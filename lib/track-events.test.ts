import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  buildEventProps,
  cartTier,
  outboundTarget,
  priceTierFor,
  propLimit,
  redactAnalyticsEvent,
  redactAnalyticsUrl,
} from "./track-events";

describe("price tiers", () => {
  it("maps products and bundles to the four tiers", () => {
    assert.equal(priceTierFor({ id: "ukentlig-plan", type: "product", price: 39 }), "enkelt");
    assert.equal(priceTierFor({ id: "daglig-pakke", type: "bundle", price: 149 }), "tema");
    assert.equal(priceTierFor({ id: "komplett", type: "bundle", price: 249 }), "komplett");
  });

  it("uses the highest tier in a cart and counts five singles as a 5-pakke", () => {
    const single = (id: string) => ({ id, type: "product", price: 39 });
    assert.equal(cartTier([]), null);
    assert.equal(cartTier([single("a"), single("b")]), "enkelt");
    assert.equal(cartTier(["a", "b", "c", "d", "e"].map(single)), "5-pakke");
    assert.equal(cartTier([single("a"), { id: "ukentlig-pakke", type: "bundle", price: 149 }]), "tema");
    assert.equal(cartTier([{ id: "komplett", type: "bundle", price: 249 }, single("a")]), "komplett");
  });
});

describe("buildEventProps", () => {
  const context = {
    path: "/produkter",
    campaign: { utm_source: "instagram", utm_medium: "social", utm_campaign: "eksamen" },
  };

  it("keeps event properties first and cuts at the plan limit", () => {
    assert.deepEqual(buildEventProps({ product: "ukentlig-plan", tier: "enkelt" }, context, 2), {
      product: "ukentlig-plan",
      tier: "enkelt",
    });
  });

  it("appends path and campaign tags when the limit allows", () => {
    assert.deepEqual(buildEventProps({ cta: "hero_komplett" }, context, 8), {
      cta: "hero_komplett",
      path: "/produkter",
      utm_source: "instagram",
      utm_campaign: "eksamen",
    });
  });

  it("drops empty values and anything that looks like an email address", () => {
    assert.deepEqual(
      buildEventProps({ code: "ola@example.com", empty: "", missing: undefined, tier: "tema" }, { path: "/kasse" }, 8),
      { tier: "tema", path: "/kasse" },
    );
  });

  it("truncates long strings so they stay under Vercel's 255-character limit", () => {
    const props = buildEventProps({ cta: "x".repeat(400) }, {}, 2);
    assert.equal((props.cta as string).length, 100);
  });

  it("reads the property limit from env with a safe default", () => {
    assert.equal(propLimit(undefined), 2);
    assert.equal(propLimit("8"), 8);
    assert.equal(propLimit("50"), 8);
    assert.equal(propLimit("nei"), 2);
  });
});

describe("redactAnalyticsUrl", () => {
  it("removes download tokens but keeps campaign tags and the catalog filter", () => {
    assert.equal(
      redactAnalyticsUrl("https://www.studentplanlegger.no/takk?token=abc123&utm_source=epost"),
      "https://www.studentplanlegger.no/takk?utm_source=epost",
    );
    assert.equal(
      redactAnalyticsUrl("https://www.studentplanlegger.no/produkter?kategori=ukentlig&kode=ABAKUS20#ukentlig-plan"),
      "https://www.studentplanlegger.no/produkter?kategori=ukentlig",
    );
  });
});

describe("redactAnalyticsEvent", () => {
  it("keeps the event and only rewrites its URL", () => {
    assert.deepEqual(redactAnalyticsEvent({ type: "event", url: "https://www.studentplanlegger.no/takk?token=abc" }), {
      type: "event",
      url: "https://www.studentplanlegger.no/takk",
    });
  });
});

describe("outboundTarget", () => {
  const site = "www.studentplanlegger.no";

  it("ignores links on the site itself", () => {
    assert.equal(outboundTarget("https://www.studentplanlegger.no/produkter", site), null);
    assert.equal(outboundTarget("https://studentplanlegger.no/gratis", site), null);
  });

  it("classifies social, email and other external links without the address", () => {
    assert.deepEqual(outboundTarget("https://www.instagram.com/studentplanlegger", site), {
      target: "instagram.com",
      kind: "social",
    });
    assert.deepEqual(outboundTarget("mailto:hei@studentplanlegger.no", site), { target: "epost", kind: "epost" });
    assert.deepEqual(outboundTarget("https://vipps.no/", site), { target: "vipps.no", kind: "ekstern" });
  });
});

describe("tracking wiring", () => {
  const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

  it("mounts Vercel Analytics with URL redaction and the click tracker", () => {
    const layout = read("../app/layout.tsx");
    assert.match(layout, /<VercelAnalytics \/>/);
    assert.match(layout, /<ClickTracker \/>/);
    assert.match(read("../components/analytics/VercelAnalytics.tsx"), /beforeSend=\{redactAnalyticsEvent\}/);
  });

  it("queues the URL redaction before any early event", () => {
    const track = read("./track.ts");
    assert.match(track, /window\.va\("beforeSend", redactAnalyticsEvent\)/);
    assert.ok(track.indexOf("ensureQueue();") < track.indexOf("track(name, data)"));
  });

  it("never passes form fields or emails to trackEvent", () => {
    for (const file of ["../app/kasse/page.tsx", "../components/sections/NewsletterSignup.tsx", "../app/takk/page.tsx"]) {
      const calls = read(file).match(/track(?:Event|Once)\([^;]*;/gs) ?? [];
      assert.ok(calls.length > 0, file);
      for (const call of calls) {
        assert.doesNotMatch(call, /email|epost|fornavn|etternavn|firstName|form\.|token/i, `${file}: ${call}`);
      }
    }
  });
});
