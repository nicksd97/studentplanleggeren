import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { downloadLocale, isOrderFile, localizedStoragePath, signLocalizedPath } from "./downloads";
import { DEFAULT_LEAD_MAGNET_STORAGE_PATH, assertSafeLeadMagnetPath } from "./newsletter";

describe("localized storage paths", () => {
  it("keeps Bokmål paths and puts translations in a language folder", () => {
    assert.equal(localizedStoragePath("planners/daglig-planlegger.pdf", "nb"), "planners/daglig-planlegger.pdf");
    assert.equal(localizedStoragePath("planners/daglig-planlegger.pdf", "de"), "planners/de/daglig-planlegger.pdf");
    assert.equal(localizedStoragePath("planners/vane-tracker.pdf", "fr"), "planners/fr/vane-tracker.pdf");
    assert.equal(
      localizedStoragePath(DEFAULT_LEAD_MAGNET_STORAGE_PATH, "sv"),
      "leads/sv/gratis-ukentlig-plan-smakebit.pdf",
    );
    assert.doesNotThrow(() => assertSafeLeadMagnetPath(localizedStoragePath(DEFAULT_LEAD_MAGNET_STORAGE_PATH, "es")));
  });

  it("prefers a valid ?lang=, then the order's language, then Bokmål", () => {
    assert.equal(downloadLocale("de", "fr"), "de");
    assert.equal(downloadLocale("xx", "fr"), "fr");
    assert.equal(downloadLocale("../../etc", undefined), "nb");
    assert.equal(downloadLocale(null, null), "nb");
  });
});

describe("signing with fallback", () => {
  it("serves the translated file when it exists", async () => {
    const asked: string[] = [];
    const signed = await signLocalizedPath("planners/ukentlig-plan.pdf", "da", async (path) => {
      asked.push(path);
      return `https://signed/${path}`;
    });
    assert.deepEqual(signed, { url: "https://signed/planners/da/ukentlig-plan.pdf", path: "planners/da/ukentlig-plan.pdf" });
    assert.deepEqual(asked, ["planners/da/ukentlig-plan.pdf"]);
  });

  it("falls back to Bokmål when the translation is missing or signing throws", async () => {
    const missing = await signLocalizedPath("planners/ukentlig-plan.pdf", "es", async (path) =>
      path.includes("/es/") ? null : `https://signed/${path}`,
    );
    assert.equal(missing?.path, "planners/ukentlig-plan.pdf");
    const throwing = await signLocalizedPath("leads/gratis-ukentlig-plan-smakebit.pdf", "en", async (path) => {
      if (path.includes("/en/")) throw new Error("Object not found");
      return `https://signed/${path}`;
    });
    assert.equal(throwing?.path, "leads/gratis-ukentlig-plan-smakebit.pdf");
  });

  it("asks only once for Bokmål and returns null when nothing can be signed", async () => {
    const asked: string[] = [];
    const none = await signLocalizedPath("planners/handlingsplan.pdf", "nb", async (path) => {
      asked.push(path);
      return null;
    });
    assert.equal(none, null);
    assert.deepEqual(asked, ["planners/handlingsplan.pdf"]);
  });
});

describe("download file restriction", () => {
  const items = [
    { id: "daglig-planlegger", name: "Daglig Planlegger", price: 39, type: "product" },
    { id: "ukentlig-pakke", name: "Ukentlig Pakke", price: 149, type: "bundle" },
  ];

  it("allows the files of the order's products and bundles", () => {
    assert.equal(isOrderFile("planners/daglig-planlegger.pdf", items), true);
    assert.equal(isOrderFile("planners/ukentlig-matplan.pdf", items), true);
  });

  it("refuses other planners, other buckets paths and junk", () => {
    assert.equal(isOrderFile("planners/vane-tracker.pdf", items), false);
    assert.equal(isOrderFile("planners/de/daglig-planlegger.pdf", items), false);
    assert.equal(isOrderFile("../secrets.pdf", items), false);
    assert.equal(isOrderFile("leads/gratis-ukentlig-plan-smakebit.pdf", items), false);
    assert.equal(isOrderFile("planners/daglig-planlegger.pdf", null), false);
  });
});
