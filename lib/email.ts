import { Resend } from 'resend';
import { SITE_EMAIL, SITE_NAME, SITE_ORIGIN } from './site';

export const EMAIL_FROM = `${SITE_NAME} <${SITE_EMAIL}>`;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(apiKey);
}

async function sendHtmlEmail({
  to,
  subject,
  html,
  idempotencyKey,
}: {
  to: string;
  subject: string;
  html: string;
  idempotencyKey?: string;
}) {
  const resend = getResendClient();
  const { error } = await resend.emails.send(
    { from: EMAIL_FROM, to, subject, html },
    idempotencyKey ? { idempotencyKey } : undefined,
  );
  if (error) {
    throw new Error(error.message);
  }
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
}

export function buildOrderConfirmationHtml({
  firstName,
  items,
  downloadToken,
  amountNok,
  discountCode,
  discountNok,
  discountPercent,
}: {
  firstName: string;
  items: OrderItem[];
  downloadToken: string;
  amountNok?: number;
  discountCode?: string;
  discountNok?: number;
  discountPercent?: number;
}) {
  const downloadUrl = `${SITE_ORIGIN}/takk?token=${downloadToken}`;
  const total = amountNok ?? items.reduce((sum, item) => sum + item.price, 0);
  const itemListHtml = items
    .map((item) => `<li style="padding:4px 0">${item.name}</li>`)
    .join('');
  const showDiscount = Boolean(discountCode && discountNok && discountNok > 0);
  const discountLine = showDiscount
    ? `<li style="padding:8px 0 0;margin-top:8px;border-top:1px solid #eee">Rabatt ${discountCode} (−${discountPercent ?? 20} %) — −${discountNok} kr</li>`
    : '';
  const totalStyle = showDiscount
    ? 'padding:8px 0 0;font-weight:600'
    : 'padding:12px 0 0;margin-top:8px;border-top:1px solid #eee;font-weight:600';

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px">
      <h1 style="font-size:24px;color:#1a1a2e;margin-bottom:8px">Takk for kjøpet, ${firstName}!</h1>
      <p style="color:#555;font-size:16px;line-height:1.6">
        Her er en oversikt over bestillingen din:
      </p>
      <ul style="list-style:none;padding:0;margin:16px 0;background:#f9f9fb;border-radius:8px;padding:16px">
        ${itemListHtml}
        ${discountLine}
        <li style="${totalStyle}">Totalt — ${total} kr</li>
      </ul>
      <p style="color:#555;font-size:16px;line-height:1.6">
        Last ned produktene dine via lenken under:
      </p>
      <a href="${downloadUrl}" style="display:inline-block;background:#6c5ce7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
        Last ned planleggerne
      </a>
      <p style="color:#888;font-size:14px;margin-top:24px">
        Lenken er gyldig i 7 dager fra kjøpstidspunktet. Har du spørsmål? Kontakt oss på
        <a href="mailto:${SITE_EMAIL}" style="color:#6c5ce7">${SITE_EMAIL}</a>.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
      <p style="color:#aaa;font-size:12px">Studentplanlegger.no · NSD Drift</p>
    </div>
  `;
}

export async function sendOrderConfirmation({
  email,
  firstName,
  items,
  downloadToken,
  amountNok,
  discountCode,
  discountNok,
  discountPercent,
}: {
  email: string;
  firstName: string;
  items: OrderItem[];
  downloadToken: string;
  amountNok?: number;
  discountCode?: string;
  discountNok?: number;
  discountPercent?: number;
}) {
  const html = buildOrderConfirmationHtml({
    firstName,
    items,
    downloadToken,
    amountNok,
    discountCode,
    discountNok,
    discountPercent,
  });

  await sendHtmlEmail({
    to: email,
    subject: 'Takk for kjøpet! Her er nedlastingslenken din',
    html,
  });
}

export async function sendLeadMagnetEmail({
  to,
  downloadUrl,
}: {
  to: string;
  downloadUrl: string;
}) {
  const shopUrl = `${SITE_ORIGIN}/produkter`;
  const privacyUrl = `${SITE_ORIGIN}/personvern`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px">
      <h1 style="font-size:24px;color:#1a1a2e;margin-bottom:8px">Her er smakebiten din</h1>
      <p style="color:#555;font-size:16px;line-height:1.6">
        Takk for at du tok turen innom. Her er den gratis ukentlige plan-smakebiten.
      </p>
      <p style="color:#555;font-size:16px;line-height:1.6">
        Dette er en <strong>GRATIS SMAKEBIT</strong> — <strong>ikke hele produktet</strong>.
        Én side, så du kan prøve de fyllbare feltene.
      </p>
      <a href="${downloadUrl}" style="display:inline-block;background:#6c5ce7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
        Last ned smakebiten
      </a>
      <p style="color:#555;font-size:16px;line-height:1.6">
        PDF-en er fyllbar. Vi anbefaler Adobe Acrobat Reader for best opplevelse.
      </p>
      <p style="color:#555;font-size:16px;line-height:1.6">
        Vil du ha hele ukeplanen og de andre planleggerne?
        <a href="${shopUrl}" style="color:#6c5ce7">Se nettbutikken</a>
        — 39 kr per stykk, 5-pakke 99 kr, temapakke 149 kr og Komplett 249 kr.
      </p>
      <p style="color:#888;font-size:14px;margin-top:24px">
        Vil du ikke motta flere e-poster? Svar til
        <a href="mailto:hei@studentplanlegger.no" style="color:#6c5ce7">hei@studentplanlegger.no</a>
        og be om avmelding. Les
        <a href="${privacyUrl}" style="color:#6c5ce7">personvernerklæringen</a>.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
      <p style="color:#aaa;font-size:12px">Studentplanlegger.no · NSD Drift</p>
    </div>
  `;

  await sendHtmlEmail({
    to,
    subject: 'Gratis ukentlig plan-smakebit',
    html,
    idempotencyKey: `lead-magnet/${to.toLowerCase()}`,
  });
}
