import type { EmailCopy } from "../types";

export const da: EmailCopy = {
  footer: {
    reason: "Du får denne mail, fordi du har bedt om en gratis ugeplan på studentplanlegger.no.",
    signature: "Mange hilsner, Studentplanlegger",
    unsubscribeSubject: "Afmelding",
  },
  leadMagnet: {
    subject: "Din smagsprøve på Ugeplan er klar",
    preheader: "Mandag–onsdag som udfyldelig PDF. Download nu – linket virker i 7 dage.",
    label: "GRATIS SMAGSPRØVE",
    heading: "Din ugeplan er klar",
    intro:
      "Hej! Hvor dejligt, at du vil prøve Ugeplan. Her er første side: mål, prioriteter, opgaver og vaner, plus skema for mandag til onsdag.",
    note: "Det er en smagsprøve, ikke hele produktet. Men det er en rigtig side fra planlæggeren, med felter du kan udfylde direkte i PDF'en.",
    imageAlt:
      "Smagsprøven: første side af Ugeplan med mål, prioriteter, opgaver og mandag til onsdag",
    button: "Download ugeplanen",
    buttonMeta: ["Udfyldelig PDF", "A4", "linket virker i 7 dage"],
    textDownload: "Download ugeplanen (udfyldelig PDF, A4, linket virker i 7 dage):",
    tipsHeading: "Sådan bruger du den",
    tips: [
      {
        title: "Åbn den i Adobe Acrobat Reader.",
        body: "Den er gratis på computer og mobil. Så kan du skrive direkte i felterne og gemme.",
      },
      {
        title: "Sæt ti minutter af søndag aften.",
        body: "Skriv ugens mål og dine tre vigtigste prioriteter ned, før du udfylder skemaet.",
      },
      {
        title: "Gem en tom kopi først.",
        body: "Så har du en ny side klar til næste uge. Eller print den og find en kuglepen frem.",
      },
    ],
    upsellHeading: "Vil du have hele ugen?",
    upsellBody:
      "Hele Ugeplan har to sider, også med torsdag til søndag, og koster {single}. Vil du have det hele, får du alle 25 planlæggere i den komplette pakke for {komplett}.",
    linkWeekly: "Se Ugeplan",
    linkKomplett: "Se den komplette pakke",
    closing: "God uge! Har du spørgsmål, så svar bare på denne mail.",
    footerUnsubscribe:
      "Vil du ikke have flere mails? Svar »afmeld« eller skriv til {email}, så afmelder vi dig.",
    footerPrivacy: "Læs vores {privacy}.",
    privacyLink: "privatlivspolitik",
    textPrivacyLabel: "Privatliv",
  },
  welcome: {
    unsubscribeLink: "Afmeld",
    privacyLink: "Privatlivspolitik",
    emails: [
      {
        subject: "Sådan får du mest ud af ugeplanen",
        body: "Hej! Har du prøvet ugeplanen endnu? Et lille tip: brug ti minutter søndag aften på at skrive forelæsninger, afleveringer og arbejde ind, og vælg så tre ting, der <em>skal</em> nås. Så bliver mandagen meget roligere. Svar endelig på denne mail, hvis du har spørgsmål.",
      },
      {
        subject: "Når eksamen nærmer sig",
        body: "Seks uger før eksamen er det smart at fordele pensum på de uger, der er tilbage, så du ikke skal læse det hele den sidste uge. I den komplette pakke finder du årsplanlægger, månedsplanlægger og ugeplan, der hænger sammen, og de er alle udfyldelige PDF'er, du kan bruge på tablet eller computer.",
        button: "Se pakken",
      },
      {
        subject: "Alle 25 planlæggere i én pakke",
        body: "Kan du lide ugeplanen? Så får du hele den komplette pakke for {bundlePrice}. Det er et engangskøb uden abonnement, og du kan downloade med det samme. Er du med i en studenterforening i Norge, kan du måske få 20 % rabat med deres kode.",
        button: "Køb den komplette pakke",
      },
    ],
  },
};
