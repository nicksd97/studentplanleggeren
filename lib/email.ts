import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(apiKey);
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
}

export async function sendOrderConfirmation({
  email,
  firstName,
  items,
  downloadToken,
}: {
  email: string;
  firstName: string;
  items: OrderItem[];
  downloadToken: string;
}) {
  const downloadUrl = `https://studentplanlegger.no/takk?token=${downloadToken}`;

  const itemListHtml = items
    .map((item) => `<li style="padding:4px 0">${item.name} — ${item.price} kr</li>`)
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px">
      <h1 style="font-size:24px;color:#1a1a2e;margin-bottom:8px">Takk for kjøpet, ${firstName}!</h1>
      <p style="color:#555;font-size:16px;line-height:1.6">
        Her er en oversikt over bestillingen din:
      </p>
      <ul style="list-style:none;padding:0;margin:16px 0;background:#f9f9fb;border-radius:8px;padding:16px">
        ${itemListHtml}
      </ul>
      <p style="color:#555;font-size:16px;line-height:1.6">
        Last ned produktene dine via lenken under:
      </p>
      <a href="${downloadUrl}" style="display:inline-block;background:#6c5ce7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
        Last ned planleggerne
      </a>
      <p style="color:#888;font-size:14px;margin-top:24px">
        Lenken er gyldig i 7 dager fra kjøpstidspunktet. Har du spørsmål? Kontakt oss på
        <a href="mailto:hei@studentplanlegger.no" style="color:#6c5ce7">hei@studentplanlegger.no</a>.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
      <p style="color:#aaa;font-size:12px">Studentplanlegger.no · NSD Drift</p>
    </div>
  `;

  const resend = getResendClient();

  await resend.emails.send({
    from: 'Studentplanlegger <onboarding@resend.dev>',
    to: email,
    subject: 'Takk for kjøpet! Her er nedlastingslenken din',
    html,
  });
}
