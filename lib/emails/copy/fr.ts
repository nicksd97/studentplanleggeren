import type { EmailCopy } from "../types";

// French typography as on the site: a no-break space ( ) before ? ! : and inside « ».

export const fr: EmailCopy = {
  footer: {
    reason:
      "Vous recevez cet e-mail parce que vous avez demandé le Plan hebdomadaire gratuit sur studentplanlegger.no.",
    signature: "À bientôt, Studentplanlegger",
    unsubscribeSubject: "Désinscription",
  },
  leadMagnet: {
    subject: "Votre extrait du Plan hebdomadaire",
    preheader:
      "Du lundi au mercredi en PDF à remplir. Téléchargez-le vite : le lien est valable 7 jours.",
    label: "EXTRAIT GRATUIT",
    heading: "Votre planning de la semaine est prêt",
    intro:
      "Bonjour ! Ravis que vous ayez envie d’essayer le Plan hebdomadaire. Voici la première page : objectifs, priorités, tâches et habitudes, plus l’emploi du temps du lundi au mercredi.",
    note: "C’est un extrait, pas le produit complet. Mais c’est une vraie page du planning, avec des champs à remplir directement dans le PDF.",
    imageAlt:
      "L’extrait : première page du Plan hebdomadaire avec objectifs, priorités, tâches et du lundi au mercredi",
    button: "Télécharger le planning",
    buttonMeta: ["PDF à remplir", "A4", "lien valable 7 jours"],
    textDownload: "Télécharger le planning (PDF à remplir, A4, lien valable 7 jours) :",
    tipsHeading: "Comment l’utiliser",
    tips: [
      {
        title: "Ouvrez-le dans Adobe Acrobat Reader.",
        body: "Il est gratuit sur ordinateur et sur mobile. Vous pouvez écrire directement dans les champs et enregistrer.",
      },
      {
        title: "Prenez dix minutes le dimanche soir.",
        body: "Notez les objectifs de la semaine et vos trois priorités avant de remplir l’emploi du temps.",
      },
      {
        title: "Enregistrez d’abord une copie vierge.",
        body: "Vous aurez ainsi une page neuve pour la semaine suivante. Ou imprimez-le et sortez un stylo.",
      },
    ],
    upsellHeading: "Envie de la semaine complète ?",
    upsellBody:
      "Le Plan hebdomadaire complet fait deux pages, du lundi au dimanche, et coûte {single}. Si vous voulez tout, les 25 plannings sont réunis dans le pack complet pour {komplett}.",
    linkWeekly: "Voir le Plan hebdomadaire",
    linkKomplett: "Voir le pack complet",
    closing: "Bonne semaine ! Une question ? Répondez simplement à cet e-mail.",
    footerUnsubscribe:
      "Vous ne voulez plus recevoir d’e-mails ? Répondez « désinscription » ou écrivez à {email}, et nous vous désinscrirons.",
    footerPrivacy: "Consultez notre {privacy}.",
    privacyLink: "politique de confidentialité",
    textPrivacyLabel: "Confidentialité",
  },
  welcome: {
    unsubscribeLink: "Se désinscrire",
    privacyLink: "Confidentialité",
    emails: [
      {
        subject: "Tirez le meilleur de votre planning",
        body: "Bonjour ! Avez-vous déjà testé le planning de la semaine ? Petite astuce : prenez dix minutes le dimanche soir pour noter vos cours, vos rendus et votre job, puis choisissez trois choses qui <em>doivent</em> être faites. Votre lundi sera bien plus serein. N’hésitez pas à répondre à cet e-mail si vous avez une question.",
      },
      {
        subject: "Quand les examens approchent",
        body: "Six semaines avant les examens, mieux vaut répartir le programme sur les semaines qui restent, pour ne pas tout réviser la dernière semaine. Dans le pack complet, vous trouverez un planning annuel, un planning mensuel et le Plan hebdomadaire, qui vont ensemble, tous en PDF à remplir sur tablette ou ordinateur.",
        button: "Voir le pack",
      },
      {
        subject: "Les 25 plannings en un seul pack",
        body: "Vous aimez le planning de la semaine ? Le pack complet est à vous pour {bundlePrice}. C’est un achat unique, sans abonnement, et vous le téléchargez tout de suite. Vous êtes membre d’une association étudiante en Norvège ? Vous pourriez avoir 20 % de réduction avec son code.",
        button: "Acheter le pack complet",
      },
    ],
  },
};
