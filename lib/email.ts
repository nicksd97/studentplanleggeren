import { Resend } from 'resend';
import { formatMoney, type Currency } from './currency';
import { getContent, type OrderEmailCopy } from './i18n/content/index';
import { localizePath, type Locale } from './i18n/config';
import { fmt } from './i18n/format';
import { getMessages } from './i18n/messages/index';
import { itemDisplayName } from './i18n/products';
import { buildLeadMagnetEmail } from './lead-magnet-email';
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
  text,
  headers,
  idempotencyKey,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}) {
  const resend = getResendClient();
  const { error } = await resend.emails.send(
    { from: EMAIL_FROM, to, subject, html, ...(text ? { text } : {}), ...(headers ? { headers } : {}) },
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

const ORDER_EMAIL_NB: OrderEmailCopy = {
  subject: 'Takk for kjøpet! Her er nedlastingslenken din',
  heading: 'Takk for kjøpet, {firstName}!',
  intro: 'Her er en oversikt over bestillingen din:',
  discount: 'Rabatt {code} (−{percent} %) — −{amount}',
  total: 'Totalt — {amount}',
  downloadIntro: 'Last ned produktene dine via lenken under:',
  button: 'Last ned planleggerne',
  validity: 'Lenken er gyldig i 7 dager fra kjøpstidspunktet. Har du spørsmål? Kontakt oss på',
};

export function orderEmailCopy(locale: Locale): OrderEmailCopy {
  return locale === 'nb' ? ORDER_EMAIL_NB : getContent(locale).email;
}

type OrderConfirmationInput = {
  firstName: string;
  items: OrderItem[];
  downloadToken: string;
  amountNok?: number;
  discountCode?: string;
  discountNok?: number;
  discountPercent?: number;
  /** Order currency; NOK when absent. Non-NOK amounts come from amountMinor/discountMinor. */
  currency?: Currency;
  amountMinor?: number;
  discountMinor?: number;
  /** Buyer's site language; Bokmål when absent. */
  locale?: Locale;
};

/** Order confirmation in the buyer's language, with amounts in the order's currency. */
export function buildOrderConfirmationHtml({
  firstName,
  items,
  downloadToken,
  amountNok,
  discountCode,
  discountNok,
  discountPercent,
  currency = 'NOK',
  amountMinor,
  discountMinor,
  locale = 'nb',
}: OrderConfirmationInput) {
  const copy = orderEmailCopy(locale);
  const messages = getMessages(locale);
  const downloadUrl = `${SITE_ORIGIN}${localizePath('/takk', locale)}?token=${downloadToken}`;
  const nok = currency === 'NOK' || amountMinor == null;
  const money = (minor: number) => formatMoney(minor, nok ? 'NOK' : currency, locale);
  const totalMinor = nok
    ? (amountNok ?? items.reduce((sum, item) => sum + item.price, 0)) * 100
    : amountMinor;
  const discountAmountMinor = nok ? (discountNok ?? 0) * 100 : (discountMinor ?? 0);
  const itemListHtml = items
    .map((item) => `<li style="padding:4px 0">${itemDisplayName(item, messages)}</li>`)
    .join('');
  const showDiscount = Boolean(discountCode && discountAmountMinor > 0);
  const discountLine = showDiscount
    ? `<li style="padding:8px 0 0;margin-top:8px;border-top:1px solid #eee">${fmt(copy.discount, {
        code: discountCode ?? '',
        percent: discountPercent ?? 20,
        amount: money(discountAmountMinor),
      })}</li>`
    : '';
  const totalStyle = showDiscount
    ? 'padding:8px 0 0;font-weight:600'
    : 'padding:12px 0 0;margin-top:8px;border-top:1px solid #eee;font-weight:600';

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px">
      <h1 style="font-size:24px;color:#1a1a2e;margin-bottom:8px">${fmt(copy.heading, { firstName })}</h1>
      <p style="color:#555;font-size:16px;line-height:1.6">
        ${copy.intro}
      </p>
      <ul style="list-style:none;padding:0;margin:16px 0;background:#f9f9fb;border-radius:8px;padding:16px">
        ${itemListHtml}
        ${discountLine}
        <li style="${totalStyle}">${fmt(copy.total, { amount: money(totalMinor) })}</li>
      </ul>
      <p style="color:#555;font-size:16px;line-height:1.6">
        ${copy.downloadIntro}
      </p>
      <a href="${downloadUrl}" style="display:inline-block;background:#6c5ce7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
        ${copy.button}
      </a>
      <p style="color:#888;font-size:14px;margin-top:24px">
        ${copy.validity}
        <a href="mailto:${SITE_EMAIL}" style="color:#6c5ce7">${SITE_EMAIL}</a>.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
      <p style="color:#aaa;font-size:12px">Studentplanlegger.no · NSD Drift</p>
    </div>
  `;
}

export async function sendOrderConfirmation(
  input: OrderConfirmationInput & { email: string },
) {
  const { email, ...rest } = input;
  const html = buildOrderConfirmationHtml(rest);

  await sendHtmlEmail({
    to: email,
    subject: orderEmailCopy(rest.locale ?? 'nb').subject,
    html,
  });
}

/** The free sample in the subscriber's language, with prices in their currency (Bokmål/NOK by default). */
export async function sendLeadMagnetEmail({
  to,
  downloadUrl,
  locale,
  currency,
}: {
  to: string;
  downloadUrl: string;
  locale?: Locale;
  currency?: Currency;
}) {
  const { subject, html, text, headers } = buildLeadMagnetEmail(downloadUrl, { locale, currency });

  await sendHtmlEmail({
    to,
    subject,
    html,
    text,
    headers,
    idempotencyKey: `lead-magnet/${to.toLowerCase()}`,
  });
}
