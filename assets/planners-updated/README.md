# Planner-PDF-er: datosjekk 2026-10-06

**Resultat: ingen av de 25 planleggerne har utdaterte datoer eller årstall. Ingen PDF-er er endret, så denne mappen har ingen oppdaterte PDF-er.**

## Slik ble det sjekket

Kilde: de 25 leverte PDF-ene (`<slug>.pdf`) fra `sp-planners-upload.tar.gz`, samme filer som ligger i Supabase `products/planners/`.

1. Hver side ble rendret til bilde (PyMuPDF, 90 dpi, 28 sider totalt) og gått gjennom visuelt: titler, topptekster, bunntekster, kalendere og eksempeltekst.
2. Tekstlaget ble søkt etter tall (`\d{2,4}`). Treffene er bare klokkeslett (5:30–23:00), prosenter (10–100 %), skalaer (1–10) og dagnumre (1–31). Ingen årstall.
3. Skjemafelt: alle verdier er tomme. Feltnavn som `Text Field 2014` er interne navn, ikke synlige datoer.
4. Ingen skjulte lag (OCG), ingen bilder med tekst (bare `pomodoro-planlegger.pdf` har ett bilde, et ikon).

Alle dato-felt er allerede nøytrale og fylles ut av kunden: «Dato:», «Uke:», «Måned:», «Start dato / Slutt dato», «Frist». Årsplanen har bare månedsnavn (januar–desember), ingen ferdig kalender for et bestemt år.

## Metadata (ikke synlig på siden)

Dokumentegenskapene har opprettet/endret-datoer fra 2022–2023 (Adobe / macOS Quartz). Kunden ser dem bare under «Dokumentegenskaper». De er ikke endret: det ville vært å forfalske når filene ble laget, og det krever ny levering av alle 25 filene uten synlig gevinst.

## Andre funn (ikke datoer, ikke endret)

Disse er feil i selve produktet. De er ikke rettet her fordi oppgaven gjaldt datoer, og fordi rettede betalte PDF-er ikke kan legges i dette offentlige repoet.

| Fil | Side | Feil |
|---|---|---|
| `ukentlig-plan.pdf` | 1 | «12:00» står to ganger i alle tre kolonnene; den andre skal være «12:30». |
| `ukentlig-plan.pdf` | 2 | «TORDAG» skal være «TORSDAG». «16::00» og «22::30» har dobbelt kolon. |
| `30-dagers-utfordring.pdf` | 1 | Rute 29 mangler (1–28, så 30, 31). |
| `aarlig-planlegger.pdf` | 2 | Feltet øverst til høyre heter «Uke:» på en årsplan (antakelig ment som «År:»). |

## Viktig: repoet er offentlig

`nicksd97/studentplanleggeren` er et offentlig GitHub-repo. Betalte planlegger-PDF-er må aldri committes hit, ellers kan hvem som helst laste dem ned gratis. Hvis en PDF må rettes senere: legg kildefilene i `assets/source/` (ignorert av git), lag den rettede filen lokalt, og last den opp direkte til Supabase `products/planners/<slug>.pdf`.
