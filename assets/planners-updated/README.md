# Planner-PDF-er: datoer og skrivefeil

## 2026-10-06 (2): skrivefeil rettet i 8 PDF-er

De rettede PDF-ene ligger **ikke** i denne mappen. Repoet er offentlig, og betalte PDF-er skal aldri committes. Bygg dem lokalt og last dem opp direkte til Supabase `products/planners/<slug>.pdf` (samme filnavn, overskriv):

```bash
# kildefilene fra sp-planners-upload.tar.gz i assets/source/ (git-ignorert)
pip install pymupdf fonttools
python3 scripts/fix-planner-typos.py          # -> assets/source/fixed/<slug>.pdf
```

Rettelsene gjøres i PDF-enes innholdsstrømmer med samme font, størrelse og farge som originalteksten. Der den innebygde font-delmengden manglet en bokstav, er den gamle glyfen fjernet og den nye tegnet på samme grunnlinje med samme font (Montserrat Regular / Josefin Sans Medium fra `assets/fonts/`, OFL; bare de nye glyfene bygges inn). Skriptet stopper hvis et mønster ikke finnes nøyaktig så mange ganger som forventet, og hvis antall eller navn på skjemafelt endrer seg. Alle felt er beholdt og kan fylles ut.

| Fil | Side | Rettet |
|---|---|---|
| `ukentlig-plan.pdf` | 1 | Andre «12:00» -> «12:30» i alle tre dagskolonnene (mandag–onsdag). |
| `ukentlig-plan.pdf` | 2 | «TORDAG» -> «TORSDAG». «16::00» -> «16:00» og «22::30» -> «22:30» i alle fire kolonnene. Klokkeslettene i fredag–søndag brukte en font som ikke var innebygd, så de ble vist fete og uten kolon («2100», «2200»); de bruker nå den innebygde Montserrat Light som resten av planen. «12:30» på side 2 var allerede riktig. |
| `30-dagers-utfordring.pdf` | 1 | Boksene var nummerert 1–28, 30, 31 (29 manglet). Nederste rad er nå «29», «30». Det var allerede 30 bokser og 30 avkrysningsfelt, så det var bare tallene som var feil. |
| `ukentlig-gjoremaal.pdf` | 1 | «TIRDAG» -> «TIRSDAG». |
| `vane-tracker.pdf` | 1 | Ukedagsforbokstavene var engelske, «M T W T F S S», i alle fem ukeradene; nå «M T O T F L S». |
| `ukentlig-matplan.pdf` | 1 | Lørdag var merket «S»; nå «L». Måltidene på lørdag var «F L D K»; nå «F L M K» som de andre dagene. |
| `daglig-gjennomgang.pdf` | 1 | Tittelen «DAGELIG GJENNOMGANG» -> «DAGLIG GJENNOMGANG». |
| `daglig-helseplan.pdf` | 1 | Tittelen «DAGELIG PLAN» -> «DAGLIG PLAN». |
| `daglig-planlegger.pdf` | 1 | Tittelen «Dagelig Planlegger» -> «Daglig Planlegger». «VANN INTAK» -> «VANNINNTAK». |

### Slik ble de andre planleggerne sjekket

Tekstlaget i alle 25 PDF-ene ble søkt etter dobbelt kolon, klokkeslett i stigende rekkefølge (duplikater og hopp), ukedagsnavn (fuzzy mot mandag–søndag), rekker med ukedagsforbokstaver (vannrett og loddrett) og tallrekker med hull. Titler og overskrifter ble i tillegg lest gjennom for stavefeil. Tabellen over er alt som ble funnet. De 17 andre filene hadde ingen slike feil.

### Funnet, men ikke endret

| Fil | Side | Hva |
|---|---|---|
| `aarlig-planlegger.pdf` | 2 | Feltet øverst til høyre heter «Uke:» på en årsplan (antakelig ment som «År:»). Det er ikke en skrivefeil, så det er ikke endret. |
| `handlingsplan.pdf`, `gjoremaal-liste.pdf`, `prosjekt-planlegger.pdf` | 1 | Engelske overskrifter («GOAL», «TOP PRIORITIES», «PROGRESSION»). Det er et ordvalg, ikke en skrivefeil. |

### Produktbilder

`public/images/products/` ble sjekket mot `lib/products.ts` (`python3 scripts/build-product-thumbnails.py --audit`). Seks bilder viste feil planlegger og er bygget på nytt fra side 1 av riktig PDF. I tillegg er bildene til de åtte rettede PDF-ene bygget på nytt, så de viser rettet tekst.

## 2026-10-06 (1): datosjekk

**Resultat: ingen av de 25 planleggerne har utdaterte datoer eller årstall.**

Kilde: de 25 leverte PDF-ene (`<slug>.pdf`) fra `sp-planners-upload.tar.gz`, samme filer som ligger i Supabase `products/planners/`.

1. Hver side ble rendret til bilde (PyMuPDF, 90 dpi, 28 sider totalt) og gått gjennom visuelt: titler, topptekster, bunntekster, kalendere og eksempeltekst.
2. Tekstlaget ble søkt etter tall (`\d{2,4}`). Treffene er bare klokkeslett (5:30–23:00), prosenter (10–100 %), skalaer (1–10) og dagnumre (1–31). Ingen årstall.
3. Skjemafelt: alle verdier er tomme. Feltnavn som `Text Field 2014` er interne navn, ikke synlige datoer.
4. Ingen skjulte lag (OCG), ingen bilder med tekst (bare `pomodoro-planlegger.pdf` har ett bilde, et ikon).

Alle dato-felt er allerede nøytrale og fylles ut av kunden: «Dato:», «Uke:», «Måned:», «Start dato / Slutt dato», «Frist». Årsplanen har bare månedsnavn (januar–desember), ingen ferdig kalender for et bestemt år.

Dokumentegenskapene har opprettet/endret-datoer fra 2022–2023 (Adobe / macOS Quartz). Kunden ser dem bare under «Dokumentegenskaper». De er ikke endret: det ville vært å forfalske når filene ble laget.

## Viktig: repoet er offentlig

`nicksd97/studentplanleggeren` er et offentlig GitHub-repo. Betalte planlegger-PDF-er må aldri committes hit, ellers kan hvem som helst laste dem ned gratis. Legg kildefilene i `assets/source/` (ignorert av git), lag de rettede filene lokalt med `scripts/fix-planner-typos.py` (de havner i `assets/source/fixed/`, også ignorert), og last dem opp direkte til Supabase `products/planners/<slug>.pdf`.
