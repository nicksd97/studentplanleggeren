import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  attachCampaignTags,
  campaignCookieValue,
  campaignTagsFromItems,
  mergeCampaignTags,
  parseCampaignCookie,
  parseCampaignTags,
} from "./attribution";

describe("parseCampaignTags", () => {
  it("keeps only present utm fields and does not invent a source", () => {
    assert.deepEqual(
      parseCampaignTags({
        utm_source: "instagram",
        utm_medium: "social",
        utm_campaign: "komplett",
        utm_content: "bio",
      }),
      {
        utm_source: "instagram",
        utm_medium: "social",
        utm_campaign: "komplett",
        utm_content: "bio",
      },
    );
    assert.equal(parseCampaignTags({}), null);
    assert.equal(parseCampaignTags({ utm_source: "  " }), null);
    assert.equal(parseCampaignTags({ source: "google" }), null);
    assert.deepEqual(parseCampaignTags({ utm_source: "google", utm_medium: "" }), {
      utm_source: "google",
    });
  });

  it("reads query strings used by the free-channel links", () => {
    const tags = parseCampaignTags(
      "utm_source=facebook&utm_medium=group&utm_campaign=komplett",
    );
    assert.deepEqual(tags, {
      utm_source: "facebook",
      utm_medium: "group",
      utm_campaign: "komplett",
    });
  });
});

describe("mergeCampaignTags", () => {
  it("prefers a new tagged landing URL and otherwise keeps stored tags", () => {
    const stored = parseCampaignTags({ utm_source: "instagram", utm_medium: "social" });
    assert.deepEqual(
      mergeCampaignTags(parseCampaignTags({ utm_source: "tiktok", utm_medium: "social" }), stored),
      { utm_source: "tiktok", utm_medium: "social" },
    );
    assert.deepEqual(mergeCampaignTags(null, stored), stored);
    assert.equal(mergeCampaignTags(null, null), null);
  });
});

describe("attachCampaignTags", () => {
  const items = [
    { id: "komplett", name: "Studentplanlegger Komplett", price: 349, type: "bundle" as const },
  ];

  it("writes tags onto the first catalog item and can read them back", () => {
    const tagged = attachCampaignTags(items, {
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "komplett",
    });
    assert.equal(tagged[0].id, "komplett");
    assert.equal(tagged[0].price, 349);
    assert.deepEqual(campaignTagsFromItems(tagged), {
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "komplett",
    });
    assert.equal(campaignTagsFromItems(items), null);
  });

  it("leaves items unchanged when there is no campaign", () => {
    assert.deepEqual(attachCampaignTags(items, null), items);
  });
});

describe("campaign cookie", () => {
  it("round-trips stored tags without inventing fields", () => {
    const tags = { utm_source: "tiktok", utm_medium: "social", utm_campaign: "komplett" };
    assert.deepEqual(parseCampaignCookie(campaignCookieValue(tags)), tags);
    assert.equal(parseCampaignCookie(""), null);
    assert.equal(parseCampaignCookie("not-json"), null);
  });

  it("does not throw when a stored tag contains a percent sign", () => {
    const tags = { utm_source: "instagram", utm_content: "50%" };
    const encoded = encodeURIComponent(campaignCookieValue(tags));
    assert.deepEqual(parseCampaignCookie(encoded), tags);
    assert.deepEqual(parseCampaignCookie(campaignCookieValue(tags)), tags);
  });
});
