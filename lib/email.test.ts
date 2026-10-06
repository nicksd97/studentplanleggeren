import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { EMAIL_FROM, buildOrderConfirmationHtml } from "./email";
import { buildLeadMagnetEmail } from "./lead-magnet-email";

describe("email from-address", () => {
  it("sends as hei@studentplanlegger.no, never the Resend sandbox", () => {
    assert.equal(EMAIL_FROM, "Studentplanlegger <hei@studentplanlegger.no>");
    assert.equal(EMAIL_FROM.includes("onboarding@resend.dev"), false);
  });
});

describe("lead magnet mail", () => {
  const source = readFileSync(new URL("./email.ts", import.meta.url), "utf8");
  const template = readFileSync(new URL("./lead-magnet-email.ts", import.meta.url), "utf8");
  const downloadUrl =
    "https://example.supabase.co/storage/v1/object/sign/products/leads/gratis-ukentlig-plan-smakebit.pdf?token=abc.def&x=1";
  const mail = buildLeadMagnetEmail(downloadUrl);

  it("sends through sendLeadMagnetEmail with HTML, plain text and List-Unsubscribe", () => {
    assert.match(source, /export async function sendLeadMagnetEmail/);
    assert.match(source, /buildLeadMagnetEmail\(downloadUrl\)/);
    assert.match(source, /text,\s*headers,/);
    assert.equal(mail.headers["List-Unsubscribe"], "<mailto:hei@studentplanlegger.no?subject=Avmelding>");
  });

  it("has a short subject and a preheader that fit on mobile", () => {
    assert.equal(mail.subject, "Smakebiten av Ukentlig Plan er klar");
    assert.ok(mail.subject.length <= 40);
    assert.ok(mail.preheader.length >= 40 && mail.preheader.length <= 90);
    assert.ok(mail.html.includes(mail.preheader));
  });

  it("says plainly that it is a free sample, not the full product", () => {
    for (const body of [mail.html, mail.text]) {
      assert.match(body, /GRATIS SMAKEBIT/);
      assert.match(body, /ikke hele produktet/);
    }
  });

  it("has one filled button to the escaped download URL, also for Outlook", () => {
    const escaped = downloadUrl.replace(/&/g, "&amp;");
    assert.match(mail.html, /Last ned ukeplanen/);
    assert.match(mail.html, /<v:roundrect[^>]+href="[^"]+token=abc\.def&amp;x=1"/);
    assert.equal(mail.html.split(`href="${escaped}"`).length - 1, 3);
    assert.equal(mail.html.includes(`href="${downloadUrl}"`), false);
    assert.equal(mail.html.match(/<v:roundrect/g)?.length, 1);
    assert.ok(mail.text.includes(downloadUrl));
  });

  it("shows the real sample image from the site", () => {
    assert.match(
      mail.html,
      /<img src="https:\/\/www\.studentplanlegger\.no\/images\/email\/smakebit\.png"[^>]+alt="[^"]+"/,
    );
  });

  it("only mentions real prices and no anchor prices or urgency", () => {
    const prices = [...mail.text.matchAll(/(\d+)\s*kr/g)].map((m) => Number(m[1]));
    assert.deepEqual(prices, [39, 249]);
    for (const body of [mail.html, mail.text]) {
      assert.equal(body.includes("line-through"), false);
      assert.doesNotMatch(body, /førpris|før \d|kun i dag|bare i dag|begrenset tid|siste sjanse/i);
    }
  });

  it("keeps the unsubscribe and privacy line and tracks shop links", () => {
    for (const body of [mail.html, mail.text]) {
      assert.match(body, /hei@studentplanlegger\.no/);
      assert.match(body, /\/personvern/);
      assert.match(body, /avmeld/);
      assert.match(body, /utm_source=epost/);
    }
    assert.match(mail.text, /\/produkter\?kategori=ukentlig/);
    assert.match(mail.text, /#pakker/);
  });

  it("is mobile-first and dark-mode aware and stays under Gmail's clipping size", () => {
    assert.match(mail.html, /name="color-scheme" content="light dark"/);
    assert.match(mail.html, /prefers-color-scheme:dark/);
    assert.match(mail.html, /\[data-ogsc\]/);
    assert.match(mail.html, /max-width:620px/);
    assert.match(mail.html, /<!--\[if mso\]>/);
    assert.ok(Buffer.byteLength(mail.html, "utf8") < 100 * 1024);
  });

  it("does not use the sandbox from-address or Beehiiv", () => {
    for (const body of [source, template]) {
      assert.equal(body.includes("onboarding@resend.dev"), false);
      assert.equal(body.includes("Beehiiv"), false);
    }
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
