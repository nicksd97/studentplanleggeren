import type { EmailCopy } from "../types";

// Bokmål. The lead-magnet text is the live email; the welcome series reproduces the live Resend
// templates «Studentplanlegger gratis – e-post 1–3» word for word. Change both together.

export const nb: EmailCopy = {
  footer: {
    reason: "Du får denne e-posten fordi du ba om gratis ukeplan på studentplanlegger.no.",
    signature: "Hilsen Studentplanlegger",
    unsubscribeSubject: "Avmelding",
  },
  leadMagnet: {
    subject: "Smakebiten av Ukentlig Plan er klar",
    preheader: "Mandag–onsdag som fyllbar PDF. Last ned nå – lenken virker i 7 dager.",
    label: "GRATIS SMAKEBIT",
    heading: "Ukeplanen din er klar",
    intro:
      "Hei! Så fint at du vil prøve Ukentlig Plan. Her er første side: mål, prioriteringer, gjøremål og vaner, og timeplan for mandag til onsdag.",
    note: "Det er en smakebit, ikke hele produktet. Men det er en ekte side fra planleggeren, med felt du kan fylle ut rett i PDF-en.",
    imageAlt:
      "Smakebiten: første side av Ukentlig Plan med mål, prioriteringer, gjøremål og mandag til onsdag",
    button: "Last ned ukeplanen",
    buttonMeta: ["Fyllbar PDF", "A4", "lenken virker i 7 dager"],
    textDownload: "Last ned ukeplanen (fyllbar PDF, A4, lenken virker i 7 dager):",
    tipsHeading: "Slik bruker du den",
    tips: [
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
    ],
    upsellHeading: "Vil du ha hele uka?",
    upsellBody:
      "Hele Ukentlig Plan har to sider, også med torsdag til søndag, og koster {single}. Vil du ha alt, får du alle 25 planleggerne i Komplett for {komplett}.",
    linkWeekly: "Se Ukentlig Plan",
    linkKomplett: "Se Komplett",
    closing: "Lykke til med uka! Lurer du på noe, er det bare å svare på denne e-posten.",
    footerUnsubscribe:
      "Vil du ikke ha flere e-poster? Svar «avmeld» eller skriv til {email}, så melder vi deg av.",
    footerPrivacy: "Les {privacy}.",
    privacyLink: "personvernerklæringen",
    textPrivacyLabel: "Personvern",
  },
  welcome: {
    unsubscribeLink: "Meld deg av",
    privacyLink: "Personvern",
    emails: [
      {
        subject: "Slik får du mest ut av ukeplanen",
        body: "Hei! Har du testet ukeplanen ennå? Et lite tips: bruk ti minutter søndag kveld på å fylle inn forelesninger, innleveringer og jobb, og velg så tre ting som <em>må</em> bli gjort. Da blir mandagen mye roligere. Svar gjerne på denne e-posten hvis du lurer på noe.",
      },
      {
        subject: "Når eksamen nærmer seg",
        body: "Seks uker før eksamen er det lurt å fordele pensum på ukene som er igjen, så du slipper å lese alt den siste uka. I den komplette pakken finner du eksamensplan, semesterplan og ukeplan som henger sammen, og alle er utfyllbare PDF-er du kan bruke på nettbrett eller PC.",
        button: "Se pakken",
      },
      {
        subject: "Hele pakken for {bundlePrice}",
        body: "Liker du ukeplanen? Da får du hele Komplett-pakken for {bundlePrice}. Det er et engangskjøp uten abonnement, og du laster ned med en gang. Er du med i en linjeforening, kan du kanskje få 20 % rabatt med koden deres.",
        button: "Kjøp Komplett",
      },
    ],
  },
};
