import type { Content } from "./types";

// French page metadata, catalog, FAQ, guides and order email. Translated from en.ts.
// " " is a non-breaking space (French typography before : ; ! ? and inside « »).

export const fr: Content = {
  meta: {
    home: {
      title: "Studentplanlegger — Organisez enfin vos études",
      description:
        "25 plannings PDF à remplir pour les étudiants. {single} l’unité, lot de 5 à {fivePack}, packs thématiques à {theme} et pack complet à {komplett}.",
      keywords: [
        "planning étudiant",
        "agenda étudiant",
        "planning hebdomadaire",
        "suivi des habitudes",
        "méthode pomodoro",
        "pdf à remplir",
        "planning de révisions",
      ],
    },
    gratis: {
      title: "Extrait gratuit du Plan hebdomadaire — Studentplanlegger",
      description:
        "Téléchargez gratuitement un extrait à remplir du Plan hebdomadaire. Une page pour tester le format — pas le produit complet. Plan complet dès {single}.",
    },
    kasse: {
      title: "Paiement — Studentplanlegger",
      description: "Finalisez votre achat de plannings PDF à remplir sur Studentplanlegger.",
    },
    takk: {
      title: "Merci pour votre achat — Studentplanlegger",
      description: "Téléchargez les plannings que vous avez achetés sur Studentplanlegger.",
    },
    notFound: {
      title: "Page introuvable — Studentplanlegger",
      description:
        "Cette page n’existe pas. Rendez-vous sur Studentplanlegger pour découvrir les plannings PDF à remplir.",
    },
    ogImageAlt: "Studentplanlegger — 25 plannings PDF à remplir",
  },
  catalog: {
    alle: {
      title: "Tous les plannings — Studentplanlegger",
      description:
        "25 plannings PDF à remplir pour les étudiants. {single} l’unité, cinq au choix pour {fivePack}, ou des packs dès {theme}.",
      heading: "Tous les plannings",
    },
    daglig: {
      title: "Plannings quotidiens — Studentplanlegger",
      description:
        "5 plannings PDF quotidiens pour les étudiants. Agenda, emploi du temps, santé et productivité — à remplir à l’écran ou à imprimer.",
      heading: "Plannings quotidiens",
    },
    ukentlig: {
      title: "Plannings hebdomadaires — Studentplanlegger",
      description:
        "5 plannings PDF hebdomadaires pour les étudiants : plan de la semaine, tâches, menus et bilan hebdomadaire.",
      heading: "Plannings hebdomadaires",
    },
    maanedlig: {
      title: "Plannings mensuels — Studentplanlegger",
      description:
        "Budget mensuel, bilan mensuel et planning mensuel en PDF à remplir pour les étudiants.",
      heading: "Plannings mensuels",
    },
    aarlig: {
      title: "Planning annuel — Studentplanlegger",
      description:
        "Planning annuel avec une vue mois par mois et vos objectifs de l’année. Un PDF à remplir pour les étudiants.",
      heading: "Planning annuel",
    },
    produktivitet: {
      title: "Plannings de productivité — Studentplanlegger",
      description:
        "Pomodoro, planning de projet, liste de tâches, plan d’action et planificateur d’objectifs en PDF à remplir.",
      heading: "Plannings de productivité",
    },
    helse: {
      title: "Santé et mode de vie — Studentplanlegger",
      description:
        "Planning santé, planning maison et planning de voyage. Des PDF à remplir pour les étudiants.",
      heading: "Santé et mode de vie",
    },
    sporing: {
      title: "Outils de suivi — Studentplanlegger",
      description:
        "Suivi des habitudes, suivi des finances et défi 30 jours. Des PDF à remplir pour les étudiants.",
      heading: "Outils de suivi",
    },
  },
  faqLanguage: {
    question: "En quelle langue sont les plannings ?",
    available:
      "Les plannings sont disponibles en français : les titres et les intitulés des PDF sont en français, et vous recevez les fichiers en français lorsque vous achetez sur le site français.",
    norwegian:
      "Les plannings sont rédigés en norvégien (bokmål). Ce site est disponible en français, mais les titres et les intitulés des PDF sont en norvégien.",
  },
  faq: [
    {
      question: "Qu’est-ce qu’un PDF à remplir ?",
      answer:
        "Un PDF à remplir contient des champs interactifs dans lesquels vous pouvez écrire directement sur votre ordinateur, votre tablette ou votre téléphone — sans rien imprimer. Si vous préférez, vous pouvez aussi l’imprimer et le remplir à la main.",
    },
    {
      question: "Puis-je imprimer les plannings ?",
      answer:
        "Bien sûr ! Tous les plannings sont conçus pour être imprimés en A4, avec une mise en page claire et lisible. Parfaits pour votre mur ou votre bureau.",
    },
    {
      question: "Fonctionnent-ils sur téléphone et tablette ?",
      answer:
        "Oui ! Ouvrez les PDF dans un lecteur PDF et remplissez directement les champs. Pour un résultat optimal, nous recommandons Adobe Acrobat Reader (gratuit).",
    },
    {
      question: "Comment télécharger mes plannings après l’achat ?",
      answer:
        "Vous avez accès aux fichiers dès le paiement effectué. Vous êtes redirigé vers une page de téléchargement et vous recevez aussi un e-mail avec des liens de téléchargement valables 7 jours.",
    },
    {
      question: "Comment puis-je payer ?",
      answer:
        "Par carte (Visa/Mastercard), dans votre devise locale lorsque nous la prenons en charge. Si vous payez en couronnes norvégiennes, vous pouvez aussi utiliser Vipps.",
    },
    {
      question: "S’agit-il d’un abonnement ?",
      answer:
        "Non — vous payez une seule fois et les plannings sont à vous pour toujours. Pas d’abonnement, pas de frais cachés.",
    },
    {
      question: "Et si je ne suis pas satisfait ?",
      answer:
        "Comme il s’agit de produits numériques livrés immédiatement, nous ne proposons normalement pas de remboursement. Mais si vous n’êtes pas satisfait, contactez-nous — nous trouverons une solution.",
    },
    {
      question: "Que contient le pack complet ?",
      answer:
        "Studentplanlegger Complet contient les 25 plannings (quotidiens, hebdomadaires, mensuels, annuel, productivité, santé et suivi), tous en PDF à remplir. Le pack coûte {komplett}.",
    },
    {
      question: "Combien coûtent les plannings ?",
      answer:
        "Chaque planning à l’unité coûte {single}. Cinq plannings au choix dans le panier coûtent {fivePack}. Les packs thématiques coûtent {theme}, et Studentplanlegger Complet coûte {komplett}.",
    },
  ],
  fivePack: {
    name: "Lot de 5",
    description: "Choisissez cinq plannings à l’unité et payez {fivePack}.",
  },
  email: {
    subject: "Merci pour votre achat ! Voici votre lien de téléchargement",
    heading: "Merci pour votre achat, {firstName} !",
    intro: "Voici le récapitulatif de votre commande :",
    discount: "Réduction {code} (−{percent} %) — −{amount}",
    total: "Total — {amount}",
    downloadIntro: "Téléchargez vos produits grâce au lien ci-dessous :",
    button: "Télécharger les plannings",
    validity:
      "Le lien est valable 7 jours à compter de l’achat. Une question ? Contactez-nous à",
  },
  guides: [
    {
      slug: "planlegg-studiedagen",
      title: "Comment organiser votre journée d’études — Studentplanlegger",
      description:
        "Choisissez quelques priorités, prévoyez du temps pour lire et faire des pauses, et terminez par un bref bilan. Une méthode concrète pour vos journées.",
      heading: "Comment organiser votre journée d’études",
      summary:
        "Une longue liste, ce n’est pas encore un plan. Voici comment choisir ce qui se fait aujourd’hui et laisser le reste attendre.",
      footerLabel: "Organiser sa journée",
      catalogKey: "daglig",
      productSlug: "daglig-planlegger",
      productLead:
        "Le Planning quotidien est une fiche PDF à remplir avec agenda, priorités du jour et liste de tâches, pour {single}. Dans la même catégorie, vous trouverez aussi l’Emploi du temps quotidien et le Bilan quotidien.",
      productCta: "Voir les plannings quotidiens",
      sections: [
        {
          heading: "Une longue liste, ce n’est pas un plan",
          paragraphs: [
            "Beaucoup de journées d’études commencent avec tout ce qu’on aurait dû faire et se terminent avec ce qui se trouvait par hasard en haut de la liste. Ce qui marche mieux, en général, c’est de choisir quelques tâches qui seront vraiment faites et de leur réserver du temps — pauses comprises.",
            "Pas besoin d’un système compliqué. Il vous faut un ordre : ce qui est fixe, ce qui compte aujourd’hui et ce qui peut attendre.",
          ],
        },
        {
          heading: "Notez l’incontournable, puis choisissez une à trois tâches",
          paragraphs: [
            "Commencez par les cours, les échéances et les rendez-vous. Choisissez ensuite une à trois tâches d’étude qui auront leur créneau. Le reste trouve sa place dans un planning hebdomadaire ou sur la liste du lendemain.",
            "Si tout vous semble aussi important, demandez-vous : qu’est-ce qui deviendra plus difficile si je le remets à demain ? La réponse est souvent votre première session du jour.",
          ],
        },
        {
          heading: "Planifiez du temps, pas seulement des tâches",
          paragraphs: [
            "« Lire le chapitre 4 » est un souhait. « Lire le chapitre 4 entre 10 h et 11 h 30 » est un plan. Inutile de minuter toute la journée : il suffit de bloquer les deux ou trois sessions qui comptent le plus et de laisser le reste de la journée respirer.",
            "Prévoyez une demi-heure de marge si vous le pouvez. Ainsi, un cours qui déborde ne fera pas dérailler votre soirée.",
          ],
        },
        {
          heading: "Terminez par trois lignes",
          paragraphs: [
            "Avant de ranger vos livres : qu’est-ce qui a été fait, qu’est-ce qui a coincé, et quelle est la première tâche de demain ? Cela prend deux minutes et rend le lendemain matin plus serein.",
          ],
        },
      ],
    },
    {
      slug: "ukentlig-studieplan",
      title: "Planning de la semaine : y voir clair avant lundi — Studentplanlegger",
      description:
        "Faites un planning qui laisse de la place aux cours, aux lectures et aux loisirs. Voici comment répartir le travail pour éviter le rush du week-end.",
      heading: "Comment faire un planning d’études hebdomadaire",
      summary:
        "Regardez d’abord les rendez-vous fixes, puis le temps dont vous disposez vraiment pour vos cours. Ainsi, tout ne finit pas le dimanche.",
      footerLabel: "Planning de la semaine",
      catalogKey: "ukentlig",
      productSlug: "ukentlig-planlegger",
      productLead:
        "Le Planning hebdomadaire est un planning de la semaine simple, à remplir, pour les études et le quotidien, à {single}. Le Plan hebdomadaire propose des priorités et des blocs pour chaque jour, et les Tâches de la semaine vous laissent de la place pour les tâches de chaque journée.",
      productCta: "Voir les plannings hebdomadaires",
      sections: [
        {
          heading: "Sans planning, les journées deviennent vite aléatoires",
          paragraphs: [
            "Le lundi déborde, le mercredi s’évapore et le dimanche passe à faire ce que vous vouliez faire mardi. Une vue d’ensemble simple de la semaine permet de voir plus facilement où le travail trouve vraiment sa place — avant que la semaine ne démarre.",
          ],
        },
        {
          heading: "Commencez par ce qui est fixe",
          paragraphs: [
            "Cours magistraux, TD, travail et rendez-vous impossibles à déplacer passent avant les huit heures de lecture que vous vous promettez. Ce qui reste, c’est le temps réel dont vous disposez pour lire et rendre vos devoirs. C’est presque toujours moins que vous ne le pensez.",
          ],
        },
        {
          heading: "Répartissez le travail le plus lourd",
          paragraphs: [
            "Ne placez pas trois grosses séances de lecture le même jour que deux cours. Déplacez-en une vers une journée plus calme. Tout l’intérêt d’un planning hebdomadaire, c’est justement de montrer les conflits avant qu’ils n’arrivent.",
            "Il est normal que les journées ne se ressemblent pas. Un planning hebdomadaire doit décrire la semaine que vous avez, pas une semaine sans cours.",
          ],
        },
        {
          heading: "Faites aussi une place aux loisirs et aux tâches ménagères",
          paragraphs: [
            "Les repas, le sport et une soirée de repos ont leur place dans la vue d’ensemble. S’ils n’en ont pas, ils en prennent une quand même — simplement de façon plus aléatoire. Un petit point le mercredi ou le jeudi suffit pour déplacer ce qui a glissé.",
          ],
        },
      ],
    },
    {
      slug: "pomodoro-til-eksamen",
      title: "La méthode Pomodoro pour réviser vos examens — Studentplanlegger",
      description:
        "Des sessions courtes et des pauses fixes aident à rester concentré sur vos révisions. Voici comment bâtir un planning de révisions que vous suivrez vraiment.",
      heading: "Comment utiliser la méthode Pomodoro pour réviser vos examens",
      summary:
        "Les sessions sans fin, « toute la journée », traînent souvent en longueur. Des blocs courts entrecoupés de pauses sont plus faciles à lancer — et à tenir.",
      footerLabel: "Pomodoro pour les examens",
      catalogKey: "produktivitet",
      productSlug: "pomodoro-planlegger",
      productLead:
        "Le Planning Pomodoro est une fiche à remplir pour planifier vos sessions d’étude et noter votre productivité, à {single}. Il complète les autres fiches de productivité.",
      productCta: "Voir le Planning Pomodoro",
      sections: [
        {
          heading: "Les longues sessions sans fin traînent souvent en longueur",
          paragraphs: [
            "Quand les révisions s’accumulent, on est tenté de bloquer toute la journée. Beaucoup constatent que leur concentration baisse au bout d’une heure, et la soirée sert à rattraper la matinée. Des blocs de travail courts avec des pauses fixes — souvent appelés Pomodoro — rendent le démarrage moins pénible.",
          ],
        },
        {
          heading: "En quoi consiste vraiment la méthode",
          paragraphs: [
            "Une version courante, c’est 25 minutes de travail concentré et 5 minutes de pause. Après quatre sessions de ce type, vous faites une pause plus longue. Les durées sont ajustables. L’essentiel n’est pas le minuteur, mais le fait que le travail ait un début et une fin.",
          ],
        },
        {
          heading: "Donnez un seul objectif à chaque session",
          paragraphs: [
            "Choisissez un chapitre, une série d’exercices ou un jeu de notes. « Réviser l’examen » est trop vague pour s’y mettre. À la fin de la session, cochez ce que vous avez fait — pas ce que vous espériez faire.",
            "Une semaine d’examens devient plus gérable si vous planifiez un nombre de sessions plutôt qu’un nombre d’heures. Les sessions sont plus faciles à déplacer si un cours vous prend la matinée.",
          ],
        },
        {
          heading: "Une pause, c’est une pause",
          paragraphs: [
            "Si la pause se transforme en nouveaux e-mails ou en nouvel onglet, la session suivante démarre plus lentement. Levez-vous, allez chercher de l’eau ou regardez par la fenêtre. L’écran peut attendre le prochain bloc de travail.",
          ],
        },
      ],
    },
    {
      slug: "bygg-studievaner",
      title: "Comment prendre des habitudes d’études durables — Studentplanlegger",
      description:
        "Commencez par une petite habitude, rendez-la visible et notez vos progrès. Vous éviterez ainsi de viser trop haut et d’abandonner au bout d’une semaine.",
      heading: "Comment prendre une habitude d’études qui dure",
      summary:
        "Une petite habitude répétée vaut mieux que trois grands projets abandonnés. Voici comment la garder sous les yeux tout au long du mois.",
      footerLabel: "Habitudes d’études",
      catalogKey: "sporing",
      productSlug: "vane-tracker",
      productLead:
        "Le Suivi des habitudes est une grille mensuelle avec de la place pour vos propres catégories, pour visualiser vos progrès, à {single}. Le Défi 30 jours est une fiche plus ciblée pour une nouvelle habitude ou un nouvel objectif.",
      productCta: "Voir le Suivi des habitudes",
      sections: [
        {
          heading: "Les grands projets échouent plus souvent que les petites habitudes",
          paragraphs: [
            "« Lire deux heures par jour » dès le premier lundi du semestre tient rarement plus d’une semaine. Ce qui dure est généralement plus petit, visible et facile à répéter — y compris les jours de cours et de mauvaises nuits.",
          ],
        },
        {
          heading: "Choisissez une habitude, et faites-la presque trop petite",
          paragraphs: [
            "Ne vous lancez pas en même temps dans le sport, la lecture, l’alimentation et le sommeil. Choisissez-en une : par exemple 20 minutes de lecture avant le déjeuner, ou préparer votre sac la veille. Une fois qu’elle est ancrée, vous pouvez ajouter la suivante.",
            "Si deux heures, c’est trop un jour chargé, dix minutes, ça ne l’est pas. Une habitude que vous tenez les mauvais jours vaut plus qu’un plan ambitieux que vous abandonnez.",
          ],
        },
        {
          heading: "Notez vos progrès là où vous les voyez",
          paragraphs: [
            "Une grille sur le frigo, dans votre carnet ou en PDF à remplir rend l’habitude visible. Les cases vides ne mentent pas. Il est plus facile de prolonger une série que de tout recommencer chaque lundi.",
          ],
        },
        {
          heading: "Un jour manqué ne ruine pas tout",
          paragraphs: [
            "Reprenez le lendemain sans chercher à tout « rattraper ». Vous punir avec une double session augmente le risque d’abandonner complètement l’habitude. Comptez les jours où vous l’avez fait, pas les jours parfaits.",
          ],
        },
      ],
    },
  ],
};
