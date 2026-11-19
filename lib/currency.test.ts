import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOK_PRICE_POINTS,
  PRICE_TABLE,
  STRIPE_MINIMUM_MINOR,
  currencies,
  currencyForCountry,
  currencyFromCookieHeader,
  defaultCurrencyForLocale,
  discountedMinor,
  fillPrices,
  formatMoney,
  parseCurrency,
  priceMinor,
} from "./currency";
import { itemsAmountMinor, orderAmounts } from "./checkout";
import { alleProdukter, pakker } from "./products";

describe("country -> currency", () => {
  const cases: Array<[string, string]> = [
    ["NO", "NOK"],
    ["SJ", "NOK"],
    ["BV", "NOK"],
    ["SE", "SEK"],
    ["DK", "DKK"],
    ["GL", "DKK"],
    ["FO", "DKK"],
    ["DE", "EUR"],
    ["AT", "EUR"],
    ["FR", "EUR"],
    ["ES", "EUR"],
    ["FI", "EUR"],
    ["IE", "EUR"],
    ["HR", "EUR"],
    ["NL", "EUR"],
    ["BE", "EUR"],
    ["LU", "EUR"],
    ["AD", "EUR"],
    ["MC", "EUR"],
    ["SM", "EUR"],
    ["VA", "EUR"],
    ["ME", "EUR"],
    ["XK", "EUR"],
    ["GB", "GBP"],
    ["IM", "GBP"],
    ["JE", "GBP"],
    ["GG", "GBP"],
    ["US", "USD"],
    ["PR", "USD"],
    ["GU", "USD"],
    ["VI", "USD"],
    ["CH", "EUR"],
    ["PL", "EUR"],
    ["IS", "EUR"],
    ["CZ", "EUR"],
    ["CA", "USD"],
    ["MX", "USD"],
    ["JP", "USD"],
    ["AU", "USD"],
    ["SN", "USD"],
  ];
  for (const [country, currency] of cases) {
    it(`${country} -> ${currency}`, () => {
      assert.equal(currencyForCountry(country), currency);
    });
  }

  it("returns null for missing or malformed codes and falls back to the language", () => {
    assert.equal(currencyForCountry(undefined), null);
    assert.equal(currencyForCountry(""), null);
    assert.equal(currencyForCountry("XXX"), null);
    assert.equal(currencyForCountry("se"), "SEK");
    assert.deepEqual(
      (["nb", "en", "de", "sv", "da", "es", "fr"] as const).map(defaultCurrencyForLocale),
      ["NOK", "USD", "EUR", "SEK", "DKK", "EUR", "EUR"],
    );
  });

  it("parses currency values strictly", () => {
    assert.equal(parseCurrency("eur"), "EUR");
    assert.equal(parseCurrency(" SEK "), "SEK");
    assert.equal(parseCurrency("BTC"), null);
    assert.equal(parseCurrency(42), null);
    assert.equal(currencyFromCookieHeader("a=1; sp_currency=GBP; b=2"), "GBP");
    assert.equal(currencyFromCookieHeader("sp_currency=XYZ"), null);
    assert.equal(currencyFromCookieHeader(""), null);
  });
});

describe("price table", () => {
  it("has every catalog price point in every currency as a positive integer", () => {
    const catalogPrices = new Set([...alleProdukter.map((p) => p.price), ...pakker.map((b) => b.price), ...NOK_PRICE_POINTS]);
    for (const currency of currencies) {
      for (const nok of catalogPrices) {
        const minor = PRICE_TABLE[currency][nok];
        assert.ok(Number.isInteger(minor) && minor > 0, `${currency} ${nok}`);
      }
    }
  });

  it("keeps NOK exactly as the catalog", () => {
    for (const nok of NOK_PRICE_POINTS) assert.equal(priceMinor(nok, "NOK"), nok * 100);
  });

  it("is above Stripe's minimum charge, even with a 20 % code", () => {
    for (const currency of currencies) {
      for (const nok of NOK_PRICE_POINTS) {
        const minor = priceMinor(nok, currency);
        assert.ok(minor >= STRIPE_MINIMUM_MINOR[currency], `${currency} ${nok}`);
        assert.ok(discountedMinor(minor, 20, currency) >= STRIPE_MINIMUM_MINOR[currency], `${currency} ${nok} −20 %`);
      }
    }
  });

  it("uses charm prices: whole kronor ending in 9, or .49/.99", () => {
    for (const currency of ["SEK", "DKK"] as const) {
      for (const nok of NOK_PRICE_POINTS) {
        const minor = priceMinor(nok, currency);
        assert.equal(minor % 100, 0, `${currency} ${nok}`);
        assert.equal((minor / 100) % 10, 9, `${currency} ${nok}`);
      }
    }
    for (const currency of ["EUR", "GBP", "USD"] as const) {
      for (const nok of NOK_PRICE_POINTS) {
        assert.ok([49, 99].includes(priceMinor(nok, currency) % 100), `${currency} ${nok}`);
      }
    }
  });

  it("keeps the price ladder: 5-pack < 5 singles, single < theme < komplett", () => {
    for (const currency of currencies) {
      const [single, five, theme, komplett] = NOK_PRICE_POINTS.map((nok) => priceMinor(nok, currency));
      assert.ok(five < single * 5, currency);
      assert.ok(single < theme && theme < komplett, currency);
    }
  });

  it("throws for a price point that isn't in the table", () => {
    assert.throws(() => priceMinor(123, "EUR"));
  });
});

describe("amounts per currency", () => {
  const single = { type: "product" as const, price: 39 };
  const komplett = { type: "bundle" as const, price: 249 };

  it("applies the 5-pack rule and bundle prices in every currency", () => {
    const sevenSingles = Array.from({ length: 7 }, () => single);
    assert.equal(itemsAmountMinor(sevenSingles, "NOK"), 9900 + 2 * 3900);
    assert.equal(itemsAmountMinor(sevenSingles, "EUR"), 899 + 2 * 349);
    assert.equal(itemsAmountMinor([...sevenSingles, komplett], "GBP"), 749 + 2 * 299 + 1849);
    assert.equal(itemsAmountMinor([komplett], "SEK"), 23900);
    assert.equal(itemsAmountMinor([komplett], "DKK"), 16900);
    assert.equal(itemsAmountMinor([komplett], "USD"), 2399);
  });

  it("rounds percent discounts to cents (EUR/GBP/USD) or whole kronor (NOK/SEK/DKK)", () => {
    assert.deepEqual(orderAmounts([{ id: "komplett", name: "x", ...komplett }], "EUR", 20), {
      currency: "EUR",
      listMinor: 2199,
      amountMinor: 1759,
      discountMinor: 440,
    });
    assert.equal(discountedMinor(24900, 20, "NOK"), 19900);
    assert.equal(discountedMinor(23900, 20, "SEK"), 19100);
    assert.equal(discountedMinor(16900, 15, "DKK"), 14400);
    assert.equal(discountedMinor(1849, 20, "GBP"), 1479);
    assert.equal(discountedMinor(399, 10, "USD"), 359);
  });
});

describe("formatting", () => {
  it("formats NOK on the Bokmål site exactly as before", () => {
    assert.equal(formatMoney(3900, "NOK", "nb"), "39 kr");
    assert.equal(formatMoney(24900, "NOK", "nb"), "249 kr");
  });

  it("formats each currency naturally per language", () => {
    assert.equal(formatMoney(349, "EUR", "en"), "€3.49");
    assert.equal(formatMoney(299, "GBP", "en"), "£2.99");
    assert.equal(formatMoney(399, "USD", "en"), "$3.99");
    assert.equal(formatMoney(3900, "NOK", "en"), "NOK 39");
    assert.equal(formatMoney(349, "EUR", "de"), "3,49 €");
    assert.equal(formatMoney(899, "EUR", "fr"), "8,99 €");
    assert.equal(formatMoney(3900, "SEK", "sv"), "39 kr");
    assert.equal(formatMoney(2900, "DKK", "da"), "29 kr.");
    assert.equal(formatMoney(119100, "SEK", "sv"), "1 191 kr");
    assert.equal(formatMoney(123456, "USD", "en"), "$1,234.56");
    assert.equal(formatMoney(123456, "EUR", "de"), "1.234,56 €");
  });

  it("fills price placeholders in copy", () => {
    assert.equal(fillPrices("Fra {single}, komplett {komplett}", "NOK", "nb"), "Fra 39 kr, komplett 249 kr");
    assert.equal(fillPrices("{fivePack} / {theme}", "EUR", "en"), "€8.99 / €12.99");
    assert.equal(fillPrices("{name} {single}", "USD", "en"), "{name} $3.99");
  });
});
