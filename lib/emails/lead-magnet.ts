import { defaultCurrencyForLocale, formatPricePoint, parseCurrency, type Currency } from "../currency";
import { htmlLang, type Locale } from "../i18n/config";
import { KOMPLETT_PRICE, SINGLE_PRICE } from "../products";
import { SITE_EMAIL, SITE_ORIGIN } from "../site";
import { emailLocale, getEmailCopy } from "./copy/index";
import { C, FONT, escapeHtml, fillPlaceholders, htmlPrice } from "./html";
import { emailLinks, unsubscribeMailto } from "./links";

// The free-sample email, sent right after /gratis signup in the subscriber's language, with
// prices in their currency. Table layout with inline CSS, a VML button for Outlook, dark mode
// support, a plain-text part and a List-Unsubscribe header.

export const LEAD_MAGNET_IMAGE_URL = `${SITE_ORIGIN}/images/email/smakebit.png`;

export type LeadMagnetOptions = {
  /** Subscriber's site language; Bokmål when missing or unknown. */
  locale?: unknown;
  /** Subscriber's currency; the language's default currency when missing or unknown. */
  currency?: unknown;
};

type Resolved = { locale: Locale; currency: Currency };

function resolve(options: LeadMagnetOptions): Resolved {
  const locale = emailLocale(options.locale);
  const currency = parseCurrency(options.currency) ?? defaultCurrencyForLocale(locale);
  return { locale, currency };
}

function prices({ locale, currency }: Resolved) {
  return {
    single: formatPricePoint(SINGLE_PRICE, currency, locale),
    komplett: formatPricePoint(KOMPLETT_PRICE, currency, locale),
  };
}

export function leadMagnetHeaders(locale: Locale): Record<string, string> {
  return { "List-Unsubscribe": `<${unsubscribeMailto(getEmailCopy(locale).footer.unsubscribeSubject)}>` };
}

function button(href: string, label: string): string {
  return `<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" class="btn-table" style="margin:0 auto;">
  <tr>
    <td align="center" class="btn" style="border-radius:8px;background-color:${C.deep};">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:52px;v-text-anchor:middle;width:280px;" arcsize="16%" stroke="f" fillcolor="${C.deep}">
        <w:anchorlock/>
        <center style="color:${C.onDeep};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${label}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <a href="${href}" target="_blank" style="background-color:${C.deep};border-radius:8px;color:${C.onDeep};display:inline-block;font-family:${FONT};font-size:16px;font-weight:600;line-height:52px;text-align:center;text-decoration:none;width:280px;max-width:100%;-webkit-text-size-adjust:none;">${label}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

function tipRow(index: number, title: string, body: string): string {
  return `<tr>
  <td valign="top" width="40" style="padding:0 0 16px 0;width:40px;">
    <table role="presentation" border="0" cellspacing="0" cellpadding="0"><tr>
      <td align="center" valign="middle" width="28" height="28" style="width:28px;height:28px;border-radius:14px;background-color:${C.accent};color:${C.text};font-family:${FONT};font-size:14px;font-weight:700;line-height:28px;">${index}</td>
    </tr></table>
  </td>
  <td valign="top" class="t-main" style="padding:3px 0 16px 0;font-family:${FONT};font-size:15px;line-height:23px;color:${C.text};">
    <strong>${title}</strong> <span class="t-muted" style="color:${C.muted};">${body}</span>
  </td>
</tr>`;
}

export function buildLeadMagnetHtml(downloadUrl: string, options: LeadMagnetOptions = {}): string {
  const resolved = resolve(options);
  const { locale } = resolved;
  const copy = getEmailCopy(locale);
  const t = copy.leadMagnet;
  const e = escapeHtml;
  const href = e(downloadUrl);
  const raw = emailLinks(locale);
  const links = {
    ukentligPlan: e(raw.ukentligPlan),
    komplett: e(raw.komplett),
    privacy: e(raw.privacy),
    site: e(raw.site),
  };
  const price = prices(resolved);
  const upsell = fillPlaceholders(e(t.upsellBody), {
    single: htmlPrice(price.single),
    komplett: htmlPrice(price.komplett),
  });
  const mailto = e(unsubscribeMailto(copy.footer.unsubscribeSubject));
  const footerUnsubscribe = fillPlaceholders(e(t.footerUnsubscribe), {
    email: `<a href="${mailto}" style="color:${C.muted};text-decoration:underline;">${SITE_EMAIL}</a>`,
  });
  const footerPrivacy = fillPlaceholders(e(t.footerPrivacy), {
    privacy: `<a href="${links.privacy}" target="_blank" style="color:${C.muted};text-decoration:underline;">${e(t.privacyLink)}</a>`,
  });
  const preheaderFill = "&#847;&zwnj;&nbsp;".repeat(40);
  const tips = t.tips.map((tip, i) => tipRow(i + 1, e(tip.title), e(tip.body))).join("\n");

  return `<!DOCTYPE html>
<html lang="${htmlLang[locale]}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${e(t.subject)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>body,table,td,p,a,h1,h2,span,strong{font-family:Arial,sans-serif !important;}</style>
<![endif]-->
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<!--<![endif]-->
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark;}
body{margin:0;padding:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
img{border:0;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;}
@media only screen and (max-width:620px){
  .container{width:100% !important;}
  .px{padding-left:22px !important;padding-right:22px !important;}
  .h1{font-size:25px !important;line-height:32px !important;}
  .btn-table{width:100% !important;}
  .btn a{width:100% !important;}
}
@media (prefers-color-scheme:dark){
  .bg-page{background-color:#1f1b19 !important;}
  .bg-card{background-color:#2a2421 !important;}
  .bg-soft{background-color:#342c28 !important;}
  .t-main{color:#f3ece7 !important;}
  .t-muted{color:#cbbdb4 !important;}
  .t-accent,.t-accent a{color:#e3b8a6 !important;}
  .bd{border-color:#4a403a !important;}
}
[data-ogsb] .bg-page{background-color:#1f1b19 !important;}
[data-ogsb] .bg-card{background-color:#2a2421 !important;}
[data-ogsb] .bg-soft{background-color:#342c28 !important;}
[data-ogsc] .t-main{color:#f3ece7 !important;}
[data-ogsc] .t-muted{color:#cbbdb4 !important;}
[data-ogsc] .t-accent,[data-ogsc] .t-accent a{color:#e3b8a6 !important;}
</style>
</head>
<body class="bg-page" style="margin:0;padding:0;background-color:${C.page};">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${e(t.preheader)}${preheaderFill}</div>
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="bg-page" style="background-color:${C.page};">
<tr>
<td align="center" style="padding:28px 12px 36px 12px;">
<!--[if mso]><table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="container" style="width:100%;max-width:600px;">

<tr>
<td align="center" class="t-main" style="padding:0 0 20px 0;font-family:${FONT};font-size:15px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${C.text};">
<a href="${links.site}" target="_blank" class="t-main" style="color:${C.text};text-decoration:none;">Studentplanlegger</a>
</td>
</tr>

<tr>
<td class="bg-card" style="background-color:${C.card};border-radius:16px;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">

<tr>
<td height="6" style="height:6px;font-size:0;line-height:0;background-color:${C.accent};border-radius:16px 16px 0 0;">&nbsp;</td>
</tr>

<tr>
<td class="px" style="padding:36px 48px 0 48px;">
<p class="t-accent" style="margin:0 0 12px 0;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;color:${C.deep};">${e(t.label)}</p>
<h1 class="h1 t-main" style="margin:0 0 16px 0;font-family:${FONT};font-size:28px;line-height:36px;font-weight:600;color:${C.text};">${e(t.heading)}</h1>
<p class="t-main" style="margin:0 0 12px 0;font-family:${FONT};font-size:16px;line-height:25px;color:${C.text};">${e(t.intro)}</p>
<p class="t-muted" style="margin:0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.muted};">${e(t.note)}</p>
</td>
</tr>

<tr>
<td align="center" class="px" style="padding:28px 48px 8px 48px;">
<a href="${href}" target="_blank" style="text-decoration:none;"><img src="${LEAD_MAGNET_IMAGE_URL}" width="280" height="387" alt="${e(t.imageAlt)}" style="display:block;width:280px;max-width:100%;height:auto;margin:0 auto;border:0;font-family:${FONT};font-size:14px;color:${C.muted};"></a>
</td>
</tr>

<tr>
<td align="center" class="px" style="padding:20px 48px 0 48px;">
${button(href, e(t.button))}
<p class="t-muted" style="margin:12px 0 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};">${t.buttonMeta.map(e).join(" &middot; ")}</p>
</td>
</tr>

<tr>
<td class="px" style="padding:36px 48px 0 48px;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="bd" style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>
<h2 class="t-main" style="margin:28px 0 18px 0;font-family:${FONT};font-size:18px;line-height:24px;font-weight:600;color:${C.text};">${e(t.tipsHeading)}</h2>
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
${tips}
</table>
</td>
</tr>

<tr>
<td class="px" style="padding:12px 48px 0 48px;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="bg-soft" style="background-color:${C.soft};border-radius:12px;">
<tr>
<td style="padding:22px 24px;">
<p class="t-main" style="margin:0 0 6px 0;font-family:${FONT};font-size:16px;line-height:24px;font-weight:600;color:${C.text};">${e(t.upsellHeading)}</p>
<p class="t-main" style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">${upsell}</p>
<p class="t-accent" style="margin:0;font-family:${FONT};font-size:15px;line-height:24px;font-weight:600;">
<a href="${links.ukentligPlan}" target="_blank" style="color:${C.deep};text-decoration:underline;">${e(t.linkWeekly)}</a>
<span class="t-muted" style="color:${C.muted};">&nbsp;&middot;&nbsp;</span>
<a href="${links.komplett}" target="_blank" style="color:${C.deep};text-decoration:underline;">${e(t.linkKomplett)}</a>
</p>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td class="px" style="padding:28px 48px 40px 48px;">
<p class="t-main" style="margin:0 0 4px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">${e(t.closing)}</p>
<p class="t-main" style="margin:0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">${e(copy.footer.signature)}</p>
</td>
</tr>

</table>
</td>
</tr>

<tr>
<td align="center" class="px" style="padding:24px 36px 0 36px;">
<p class="t-muted" style="margin:0 0 10px 0;font-family:${FONT};font-size:12px;line-height:19px;color:${C.muted};">${e(copy.footer.reason)} ${footerUnsubscribe} ${footerPrivacy}</p>
<p class="t-muted" style="margin:0;font-family:${FONT};font-size:12px;line-height:19px;color:${C.muted};">Studentplanlegger.no &middot; NSD Drift</p>
</td>
</tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td>
</tr>
</table>
</body>
</html>`;
}

export function buildLeadMagnetText(downloadUrl: string, options: LeadMagnetOptions = {}): string {
  const resolved = resolve(options);
  const { locale } = resolved;
  const copy = getEmailCopy(locale);
  const t = copy.leadMagnet;
  const links = emailLinks(locale);
  const tips = t.tips.map((tip, i) => `${i + 1}. ${tip.title} ${tip.body}`).join("\n");
  const upsell = fillPlaceholders(t.upsellBody, prices(resolved));
  const unsubscribe = fillPlaceholders(t.footerUnsubscribe, { email: SITE_EMAIL });
  return `${t.label}

${t.heading}

${t.intro}

${t.note}

${t.textDownload}
${downloadUrl}

${t.tipsHeading.toUpperCase()}

${tips}

${t.upsellHeading.toUpperCase()}

${upsell}

${t.linkWeekly}: ${links.ukentligPlan}
${t.linkKomplett}: ${links.komplett}

${t.closing}
${copy.footer.signature}

--
${copy.footer.reason} ${unsubscribe}
${t.textPrivacyLabel}: ${links.privacy}
Studentplanlegger.no · NSD Drift
`;
}

export function buildLeadMagnetEmail(downloadUrl: string, options: LeadMagnetOptions = {}) {
  const { locale } = resolve(options);
  const t = getEmailCopy(locale).leadMagnet;
  return {
    locale,
    subject: t.subject,
    preheader: t.preheader,
    html: buildLeadMagnetHtml(downloadUrl, options),
    text: buildLeadMagnetText(downloadUrl, options),
    headers: leadMagnetHeaders(locale),
  };
}
