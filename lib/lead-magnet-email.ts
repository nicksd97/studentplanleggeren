import { KOMPLETT_PRICE, SINGLE_PRICE } from "./products";
import { SITE_EMAIL, SITE_ORIGIN } from "./site";

export const LEAD_MAGNET_SUBJECT = "Smakebiten av Ukentlig Plan er klar";
export const LEAD_MAGNET_PREHEADER =
  "Mandag–onsdag som fyllbar PDF. Last ned nå – lenken virker i 7 dager.";
export const LEAD_MAGNET_IMAGE_URL = `${SITE_ORIGIN}/images/email/smakebit.png`;

const UTM = "utm_source=epost&utm_medium=email&utm_campaign=gratis-ukeplan";
export const LEAD_MAGNET_LINKS = {
  ukentligPlan: `${SITE_ORIGIN}/produkter?kategori=ukentlig&${UTM}&utm_content=ukentlig-plan`,
  komplett: `${SITE_ORIGIN}/?${UTM}&utm_content=komplett#pakker`,
  privacy: `${SITE_ORIGIN}/personvern`,
  site: SITE_ORIGIN,
};

export const LEAD_MAGNET_HEADERS = {
  "List-Unsubscribe": `<mailto:${SITE_EMAIL}?subject=Avmelding>`,
};

const C = {
  page: "#f7f3f0",
  card: "#fffffe",
  soft: "#f7f3f0",
  text: "#3a3330",
  muted: "#6f625b",
  accent: "#d4a593",
  deep: "#9c5a43",
  line: "#eae1da",
  onDeep: "#fffffe",
};

const FONT = "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif";

const TIPS = [
  {
    title: "Åpne den i Adobe Acrobat Reader.",
    body: "Den er gratis på PC og mobil. Da kan du skrive rett i feltene og lagre.",
  },
  {
    title: "Sett av ti minutter søndag kveld.",
    body: "Skriv ukens mål og de tre viktigste prioriteringene før du fyller timeplanen.",
  },
  {
    title: "Lagre en tom kopi først.",
    body: "Da har du en ny side klar neste uke. Eller skriv den ut og bruk penn.",
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

export function buildLeadMagnetHtml(downloadUrl: string): string {
  const href = escapeHtml(downloadUrl);
  const links = {
    ukentligPlan: escapeHtml(LEAD_MAGNET_LINKS.ukentligPlan),
    komplett: escapeHtml(LEAD_MAGNET_LINKS.komplett),
    privacy: escapeHtml(LEAD_MAGNET_LINKS.privacy),
    site: escapeHtml(LEAD_MAGNET_LINKS.site),
  };
  const preheaderFill = "&#847;&zwnj;&nbsp;".repeat(40);
  const tips = TIPS.map((tip, i) => tipRow(i + 1, tip.title, tip.body)).join("\n");

  return `<!DOCTYPE html>
<html lang="nb" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${LEAD_MAGNET_SUBJECT}</title>
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
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${LEAD_MAGNET_PREHEADER}${preheaderFill}</div>
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
<p class="t-accent" style="margin:0 0 12px 0;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;color:${C.deep};">GRATIS SMAKEBIT</p>
<h1 class="h1 t-main" style="margin:0 0 16px 0;font-family:${FONT};font-size:28px;line-height:36px;font-weight:600;color:${C.text};">Ukeplanen din er klar</h1>
<p class="t-main" style="margin:0 0 12px 0;font-family:${FONT};font-size:16px;line-height:25px;color:${C.text};">Hei! Så fint at du vil prøve Ukentlig Plan. Her er første side: mål, prioriteringer, gjøremål og vaner, og timeplan for mandag til onsdag.</p>
<p class="t-muted" style="margin:0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.muted};">Det er en smakebit, ikke hele produktet. Men det er en ekte side fra planleggeren, med felt du kan fylle ut rett i PDF-en.</p>
</td>
</tr>

<tr>
<td align="center" class="px" style="padding:28px 48px 8px 48px;">
<a href="${href}" target="_blank" style="text-decoration:none;"><img src="${LEAD_MAGNET_IMAGE_URL}" width="280" height="387" alt="Smakebiten: første side av Ukentlig Plan med mål, prioriteringer, gjøremål og mandag til onsdag" style="display:block;width:280px;max-width:100%;height:auto;margin:0 auto;border:0;font-family:${FONT};font-size:14px;color:${C.muted};"></a>
</td>
</tr>

<tr>
<td align="center" class="px" style="padding:20px 48px 0 48px;">
${button(href, "Last ned ukeplanen")}
<p class="t-muted" style="margin:12px 0 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};">Fyllbar PDF &middot; A4 &middot; lenken virker i 7 dager</p>
</td>
</tr>

<tr>
<td class="px" style="padding:36px 48px 0 48px;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="bd" style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>
<h2 class="t-main" style="margin:28px 0 18px 0;font-family:${FONT};font-size:18px;line-height:24px;font-weight:600;color:${C.text};">Slik bruker du den</h2>
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
<p class="t-main" style="margin:0 0 6px 0;font-family:${FONT};font-size:16px;line-height:24px;font-weight:600;color:${C.text};">Vil du ha hele uka?</p>
<p class="t-main" style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">Hele Ukentlig Plan har to sider, også med torsdag til søndag, og koster ${SINGLE_PRICE}&nbsp;kr. Vil du ha alt, får du alle 25 planleggerne i Komplett for ${KOMPLETT_PRICE}&nbsp;kr.</p>
<p class="t-accent" style="margin:0;font-family:${FONT};font-size:15px;line-height:24px;font-weight:600;">
<a href="${links.ukentligPlan}" target="_blank" style="color:${C.deep};text-decoration:underline;">Se Ukentlig Plan</a>
<span class="t-muted" style="color:${C.muted};">&nbsp;&middot;&nbsp;</span>
<a href="${links.komplett}" target="_blank" style="color:${C.deep};text-decoration:underline;">Se Komplett</a>
</p>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td class="px" style="padding:28px 48px 40px 48px;">
<p class="t-main" style="margin:0 0 4px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">Lykke til med uka! Lurer du på noe, er det bare å svare på denne e-posten.</p>
<p class="t-main" style="margin:0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">Hilsen Studentplanlegger</p>
</td>
</tr>

</table>
</td>
</tr>

<tr>
<td align="center" class="px" style="padding:24px 36px 0 36px;">
<p class="t-muted" style="margin:0 0 10px 0;font-family:${FONT};font-size:12px;line-height:19px;color:${C.muted};">Du får denne e-posten fordi du ba om gratis ukeplan på studentplanlegger.no. Vil du ikke ha flere e-poster? Svar «avmeld» eller skriv til <a href="mailto:${SITE_EMAIL}?subject=Avmelding" style="color:${C.muted};text-decoration:underline;">${SITE_EMAIL}</a>, så melder vi deg av. Les <a href="${links.privacy}" target="_blank" style="color:${C.muted};text-decoration:underline;">personvernerklæringen</a>.</p>
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

export function buildLeadMagnetText(downloadUrl: string): string {
  const tips = TIPS.map((tip, i) => `${i + 1}. ${tip.title} ${tip.body}`).join("\n");
  return `GRATIS SMAKEBIT

Ukeplanen din er klar

Hei! Så fint at du vil prøve Ukentlig Plan. Her er første side: mål, prioriteringer, gjøremål og vaner, og timeplan for mandag til onsdag.

Det er en smakebit, ikke hele produktet. Men det er en ekte side fra planleggeren, med felt du kan fylle ut rett i PDF-en.

Last ned ukeplanen (fyllbar PDF, A4, lenken virker i 7 dager):
${downloadUrl}

SLIK BRUKER DU DEN

${tips}

VIL DU HA HELE UKA?

Hele Ukentlig Plan har to sider, også med torsdag til søndag, og koster ${SINGLE_PRICE} kr. Vil du ha alt, får du alle 25 planleggerne i Komplett for ${KOMPLETT_PRICE} kr.

Se Ukentlig Plan: ${LEAD_MAGNET_LINKS.ukentligPlan}
Se Komplett: ${LEAD_MAGNET_LINKS.komplett}

Lykke til med uka! Lurer du på noe, er det bare å svare på denne e-posten.
Hilsen Studentplanlegger

--
Du får denne e-posten fordi du ba om gratis ukeplan på studentplanlegger.no. Vil du ikke ha flere e-poster? Svar «avmeld» eller skriv til ${SITE_EMAIL}, så melder vi deg av.
Personvern: ${LEAD_MAGNET_LINKS.privacy}
Studentplanlegger.no · NSD Drift
`;
}

export function buildLeadMagnetEmail(downloadUrl: string) {
  return {
    subject: LEAD_MAGNET_SUBJECT,
    preheader: LEAD_MAGNET_PREHEADER,
    html: buildLeadMagnetHtml(downloadUrl),
    text: buildLeadMagnetText(downloadUrl),
    headers: LEAD_MAGNET_HEADERS,
  };
}
