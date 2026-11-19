// Copy for every email a subscriber gets, one dictionary per language (lib/emails/copy/<lang>.ts).
//
// Plain text throughout, escaped when rendered into HTML. Exceptions are noted per field.
// Placeholders: {single}, {komplett}, {bundlePrice} (prices in the subscriber's currency),
// {email} (our address) and {privacy} (the privacy link).

export type EmailTip = { title: string; body: string };

/** Shared by the lead-magnet email and the welcome series. */
export type EmailFooterCopy = {
  /** "Du får denne e-posten fordi …". */
  reason: string;
  /** Sign-off line, e.g. "Hilsen Studentplanlegger". */
  signature: string;
  /** Subject of the List-Unsubscribe / unsubscribe mailto link. */
  unsubscribeSubject: string;
};

export type LeadMagnetCopy = {
  subject: string;
  preheader: string;
  /** Small caps label above the heading, e.g. "GRATIS SMAKEBIT". */
  label: string;
  heading: string;
  intro: string;
  /** Says plainly that this is a sample, not the full product. */
  note: string;
  imageAlt: string;
  button: string;
  /** Shown under the button, joined with " · ". */
  buttonMeta: readonly string[];
  /** Plain-text line before the download URL. */
  textDownload: string;
  tipsHeading: string;
  tips: readonly EmailTip[];
  upsellHeading: string;
  /** Uses {single} and {komplett}. */
  upsellBody: string;
  linkWeekly: string;
  linkKomplett: string;
  closing: string;
  /** Uses {email}. */
  footerUnsubscribe: string;
  /** Uses {privacy}, replaced by a link with `privacyLink` as its text. */
  footerPrivacy: string;
  privacyLink: string;
  /** Label before the privacy URL in the plain-text part. */
  textPrivacyLabel: string;
};

export type WelcomeEmailCopy = {
  /** May use {bundlePrice}. Non-Bokmål subjects don't, since the automation can't fill them. */
  subject: string;
  /** HTML-safe: may contain <em>; may use {bundlePrice}. */
  body: string;
  /** Call-to-action button; omitted for a plain-text-style email. */
  button?: string;
};

export type WelcomeSeriesCopy = {
  unsubscribeLink: string;
  privacyLink: string;
  emails: readonly [WelcomeEmailCopy, WelcomeEmailCopy, WelcomeEmailCopy];
};

export type EmailCopy = {
  footer: EmailFooterCopy;
  leadMagnet: LeadMagnetCopy;
  welcome: WelcomeSeriesCopy;
};
