import type { Content } from "./types";

// Swedish page metadata, catalog, FAQ, guides and order email.

export const sv: Content = {
  meta: {
    home: {
      title: "Studentplanlegger — Få ordning på studierna",
      description:
        "25 ifyllbara PDF-planerare för studenter. {single} styck, 5-pack {fivePack}, temapaket {theme} och hela paketet {komplett}.",
      keywords: [
        "studieplanering",
        "planerare för studenter",
        "veckoplanering mall",
        "dagsplanerare pdf",
        "vanetracker",
        "pomodoro",
        "ifyllbar pdf",
        "studieplan",
      ],
    },
    gratis: {
      title: "Gratis smakprov på veckoplanen — Studentplanlegger",
      description:
        "Ladda ner ett gratis ifyllbart smakprov på veckoplanen. En sida för att testa formatet — inte hela produkten. Hela veckoplanen från {single}.",
    },
    kasse: {
      title: "Kassa — Studentplanlegger",
      description: "Slutför ditt köp av ifyllbara PDF-planerare från Studentplanlegger.",
    },
    takk: {
      title: "Tack för ditt köp — Studentplanlegger",
      description: "Ladda ner planerarna du har köpt från Studentplanlegger.",
    },
    notFound: {
      title: "Sidan finns inte — Studentplanlegger",
      description:
        "Den här sidan finns inte. Besök Studentplanlegger och se de ifyllbara PDF-planerarna.",
    },
    ogImageAlt: "Studentplanlegger — 25 ifyllbara PDF-planerare",
  },
  catalog: {
    alle: {
      title: "Alla planerare — Studentplanlegger",
      description:
        "25 ifyllbara PDF-planerare för studenter. {single} styck, valfria fem för {fivePack} eller paket från {theme}.",
      heading: "Alla planerare",
    },
    daglig: {
      title: "Dagsplanerare — Studentplanlegger",
      description:
        "5 PDF-planerare för dagen, gjorda för studenter. Agenda, schema, hälsa och produktivitet — fyll i på skärmen eller skriv ut.",
      heading: "Dagsplanerare",
    },
    ukentlig: {
      title: "Veckoplanerare — Studentplanlegger",
      description:
        "5 PDF-planerare för veckan, gjorda för studenter: veckoplan, att göra, matsedel och veckogenomgång.",
      heading: "Veckoplanerare",
    },
    maanedlig: {
      title: "Månadsplanerare — Studentplanlegger",
      description:
        "Månadsbudget, månadsgenomgång och månadsplanerare som ifyllbara PDF:er för studenter.",
      heading: "Månadsplanerare",
    },
    aarlig: {
      title: "Årsplanerare — Studentplanlegger",
      description:
        "Årsplanerare med översikt månad för månad och mål för året. En ifyllbar PDF för studenter.",
      heading: "Årsplanerare",
    },
    produktivitet: {
      title: "Produktivitetsplanerare — Studentplanlegger",
      description:
        "Pomodoro, projektplan, att göra-lista, handlingsplan och målplanerare som ifyllbara PDF:er.",
      heading: "Produktivitetsplanerare",
    },
    helse: {
      title: "Hälsa och livsstil — Studentplanlegger",
      description:
        "Hälsoplanerare, hemplanerare och reseplanerare. Ifyllbara PDF:er för studenter.",
      heading: "Hälsa och livsstil",
    },
    sporing: {
      title: "Trackers — Studentplanlegger",
      description:
        "Vanetracker, ekonomitracker och 30-dagarsutmaning. Ifyllbara PDF:er för studenter.",
      heading: "Trackers",
    },
  },
  faqLanguage: {
    question: "Vilket språk är planerarna på?",
    available:
      "Planerarna finns på svenska: rubriker och etiketter i PDF:erna är på svenska, och du får de svenska filerna när du handlar på den svenska sajten.",
    norwegian:
      "Planerarna är skrivna på norska (bokmål). Sajten finns på svenska, men rubriker och etiketter i PDF:erna är på norska.",
  },
  faq: [
    {
      question: "Vad är en ifyllbar PDF?",
      answer:
        "En ifyllbar PDF har interaktiva fält som du kan skriva i direkt på datorn, surfplattan eller mobilen — utan att skriva ut. Du kan också skriva ut den och fylla i för hand om du hellre vill det.",
    },
    {
      question: "Kan jag skriva ut planerarna?",
      answer:
        "Absolut! Alla planerare är gjorda för utskrift i A4 med en ren och lättläst layout. Perfekt på väggen eller vid skrivbordet.",
    },
    {
      question: "Fungerar de på mobil och surfplatta?",
      answer:
        "Ja! Öppna PDF:erna i en PDF-läsare och fyll i fälten direkt. Vi rekommenderar Adobe Acrobat Reader (gratis) för bästa upplevelse.",
    },
    {
      question: "Hur laddar jag ner efter köpet?",
      answer:
        "Du får tillgång till filerna direkt efter betalningen. Du kommer till en nedladdningssida och får dessutom ett mejl med nedladdningslänkar som gäller i 7 dagar.",
    },
    {
      question: "Hur kan jag betala?",
      answer:
        "Med kort (Visa/Mastercard), i din lokala valuta där vi stöder den. Om du betalar i norska kronor kan du också använda Vipps.",
    },
    {
      question: "Är det en prenumeration?",
      answer:
        "Nej — du betalar en gång och äger planerarna för alltid. Ingen prenumeration, inga dolda kostnader.",
    },
    {
      question: "Vad händer om jag inte är nöjd?",
      answer:
        "Eftersom det är digitala produkter som levereras direkt erbjuder vi normalt inte återbetalning. Men om du inte är nöjd, hör av dig — vi hittar en lösning.",
    },
    {
      question: "Vad ingår i hela paketet?",
      answer:
        "Studentplanlegger Komplett innehåller alla 25 planerare (dag, vecka, månad, år, produktivitet, hälsa och trackers), alla som ifyllbara PDF:er. Paketet kostar {komplett}.",
    },
    {
      question: "Vad kostar planerarna?",
      answer:
        "Varje enskild planerare kostar {single}. Valfria fem enskilda planerare i varukorgen kostar {fivePack}. Temapaketen kostar {theme} och Studentplanlegger Komplett kostar {komplett}.",
    },
  ],
  fivePack: {
    name: "5-pack",
    description: "Välj valfria fem enskilda planerare och betala {fivePack}.",
  },
  email: {
    subject: "Tack för ditt köp! Här är din nedladdningslänk",
    heading: "Tack för ditt köp, {firstName}!",
    intro: "Här är en sammanfattning av din beställning:",
    discount: "Rabatt {code} (−{percent} %) — −{amount}",
    total: "Totalt — {amount}",
    downloadIntro: "Ladda ner dina produkter via länken nedan:",
    button: "Ladda ner planerarna",
    validity:
      "Länken gäller i 7 dagar från köptillfället. Har du frågor? Kontakta oss på",
  },
  guides: [
    {
      slug: "planlegg-studiedagen",
      title: "Så planerar du din studiedag — Studentplanlegger",
      description:
        "Välj ett fåtal prioriteringar, avsätt tid för plugg och pauser och avsluta med en kort genomgång. En praktisk metod för studiedagen.",
      heading: "Så planerar du din studiedag",
      summary:
        "En lång lista är sällan en plan. Så väljer du vad som ska hända i dag och låter resten vänta.",
      footerLabel: "Planera studiedagen",
      catalogKey: "daglig",
      productSlug: "daglig-planlegger",
      productLead:
        "Dagsplanerare är ett ifyllbart PDF-blad med agenda, fokusområden och att göra-lista för {single}. I samma kategori finns också Dagsschema och Daglig genomgång.",
      productCta: "Se dagsplanerarna",
      sections: [
        {
          heading: "En lång lista är sällan en plan",
          paragraphs: [
            "Många studiedagar börjar med allt du borde ha gjort och slutar med det som råkade ligga överst på listan. Det som brukar fungera bättre är att välja ett fåtal uppgifter som faktiskt blir gjorda och avsätta tid för dem — pauserna inräknade.",
            "Du behöver inget avancerat system. Du behöver en ordning: vad som är fast, vad som är viktigt i dag och vad som kan vänta.",
          ],
        },
        {
          heading: "Skriv ner det som måste hända och välj sedan en till tre uppgifter",
          paragraphs: [
            "Börja med föreläsningar, deadlines och avtalade tider. Välj sedan en till tre studieuppgifter som får en egen tid. Resten hör hemma i en veckoplan eller på morgondagens lista.",
            "Om allt känns lika viktigt, fråga dig: vad blir svårare om jag skjuter upp det till i morgon? Svaret är ofta dagens första pass.",
          ],
        },
        {
          heading: "Planera tid, inte bara uppgifter",
          paragraphs: [
            "”Läsa kapitel 4” är en önskan. ”Läsa kapitel 4 mellan 10 och 11.30” är en plan. Du behöver inget schema för hela dagen. Det räcker att boka in de två eller tre passen som betyder mest och ge resten av dagen lite andrum.",
            "Lägg in en halvtimmes buffert om du kan. Då klarar dagen att en föreläsning drar över utan att kvällen faller ihop.",
          ],
        },
        {
          heading: "Avsluta med tre rader",
          paragraphs: [
            "Innan du lägger undan böckerna: vad blev gjort, vad gick dåligt och vilken är morgondagens första uppgift? Det tar ett par minuter och gör nästa morgon lugnare.",
          ],
        },
      ],
    },
    {
      slug: "ukentlig-studieplan",
      title: "Veckoplan för studierna: överblick före måndag — Studentplanlegger",
      description:
        "Gör en veckoplan som rymmer föreläsningar, plugg och fritid. Så fördelar du arbetet så att det inte hopar sig inför helgen.",
      heading: "Så gör du en veckoplan för studierna",
      summary:
        "Titta först på de fasta tiderna och sedan på den tid du faktiskt har för kurslitteraturen. Då hamnar inte allt på söndagen.",
      footerLabel: "Veckoplan för studierna",
      catalogKey: "ukentlig",
      productSlug: "ukentlig-planlegger",
      productLead:
        "Veckoplanerare är en enkel ifyllbar veckoplan för studier och vardag, {single}. Veckoplan har fokusområden och dagsblock, och Veckans att göra ger dig plats för uppgifter varje dag.",
      productCta: "Se veckoplanerarna",
      sections: [
        {
          heading: "Utan veckoplan blir dagarna snabbt slumpmässiga",
          paragraphs: [
            "Måndagen blir full, onsdagen försvinner och söndagen går åt till det du tänkte göra på tisdagen. En enkel överblick över veckan gör det lättare att se var arbetet faktiskt får plats — innan veckan drar i gång.",
          ],
        },
        {
          heading: "Fyll i det fasta först",
          paragraphs: [
            "Föreläsningar, seminarier, jobb och tider du inte kan flytta skrivs in innan du lovar dig själv åtta timmars plugg. Det som blir kvar är den verkliga tiden för läsning och inlämningar. Den är nästan alltid kortare än du tror.",
          ],
        },
        {
          heading: "Sprid ut det tunga arbetet",
          paragraphs: [
            "Lägg inte tre tunga läspass samma dag som två föreläsningar. Flytta ett pass till en lugnare dag. En veckoplan är användbar just för att den visar krockar innan de händer.",
            "Det är helt okej att dagarna ser olika ut. En veckoplan ska beskriva veckan du har, inte en vecka utan undervisning.",
          ],
        },
        {
          heading: "Ge fritid och hushållssysslor en plats också",
          paragraphs: [
            "Mat, träning och en ledig kväll hör hemma i överblicken. Om de inte får en plats tar de en ändå — bara mer slumpmässigt. En kort koll på onsdag eller torsdag räcker för att flytta det som har halkat efter.",
          ],
        },
      ],
    },
    {
      slug: "pomodoro-til-eksamen",
      title: "Pomodoro när du pluggar till tentan — Studentplanlegger",
      description:
        "Korta arbetspass och fasta pauser gör det lättare att hålla fokus på kurslitteraturen. Så lägger du upp en studieplan du faktiskt följer.",
      heading: "Så använder du Pomodoro när du pluggar till tentan",
      summary:
        "Öppna pass på ”hela dagen” blir ofta segdragna. Korta block med pauser emellan är lättare att komma i gång med — och att hålla i.",
      footerLabel: "Pomodoro inför tentan",
      catalogKey: "produktivitet",
      productSlug: "pomodoro-planlegger",
      productLead:
        "Pomodoroplanerare är ett ifyllbart blad där du planerar studiepass och noterar hur produktiv du var, {single}. Det finns bland de andra produktivitetsbladen.",
      productCta: "Se Pomodoroplanerare",
      sections: [
        {
          heading: "Långa, öppna pass blir ofta segdragna",
          paragraphs: [
            "När kurslitteraturen hopar sig är det frestande att avsätta hela dagen. Många märker att fokuset tryter efter en timme, och kvällen går åt till att ta igen förmiddagen. Korta arbetsblock med fasta pauser — ofta kallat Pomodoro — gör det mindre tungt att komma i gång.",
          ],
        },
        {
          heading: "Vad metoden faktiskt går ut på",
          paragraphs: [
            "En vanlig variant är 25 minuters fokuserat arbete och 5 minuters paus. Efter fyra sådana pass tar du en längre paus. Tiderna kan justeras. Poängen är inte klockan, utan att arbetet har en början och ett slut.",
          ],
        },
        {
          heading: "Ge varje pass ett mål",
          paragraphs: [
            "Välj ett kapitel, en uppgiftssamling eller en uppsättning anteckningar. ”Plugga till tentan” är för vagt för att komma i gång med. När passet är slut bockar du av det du fick gjort — inte det du hoppades hinna.",
            "En tentavecka blir mer hanterbar om du planerar ett antal pass i stället för ett antal timmar. Pass är lättare att flytta om en föreläsning äter upp förmiddagen.",
          ],
        },
        {
          heading: "Paus betyder paus",
          paragraphs: [
            "Om pausen blir nya mejl eller en ny flik kommer nästa pass i gång långsammare. Res dig, hämta lite vatten eller titta ut genom fönstret. Skärmen kan vänta till nästa arbetsblock.",
          ],
        },
      ],
    },
    {
      slug: "bygg-studievaner",
      title: "Så bygger du studievanor som håller — Studentplanlegger",
      description:
        "Börja med en liten vana, gör den synlig och bocka av dina framsteg. Då slipper du börja för stort och ge upp efter en vecka.",
      heading: "Så bygger du en studievana som håller",
      summary:
        "En liten vana som du upprepar slår tre stora planer som du släpper. Så håller du den synlig hela månaden.",
      footerLabel: "Bygg studievanor",
      catalogKey: "sporing",
      productSlug: "vane-tracker",
      productLead:
        "Vanetracker är ett månadsrutnät med plats för dina egna kategorier, så att du ser dina framsteg, {single}. 30-dagarsutmaning är ett mer fokuserat blad för nya vanor eller mål.",
      productCta: "Se Vanetracker",
      sections: [
        {
          heading: "Stora planer spricker oftare än små vanor",
          paragraphs: [
            "”Plugga två timmar varje dag” från terminens första måndag håller sällan mer än en vecka. Det som håller är oftast mindre, synligt och lätt att upprepa — även dagar med föreläsningar och dålig sömn.",
          ],
        },
        {
          heading: "Välj en vana och gör den nästan löjligt liten",
          paragraphs: [
            "Börja inte med träning, läsning, mat och sömn på en gång. Välj en: till exempel 20 minuters läsning före lunch, eller att packa väskan kvällen innan. När den sitter kan du lägga till nästa.",
            "Om två timmar är för mycket en stressig dag är tio minuter det inte. En vana du håller en dålig dag är värd mer än en ambitiös plan du släpper.",
          ],
        },
        {
          heading: "Bocka av framstegen där du ser dem",
          paragraphs: [
            "Ett rutnät på kylskåpet, i anteckningsboken eller som ifyllbar PDF gör vanan synlig. Tomma rutor är ärliga. Det är lättare att hålla en svit vid liv än att börja om varje måndag.",
          ],
        },
        {
          heading: "En missad dag betyder inte att allt är förstört",
          paragraphs: [
            "Börja igen dagen efter utan att ”ta igen” allt. Att straffa dig själv med ett dubbelpass gör det mer troligt att du släpper hela vanan. Räkna dagarna du gjorde det, inte dagarna som var perfekta.",
          ],
        },
      ],
    },
  ],
};
