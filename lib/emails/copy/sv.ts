import type { EmailCopy } from "../types";

export const sv: EmailCopy = {
  footer: {
    reason: "Du får det här mejlet för att du bad om en gratis veckoplan på studentplanlegger.no.",
    signature: "Hälsningar, Studentplanlegger",
    unsubscribeSubject: "Avregistrering",
  },
  leadMagnet: {
    subject: "Ditt smakprov på Veckoplan är klart",
    preheader: "Måndag–onsdag som ifyllbar PDF. Ladda ner nu – länken gäller i 7 dagar.",
    label: "GRATIS SMAKPROV",
    heading: "Din veckoplan är klar",
    intro:
      "Hej! Vad roligt att du vill testa Veckoplan. Här är första sidan: mål, prioriteringar, att göra och vanor, plus schema för måndag till onsdag.",
    note: "Det är ett smakprov, inte hela produkten. Men det är en riktig sida ur planeraren, med fält du kan fylla i direkt i PDF:en.",
    imageAlt:
      "Smakprovet: första sidan av Veckoplan med mål, prioriteringar, att göra och måndag till onsdag",
    button: "Ladda ner veckoplanen",
    buttonMeta: ["Ifyllbar PDF", "A4", "länken gäller i 7 dagar"],
    textDownload: "Ladda ner veckoplanen (ifyllbar PDF, A4, länken gäller i 7 dagar):",
    tipsHeading: "Så använder du den",
    tips: [
      {
        title: "Öppna den i Adobe Acrobat Reader.",
        body: "Den är gratis på dator och mobil. Då kan du skriva direkt i fälten och spara.",
      },
      {
        title: "Lägg tio minuter på söndagskvällen.",
        body: "Skriv veckans mål och dina tre viktigaste prioriteringar innan du fyller i schemat.",
      },
      {
        title: "Spara en tom kopia först.",
        body: "Då har du en ny sida redo nästa vecka. Eller skriv ut den och ta fram pennan.",
      },
    ],
    upsellHeading: "Vill du ha hela veckan?",
    upsellBody:
      "Hela Veckoplan har två sidor, även med torsdag till söndag, och kostar {single}. Vill du ha allt får du alla 25 planerare i hela paketet för {komplett}.",
    linkWeekly: "Se Veckoplan",
    linkKomplett: "Se hela paketet",
    closing: "Lycka till med veckan! Undrar du något är det bara att svara på det här mejlet.",
    footerUnsubscribe:
      "Vill du inte få fler mejl? Svara ”avregistrera” eller skriv till {email}, så tar vi bort dig.",
    footerPrivacy: "Läs vår {privacy}.",
    privacyLink: "integritetspolicy",
    textPrivacyLabel: "Integritet",
  },
  welcome: {
    unsubscribeLink: "Avregistrera dig",
    privacyLink: "Integritetspolicy",
    emails: [
      {
        subject: "Så får du ut mest av veckoplanen",
        body: "Hej! Har du hunnit testa veckoplanen? Ett litet tips: lägg tio minuter på söndagskvällen på att fylla i föreläsningar, inlämningar och jobb, och välj sedan tre saker som <em>måste</em> bli gjorda. Då blir måndagen mycket lugnare. Svara gärna på det här mejlet om du undrar något.",
      },
      {
        subject: "När tentorna närmar sig",
        body: "Sex veckor före tentan är det smart att fördela kurslitteraturen på veckorna som är kvar, så slipper du plugga allt den sista veckan. I hela paketet hittar du årsplanerare, månadsplanerare och veckoplan som hänger ihop, och alla är ifyllbara PDF:er som du kan använda på surfplatta eller dator.",
        button: "Se paketet",
      },
      {
        subject: "Alla 25 planerare i ett paket",
        body: "Gillar du veckoplanen? Då får du hela paketet för {bundlePrice}. Det är ett engångsköp utan prenumeration, och du laddar ner direkt. Är du med i en studentförening i Norge kan du kanske få 20 % rabatt med deras kod.",
        button: "Köp hela paketet",
      },
    ],
  },
};
