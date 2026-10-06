# Ny /gratis-e-post (smakebit av Ukentlig Plan)

Date: 2026-10-06
Branch: `cursor/gratis-epost-6edf`

**Goal:** The email that delivers the free sample looks like the brand, works in Outlook, Gmail and Apple Mail (light and dark), and gently points to the paid plan without pressure.

## Constraints

- Bokmål, warm, du-form. Prices only as in the shop: 39 / 99 / 149 / 249 kr. No fake urgency, reviews or anchor prices.
- Don't touch the download/token logic (`app/api/newsletter/route.ts`, signed URL, 7-day TTL). Don't send any email.
- Keep the unsubscribe and privacy line. Add a plain-text part.
- One PR against `master`. Do not merge.

## Research findings

**Timing and job of the email.** The welcome/lead-magnet email is the most-read email a small shop sends: 35–84 % opens depending on the benchmark, about 4× the clicks of a newsletter, highest revenue per email of any flow (Omnisend: 35.5 % open, 3.9 % CTR, $6.16/email). Opens are inflated by Apple MPP, so judge on clicks. It must arrive at once and deliver exactly what was promised. Keep email 1 short (under ~150 words of body copy) with **one** clear CTA. Upselling and social proof belong in later emails, not the delivery email. [Omnisend][omnisend], [Stripo Research][stripo], [ConversionStudio][cs], [Ecommerce Times][ect], [Geysera][geysera]

**Subject and preheader.** Mobile shows 33–40 characters of subject (Gmail on Android is tightest), so aim for 30–40 and put the key words first. The subject should name the thing they signed up for. Preheader: 40–90 characters with the point in the first 40, adding new information instead of repeating the subject. Without one, clients show the first body text. [ActiveCampaign][ac], [Emailtooltester][ett], [Knak][knak], [TypeCount][tc]

**Students.** 63 % of students read email on their phone and **74 % use dark mode** on at least one device. They skim, rank "useful and on point" first, and trust messages that sound like a person more than polished marketing (no superlatives, stock photos or hype). Gen Z fact-checks, so claims have to be true. [SchoolFinder 2026 survey][sf], [User Intuition][ui], [GMAC/mba.com][gmac]

**Design and code.**
- Use table layout, inline CSS and a 600 px fluid column.
- **Bulletproof button.** Modern clients get a padded `<a>`. Classic Outlook gets a VML `roundrect` inside `<!--[if mso]>`, with the same URL, size and colour, so the whole button is clickable and keeps rounded corners. [Litmus][litmus-btn], [Osama Hassouna][oh], [Email Developer][ed-btn]
- **Web fonts** only load in Apple Mail, iOS, Outlook for Mac and Samsung. Gmail and Outlook on Windows ignore them, so use Montserrat with a Helvetica/Arial stack. Hide the font `<link>` from Outlook with `<!--[if !mso]>` (otherwise it falls back to Times) and set `mso-font-alt`. [Litmus fonts][litmus-fonts], [Can I email][caniemail], [Email on Acid][eoa]
- **Dark mode.** Apple Mail only applies custom dark styles if `color-scheme` / `supported-color-schemes` is declared. Outlook.com/apps can be targeted with `[data-ogsc]` / `[data-ogsb]`. Gmail ignores all of it and does its own partial inversion (Android) or full inversion (iOS). The defence:
  - an explicit colour on every cell;
  - no pure #fff/#000;
  - mid-tone accents;
  - solid-fill buttons;
  - underlined links;
  - images that read on both light and dark backgrounds.

  [Courier][courier], [Litmus dark mode][litmus-dm], [Mailchimp][mc], [Email Developer][ed-dm]
- **Accessibility.** Text and buttons should meet at least WCAG AA contrast. Avoid thin fonts, and make the CTA readable even with images off. [Litmus dark mode][litmus-dm]

**Deliverability.**
- Send a real `text/plain` part that matches the HTML.
- Don't let the message depend on an image: keep the key copy, CTA and footer as live text, roughly 60/40 text to image.
- Keep the HTML under ~100 KB (Gmail clips at 102 KB).
- Don't hide content apart from the standard preheader.
- Make links visible and honest.
- Words like "gratis" are only a weak signal; deception and poor authentication are what hurt.
- Gmail and Yahoo want a visible unsubscribe link in the body, plus a `List-Unsubscribe` header (one-click RFC 8058 is required above 5,000/day; mailto is accepted by Yahoo).

[Gmail sender guidelines][gmail], [Gmail FAQ][gmail-faq], [Yahoo Sender Hub][yahoo], [Suped][suped-img], [Suped MIME][suped-mime]

**Norwegian law.** The sign-up form gives consent (markedsføringsloven § 15), and every marketing email must offer an easy, free way to opt out. Forbrukertilsynet suggests a link in each email, with no login required. [Forbrukertilsynet][ft], [Lovdata § 15][lovdata], [Datatilsynet][dt]

## Decisions

| Topic | Choice |
|---|---|
| Subject | «Smakebiten av Ukentlig Plan er klar» (35 tegn): names what they asked for and stays honest that it's a sample. |
| Preheader | «Mandag–onsdag som fyllbar PDF. Last ned nå – lenken virker i 7 dager.» (70 tegn): new information, true (signed URL TTL is 7 days). |
| Structure | Wordmark → eyebrow «GRATIS SMAKEBIT» → headline → 2 short lines → real image of the sample (links to the download) → one button «Last ned ukeplanen» → «Slik bruker du den» (3 tips) → small upsell box → sign-off → footer with opt-out + personvern. |
| One CTA | The button is the only filled element. The upsell uses plain underlined text links. |
| Upsell | «Hele Ukentlig Plan (2 sider, også torsdag–søndag) koster 39 kr. Alle 25 planleggerne i Komplett: 249 kr.» No urgency, no reviews, no "før"-price. Links carry `utm_source=epost&utm_medium=email&utm_campaign=gratis-ukeplan`. |
| Palette | Background #f7f3f0, card #fffffe, text #3a3330, muted #6f625b, accent #d4a593 (decorative only, dark text on it is 5.7:1). Button and eyebrow #9c5a43 (white text 5.3:1, AA). White on #d4a593 would only be 2.2:1. |
| Fonts | Montserrat (the planners' own font) via Google Fonts for Apple Mail and iOS; fallback `'Helvetica Neue', Helvetica, Arial, sans-serif`; hidden from Outlook. |
| Dark mode | `color-scheme` meta + CSS, `prefers-color-scheme` block and `[data-ogsc]` copies (card #2a2421, text #f3ece7, accent #e3b8a6). The image is a transparent PNG with its own soft shadow so it sits on either background. |
| Image | `public/images/email/smakebit.png`, rendered from `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf` by `scripts/build-email-images.py`, linked as `https://www.studentplanlegger.no/images/email/smakebit.png` with alt text. |
| Plain text | `text` part with the same copy and full URLs. |
| Headers | `List-Unsubscribe: <mailto:hei@studentplanlegger.no?subject=Avmelding>`. No one-click endpoint (volume is far below 5,000/day; would need new route logic). |

## Tasks

- [x] Research and findings (this file)
- [x] `scripts/build-email-images.py` → `public/images/email/smakebit.png`
- [x] `buildLeadMagnetEmail()` in `lib/lead-magnet-email.ts` returns subject, preheader, HTML and text; `sendLeadMagnetEmail` sends HTML + text + `List-Unsubscribe`. Route and token logic untouched
- [x] Tests in `lib/email.test.ts`: subject/preheader length, one filled CTA + VML, escaped URL in HTML and text, prices only 39/249, sample honesty, opt-out and personvern, absolute image URL, size under 100 KB
- [x] Render previews in headless Chrome: desktop 800px, mobile 390px, mobile dark mode (Apple Mail rules), and mobile with `<style>` stripped (clients that drop embedded CSS) to check that the layout is fluid. The Outlook (Word) path was checked statically: MSO conditionals balanced, one VML button with the same href, 600px MSO wrapper, Arial override
- [x] `npm test`, `npm run build`
- [x] `STATE.md`, PR (not merged)

## Not done / follow-up

- Real-client screenshots (Litmus / Email on Acid) need an account; the previews here are browser renders of the same HTML under each client's rules.
- One-click unsubscribe (RFC 8058) needs a POST endpoint and a store for opt-outs.
- A short follow-up email (e.g. day 2 with tips, day 5 with the full plan) would fit the research better than a heavier upsell in email 1.

[omnisend]: https://www.omnisend.com/blog/email-marketing-benchmarks/
[stripo]: https://research.stripo.email/welcome-email-open-rates
[cs]: https://conversion.studio/blog/welcome-email-examples
[ect]: https://ecommerce-times.com/how-to-build-a-high-converting-email-welcome-series-in-2026-2/
[geysera]: https://www.geysera.com/blog/ecommerce-email/welcome-email-best-practices
[ac]: https://www.activecampaign.com/glossary/subject-line-length
[ett]: https://www.emailtooltester.com/en/blog/email-subject-lines-character-limit/
[knak]: https://knak.com/blog/email-preview-text/
[tc]: https://typecount.com/blog/email-subject-line-length
[sf]: https://schoolfindergroup.com/guides-research-and-more/prospective-student-communication-survey-2026/
[ui]: https://www.userintuition.ai/reference-guides/gen-z-student-communication-preferences/
[gmac]: https://www.mba.com/-/media/files/gradselect/8-gen-z-2023.pdf
[litmus-btn]: https://www.litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design
[oh]: https://docs.osamahassouna.com/email-playbook/production/bulletproof-buttons/
[ed-btn]: https://email-dev.com/bulletproof-buttons-for-email/
[litmus-fonts]: https://www.litmus.com/blog/the-ultimate-guide-to-web-fonts
[caniemail]: https://www.caniemail.com/features/css-at-font-face/
[eoa]: http://www.emailonacid.com/blog/article/email-development/best-font-for-email-everything-you-need-to-know-about-email-safe-fonts/
[courier]: https://www.courier.com/blog/dark-mode-email-design
[litmus-dm]: https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers
[mc]: https://mailchimp.com/help/design-emails-dark-mode/
[ed-dm]: https://email-dev.com/coding-dark-mode-emails/
[gmail]: https://support.google.com/mail/answer/81126
[gmail-faq]: https://support.google.com/mail/answer/14229414
[yahoo]: https://senders.yahooinc.com/best-practices/
[suped-img]: https://www.suped.com/learn/email-deliverability/can-images-in-emails-cause-them-to-go-to-spam
[suped-mime]: https://www.suped.com/learn/email-deliverability/how-does-email-file-size-and-mime-types-affect-email-deliverability
[ft]: https://www.forbrukertilsynet.no/lov-og-rett/veiledninger-og-retningslinjer/forbrukertilsynets-veiledning-markedsforing-via-e-post-sms-o-l
[lovdata]: https://lovdata.no/nav/lov/2009-01-09-2/kap3
[dt]: https://www.datatilsynet.no/personvern-pa-ulike-omrader/kundehandtering-handel-og-medlemskap/nyhetsbrev-epostlister-og-sms/
