import { defaultCurrencyForLocale, formatPricePoint, type Currency } from "../currency";
import { htmlLang, type Locale, type PrefixedLocale } from "../i18n/config";
import { KOMPLETT_PRICE } from "../products";
import { getEmailCopy } from "./copy/index";
import { C, FONT, escapeHtml, fillPlaceholders, stripTags } from "./html";
import { emailLinks } from "./links";

// The 3-step welcome series after a /gratis signup. It runs as Resend automations, not in this
// app: «Studentplanlegger gratis – velkomstserie» (Bokmål, live) and one automation per other
// language created by scripts/setup-resend-welcome-i18n.ts. This module renders their templates
// from the copy in lib/emails/copy/<lang>.ts, in the layout of the live Bokmål templates.

/** Custom event the Bokmål automation listens for (and the fallback for every language). */
export const GRATIS_SIGNUP_EVENT = "studentplanlegger.gratis_signup";

/** Resend fills these in when the automation sends the email. */
export const UNSUBSCRIBE_VARIABLE = "{{{RESEND_UNSUBSCRIBE_URL}}}";
export const BUNDLE_PRICE_VARIABLE = "BUNDLE_PRICE";

export const WELCOME_FROM = "Studentplanlegger <hei@studentplanlegger.no>";
export const WELCOME_REPLY_TO = "hei@studentplanlegger.no";

/** Live Bokmål automation and templates, mirrored by the per-language ones. */
export const NB_WELCOME_AUTOMATION_ID = "01a12ef3-04a1-7310-b3d9-8432275b60b4";

export const WELCOME_STEPS = [
  { day: 2, delay: "2 days", nbTemplateId: "863c4b25-c23d-43f8-87c9-5dc4b0144464" },
  { day: 4, delay: "2 days", nbTemplateId: "3011950e-79a5-4fbc-9e67-3eae3e713b46" },
  { day: 7, delay: "3 days", nbTemplateId: "2f5447c5-3154-4cdb-bb7d-6505db812d76" },
] as const;

export type WelcomeStep = 1 | 2 | 3;

export function welcomeEventName(locale: Locale): string {
  return locale === "nb" ? GRATIS_SIGNUP_EVENT : `${GRATIS_SIGNUP_EVENT}.${locale}`;
}

export function welcomeTemplateAlias(locale: Locale, step: WelcomeStep): string {
  const base = `studentplanlegger-gratis-e-post-${step}-dag-${WELCOME_STEPS[step - 1].day}`;
  return locale === "nb" ? base : `${base}-${locale}`;
}

export function welcomeTemplateName(locale: Locale, step: WelcomeStep): string {
  const base = `Studentplanlegger gratis – e-post ${step} (dag ${WELCOME_STEPS[step - 1].day})`;
  return locale === "nb" ? base : `${base} – ${locale.toUpperCase()}`;
}

export function welcomeAutomationName(locale: PrefixedLocale): string {
  return `Studentplanlegger gratis – velkomstserie – ${locale.toUpperCase()}`;
}

/** Komplett in the subscriber's currency, as sent in the event payload ("249 kr", "€21.99"). */
export function bundlePrice(locale: Locale, currency: Currency): string {
  return formatPricePoint(KOMPLETT_PRICE, currency, locale);
}

export type WelcomeRenderOptions = {
  /**
   * Text for {bundlePrice}. Defaults to "249 kr" for Bokmål (as the live template has it) and
   * to the {{{BUNDLE_PRICE}}} automation variable for every other language.
   */
  bundlePrice?: string;
  /** Defaults to Resend's {{{RESEND_UNSUBSCRIBE_URL}}}. */
  unsubscribeUrl?: string;
};

export type WelcomeEmail = {
  locale: Locale;
  step: WelcomeStep;
  alias: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  /** Template variables to declare in Resend (none for Bokmål). */
  variables: { key: string; type: "string"; fallbackValue: string }[];
};

export function buildWelcomeEmail(
  locale: Locale,
  step: WelcomeStep,
  options: WelcomeRenderOptions = {},
): WelcomeEmail {
  const copy = getEmailCopy(locale);
  const t = copy.welcome.emails[step - 1];
  const links = emailLinks(locale);
  const price =
    options.bundlePrice ??
    (locale === "nb" ? bundlePrice("nb", "NOK") : `{{{${BUNDLE_PRICE_VARIABLE}}}}`);
  const unsubscribe = options.unsubscribeUrl ?? UNSUBSCRIBE_VARIABLE;
  const subject = fillPlaceholders(t.subject, { bundlePrice: price });
  const bodyHtml = fillPlaceholders(t.body, { bundlePrice: price });
  const e = escapeHtml;
  const p = (size: number, lineHeight: number) =>
    `font-family:${FONT};font-size:${size}px;line-height:${lineHeight}px;`;

  const buttonRow = t.button
    ? `<tr><td align="center" style="padding-top:8px;padding-bottom:8px;padding-left:48px;padding-right:48px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" bgcolor="${C.deep}" style="border-radius:8px;background-color:${C.deep};"><a href="${e(links.packages)}" target="_blank" style="display:inline-block;padding-top:14px;padding-bottom:14px;padding-left:32px;padding-right:32px;${p(16, 24)}font-weight:600;color:${C.onDeep};text-decoration:none;">${e(t.button)}</a></td></tr></table></td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="${htmlLang[locale]}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background-color:${C.page};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background-color:${C.page};"><tr><td align="center" style="padding-top:28px;padding-bottom:36px;padding-left:12px;padding-right:12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr><td align="center" style="padding-bottom:20px;${p(15, 20)}font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${C.text};"><a href="${e(links.site)}" target="_blank" style="color:${C.text};text-decoration:none;">Studentplanlegger</a></td></tr>
<tr><td bgcolor="${C.card}" style="background-color:${C.card};border-radius:16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td height="6" bgcolor="${C.accent}" style="height:6px;font-size:0;line-height:0;background-color:${C.accent};border-radius:16px 16px 0 0;">&nbsp;</td></tr>
<tr><td style="padding-top:36px;padding-bottom:8px;padding-left:48px;padding-right:48px;"><p style="margin:0 0 14px 0;${p(16, 25)}color:${C.text};">${bodyHtml}</p></td></tr>
${buttonRow}
<tr><td style="padding-top:16px;padding-bottom:40px;padding-left:48px;padding-right:48px;"><p style="margin:0;${p(15, 24)}color:${C.text};">${e(copy.footer.signature)}</p></td></tr>
</table></td></tr>
<tr><td align="center" style="padding-top:24px;padding-left:36px;padding-right:36px;">
<p style="margin:0 0 10px 0;${p(12, 19)}color:${C.muted};">${e(copy.footer.reason)} <a href="${unsubscribe}" target="_blank" style="color:${C.muted};text-decoration:underline;">${e(copy.welcome.unsubscribeLink)}</a> &middot; <a href="${e(links.privacy)}" target="_blank" style="color:${C.muted};text-decoration:underline;">${e(copy.welcome.privacyLink)}</a></p>
<p style="margin:0;${p(12, 19)}color:${C.muted};">Studentplanlegger.no &middot; NSD Drift</p>
</td></tr></table></td></tr></table></body></html>`;

  const text = `Studentplanlegger ${links.site}

${stripTags(bodyHtml)}
${t.button ? `\n${t.button} ${links.packages}\n` : ""}
${copy.footer.signature}

${copy.footer.reason}
${copy.welcome.unsubscribeLink} ${unsubscribe} · ${copy.welcome.privacyLink}
${links.privacy}

Studentplanlegger.no · NSD Drift
`;

  const usesPrice = /\{bundlePrice\}/.test(t.subject + t.body);
  const variables =
    locale === "nb" || !usesPrice
      ? []
      : [
          {
            key: BUNDLE_PRICE_VARIABLE,
            type: "string" as const,
            fallbackValue: bundlePrice(locale, defaultCurrencyForLocale(locale)),
          },
        ];

  return {
    locale,
    step,
    alias: welcomeTemplateAlias(locale, step),
    name: welcomeTemplateName(locale, step),
    subject,
    html,
    text,
    variables,
  };
}

export function buildWelcomeSeries(locale: Locale, options: WelcomeRenderOptions = {}): WelcomeEmail[] {
  return ([1, 2, 3] as const).map((step) => buildWelcomeEmail(locale, step, options));
}
