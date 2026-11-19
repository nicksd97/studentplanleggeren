import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { subscriberCurrency } from "./currency";
import { emailCopies, emailLocale, getEmailCopy } from "./emails/copy/index";
import { buildLeadMagnetEmail } from "./emails/lead-magnet";
import {
  GRATIS_SIGNUP_EVENT,
  buildWelcomeEmail,
  buildWelcomeSeries,
  welcomeEventName,
  welcomeTemplateAlias,
} from "./emails/welcome";
import { locales, prefixedLocales, type Locale } from "./i18n/config";

const NBSP = " ";
const DOWNLOAD = "https://example.supabase.co/storage/v1/object/sign/products/leads/en/x.pdf?token=a&b=1";

/** Every page URL on our site in an email (hrefs and plain-text URLs), minus images. */
function siteLinks(body: string): string[] {
  return [...body.matchAll(/https:\/\/www\.studentplanlegger\.no[^\s"<>]*/g)]
    .map((m) => m[0].replace(/&amp;/g, "&"))
    .filter((url) => !url.includes("/images/"));
}

function allEmails(locale: Locale) {
  const lead = buildLeadMagnetEmail(DOWNLOAD, { locale });
  return [
    { name: "lead-magnet", subject: lead.subject, html: lead.html, text: lead.text },
    ...buildWelcomeSeries(locale).map((w) => ({ name: `welcome-${w.step}`, ...w })),
  ];
}

describe("email copy dictionaries", () => {
  function shape(value: unknown, path: string, out: Map<string, unknown>) {
    if (Array.isArray(value)) {
      out.set(path, value.length);
      value.forEach((item, i) => shape(item, `${path}[${i}]`, out));
    } else if (value && typeof value === "object") {
      for (const [key, inner] of Object.entries(value)) shape(inner, `${path}.${key}`, out);
    } else {
      out.set(path, typeof value);
    }
    return out;
  }

  it("has every language with exactly the keys Bokmål has, all non-empty", () => {
    const reference = shape(emailCopies.nb, "", new Map());
    for (const locale of locales) {
      const copy = emailCopies[locale];
      assert.ok(copy, locale);
      assert.deepEqual(shape(copy, "", new Map()), reference, locale);
      const strings: string[] = [];
      const collect = (v: unknown) => {
        if (typeof v === "string") strings.push(v);
        else if (v && typeof v === "object") Object.values(v).forEach(collect);
      };
      collect(copy);
      for (const s of strings) assert.ok(s.trim().length > 0, `${locale}: empty string`);
    }
  });

  it("uses only known placeholders, and {bundlePrice} only in the bundle email", () => {
    for (const locale of locales) {
      const { leadMagnet, welcome } = emailCopies[locale];
      assert.match(leadMagnet.upsellBody, /\{single\}/, locale);
      assert.match(leadMagnet.upsellBody, /\{komplett\}/, locale);
      assert.match(leadMagnet.footerUnsubscribe, /\{email\}/, locale);
      assert.match(leadMagnet.footerPrivacy, /\{privacy\}/, locale);
      assert.match(welcome.emails[2].body, /\{bundlePrice\}/, locale);
      for (const email of welcome.emails) {
        assert.doesNotMatch(email.body.replace(/<\/?em>/g, ""), /<|>/, `${locale}: only <em> allowed`);
      }
    }
  });

  it("keeps the welcome subjects for other languages free of prices the automation can't fill", () => {
    for (const locale of prefixedLocales) {
      for (const email of emailCopies[locale].welcome.emails) {
        assert.doesNotMatch(email.subject, /\{|\bkr\b|NOK|€|\$|£/, locale);
      }
    }
  });
});

describe("lead magnet email per language", () => {
  it("picks the subscriber's language and sets <html lang>", () => {
    for (const locale of locales) {
      const mail = buildLeadMagnetEmail(DOWNLOAD, { locale });
      assert.equal(mail.locale, locale);
      assert.equal(mail.subject, emailCopies[locale].leadMagnet.subject);
      assert.match(mail.html, new RegExp(`<html lang="${locale}"`));
      assert.ok(mail.html.includes(emailCopies[locale].leadMagnet.button));
      assert.ok(mail.subject.length <= 40, `${locale} subject too long`);
      assert.ok(mail.preheader.length >= 40 && mail.preheader.length <= 90, `${locale} preheader`);
      assert.doesNotMatch(mail.html + mail.text, /\{\w+\}/, `${locale}: unfilled placeholder`);
    }
  });

  it("falls back to Bokmål for a missing or unknown language", () => {
    for (const locale of [undefined, null, "", "xx", "NB", 42]) {
      const mail = buildLeadMagnetEmail(DOWNLOAD, { locale });
      assert.equal(mail.locale, "nb");
      assert.equal(mail.subject, "Smakebiten av Ukentlig Plan er klar");
      assert.match(mail.html, /<html lang="nb"/);
    }
    assert.equal(emailLocale("de"), "de");
    assert.equal(getEmailCopy("zz"), emailCopies.nb);
  });

  it("keeps the Bokmål NOK email exactly as before when locale and currency are given", () => {
    const before = buildLeadMagnetEmail(DOWNLOAD);
    const now = buildLeadMagnetEmail(DOWNLOAD, { locale: "nb", currency: "NOK" });
    assert.equal(now.html, before.html);
    assert.equal(now.text, before.text);
    assert.match(now.html, /koster 39&nbsp;kr\. Vil du ha alt, får du alle 25 planleggerne i Komplett for 249&nbsp;kr\./);
  });

  it("shows prices in the subscriber's currency", () => {
    const cases: Array<[Locale, string, string, string]> = [
      ["en", "USD", "$3.99", "$23.99"],
      ["en", "GBP", "£2.99", "£18.49"],
      ["en", "NOK", "NOK 39", "NOK 249"],
      ["de", "EUR", `3,49${NBSP}€`, `21,99${NBSP}€`],
      ["sv", "SEK", `39${NBSP}kr`, `239${NBSP}kr`],
      ["da", "DKK", `29${NBSP}kr.`, `169${NBSP}kr.`],
      ["es", "EUR", `3,49${NBSP}€`, `21,99${NBSP}€`],
      ["fr", "EUR", `3,49${NBSP}€`, `21,99${NBSP}€`],
      ["nb", "SEK", `39${NBSP}SEK`, `239${NBSP}SEK`],
    ];
    for (const [locale, currency, single, komplett] of cases) {
      const mail = buildLeadMagnetEmail(DOWNLOAD, { locale, currency });
      assert.ok(mail.text.includes(single), `${locale}/${currency}: ${single}`);
      assert.ok(mail.text.includes(komplett), `${locale}/${currency}: ${komplett}`);
      const htmlSingle = single.replace(/[  ]/g, "&nbsp;");
      assert.ok(mail.html.includes(htmlSingle), `${locale}/${currency} html: ${htmlSingle}`);
    }
  });

  it("uses the language's default currency when none is given", () => {
    assert.ok(buildLeadMagnetEmail(DOWNLOAD, { locale: "en" }).text.includes("$23.99"));
    assert.ok(buildLeadMagnetEmail(DOWNLOAD, { locale: "de", currency: "XYZ" }).text.includes(`21,99${NBSP}€`));
  });

  it("localizes the List-Unsubscribe subject", () => {
    assert.equal(
      buildLeadMagnetEmail(DOWNLOAD, { locale: "nb" }).headers["List-Unsubscribe"],
      "<mailto:hei@studentplanlegger.no?subject=Avmelding>",
    );
    assert.equal(
      buildLeadMagnetEmail(DOWNLOAD, { locale: "en" }).headers["List-Unsubscribe"],
      "<mailto:hei@studentplanlegger.no?subject=Unsubscribe>",
    );
    assert.equal(
      buildLeadMagnetEmail(DOWNLOAD, { locale: "fr" }).headers["List-Unsubscribe"],
      "<mailto:hei@studentplanlegger.no?subject=D%C3%A9sinscription>",
    );
  });

  it("keeps the UTM tags identical in every language", () => {
    for (const locale of locales) {
      const { text } = buildLeadMagnetEmail(DOWNLOAD, { locale });
      assert.match(text, /\?kategori=ukentlig&utm_source=epost&utm_medium=email&utm_campaign=gratis-ukeplan&utm_content=ukentlig-plan/);
      assert.match(text, /\?utm_source=epost&utm_medium=email&utm_campaign=gratis-ukeplan&utm_content=komplett#pakker/);
    }
  });
});

describe("welcome series templates", () => {
  it("names the per-language events and template aliases", () => {
    assert.equal(welcomeEventName("nb"), GRATIS_SIGNUP_EVENT);
    assert.equal(welcomeEventName("en"), "studentplanlegger.gratis_signup.en");
    assert.equal(welcomeTemplateAlias("nb", 1), "studentplanlegger-gratis-e-post-1-dag-2");
    assert.equal(welcomeTemplateAlias("en", 1), "studentplanlegger-gratis-e-post-1-dag-2-en");
    assert.equal(welcomeTemplateAlias("fr", 3), "studentplanlegger-gratis-e-post-3-dag-7-fr");
  });

  it("reproduces the live Bokmål templates' wording", () => {
    const [one, two, three] = buildWelcomeSeries("nb");
    assert.equal(one.subject, "Slik får du mest ut av ukeplanen");
    assert.equal(two.subject, "Når eksamen nærmer seg");
    assert.equal(three.subject, "Hele pakken for 249 kr");
    assert.match(one.html, /velg så tre ting som <em>må<\/em> bli gjort/);
    assert.match(two.html, />Se pakken<\/a>/);
    assert.match(three.html, /hele Komplett-pakken for 249 kr\. Det er et engangskjøp/);
    for (const mail of [one, two, three]) {
      assert.match(mail.html, /<html lang="nb">/);
      assert.match(mail.html, /<a href="\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}"[^>]*>Meld deg av<\/a>/);
      assert.match(mail.html, /href="https:\/\/www\.studentplanlegger\.no\/personvern"/);
      assert.deepEqual(mail.variables, []);
    }
  });

  it("uses {{{BUNDLE_PRICE}}} instead of a hard-coded price in other languages", () => {
    for (const locale of prefixedLocales) {
      const three = buildWelcomeEmail(locale, 3);
      assert.ok(three.html.includes("{{{BUNDLE_PRICE}}}"), locale);
      assert.ok(three.text.includes("{{{BUNDLE_PRICE}}}"), locale);
      assert.equal(three.subject.includes("BUNDLE_PRICE"), false, locale);
      assert.deepEqual(three.variables.map((v) => v.key), ["BUNDLE_PRICE"]);
      assert.ok(three.variables[0]?.fallbackValue, locale);
      assert.deepEqual(buildWelcomeEmail(locale, 1).variables, [], locale);
      assert.deepEqual(buildWelcomeEmail(locale, 2).variables, [], locale);
    }
  });

  it("can render a preview with a real price and unsubscribe URL", () => {
    const mail = buildWelcomeEmail("de", 3, { bundlePrice: `21,99${NBSP}€`, unsubscribeUrl: "https://example.com/u" });
    assert.ok(mail.html.includes(`21,99${NBSP}€`));
    assert.equal(mail.html.includes("{{{"), false);
  });
});

describe("no Bokmål leftovers in other languages", () => {
  it("has no NOK 'kr' prices and no Bokmål text", () => {
    for (const locale of prefixedLocales) {
      for (const email of allEmails(locale)) {
        const where = `${locale}/${email.name}`;
        for (const body of [email.html, email.text, email.subject]) {
          if (locale !== "sv" && locale !== "da") assert.doesNotMatch(body, /\d[\s ]*kr\b/, where);
          assert.doesNotMatch(body, /\b249\b/, where);
          assert.doesNotMatch(body, /Hilsen Studentplanlegger|Meld deg av|smakebit(?!\.png)|personvernerklæringen/i, where);
        }
        assert.match(email.html, new RegExp(`<html lang="${locale}"`), where);
      }
    }
  });

  it("has no 'kr' at all in EUR, GBP or USD emails", () => {
    for (const locale of prefixedLocales) {
      for (const currency of ["EUR", "GBP", "USD"]) {
        const mail = buildLeadMagnetEmail(DOWNLOAD, { locale, currency });
        assert.doesNotMatch(mail.html + mail.text, /\d[\s ]*kr\b|&nbsp;kr\b/, `${locale}/${currency}`);
      }
    }
  });

  it("links every page in the subscriber's language", () => {
    for (const locale of prefixedLocales) {
      for (const email of allEmails(locale)) {
        const links = siteLinks(`${email.html}\n${email.text}`);
        assert.ok(links.length >= 3, `${locale}/${email.name}: found ${links.length} links`);
        for (const url of links) {
          assert.ok(
            url === `https://www.studentplanlegger.no/${locale}` ||
              url.startsWith(`https://www.studentplanlegger.no/${locale}/`) ||
              url.startsWith(`https://www.studentplanlegger.no/${locale}?`) ||
              url.startsWith(`https://www.studentplanlegger.no/${locale}#`),
            `${locale}/${email.name}: ${url}`,
          );
        }
        assert.ok(links.includes(`https://www.studentplanlegger.no/${locale}/personvern`), `${locale}/${email.name} privacy`);
      }
    }
  });

  it("links the localized packages section from the welcome buttons", () => {
    for (const locale of prefixedLocales) {
      assert.ok(buildWelcomeEmail(locale, 2).html.includes(`href="https://www.studentplanlegger.no/${locale}#pakker"`));
    }
  });
});

describe("subscriberCurrency", () => {
  it("prefers a valid cookie, then the country, then the language default", () => {
    assert.equal(subscriberCurrency({ cookie: "sek", country: "DE", locale: "en" }), "SEK");
    assert.equal(subscriberCurrency({ cookie: "BTC", country: "DE", locale: "en" }), "EUR");
    assert.equal(subscriberCurrency({ cookie: undefined, country: "NO", locale: "en" }), "NOK");
    assert.equal(subscriberCurrency({ cookie: null, country: null, locale: "en" }), "USD");
    assert.equal(subscriberCurrency({ locale: "da" }), "DKK");
    assert.equal(subscriberCurrency({ locale: "nb" }), "NOK");
  });
});
