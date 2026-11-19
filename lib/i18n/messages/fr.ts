import type { Messages } from "./types";

// French UI copy. Translated from the English reference (en.ts) and the Bokmål original (nb.ts).
// " " is a non-breaking space (French typography before : ; ! ? and in "{percent} %").

export const fr: Messages = {
  switcher: { label: "Langue" },
  header: {
    planners: "Plannings",
    free: "Extrait gratuit",
    bundles: "Packs",
    faq: "FAQ",
    buyKomplett: "Acheter le pack complet avec Vipps",
    cart: "Panier",
    menu: "Menu",
  },
  footer: {
    tagline: "Des plannings et des outils de productivité conçus pour les étudiants.",
    products: "Produits",
    komplett: "Pack complet",
    daily: "Pack Quotidien",
    weekly: "Pack Hebdomadaire",
    all: "Tous les plannings",
    guides: "Guides",
    info: "Infos",
    faq: "FAQ",
    free: "Extrait gratuit",
    privacy: "Confidentialité",
    terms: "Conditions de vente",
    madeWith: "Fait avec amour en Norvège",
    orgNo: "N° d’org.",
  },
  hero: {
    label: "✦ Conçu pour les étudiants ✦",
    tagline: "Organisez enfin vos études.",
    intro:
      "25 plannings PDF à remplir pour les étudiants. Quotidiens, hebdomadaires, mensuels — imprimez-les ou remplissez-les directement à l’écran.",
    komplett: "Voir le pack complet — {komplett}",
    explore: "Découvrir les plannings",
    trust: ["Paiement par Vipps ou par carte", "PDF à remplir", "Téléchargement immédiat"],
    trustNoVipps: "Paiement sécurisé par carte",
    coverAlt: "Produits Studentplanlegger — 25 plannings PDF à remplir",
  },
  devices: {
    label: "✦ Partout avec vous ✦",
    heading: "Compatible avec tous vos appareils",
    intro:
      "Remplissez les plannings sur ordinateur, Mac, iPad ou tablette — ou imprimez-les sur papier. À vous de choisir.",
    cards: [
      {
        alt: "Remplir le planning en numérique sur ordinateur, Mac, iPad ou tablette",
        label: "À remplir en numérique",
        subtext: "Sur ordinateur, Mac, iPad ou tablette",
      },
      {
        alt: "Plannings annuels, mensuels, hebdomadaires et quotidiens",
        label: "Annuel, mensuel, hebdomadaire et quotidien",
        subtext: "Un planning pour chaque besoin",
      },
      {
        alt: "Disponible en plusieurs formats : A4, A5, Letter et Half Letter",
        label: "Plusieurs formats",
        subtext: "A4, A5, Letter et Half Letter",
      },
    ],
  },
  categories: {
    label: "✦ Découvrez les catégories ✦",
    heading: "De quoi avez-vous besoin ?",
    planners: "plannings",
  },
  painPoints: {
    label: "✦ Ça vous parle ? ✦",
    heading: "Pour vous si vous...",
    cards: [
      {
        title: "...ne savez jamais par où commencer",
        description:
          "Rentrée, examens, projets — il y a beaucoup à gérer. Les plannings quotidiens et hebdomadaires vous donnent une vue d’ensemble dès le premier jour.",
      },
      {
        title: "...voulez prendre de meilleures habitudes",
        description:
          "Commencer, c’est facile ; tenir, c’est autre chose. Le Suivi des habitudes et le Défi 30 jours vous aident à vraiment tenir sur la durée.",
      },
      {
        title: "...voulez atteindre vos objectifs",
        description:
          "Objectifs de notes, de sport ou d’épargne — le Planificateur d’objectifs et le Plan d’action découpent les grands objectifs en étapes concrètes.",
      },
    ],
  },
  bundleShowcase: {
    label: "✦ Tout ce qu’il vous faut ✦",
    heading: "Studentplanlegger Complet",
    includedTitle: "25 plannings inclus :",
    includes: [
      "5 plannings quotidiens",
      "5 plannings hebdomadaires",
      "3 plannings mensuels",
      "1 planning annuel",
      "5 outils de productivité",
      "3 santé et mode de vie",
      "3 outils de suivi",
    ],
    buyKomplett: "Acheter le pack complet avec Vipps — {price}",
    addKomplett: "Ajouter le pack complet au panier — {price}",
    seeAll: "Voir les 25 plannings",
    orPick: "✦ Ou choisissez un pack ✦",
    packsNote:
      "Packs thématiques à {theme}. Mettez cinq plannings au choix dans votre panier pour {fivePack}.",
    bundleMeta: "{count} plannings · {price}",
    buy: "Acheter",
    alreadyInCart: "Déjà dans votre panier",
    added: "Ajouté ✓",
  },
  howItWorks: {
    label: "✦ Simple et rapide ✦",
    heading: "Comment ça marche",
    step: "Étape",
    steps: [
      {
        title: "Choisissez",
        description:
          "Choisissez l’outil ou le pack qui correspond à vos besoins. Plannings à l’unité dès {single}, lot de 5 à {fivePack}, packs dès {theme}.",
      },
      {
        title: "Payez",
        description:
          "Paiement sécurisé par Vipps ou par carte bancaire. Sans abonnement — vous payez une seule fois et le produit est à vous pour toujours.",
      },
      {
        title: "Téléchargez",
        description:
          "Téléchargez vos fichiers tout de suite — des PDF à remplir, à imprimer ou à utiliser en numérique. Prêts en moins d’une minute.",
      },
    ],
    payNoVipps:
      "Paiement sécurisé par carte. Sans abonnement — vous payez une seule fois et le produit est à vous pour toujours.",
  },
  testimonials: {
    label: "✦ Des étudiants comme vous ✦",
    heading: "Ce qu’ils en disent",
    note: "Citations traduites du norvégien.",
    quotes: [
      {
        quote:
          "Le Planning quotidien a changé ma routine du matin. Je prends 5 minutes pour planifier ma journée et j’en fais beaucoup plus.",
        study: "Droit, UiO",
      },
      {
        quote:
          "Le Plan hebdomadaire est génial pour organiser le semestre. Je vois enfin toute la semaine d’un coup d’œil au lieu d’oublier des choses.",
        study: "Soins infirmiers, NTNU",
      },
      {
        quote:
          "J’adore pouvoir le remplir directement sur mon iPad. Pas besoin d’imprimer, et c’est toujours aussi joli.",
        study: "Économie, NHH",
      },
    ],
  },
  faq: { label: "✦ Des questions ? ✦", heading: "Questions fréquentes" },
  guideList: {
    label: "✦ Guides ✦",
    heading: "Conseils pour votre quotidien d’étudiant",
    read: "Lire le guide",
  },
  guidePage: { home: "Accueil", guide: "Guide" },
  newsletter: {
    heading: "Extrait gratuit du Plan hebdomadaire",
    subheading:
      "Recevez par e-mail un extrait à remplir du Plan hebdomadaire — une seule page, pas le produit complet.",
    buttonLabel: "Recevoir l’extrait",
    successMessage: "Merci ! Consultez votre boîte de réception — l’extrait est en route.",
    error: "Une erreur s’est produite. Veuillez réessayer.",
    emailLabel: "Adresse e-mail",
    placeholder: "vous@example.com",
    sending: "Envoi en cours...",
    consentBefore:
      "En envoyant ce formulaire, vous acceptez que nous conservions votre adresse e-mail pour vous envoyer l’extrait ainsi que des conseils d’études réguliers (les e-mails sont en norvégien). Consultez notre ",
    consentLink: "politique de confidentialité",
    consentAfter: ".",
  },
  gratis: {
    label: "EXTRAIT GRATUIT",
    heading: "Téléchargez gratuitement un extrait du Plan hebdomadaire",
    intro:
      "Un PDF à remplir d’une seule page, pour tester le format avant d’acheter. Ce n’est pas le planning complet — seulement un extrait du Plan hebdomadaire.",
    bullets: [
      "Champs à remplir pour les objectifs, les priorités, les tâches, les habitudes et du lundi au mercredi",
      "Une vraie page du Plan hebdomadaire — même design que la version complète",
      "Le Plan hebdomadaire complet et 24 autres PDF vous attendent dans la boutique",
    ],
    formHeading: "Recevez l’extrait par e-mail",
    formText:
      "Saisissez votre adresse e-mail. Nous vous enverrons un lien de téléchargement — pas le produit complet.",
    cta: "Voir tous les plannings — dès {single}",
    komplett: "Pack complet de 25 plannings : {komplett}.",
  },
  notFound: {
    heading: "Page introuvable",
    text: "Nous n’avons pas trouvé la page que vous cherchez. Parcourez les plannings ou revenez à l’accueil.",
    home: "Retour à l’accueil",
    planners: "Voir les plannings",
  },
  catalog: {
    prices: "{single} le planning. Mettez-en cinq au choix dans votre panier et payez {fivePack}.",
    nav: "Catégories de produits",
    allTab: "Tous",
  },
  productCard: {
    alreadyInCart: "Déjà dans votre panier",
    added: "Ajouté ✓",
    badge: "PDF à remplir",
    pages: "pages",
    buy: "Acheter",
  },
  stickyBar: {
    title: "Studentplanlegger Complet — les 25 pour {komplett}",
    subtitle: "Les 25 PDF à remplir",
    alreadyInCart: "Déjà dans votre panier",
    added: "Ajouté ✓",
    add: "Ajouter au panier",
  },
  cart: {
    title: "Panier",
    close: "Fermer",
    empty: "Votre panier est vide",
    seeProducts: "Voir les produits",
    remove: "Retirer {name}",
    onePack: "Lot de 5 : cinq plannings pour {fivePack}",
    manyPacks: "{packs} × lot de 5 pour {price}",
    singles: " + {count} à l’unité",
    addMore: "Ajoutez-en encore {count} pour profiter du lot de 5 à {fivePack}.",
    total: "Total",
    checkout: "Passer commande",
    clear: "Vider le panier",
  },
  komplettVipps: {
    label: "Acheter le pack complet avec Vipps",
    error: "Impossible de lancer le paiement Vipps",
  },
  kasse: {
    errors: {
      firstName: "Le prénom est obligatoire",
      lastName: "Le nom est obligatoire",
      email: "L’adresse e-mail est obligatoire",
      emailInvalid: "Adresse e-mail invalide",
      confirm: "Veuillez confirmer votre adresse e-mail",
      mismatch: "Les adresses e-mail ne correspondent pas",
    },
    invalidCode: "Code invalide",
    codeActive:
      "Le code {code} est activé — {percent} % pour {association}. Vous payez {amount}.",
    cancelled: "Le paiement a été annulé ou a échoué. Aucune commande n’a été finalisée.",
    genericError: "Une erreur s’est produite. Veuillez réessayer.",
    emptyTitle: "Votre panier est vide",
    emptyText: "Ajoutez des produits avant de passer commande.",
    seeProducts: "Voir les produits",
    title: "Paiement",
    steps: ["Coordonnées", "Paiement", "Téléchargement"],
    details: "Vos coordonnées",
    firstName: "Prénom",
    firstNamePlaceholder: "Camille",
    lastName: "Nom",
    lastNamePlaceholder: "Martin",
    email: "E-mail",
    emailPlaceholder: "camille@example.com",
    confirmEmail: "Confirmez votre e-mail",
    summary: "Récapitulatif de la commande",
    remove: "Retirer {name}",
    fivePack: "Lot de 5",
    singleOne: "1 planning à l’unité",
    singleOther: "{count} plannings à l’unité",
    discountCode: "Code promo",
    discountPlaceholder: "ex. ABAKUS20",
    apply: "Appliquer",
    listPrice: "Prix catalogue {amount}",
    total: "Total",
    payVipps: "Payer avec Vipps",
    recommended: "Recommandé",
    or: "ou",
    payCard: "Payer par carte",
    cardDisabled: "Le paiement par carte n’est pas encore disponible. Veuillez payer avec Vipps.",
    secure: "Paiement sécurisé · Téléchargement immédiat",
    acceptTerms: "En achetant, vous acceptez nos conditions de vente",
  },
  takk: {
    errorTitle: "Une erreur s’est produite",
    errorText:
      "Nous n’avons pas trouvé votre commande. Vérifiez vos e-mails ou contactez-nous pour obtenir de l’aide.",
    home: "Retour à l’accueil",
    paidTitle: "Merci pour votre achat !",
    cancelledTitle: "Le paiement a été annulé",
    pendingTitle: "En attente du paiement",
    confirmationSent: "Une confirmation a été envoyée à",
    readyNoEmail:
      "Votre téléchargement est prêt. Gardez cette page si vous n’avez pas reçu d’e-mail.",
    cancelledText: "Le paiement n’a pas été confirmé : le téléchargement n’est donc pas activé.",
    pendingText:
      "Nous attendons la confirmation du paiement. Merci de ne pas fermer cette page.",
    products: "Vos produits",
    download: "Télécharger",
    downloadsLeft: "Téléchargements restants : {count}",
    expires: "Le lien expire le",
    expired: "Le lien de téléchargement a expiré. Contactez-nous pour obtenir de l’aide.",
    activatesOnPayment: "Les téléchargements sont activés dès que le paiement est confirmé",
  },
  legalNote: {
    before: "Ceci est une traduction française fournie à titre indicatif. Seule la ",
    link: "version norvégienne",
    after: " fait juridiquement foi.",
  },
  pdfLanguage: {
    available: {
      sentence: "Tous les plannings sont disponibles en français.",
      short: "En français",
    },
    norwegian: {
      sentence: "Les plannings sont en norvégien (bokmål).",
      short: "En norvégien (bokmål)",
    },
  },
  apiErrors: {
    "Ugyldig forespørsel": "Requête invalide.",
    "Ugyldig e-postadresse": "Adresse e-mail invalide.",
    "For mange forsøk. Prøv igjen senere.": "Trop de tentatives. Veuillez réessayer plus tard.",
    "Kunne ikke lage nedlastingslenke": "Impossible de créer le lien de téléchargement.",
    "Nyhetsbrev er ikke konfigurert": "La newsletter n’est pas encore configurée.",
    "Kunne ikke lagre kontakten": "Impossible d’enregistrer votre adresse e-mail.",
    "Kunne ikke sende e-post": "Impossible d’envoyer l’e-mail.",
    Serverfeil: "Erreur du serveur. Veuillez réessayer.",
    "Mangler produkter": "Votre panier est vide.",
    "Ukjent produkt": "Produit inconnu dans le panier.",
    "Ugyldig betalingsmetode": "Moyen de paiement invalide.",
    "Mangler påkrevde felt": "Veuillez remplir tous les champs obligatoires.",
    "Kunne ikke starte kortbetaling": "Impossible de lancer le paiement par carte.",
    "Kortbetaling kan ikke belastes ennå. Stripe-kontoen er ikke aktivert.":
      "Les paiements par carte ne peuvent pas encore être débités. Le compte Stripe n’est pas activé.",
    "Kunne ikke opprette ordre": "Impossible de créer la commande.",
    "Kunne ikke starte Vipps-betaling": "Impossible de lancer le paiement Vipps.",
    "Ugyldig eller utløpt rabattkode": "Code promo invalide ou expiré.",
    "Ugyldig kode": "Code invalide.",
    "Ugyldig valuta": "Cette devise n’est pas prise en charge.",
    "Vipps kan bare brukes ved betaling i norske kroner (NOK)":
      "Vipps n’est disponible que pour les paiements en couronnes norvégiennes (NOK).",
  },
  genericError: "Une erreur s’est produite. Veuillez réessayer.",
  products: {
    "daglig-gjennomgang": {
      name: "Bilan quotidien",
      description:
        "Fiche de bilan et de réflexion quotidienne — résumez votre journée, notez ce qui a bien marché et ce que vous voulez améliorer.",
      features: ["Résumé de la journée", "Réflexion", "Points à améliorer"],
    },
    "daglig-helseplan": {
      name: "Plan santé quotidien",
      description:
        "Planning santé quotidien — suivez votre activité physique, vos repas, votre hydratation et votre sommeil.",
      features: ["Suivi de l’activité physique", "Plan des repas", "Sommeil et hydratation"],
    },
    "daglig-planlegger": {
      name: "Planning quotidien",
      description: "Planning quotidien avec agenda, priorités du jour et liste de tâches.",
      features: ["Agenda du jour", "Priorités du jour", "Liste de tâches"],
    },
    "daglig-produktivitetsplan": {
      name: "Plan de productivité quotidien",
      description: "Plan de productivité quotidien avec créneaux horaires et priorités.",
      features: ["Créneaux horaires", "Priorités", "Objectif productivité"],
    },
    "daglig-timeplan": {
      name: "Emploi du temps quotidien",
      description: "Planning de la journée heure par heure, du matin au soir.",
      features: ["Plan heure par heure", "Du matin au soir", "Journée structurée"],
    },
    "ukentlig-gjennomgang": {
      name: "Bilan hebdomadaire",
      description:
        "Bilan de la semaine — faites le point sur la semaine écoulée et fixez vos objectifs pour la suivante.",
      features: ["Résumé de la semaine", "Réflexion", "Définition d’objectifs"],
    },
    "ukentlig-gjoremaal": {
      name: "Tâches de la semaine",
      description: "Liste de tâches hebdomadaire avec de la place pour chaque jour.",
      features: ["Tâches quotidiennes", "Vue de la semaine", "Champ de priorité"],
    },
    "ukentlig-matplan": {
      name: "Menus de la semaine",
      description: "Planning des repas de la semaine avec liste de courses.",
      features: ["Plan des repas", "Liste de courses", "Vue de la semaine"],
    },
    "ukentlig-plan": {
      name: "Plan hebdomadaire",
      description: "Plan hebdomadaire complet avec priorités et blocs pour chaque jour.",
      features: ["Priorités", "Blocs quotidiens", "2 pages"],
    },
    "ukentlig-planlegger": {
      name: "Planning hebdomadaire",
      description: "Planning hebdomadaire simple pour les études et le quotidien.",
      features: ["Vue d’ensemble simple", "Études et quotidien", "Plan de la semaine"],
    },
    "maanedlig-budsjett": {
      name: "Budget mensuel",
      description: "Planning budgétaire mensuel — suivez vos revenus et vos dépenses.",
      features: ["Vue des revenus", "Suivi des dépenses", "Équilibre du budget"],
    },
    "maanedlig-gjennomgang": {
      name: "Bilan mensuel",
      description: "Bilan et réflexion du mois.",
      features: ["Résumé du mois", "Réflexion", "2 pages"],
    },
    "maanedlig-planlegger": {
      name: "Planning mensuel",
      description: "Planning mensuel avec une vue d’ensemble des objectifs et des tâches.",
      features: ["Objectifs du mois", "Liste de tâches", "Mise en page claire"],
    },
    "aarlig-planlegger": {
      name: "Planning annuel",
      description: "Planning annuel avec une vue mois par mois et vos objectifs de l’année.",
      features: ["Vue mois par mois", "Objectifs de l’année", "2 pages"],
    },
    "pomodoro-planlegger": {
      name: "Planning Pomodoro",
      description:
        "Planning de sessions d’étude Pomodoro avec évaluation de votre productivité.",
      features: ["Minuteur Pomodoro", "Évaluation de la productivité", "Planification des sessions"],
    },
    "prosjekt-planlegger": {
      name: "Planning de projet",
      description: "Planification de projet avec calendrier et étapes clés.",
      features: ["Calendrier", "Étapes clés", "Découpage des tâches"],
    },
    "gjoremaal-liste": {
      name: "Liste de tâches",
      description: "Liste de tâches simple avec champs de priorité.",
      features: ["Champs de priorité", "Vue d’ensemble simple", "Liste de tâches"],
    },
    handlingsplan: {
      name: "Plan d’action",
      description: "Plan d’action pour découper vos objectifs en étapes concrètes.",
      features: ["Découpage des objectifs", "Étapes concrètes", "Orienté action"],
    },
    "maal-planlegger": {
      name: "Planificateur d’objectifs",
      description: "Fiche d’objectifs avec actions et échéances.",
      features: ["Définition d’objectifs", "Actions", "Échéances"],
    },
    "helse-planlegger": {
      name: "Planning santé",
      description: "Planning santé et forme avec objectifs nutritionnels.",
      features: ["Programme d’entraînement", "Objectifs nutritionnels", "Suivi santé"],
    },
    hjemmeplanlegger: {
      name: "Planning maison",
      description: "Organisez les repas, les tâches ménagères et la liste de courses de la maison.",
      features: ["Plan des repas", "Tâches ménagères", "Liste de courses"],
    },
    "reise-planlegger": {
      name: "Planning de voyage",
      description: "Préparez vos voyages avec un budget, une liste de bagages et un programme jour par jour.",
      features: ["Budget voyage", "Liste de bagages", "Programme jour par jour"],
    },
    "personlig-finans-tracker": {
      name: "Suivi des finances personnelles",
      description: "Vue d’ensemble de vos finances avec revenus, dépenses et épargne.",
      features: ["Revenus", "Dépenses", "Vue de l’épargne"],
    },
    "vane-tracker": {
      name: "Suivi des habitudes",
      description: "Grille mensuelle de suivi des habitudes — prenez de bonnes habitudes.",
      features: ["Grille mensuelle", "Catégories personnalisables", "Progrès visibles"],
    },
    "30-dagers-utfordring": {
      name: "Défi 30 jours",
      description: "Suivi sur 30 jours pour une nouvelle habitude ou un nouvel objectif.",
      features: ["Suivi sur 30 jours", "Objectifs d’habitudes", "Case quotidienne"],
    },
  },
  bundles: {
    komplett: {
      name: "Studentplanlegger Complet",
      description:
        "Les 25 plannings. Tout ce qu’il vous faut pour garder le contrôle sur vos études.",
      badge: "Meilleur rapport qualité-prix",
    },
    "daglig-pakke": {
      name: "Pack Quotidien",
      description: "Les 5 plannings quotidiens réunis dans un pack.",
    },
    "ukentlig-pakke": {
      name: "Pack Hebdomadaire",
      description: "Les 5 plannings hebdomadaires réunis dans un pack.",
    },
    produktivitetspakken: {
      name: "Pack Productivité",
      description: "Les 5 outils de productivité réunis dans un pack.",
    },
  },
  categoryLabels: {
    alle: "Tous",
    daglig: "Quotidien",
    ukentlig: "Hebdomadaire",
    maanedlig: "Mensuel",
    aarlig: "Annuel",
    produktivitet: "Productivité",
    helse: "Santé et mode de vie",
    sporing: "Suivi",
  },
};
