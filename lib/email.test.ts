import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { EMAIL_FROM, buildOrderConfirmationHtml } from "./email";

describe("email from-address", () => {
  it("sends as hei@studentplanlegger.no, never the Resend sandbox", () => {
    assert.equal(EMAIL_FROM, "Studentplanlegger <hei@studentplanlegger.no>");
    assert.equal(EMAIL_FROM.includes("onboarding@resend.dev"), false);
  });
});

describe("lead magnet mail copy", () => {
  const source = readFileSync(new URL("./email.ts", import.meta.url), "utf8");

  it("defines sendLeadMagnetEmail with the locked Bokmål copy", () => {
    assert.match(source, /export async function sendLeadMagnetEmail/);
    assert.match(source, /Gratis ukentlig plan-smakebit/);
    assert.match(source, /GRATIS SMAKEBIT/);
    assert.match(source, /ikke hele produktet/);
    assert.match(source, /\/produkter/);
    assert.match(source, /hei@studentplanlegger\.no/);
    assert.match(source, /\/personvern/);
  });

  it("does not use the sandbox from-address or Beehiiv", () => {
    assert.equal(source.includes("onboarding@resend.dev"), false);
    assert.equal(source.includes("Beehiiv"), false);
  });
});

describe("order confirmation discount line", () => {
  it("shows the linjeforening code and the charged total without strikethrough", () => {
    const html = buildOrderConfirmationHtml({
      firstName: "Ola",
      items: [{ id: "komplett", name: "Studentplanlegger Komplett", price: 249 }],
      downloadToken: "download-token-test",
      amountNok: 199,
      discountCode: "ABAKUS20",
      discountNok: 50,
      discountPercent: 20,
    });
    assert.match(html, /ABAKUS20/);
    assert.match(html, /−20\s*%/);
    assert.match(html, /−50 kr/);
    assert.match(html, /Totalt — 199 kr/);
    assert.equal(html.includes("line-through"), false);
  });
});
