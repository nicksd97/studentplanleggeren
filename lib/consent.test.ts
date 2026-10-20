import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONSENT_STORAGE_KEY, gaBootstrapScript, parseConsent } from "./consent";

describe("parseConsent", () => {
  it("accepts only the two stored choices", () => {
    assert.equal(parseConsent("granted"), "granted");
    assert.equal(parseConsent("denied"), "denied");
    assert.equal(parseConsent(null), null);
    assert.equal(parseConsent("yes"), null);
  });
});

describe("gaBootstrapScript", () => {
  const script = gaBootstrapScript("G-ABC123");

  it("sets every Consent Mode v2 default to denied before config", () => {
    const consent = script.indexOf("gtag('consent','default'");
    assert.ok(consent >= 0);
    for (const key of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
      assert.match(script, new RegExp(`${key}:'denied'`));
    }
    assert.ok(consent < script.indexOf("gtag('config'"));
  });

  it("only grants analytics_storage from a stored choice", () => {
    assert.ok(script.includes(`localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})==='granted'`));
    assert.ok(script.includes("gtag('consent','update',{analytics_storage:'granted'})"));
    assert.ok(!/ad_storage:'granted'/.test(script));
  });

  it("disables the automatic page_view and starts with a query-free page_location", () => {
    assert.ok(script.includes(`gtag('config',"G-ABC123",{send_page_view:false})`));
    assert.ok(script.indexOf("page_location:location.origin+location.pathname") < script.indexOf("gtag('config'"));
  });

  it("runs as valid JavaScript and queues commands in order", () => {
    const dataLayer: unknown[][] = [];
    const storage = new Map([[CONSENT_STORAGE_KEY, "granted"]]);
    // In the browser `dataLayer` resolves to window.dataLayer; here it is passed in directly.
    const run = new Function("window", "dataLayer", "localStorage", "location", script);
    run({ dataLayer }, dataLayer, { getItem: (k: string) => storage.get(k) ?? null }, { origin: "https://x.no", pathname: "/takk" });
    const commands = dataLayer.map((args) => Array.from(args as ArrayLike<unknown>).slice(0, 2).join(":"));
    assert.deepEqual(commands.map((c) => c.split(":")[0]), ["consent", "consent", "set", "js", "config"]);
    assert.deepEqual(Array.from(dataLayer[2] as ArrayLike<unknown>)[1], { page_location: "https://x.no/takk" });
  });
});
