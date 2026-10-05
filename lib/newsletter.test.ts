import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import {
  DEFAULT_LEAD_MAGNET_STORAGE_PATH,
  NEWSLETTER_SEGMENT_NAME,
  allowNewsletterRequest,
  assertSafeLeadMagnetPath,
  isHoneypot,
  leadMagnetStoragePath,
  normalizeEmail,
} from "./newsletter";

describe("normalizeEmail", () => {
  it("trims and lower-cases a valid address", () => {
    assert.equal(normalizeEmail("Name@Gmail.com"), "name@gmail.com");
    assert.equal(normalizeEmail("  student@uio.no  "), "student@uio.no");
  });

  it("rejects missing, incomplete, and non-string values", () => {
    assert.equal(normalizeEmail(undefined), null);
    assert.equal(normalizeEmail(""), null);
    assert.equal(normalizeEmail("ingen-krøllalfa"), null);
    assert.equal(normalizeEmail("a@b"), null);
    assert.equal(normalizeEmail("a@b."), null);
    assert.equal(normalizeEmail(12), null);
  });
});

describe("isHoneypot", () => {
  it("is empty for a normal signup", () => {
    assert.equal(isHoneypot({}), false);
    assert.equal(isHoneypot({ company: "", website: "" }), false);
    assert.equal(isHoneypot({ company: "  " }), false);
  });

  it("trips when company or website is filled", () => {
    assert.equal(isHoneypot({ company: "http://spam" }), true);
    assert.equal(isHoneypot({ website: "x" }), true);
  });
});

describe("allowNewsletterRequest", () => {
  it("allows five hits per key per hour and denies the sixth", () => {
    const now = 1_700_000_000_000;
    const key = `203.0.113.1|rate-limit-${now}@example.com`;
    for (let i = 0; i < 5; i += 1) {
      assert.equal(allowNewsletterRequest(key, now + i), true);
    }
    assert.equal(allowNewsletterRequest(key, now + 5), false);
    assert.equal(
      allowNewsletterRequest(`203.0.113.2|other-${now}@example.com`, now + 5),
      true,
    );
  });
});

describe("lead magnet storage path", () => {
  const previous = process.env.LEAD_MAGNET_STORAGE_PATH;

  after(() => {
    if (previous === undefined) {
      delete process.env.LEAD_MAGNET_STORAGE_PATH;
    } else {
      process.env.LEAD_MAGNET_STORAGE_PATH = previous;
    }
  });

  it("defaults to the smakebit object in the products bucket", () => {
    delete process.env.LEAD_MAGNET_STORAGE_PATH;
    assert.equal(NEWSLETTER_SEGMENT_NAME, "lead-gratis-ukeplan");
    assert.equal(
      DEFAULT_LEAD_MAGNET_STORAGE_PATH,
      "leads/gratis-ukentlig-plan-smakebit.pdf",
    );
    assert.equal(leadMagnetStoragePath(), DEFAULT_LEAD_MAGNET_STORAGE_PATH);
  });

  it("rejects paid planner paths and allows the smakebit", () => {
    assert.throws(() => assertSafeLeadMagnetPath("planners/ukentlig-plan.pdf"));
    assert.throws(() => assertSafeLeadMagnetPath("planners/daglig-planlegger.pdf"));
    assert.doesNotThrow(() =>
      assertSafeLeadMagnetPath("leads/gratis-ukentlig-plan-smakebit.pdf"),
    );
  });
});
