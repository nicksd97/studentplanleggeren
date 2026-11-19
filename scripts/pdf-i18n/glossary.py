#!/usr/bin/env python3
"""Translation memory for the planners -> translations/<slug>.json.

    python3 glossary.py [--slug ukentlig-plan]

Every unit in translations/<slug>.json gets its six translations from (in order)
  1. UNIT[slug][unit id]           exact per-unit choice (titles, context)
  2. SLUG[slug][source text]       per-file meaning of a string
  3. GLOSSARY[source text]         general translation
  4. weekday / meal initials       classified from the page layout
  5. numbers, times, "/", "--"     kept as-is
Layout-only keys already in the JSON (align, fit, scale, dx) are preserved.
Unknown strings are reported and the JSON is not written.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LANGS = ["en", "de", "sv", "da", "es", "fr"]


def table(text: str) -> dict:
    out = {}
    for line in text.strip().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        cols = [c.strip() for c in line.split("|")]
        if len(cols) != 7:
            raise SystemExit(f"bad glossary line: {line}")
        out[cols[0]] = dict(zip(LANGS, cols[1:]))
    return out


# source | en | de | sv | da | es | fr
GLOSSARY = table("""
NOTATER | NOTES | NOTIZEN | ANTECKNINGAR | NOTER | NOTAS | NOTES
NOTATER: | NOTES: | NOTIZEN: | ANTECKNINGAR: | NOTER: | NOTAS: | NOTES :
Notater | Notes | Notizen | Anteckningar | Noter | Notas | Notes
NOTAT | NOTES | NOTIZEN | NOTER | NOTER | NOTAS | NOTES
30-DAGERS UTFORDRING | 30-DAY CHALLENGE | 30-TAGE-CHALLENGE | 30-DAGARSUTMANING | 30-DAGES UDFORDRING | RETO DE 30 DÍAS | DÉFI 30 JOURS
MÅL / UTFORDRING | GOAL / CHALLENGE | ZIEL / CHALLENGE | MÅL / UTMANING | MÅL / UDFORDRING | META / RETO | OBJECTIF / DÉFI
START DATO : | START DATE : | STARTDATUM : | STARTDATUM : | STARTDATO : | INICIO : | DÉBUT :
SLUTT DATO : | END DATE : | ENDDATUM : | SLUTDATUM : | SLUTDATO : | FIN : | FIN :
BELØNNING : | REWARD : | BELOHNUNG : | BELÖNING : | BELØNNING : | PREMIO : | RÉCOMPENSE :
START | START | START | START | START | INICIO | DÉBUT
HALVEIS! | HALFWAY! | HALBZEIT! | HALVVÄGS! | HALVVEJS! | ¡A MITAD! | MI-PARCOURS !
DU KLARTE DET! | YOU DID IT! | GESCHAFFT! | DU KLARADE DET! | DU KLAREDE DET! | ¡LO LOGRASTE! | TU AS RÉUSSI !
ÅRSPLAN | YEARLY PLAN | JAHRESPLAN | ÅRSPLAN | ÅRSPLAN | PLAN ANUAL | PLANNING ANNUEL
JANUAR | JANUARY | JANUAR | JANUARI | JANUAR | ENERO | JANVIER
FEBRUAR | FEBRUARY | FEBRUAR | FEBRUARI | FEBRUAR | FEBRERO | FÉVRIER
MARS | MARCH | MÄRZ | MARS | MARTS | MARZO | MARS
APRIL | APRIL | APRIL | APRIL | APRIL | ABRIL | AVRIL
MAI | MAY | MAI | MAJ | MAJ | MAYO | MAI
JUNI | JUNE | JUNI | JUNI | JUNI | JUNIO | JUIN
JULI | JULY | JULI | JULI | JULI | JULIO | JUILLET
AUGUST | AUGUST | AUGUST | AUGUSTI | AUGUST | AGOSTO | AOÛT
SEPTEMBER | SEPTEMBER | SEPTEMBER | SEPTEMBER | SEPTEMBER | SEPTIEMBRE | SEPTEMBRE
OKTOBER | OCTOBER | OKTOBER | OKTOBER | OKTOBER | OCTUBRE | OCTOBRE
NOVEMBER | NOVEMBER | NOVEMBER | NOVEMBER | NOVEMBER | NOVIEMBRE | NOVEMBRE
DESEMBER | DECEMBER | DEZEMBER | DECEMBER | DECEMBER | DICIEMBRE | DÉCEMBRE
Uke: | Week: | Woche: | Vecka: | Uge: | Semana: | Semaine :
Uke : | Week : | Woche : | Vecka : | Uge : | Semana : | Semaine :
DATO : | DATE : | DATUM : | DATUM : | DATO : | FECHA : | DATE :
Dato : | Date : | Datum : | Datum : | Dato : | Fecha : | Date :
Dato: | Date: | Datum: | Datum: | Dato: | Fecha: | Date :
DATO | DATE | DATUM | DATUM | DATO | FECHA | DATE
TOPP 3 PRESTASJONER | TOP 3 ACHIEVEMENTS | MEINE TOP 3 ERFOLGE | TOPP 3 PRESTATIONER | TOP 3 PRÆSTATIONER | MIS 3 GRANDES LOGROS | MES 3 RÉUSSITES
DAGENS HØYDEPUNKTER | TODAY'S HIGHLIGHTS | HIGHLIGHTS DES TAGES | DAGENS HÖJDPUNKTER | DAGENS HØJDEPUNKTER | LO MEJOR DEL DÍA | MOMENTS FORTS DU JOUR
TING JEG HAR LÆRT I DAG | WHAT I LEARNED TODAY | WAS ICH HEUTE GELERNT HABE | DET HÄR LÄRDE JAG MIG IDAG | DET HAR JEG LÆRT I DAG | LO QUE APRENDÍ HOY | CE QUE J'AI APPRIS AUJOURD'HUI
TING JEG GJORDE BRA I DAG | WHAT I DID WELL TODAY | WAS MIR HEUTE GUT GELUNGEN IST | DET HÄR GJORDE JAG BRA IDAG | DET GJORDE JEG GODT I DAG | LO QUE HICE BIEN HOY | CE QUE J'AI BIEN FAIT AUJOURD'HUI
TING JEG KAN FORBEDRE I MORGEN | WHAT I CAN IMPROVE TOMORROW | WAS ICH MORGEN BESSER MACHEN KANN | DET HÄR KAN JAG GÖRA BÄTTRE IMORGON | DET KAN JEG GØRE BEDRE I MORGEN | LO QUE PUEDO MEJORAR MAÑANA | CE QUE JE PEUX AMÉLIORER DEMAIN
I DAG ER JEG TAKKNEMLIG FOR | TODAY I'M GRATEFUL FOR | HEUTE BIN ICH DANKBAR FÜR | IDAG ÄR JAG TACKSAM FÖR | I DAG ER JEG TAKNEMMELIG FOR | HOY DOY GRACIAS POR | AUJOURD'HUI, JE SUIS RECONNAISSANT(E) POUR
SCORE | SCORE | BEWERTUNG | BETYG | SCORE | PUNTUACIÓN | NOTE
MORGENDAGENS MÅL / NOTATER | TOMORROW'S GOALS / NOTES | ZIELE FÜR MORGEN / NOTIZEN | MÅL FÖR IMORGON / ANTECKNINGAR | MÅL FOR I MORGEN / NOTER | METAS PARA MAÑANA / NOTAS | OBJECTIFS DE DEMAIN / NOTES
AGENDA | SCHEDULE | TAGESABLAUF | SCHEMA | PROGRAM | AGENDA | PROGRAMME
Agenda | Schedule | Tagesablauf | Schema | Program | Agenda | Programme
FOKUS | FOCUS | FOKUS | FOKUS | FOKUS | ENFOQUE | FOCUS
TIMER MED SØVN | HOURS OF SLEEP | SCHLAFSTUNDEN | TIMMAR SÖMN | TIMERS SØVN | HORAS DE SUEÑO | HEURES DE SOMMEIL
TIM | HRS | STD | TIM | TIM | H | H
HUMØR | MOOD | STIMMUNG | HUMÖR | HUMØR | ÁNIMO | HUMEUR
VELLVÆRE | WELL-BEING | WOHLBEFINDEN | VÄLMÅENDE | VELVÆRE | BIENESTAR | BIEN-ÊTRE
MÅLTIDER | MEALS | MAHLZEITEN | MÅLTIDER | MÅLTIDER | COMIDAS | REPAS
Måltider | Meals | Mahlzeiten | Måltider | Måltider | Comidas | Repas
TRENING | EXERCISE | TRAINING | TRÄNING | TRÆNING | EJERCICIO | SPORT
JEG ER TAKKNEMELIG FOR | I'M GRATEFUL FOR | ICH BIN DANKBAR FÜR | JAG ÄR TACKSAM FÖR | JEG ER TAKNEMMELIG FOR | DOY GRACIAS POR | JE SUIS RECONNAISSANT(E) POUR
JEG ER TAKNEMMELIG FOR | I'M GRATEFUL FOR | ICH BIN DANKBAR FÜR | JAG ÄR TACKSAM FÖR | JEG ER TAKNEMMELIG FOR | DOY GRACIAS POR | JE SUIS RECONNAISSANT(E) POUR
JEG ER TAKNEMELIG FOR | I'M GRATEFUL FOR | ICH BIN DANKBAR FÜR | JAG ÄR TACKSAM FÖR | JEG ER TAKNEMMELIG FOR | DOY GRACIAS POR | JE SUIS RECONNAISSANT(E) POUR
TING JEG ER TAKKNEMLIG FOR | THINGS I'M GRATEFUL FOR | WOFÜR ICH DANKBAR BIN | DET HÄR ÄR JAG TACKSAM FÖR | DET ER JEG TAKNEMMELIG FOR | COSAS QUE AGRADEZCO | CE POUR QUOI JE SUIS RECONNAISSANT(E)
Daglig Planlegger | Daily Planner | Tagesplaner | Dagsplanerare | Dagsplanlægger | Planificador Diario | Planning Quotidien
Tenk Positivt | Think Positive | Denk Positiv | Tänk Positivt | Tænk Positivt | Piensa en Positivo | Pense Positif
PRIORITETER | PRIORITIES | PRIORITÄTEN | PRIORITERINGAR | PRIORITETER | PRIORIDADES | PRIORITÉS
PRIORITERINGER | PRIORITIES | PRIORITÄTEN | PRIORITERINGAR | PRIORITETER | PRIORIDADES | PRIORITÉS
Prioriteringer | Priorities | Prioritäten | Prioriteringar | Prioriteter | Prioridades | Priorités
MÅL | GOALS | ZIELE | MÅL | MÅL | METAS | OBJECTIFS
GJØRE MÅL | TO DO | TO-DOS | ATT GÖRA | GØREMÅL | POR HACER | À FAIRE
GJØREMÅL | TO DO | TO-DOS | ATT GÖRA | GØREMÅL | POR HACER | À FAIRE
Må Gjøre | To Do | To-dos | Att göra | Gøremål | Por hacer | À faire
Å GJØRE | TO DO | TO-DOS | ATT GÖRA | GØREMÅL | POR HACER | À FAIRE
DAGENS PLAN | TODAY'S PLAN | TAGESPLAN | DAGENS PLAN | DAGENS PLAN | PLAN DEL DÍA | PLANNING DU JOUR
VANNINNTAK | WATER INTAKE | WASSER | VATTENINTAG | VANDINDTAG | AGUA | HYDRATATION
Føler Meg | How I Feel | Stimmung | Mående | Humør | Cómo Me Siento | Mon Humeur
Penger | Money | Geld | Pengar | Penge | Dinero | Argent
INN: | IN: | EIN: | IN: | IND: | COBRO: | REÇU :
UT: | OUT: | AUS: | UT: | UD: | PAGO: | PAYÉ :
Helse | Health | Gesundheit | Hälsa | Sundhed | Salud | Santé
HASTEMÅL | URGENT | DRINGEND | BRÅDSKANDE | HASTER | URGENTE | URGENT
TOP PRIORITIES | TOP PRIORITIES | TOP-PRIORITÄTEN | TOPPRIORITERINGAR | TOPPRIORITETER | PRIORIDADES | PRIORITÉS
HANDLINGSPLAN | ACTION PLAN | AKTIONSPLAN | HANDLINGSPLAN | HANDLINGSPLAN | PLAN DE ACCIÓN | PLAN D'ACTION
HVORFOR? | WHY? | WARUM? | VARFÖR? | HVORFOR? | ¿POR QUÉ? | POURQUOI ?
GOAL | GOAL | ZIEL | MÅL | MÅL | META | OBJECTIF
START : | START : | START : | START : | START : | INICIO : | DÉBUT :
FÆRDIGDATO: | DUE DATE: | ZIELDATUM: | MÅLDATUM: | DEADLINE: | FECHA LÍMITE: | ÉCHÉANCE :
FÆRDIGDATO | DUE DATE | ZIELDATUM | MÅLDATUM | DEADLINE | FECHA LÍMITE | ÉCHÉANCE
FULLFØRT | DONE | ERLEDIGT | KLART | FÆRDIG | HECHO | FAIT
HANDLIGSDATO | ACTION STEPS | MASSNAHMEN | ÅTGÄRDER | HANDLINGER | ACCIONES | ACTIONS
MULIGE HINDRINGER | POSSIBLE OBSTACLES | MÖGLICHE HINDERNISSE | MÖJLIGA HINDER | MULIGE FORHINDRINGER | POSIBLES OBSTÁCULOS | OBSTACLES POSSIBLES
HVORDAN OVERKOMME HINDRINGER | HOW TO OVERCOME THEM | WIE ICH SIE ÜBERWINDE | HUR JAG ÖVERVINNER DEM | SÅDAN OVERVINDER JEG DEM | CÓMO SUPERARLOS | COMMENT LES SURMONTER
NOTATER OG IDEER | NOTES & IDEAS | NOTIZEN & IDEEN | ANTECKNINGAR & IDÉER | NOTER & IDÉER | NOTAS E IDEAS | NOTES ET IDÉES
FREMDRIFTSSPORING | PROGRESS | FORTSCHRITT | FRAMSTEG | FREMSKRIDT | PROGRESO | PROGRESSION
KOSTHOLD MÅL | NUTRITION GOALS | ERNÄHRUNGSZIELE | KOSTMÅL | KOSTMÅL | METAS DE NUTRICIÓN | OBJECTIFS NUTRITION
Fett : | Fat : | Fett : | Fett : | Fedt : | Grasas : | Lip :
Cal : | Cal : | Kal : | Kal : | Kal : | Cal : | Cal :
Carb : | Carbs : | KH : | Kolh : | Kulh : | Carb : | Gluc :
Prot : | Prot : | Prot : | Prot : | Prot : | Prot : | Prot :
Kal : | Cal : | Kcal : | Kcal : | Kcal : | Kcal : | Kcal :
VANN | WATER | WASSER | VATTEN | VAND | AGUA | EAU
Søvn : | Sleep : | Schlaf : | Sömn : | Søvn : | Sueño : | Nuit :
Kaloriforbruk : | Calories burned : | Verbrauch : | Förbränning : | Kalorieforbrug : | Kcal quemadas : | Kcal brûlées :
START VEKT : | START WEIGHT : | STARTGEWICHT : | STARTVIKT : | STARTVÆGT : | PESO INICIAL : | POIDS INITIAL :
MÅL VEKT : | GOAL WEIGHT : | ZIELGEWICHT : | MÅLVIKT : | MÅLVÆGT : | PESO META : | POIDS CIBLE :
SLUTT VEKT : | END WEIGHT : | ENDGEWICHT : | SLUTVIKT : | SLUTVÆGT : | PESO FINAL : | POIDS FINAL :
HJEMMEPLANLEGGING | HOME PLANNER | HAUSHALTSPLANER | HEMPLANERING | HJEMMEPLANLÆGNING | PLANIFICADOR DEL HOGAR | PLANNING DE LA MAISON
UKENTLIGE MÅLTIDER | WEEKLY MEALS | MAHLZEITEN DER WOCHE | VECKANS MÅLTIDER | UGENS MÅLTIDER | COMIDAS DE LA SEMANA | REPAS DE LA SEMAINE
DAG | DAY | TAG | DAG | DAG | DÍA | JOUR
FROKOST | BREAKFAST | FRÜHSTÜCK | FRUKOST | MORGENMAD | DESAYUNO | PETIT-DÉJEUNER
LUNSJ | LUNCH | MITTAGESSEN | LUNCH | FROKOST | ALMUERZO | DÉJEUNER
MIDDAG | DINNER | ABENDESSEN | MIDDAG | AFTENSMAD | CENA | DÎNER
SNACKS | SNACKS | SNACKS | MELLANMÅL | SNACKS | TENTEMPIÉS | EN-CAS
HANDLE LISTE | SHOPPING LIST | EINKAUFSLISTE | INKÖPSLISTA | INDKØBSLISTE | LISTA DE LA COMPRA | LISTE DE COURSES
HUS ARBEID | CHORES | HAUSARBEIT | HUSHÅLLSSYSSLOR | HUSARBEJDE | TAREAS DEL HOGAR | TÂCHES MÉNAGÈRES
ÆREND | ERRANDS | ERLEDIGUNGEN | ÄRENDEN | ÆRINDER | RECADOS | COMMISSIONS
TILTAK | ACTION STEPS | MASSNAHMEN | ÅTGÄRDER | TILTAG | ACCIONES | ACTIONS
MÅL : | GOAL : | ZIEL : | MÅL : | MÅL : | META : | OBJECTIF :
FRIST : | DUE : | FRIST : | SENAST : | FRIST : | PLAZO : | LIMITE :
OPPNÅDD | ACHIEVED | ERREICHT | UPPNÅTT | OPNÅET | LOGRADO | ATTEINT
BUDSJETT | BUDGET | BUDGET | BUDGET | BUDGET | PRESUPUESTO | BUDGET
Måned : | Month : | Monat : | Månad : | Måned : | Mes : | Mois :
MÅNED : | MONTH : | MONAT : | MÅNAD : | MÅNED : | MES : | MOIS :
Måned | Month | Monat | Månad | Måned | Mes | Mois
INTEKT | INCOME | EINNAHMEN | INKOMST | INDKOMST | INGRESOS | REVENUS
PLANLAGT | PLANNED | GEPLANT | PLANERAT | PLANLAGT | PREVISTO | PRÉVU
FAKTISK | ACTUAL | IST | FAKTISKT | FAKTISK | REAL | RÉEL
FORSKJELL | DIFFERENCE | DIFFERENZ | DIFFERENS | DIFFERENCE | DIFERENCIA | ÉCART
FORSKJELD | DIFFERENCE | DIFFERENZ | DIFFERENS | DIFFERENCE | DIFERENCIA | ÉCART
TOTALT | TOTAL | GESAMT | TOTALT | TOTAL | TOTAL | TOTAL
TOTAL | TOTAL | GESAMT | TOTALT | TOTAL | TOTAL | TOTAL
TOTAL : | TOTAL : | GESAMT : | TOTALT : | TOTAL : | TOTAL : | TOTAL :
SPARING | SAVINGS | SPAREN | SPARANDE | OPSPARING | AHORRO | ÉPARGNE
HVA JEG HAR OPPNÅDD | WHAT I ACHIEVED | WAS ICH ERREICHT HABE | DET HÄR HAR JAG UPPNÅTT | DET HAR JEG OPNÅET | LO QUE HE LOGRADO | CE QUE J'AI ACCOMPLI
TING JEG HAR LÆRT | WHAT I LEARNED | WAS ICH GELERNT HABE | DET HÄR HAR JAG LÄRT MIG | DET HAR JEG LÆRT | LO QUE HE APRENDIDO | CE QUE J'AI APPRIS
MINNER / HVORDAN FØLER DU DEG DENNE | MEMORIES / HOW DO YOU FEEL THIS | ERINNERUNGEN / WIE FÜHLST DU DICH IN | MINNEN / HUR KÄNNER DU DIG DEN HÄR | MINDER / HVORDAN HAR DU DET DENNE | RECUERDOS / ¿CÓMO TE SIENTES ESTE | SOUVENIRS / COMMENT TE SENS-TU CE
MÅNEDEN? | MONTH? | DIESEM MONAT? | MÅNADEN? | MÅNED? | MES? | MOIS-CI ?
TING JEG MÅ FORBEDRE TIL NESTE MÅNED | WHAT TO IMPROVE NEXT MONTH | WAS ICH NÄCHSTEN MONAT VERBESSERE | DET SKA JAG FÖRBÄTTRA NÄSTA MÅNAD | DET SKAL JEG FORBEDRE NÆSTE MÅNED | QUÉ MEJORAR EL PRÓXIMO MES | À AMÉLIORER LE MOIS PROCHAIN
MÅNEDLIG INTEKT | MONTHLY INCOME | MONATLICHE EINNAHMEN | MÅNADSINKOMST | MÅNEDLIG INDKOMST | INGRESOS MENSUALES | REVENUS MENSUELS
DAGLIG FORBRUK | DAILY SPENDING | TÄGLICHE AUSGABEN | DAGLIGA UTGIFTER | DAGLIGT FORBRUG | GASTOS DIARIOS | DÉPENSES QUOTIDIENNES
MÅNEDLIGE UTGIFTER | MONTHLY EXPENSES | MONATLICHE AUSGABEN | MÅNADSUTGIFTER | MÅNEDLIGE UDGIFTER | GASTOS MENSUALES | DÉPENSES MENSUELLES
BESKRIVELSE | DESCRIPTION | BESCHREIBUNG | BESKRIVNING | BESKRIVELSE | DESCRIPCIÓN | DESCRIPTION
SUM | AMOUNT | BETRAG | BELOPP | BELØB | IMPORTE | MONTANT
BETALT | PAID | BEZAHLT | BETALD | BETALT | PAGADO | PAYÉ
MÅNEDLIG SALDO | MONTHLY BALANCE | MONATSBILANZ | MÅNADSSALDO | MÅNEDLIG SALDO | BALANCE MENSUAL | SOLDE MENSUEL
ESTIMAT | ESTIMATE | GESCHÄTZT | UPPSKATTAT | ESTIMERET | ESTIMADO | ESTIMÉ
UTGIFTER | EXPENSES | AUSGABEN | UTGIFTER | UDGIFTER | GASTOS | DÉPENSES
HAR IGJEN | REMAINING | ÜBRIG | KVAR | TILBAGE | RESTANTE | RESTE
POMODORO TIDSBLOCKER : | POMODORO TIME BLOCKS : | POMODORO-ZEITBLÖCKE : | POMODOROPASS : | POMODORO-TIDSBLOKKE : | BLOQUES POMODORO : | BLOCS POMODORO :
DAGENS PRODUCTIVITET SCORE | TODAY'S PRODUCTIVITY SCORE | MEINE PRODUKTIVITÄT HEUTE | DAGENS PRODUKTIVITET | DAGENS PRODUKTIVITET | PRODUCTIVIDAD DEL DÍA | PRODUCTIVITÉ DU JOUR
PROSJEKTVISUALISERING | PROJECT OVERVIEW | PROJEKTÜBERSICHT | PROJEKTÖVERSIKT | PROJEKTOVERSIGT | RESUMEN DE PROYECTOS | APERÇU DES PROJETS
PROSJEKT | PROJECT | PROJEKT | PROJEKT | PROJEKT | PROYECTO | PROJET
TID | TIME | ZEIT | TID | TID | TIEMPO | TEMPS
MÅL / AKTIVITET | GOAL / ACTIVITY | ZIEL / AKTIVITÄT | MÅL / AKTIVITET | MÅL / AKTIVITET | META / ACTIVIDAD | OBJECTIF / ACTIVITÉ
SLUTT | END | ENDE | SLUT | SLUT | FIN | FIN
PAUSER | BREAKS | PAUSEN | PAUSER | PAUSER | DESCANSOS | PAUSES
FULLFØRT : | COMPLETED : | ABGESCHLOSSEN : | SLUTFÖRT : | AFSLUTTET : | COMPLETADO : | TERMINÉ :
OBJEKTIV | OBJECTIVE | ZIEL | MÅL | MÅL | OBJETIVO | OBJECTIF
NØDVENDIGE RESSURSER | RESOURCES NEEDED | BENÖTIGTE RESSOURCEN | RESURSER SOM BEHÖVS | NØDVENDIGE RESSOURCER | RECURSOS NECESARIOS | RESSOURCES NÉCESSAIRES
OPPGAVER | TASKS | AUFGABEN | UPPGIFTER | OPGAVER | TAREAS | TÂCHES
INNEN | DUE | BIS | SENAST | INDEN | PLAZO | POUR LE
FERDIG | DONE | ERLEDIGT | KLAR | FÆRDIG | HECHO | FAIT
PROGRESSION | PROGRESSION | FORTSCHRITT | FRAMSTEG | FREMSKRIDT | PROGRESO | PROGRESSION
DESTINASJON(ER) | DESTINATION(S) | REISEZIEL(E) | RESMÅL | DESTINATION(ER) | DESTINO(S) | DESTINATION(S)
NÅR | WHEN | WANN | NÄR | HVORNÅR | CUÁNDO | QUAND
UTGIFT | EXPENSE | AUSGABE | UTGIFT | UDGIFT | GASTO | DÉPENSE
STEDER Å BESØKE | PLACES TO VISIT | SEHENSWÜRDIGKEITEN | PLATSER ATT BESÖKA | STEDER AT BESØGE | LUGARES PARA VISITAR | LIEUX À VISITER
STEDER Å SPISE | PLACES TO EAT | RESTAURANTS | STÄLLEN ATT ÄTA PÅ | STEDER AT SPISE | DÓNDE COMER | OÙ MANGER
STEDER Å SHOPPE | PLACES TO SHOP | SHOPPING | STÄLLEN ATT SHOPPA PÅ | STEDER AT SHOPPE | DÓNDE COMPRAR | OÙ FAIRE DU SHOPPING
FLY | FLIGHTS | FLÜGE | FLYG | FLY | VUELOS | VOLS
TRANSPORT | TRANSPORT | TRANSPORT | TRANSPORT | TRANSPORT | TRANSPORTE | TRANSPORT
HOTELL | HOTEL | HOTEL | HOTELL | HOTEL | HOTEL | HÔTEL
MAT | FOOD | ESSEN | MAT | MAD | COMIDA | REPAS
SHOPPING | SHOPPING | SHOPPING | SHOPPING | SHOPPING | COMPRAS | SHOPPING
ANNET | OTHER | SONSTIGES | ÖVRIGT | ANDET | OTROS | AUTRES
ADRESSEN TIL STEDET/STEDENE JEG BOR | ADDRESS(ES) WHERE I'M STAYING | ADRESSE(N) MEINER UNTERKUNFT | ADRESS(ER) DÄR JAG BOR | ADRESSE(R) HVOR JEG BOR | DIRECCIÓN(ES) DEL ALOJAMIENTO | ADRESSE(S) DE L'HÉBERGEMENT
KONTAKTPERSONER I NØDSTILFELLER | EMERGENCY CONTACTS | NOTFALLKONTAKTE | KONTAKTER VID NÖDFALL | KONTAKTER I NØDSTILFÆLDE | CONTACTOS DE EMERGENCIA | CONTACTS D'URGENCE
NAVN | NAME | NAME | NAMN | NAVN | NOMBRE | NOM
KONTAKT NR. | PHONE NO. | TELEFON | TELEFONNR. | TELEFONNR. | TELÉFONO | TÉLÉPHONE
HVORDAN JEG HAR FØLT MEG DENNE UKEN | HOW I FELT THIS WEEK | SO HABE ICH MICH DIESE WOCHE GEFÜHLT | SÅ HAR JAG MÅTT DEN HÄR VECKAN | SÅDAN HAR JEG HAFT DET DENNE UGE | CÓMO ME HE SENTIDO ESTA SEMANA | COMMENT JE ME SUIS SENTI(E) CETTE SEMAINE
TING SOM HAR GJORT MEG GLAD/STOLT | WHAT MADE ME HAPPY/PROUD | WAS MICH FROH/STOLZ GEMACHT HAT | DET SOM GJORT MIG GLAD/STOLT | DET DER HAR GJORT MIG GLAD/STOLT | LO QUE ME HIZO FELIZ/ME ENORGULLECIÓ | CE QUI M'A RENDU(E) HEUREUX/FIER
NYE TING JEG HAR LÆRT/OPPLEVD | NEW THINGS I LEARNED/EXPERIENCED | NEUES, DAS ICH GELERNT/ERLEBT HABE | NYTT JAG HAR LÄRT MIG/UPPLEVT | NYT JEG HAR LÆRT/OPLEVET | LO NUEVO QUE APRENDÍ/VIVÍ | CE QUE J'AI APPRIS/VÉCU DE NOUVEAU
NYE TING Å PRØVE UT | NEW THINGS TO TRY | NEUES ZUM AUSPROBIEREN | NYTT ATT TESTA | NYT AT PRØVE | COSAS NUEVAS POR PROBAR | NOUVEAUTÉS À ESSAYER
VANER JEG HAR BEHOLDT | HABITS I KEPT UP | BEIBEHALTENE GEWOHNHEITEN | VANOR JAG HAR BEHÅLLIT | VANER JEG HAR HOLDT FAST I | HÁBITOS QUE HE MANTENIDO | HABITUDES QUE J'AI GARDÉES
VANER SOM ER VANSKELIGE Å | HABITS THAT ARE HARD TO | GEWOHNHEITEN, DIE MIR SCHWER- | VANOR SOM ÄR SVÅRA ATT | VANER DER ER SVÆRE AT | HÁBITOS QUE ME CUESTA | HABITUDES DIFFICILES À
VEDLIKEHOLDE, HVORFOR? | KEEP UP, AND WHY? | FALLEN, UND WARUM? | UPPRÄTTHÅLLA, VARFÖR? | HOLDE FAST I, HVORFOR? | MANTENER, ¿POR QUÉ? | MAINTENIR, POURQUOI ?
MÅL JEG OPPNÅDDE DENNE UKEN | GOALS I REACHED THIS WEEK | DIESE WOCHE ERREICHTE ZIELE | MÅL JAG NÅDDE DEN HÄR VECKAN | MÅL JEG NÅEDE I DENNE UGE | METAS LOGRADAS ESTA SEMANA | OBJECTIFS ATTEINTS CETTE SEMAINE
MÅL FOR NESTE UKE | GOALS FOR NEXT WEEK | ZIELE FÜR NÄCHSTE WOCHE | MÅL FÖR NÄSTA VECKA | MÅL FOR NÆSTE UGE | METAS PARA LA PRÓXIMA SEMANA | OBJECTIFS DE LA SEMAINE PROCHAINE
TANKER / NOTATER | THOUGHTS / NOTES | GEDANKEN / NOTIZEN | TANKAR / ANTECKNINGAR | TANKER / NOTER | IDEAS / NOTAS | PENSÉES / NOTES
VANER | HABITS | GEWOHNHEITEN | VANOR | VANER | HÁBITOS | HABITUDES
UKE 1 | WEEK 1 | WOCHE 1 | VECKA 1 | UGE 1 | SEMANA 1 | SEMAINE 1
UKE 2 | WEEK 2 | WOCHE 2 | VECKA 2 | UGE 2 | SEMANA 2 | SEMAINE 2
UKE 3 | WEEK 3 | WOCHE 3 | VECKA 3 | UGE 3 | SEMANA 3 | SEMAINE 3
UKE 4 | WEEK 4 | WOCHE 4 | VECKA 4 | UGE 4 | SEMANA 4 | SEMAINE 4
UKE 5 | WEEK 5 | WOCHE 5 | VECKA 5 | UGE 5 | SEMANA 5 | SEMAINE 5
MANDAG | MONDAY | MONTAG | MÅNDAG | MANDAG | LUNES | LUNDI
TIRSDAG | TUESDAY | DIENSTAG | TISDAG | TIRSDAG | MARTES | MARDI
ONSDAG | WEDNESDAY | MITTWOCH | ONSDAG | ONSDAG | MIÉRCOLES | MERCREDI
TORSDAG | THURSDAY | DONNERSTAG | TORSDAG | TORSDAG | JUEVES | JEUDI
FREDAG | FRIDAY | FREITAG | FREDAG | FREDAG | VIERNES | VENDREDI
LØRDAG | SATURDAY | SAMSTAG | LÖRDAG | LØRDAG | SÁBADO | SAMEDI
SØNDAG | SUNDAY | SONNTAG | SÖNDAG | SØNDAG | DOMINGO | DIMANCHE
MAN | MON | MO | MÅN | MAN | LUN | LUN
TIR | TUE | DI | TIS | TIR | MAR | MAR
ONS | WED | MI | ONS | ONS | MIÉ | MER
TOR | THU | DO | TOR | TOR | JUE | JEU
FRE | FRI | FR | FRE | FRE | VIE | VEN
LØR | SAT | SA | LÖR | LØR | SÁB | SAM
SØN | SUN | SO | SÖN | SØN | DOM | DIM
""")

# Weekday initials Monday..Sunday and meal initials (breakfast, lunch, dinner,
# evening meal/snack, water).
WEEKDAY_INITIALS = {
    "en": "MTWTFSS", "de": "MDMDFSS", "sv": "MTOTFLS",
    "da": "MTOTFLS", "es": "LMXJVSD", "fr": "LMMJVSD",
}
MEAL_INITIALS = {  # F L M K V
    "en": ["B", "L", "D", "S", "W"],
    "de": ["F", "M", "A", "S", "W"],
    "sv": ["F", "L", "M", "K", "V"],
    "da": ["M", "F", "A", "S", "V"],
    "es": ["D", "A", "C", "M", "AG"],
    "fr": ["P", "M", "S", "C", "E"],
}
NO_WEEKDAYS = ["MANDAG", "TIRSDAG", "ONSDAG", "TORSDAG", "FREDAG", "LØRDAG", "SØNDAG"]


def L(en, de, sv, da, es, fr, **extra):
    d = dict(zip(LANGS, (en, de, sv, da, es, fr)))
    d.update(extra)
    return d


ALL_JOIN = ["de", "sv", "da"]

# Per-file meaning of a source string.
SLUG = {
    "maanedlig-budsjett": {
        "MÅL": L("GOAL", "ZIEL", "MÅL", "MÅL", "META", "OBJECTIF"),
    },
    "reise-planlegger": {
        "BUDSJETT": L("BUDGET", "BUDGET", "BUDGET", "BUDGET", "PREVISTO", "BUDGET"),
    },
    "pomodoro-planlegger": {
        "MÅL": L("GOAL", "ZIEL", "MÅL", "MÅL", "META", "BUT"),
        "START": L("START", "START", "START", "START", "INICIO", "DÉBUT"),
    },
}

# Per-unit choices: titles built from two/three weights, etc.
UNIT = {
    "ukentlig-plan": {
        "p1-001": L("WEEKLY", "WOCHEN", "VECKO", "UGE", "PLAN", "PLANNING"),
        "p1-002": L("PLAN", "PLAN", "PLAN", "PLAN", "SEMANAL", "HEBDOMADAIRE", join=ALL_JOIN),
    },
    "ukentlig-planlegger": {
        "p1-001": L("WEEKLY", "WOCHEN", "VECKO", "UGE", "PLAN", "PLANNING"),
        "p1-002": L("PLAN", "PLAN", "PLAN", "PLAN", "SEMANAL", "HEBDOMADAIRE", join=ALL_JOIN),
    },
    "daglig-helseplan": {
        "p1-001": L("DAILY", "TAGES", "DAGS", "DAGS", "PLAN", "PLANNING"),
        "p1-002": L("PLAN", "PLAN", "PLAN", "PLAN", "DIARIO", "QUOTIDIEN", join=ALL_JOIN),
    },
    "daglig-produktivitetsplan": {
        "p1-001": L("DAILY", "TAGES", "DAGS", "DAGS", "PLAN", "PLANNING"),
        "p1-002": L("PLAN", "PLAN", "PLAN", "PLAN", "DIARIO", "QUOTIDIEN", join=ALL_JOIN),
    },
    "daglig-timeplan": {
        "p1-001": L("DAILY", "TAGES", "DAGLIG", "DAGLIG", "PLAN", "PLANNING"),
        "p1-002": L("PLAN", "PLAN", "PLAN", "PLAN", "DIARIO", "QUOTIDIEN"),
    },
    "daglig-gjennomgang": {
        "p1-001": L("DAILY", "TAGES", "DAGLIG", "DAGLIG", "REVISIÓN", "BILAN"),
        "p1-002": L("REVIEW", "RÜCKBLICK", "GENOMGÅNG", "GENNEMGANG", "DIARIA", "QUOTIDIEN", join=["de"]),
    },
    "ukentlig-gjennomgang": {
        "p1-001": L("WEEKLY", "WOCHEN", "VECKO", "UGENTLIG", "REVISIÓN", "BILAN"),
        "p1-002": L("REVIEW", "RÜCKBLICK", "GENOMGÅNG", "GENNEMGANG", "SEMANAL", "HEBDOMADAIRE", join=["de", "sv"]),
    },
    "ukentlig-gjoremaal": {
        "p1-001": L("WEEKLY", "WOCHEN", "VECKANS", "UGENS", "TAREAS", "TÂCHES"),
        "p1-002": L("TO-DO LIST", "AUFGABEN", "ATT GÖRA", "GØREMÅL", "SEMANALES", "DE LA SEMAINE", join=["de"]),
    },
    "ukentlig-matplan": {
        "p1-002": L("WEEKLY", "WOCHEN", "VECKANS", "UGENS", "MENÚ", "MENUS"),
        "p1-003": L("MEAL PLAN", "SPEISEPLAN", "MATSEDEL", "MADPLAN", "SEMANAL", "DE LA SEMAINE", join=["de"]),
    },
    "helse-planlegger": {
        "p1-001": L("WEEKLY", "WOCHEN", "VECKANS", "UGENTLIG", "ENTRENAMIENTO", "ENTRAÎNEMENT"),
        "p1-002": L("WORKOUT PLAN", "TRAININGSPLAN", "TRÄNINGSPLAN", "TRÆNINGSPLAN", "SEMANAL", "HEBDOMADAIRE", join=["de"]),
    },
    "maanedlig-gjennomgang": {
        "p1-001": L("MONTHLY", "MONATS", "MÅNADS", "MÅNEDS", "PLAN", "PLANNING"),
        "p1-002": L("PLAN", "PLAN", "PLAN", "PLAN", "MENSUAL", "MENSUEL", join=ALL_JOIN),
    },
    "maanedlig-planlegger": {
        "p1-001": L("MONTHLY", "MONATS", "MÅNADS", "MÅNEDS", "PLAN", "PLANNING"),
        "p1-002": L("PLAN", "PLAN", "PLAN", "PLAN", "MENSUAL", "MENSUEL", join=ALL_JOIN),
    },
    "maanedlig-budsjett": {
        "p1-001": L("MONTHLY", "MONATS", "MÅNADS", "MÅNEDS", "PRESUPUESTO", "BUDGET"),
        "p1-002": L("BUDGET", "BUDGET", "BUDGET", "BUDGET", "MENSUAL", "MENSUEL", join=ALL_JOIN),
    },
    "gjoremaal-liste": {
        "p1-001": L("TO-DO", "TO-DO-", "ATT GÖRA-", "TO DO-", "LISTA DE", "LISTE DE"),
        "p1-002": L("LIST", "LISTE", "LISTA", "LISTE", "TAREAS", "TÂCHES", join=["de", "sv", "da"]),
    },
    "maal-planlegger": {
        "p1-001": L("GOAL", "ZIEL", "MÅL", "MÅL", "PLANIFICADOR DE", "MES"),
        "p1-002": L("PLANNER", "PLANER", "PLANERARE", "PLANLÆGGER", "METAS", "OBJECTIFS", join=ALL_JOIN),
    },
    "pomodoro-planlegger": {
        "p1-001": L("POMODORO", "POMODORO-", "POMODORO-", "POMODORO-", "PLANIFICADOR", "PLANNING"),
        "p1-002": L("PLANNER", "PLANER", "PLANERARE", "PLANLÆGGER", "POMODORO", "POMODORO", join=ALL_JOIN),
    },
    "prosjekt-planlegger": {
        "p1-001": L("PROJECT", "PROJEKT", "PROJEKT", "PROJEKT", "PLANIFICADOR DE", "PLANNING DE"),
        "p1-002": L("PLANNER", "PLANER", "PLANERARE", "PLANLÆGGER", "PROYECTOS", "PROJET", join=ALL_JOIN),
    },
    "reise-planlegger": {
        "p1-001": L("TRAVEL", "REISE", "RESE", "REJSE", "PLANIFICADOR", "PLANNING"),
        "p1-002": L("PLANNER", "PLANER", "PLANERARE", "PLANLÆGGER", "DE VIAJE", "DE VOYAGE", join=ALL_JOIN),
    },
    "vane-tracker": {
        "p1-001": L("HABIT", "GEWOHNHEITS", "VANE", "VANE", "REGISTRO DE", "SUIVI DES"),
        "p1-002": L("TRACKER", "TRACKER", "TRACKER", "TRACKER", "HÁBITOS", "HABITUDES", join=ALL_JOIN),
    },
    "personlig-finans-tracker": {
        "p1-001": L("PERSONAL", "PERSÖNLICHE", "PERSONLIG", "PERSONLIG", "CONTROL DE", "SUIVI DES"),
        "p1-002": L("FINANCE", "FINANZEN", "EKONOMI", "ØKONOMI", "FINANZAS", "FINANCES"),
        "p1-003": L("Tracker", "Tracker", "Tracker", "Tracker", "Personales", "Personnelles"),
    },
}

# Manual alignment overrides where the layout inference is ambiguous.
ALIGN = {
    "handlingsplan": {"p1-005": "left"},
    "prosjekt-planlegger": {"p1-004": "left", "p1-005": "left"},
    "hjemmeplanlegger": {"p1-011": "left", "p1-013": "left"},
}

# The Saturday initial in ukentlig-matplan is a later overlay whose embedded
# font reports itself as JosefinSans-Thin but renders as Medium (like M T O T F S).
FONT_OVERRIDE = {
    "ukentlig-matplan": {"p1-055": "JosefinSans-Medium"},
}

# Per-language layout overrides (scale / fit / dx) for specific units.
LAYOUT = {
    # keep a clear gap between the long French title and "Semaine :"
    "ukentlig-planlegger": {"p1-001": {"scale": {"fr": 0.9}}},
}

KEEP = re.compile(r"^[\d\s:%/.\-–]+$")


def classify_initials(units: list[dict]) -> dict[str, dict]:
    """Weekday / meal initials from the page layout -> {unit id: translations}."""
    out: dict[str, dict] = {}
    singles = [u for u in units if len(u["src"]) == 1 and u["src"].isalpha()]

    def cx(u):
        return (u["bbox"][0] + u["bbox"][2]) / 2

    def assign_week(seq):
        for i, u in enumerate(seq):
            out[u["id"]] = {lg: WEEKDAY_INITIALS[lg][i % 7] for lg in LANGS}

    def assign_meals(seq):
        for i, u in enumerate(seq):
            k = "FLMKV".index(u["src"])
            out[u["id"]] = {lg: MEAL_INITIALS[lg][k] for lg in LANGS}

    # 1. initial stacked above a weekday name ("M" over "MANDAG")
    for u in singles:
        for v in units:
            if v["src"] in NO_WEEKDAYS and v["page"] == u["page"] and 0 < v["bbox"][3] - u["bbox"][3] < 3 * u["size"]:
                if abs(cx(v) - cx(u)) < 4 and v["src"][0] == u["src"]:
                    i = NO_WEEKDAYS.index(v["src"])
                    out[u["id"]] = {lg: WEEKDAY_INITIALS[lg][i] for lg in LANGS}
    # 2. rows (same baseline) and 3. columns (same centre x) of same-size initials
    rest = [u for u in singles if u["id"] not in out]
    rows: dict = {}
    for u in rest:
        rows.setdefault((u["page"], round(u["bbox"][3]), u["size"], u["font"]), []).append(u)
    for seq in rows.values():
        seq.sort(key=lambda u: u["bbox"][0])
        if re.fullmatch(r"(MTOTFLS)+", "".join(u["src"] for u in seq)):
            assign_week(seq)
    rest = [u for u in singles if u["id"] not in out]
    cols: list[list] = []
    for u in sorted(rest, key=lambda u: (u["page"], u["bbox"][3])):
        for col in cols:
            if col[0]["page"] == u["page"] and col[0]["size"] == u["size"] and abs(cx(col[0]) - cx(u)) < 4:
                col.append(u)
                break
        else:
            cols.append([u])
    for seq in cols:
        s = "".join(u["src"] for u in seq)
        if s == "MTOTFLS":
            assign_week(seq)
        elif re.fullmatch(r"(FLMK)+V?", s):
            assign_meals(seq)
    return out


def fill(slug: str, tdir: Path) -> list[str]:
    path = tdir / f"{slug}.json"
    data = json.loads(path.read_text())
    units = data["units"]
    initials = classify_initials(units)
    missing = []
    for u in units:
        src = u["src"]
        t = None
        if u["id"] in UNIT.get(slug, {}):
            t = UNIT[slug][u["id"]]
        elif src in SLUG.get(slug, {}):
            t = SLUG[slug][src]
        elif src in GLOSSARY:
            t = GLOSSARY[src]
        elif u["id"] in initials:
            t = initials[u["id"]]
        elif KEEP.match(src):
            t = {lg: src for lg in LANGS}
        if t is None:
            missing.append(f"{slug} {u['id']} {src!r}")
            continue
        for lg in LANGS:
            u[lg] = t[lg]
        if "join" in t:
            u["join"] = t["join"]
        else:
            u.pop("join", None)
        for key in ("scale", "fit", "dx"):
            u.pop(key, None)
        u.update(LAYOUT.get(slug, {}).get(u["id"], {}))
        if u["id"] in FONT_OVERRIDE.get(slug, {}):
            u["font_override"] = FONT_OVERRIDE[slug][u["id"]]
        if u["id"] in ALIGN.get(slug, {}):
            u["align"] = ALIGN[slug][u["id"]]
            u["align_manual"] = True
        if src.isupper() and any(u[lg] != u[lg].upper() for lg in LANGS):
            missing.append(f"{slug} {u['id']} {src!r}: translation not uppercase {[u[lg] for lg in LANGS]}")
    if not missing:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    return missing


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--translations", type=Path, default=ROOT / "translations")
    ap.add_argument("--slug", action="append")
    args = ap.parse_args()
    bad = []
    for path in sorted(args.translations.glob("*.json")):
        if args.slug and path.stem not in args.slug:
            continue
        bad += fill(path.stem, args.translations)
    for b in bad:
        print("MISSING", b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
