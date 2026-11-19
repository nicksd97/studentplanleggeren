import Link from "next/link";
import type { LegalCopy } from "./types";

// French privacy policy and terms of sale. The Norwegian pages are legally binding.

export const fr: LegalCopy = {
  personvern: {
    metaTitle: "Politique de confidentialité — Studentplanlegger",
    metaDescription:
      "Comment Studentplanlegger traite les données personnelles lors des achats, de l’extrait gratuit et de la newsletter. Contact : hei@studentplanlegger.no.",
    orgLine: "Studentplanlegger Davidson · N° d’org. 937416156",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 18 novembre 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Qui sommes-nous</h2>
          <p>
            Studentplanlegger.no est exploité par Studentplanlegger Davidson, numéro
            d’organisation 937416156. Nous vendons des plannings PDF à remplir sous forme de
            téléchargements numériques.
          </p>
          <p>
            <strong>Contact&nbsp;:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Les informations que nous collectons</h2>
          <p>Lorsque vous effectuez un achat, nous collectons les données personnelles suivantes&nbsp;:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Prénom</li>
            <li>Nom</li>
            <li>Adresse e-mail</li>
          </ul>
          <p>
            Ces informations sont nécessaires pour traiter votre commande et vous envoyer un lien
            de téléchargement pour les produits achetés.
          </p>
          <p>
            Lorsque vous envoyez le formulaire de la page{" "}
            <Link href="/fr/gratis" className="text-brand-accent hover:underline">
              /gratis
            </Link>{" "}
            ou de la page d’accueil, nous collectons votre adresse e-mail pour la newsletter, la
            série d’e-mails de bienvenue et l’extrait gratuit du Plan hebdomadaire. Si vous êtes
            arrivé via un lien de campagne, nous enregistrons également les paramètres de campagne
            (UTM) associés à cette inscription.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Newsletter et extrait gratuit</h2>
          <p>
            Nous collectons votre <strong>adresse e-mail</strong> lorsque vous envoyez le
            formulaire de la page /gratis ou de la page d’accueil.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Finalité&nbsp;:</strong> vous envoyer l’extrait gratuit du Plan hebdomadaire,
              une série d’e-mails de bienvenue et des e-mails réguliers avec des conseils d’études
              et des informations sur nos produits.
            </li>
            <li>
              <strong>Base juridique&nbsp;:</strong> le consentement (envoi du formulaire). Vous
              pouvez retirer votre consentement à tout moment.
            </li>
            <li>
              <strong>Responsable du traitement&nbsp;:</strong> Studentplanlegger Davidson, numéro
              d’organisation 937416156.
            </li>
            <li>
              <strong>Sous-traitants&nbsp;:</strong> Resend (envoi des e-mails, liste de contacts et
              série de bienvenue) et Supabase (registre des inscrits et commandes).
            </li>
            <li>
              <strong>Données conservées&nbsp;:</strong> adresse e-mail, source (par exemple
              gratis-ukeplan), date et heure du consentement, statut de désinscription, champs de
              campagne/UTM le cas échéant, et les campagnes d’e-mails que vous avez reçues (extrait
              et série de bienvenue). Les données sont conservées dans Resend Contacts (segment
              lead-gratis-ukeplan) et dans les tables Supabase leads et lead_campaigns jusqu’à ce
              que vous nous demandiez de les supprimer ou que vous vous désinscriviez, ou jusqu’à
              ce qu’elles ne soient plus pertinentes.
            </li>
            <li>
              <strong>Désinscription&nbsp;:</strong> répondez à{" "}
              <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                hei@studentplanlegger.no
              </a>{" "}
              en demandant à être désinscrit, ou utilisez le lien présent dans l’e-mail, le cas
              échéant.
            </li>
          </ul>
          <p>
            Les droits décrits ci-dessous (accès, rectification, effacement et réclamation auprès
            de Datatilsynet, l’autorité norvégienne de protection des données) s’appliquent
            également aux données de la newsletter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Paiement</h2>
          <p>
            Nous proposons le paiement via Stripe et Vipps. Toutes les informations de paiement
            (numéro de carte, données Vipps) sont traitées directement par le prestataire de
            paiement. Nous ne stockons jamais de données de carte ou de paiement sur nos serveurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Cookies et mesure d’audience</h2>
          <p>
            Nous n’utilisons <strong>aucun cookie de suivi tiers</strong>. Le panier et le
            paiement n’utilisent que ce qui est techniquement nécessaire. Nous déposons en outre un
            cookie interne <code>sp_campaign</code> pendant 30 jours au maximum, contenant les
            paramètres UTM des liens de campagne, afin de pouvoir rattacher un achat ou une
            inscription sur /gratis à la campagne dont vous venez. Il n’est pas transmis à des
            régies publicitaires.
          </p>
          <p>
            Pour comprendre comment le site est utilisé, nous disposons de statistiques de visite
            anonymes fournies par <strong>Vercel Web Analytics</strong>. Ce service n’utilise aucun
            cookie et ne stocke rien sur votre appareil. Nous voyons les pages consultées et des
            événements simples, par exemple qu’une personne a cliqué sur un bouton, ajouté un
            planning au panier ou finalisé un achat, avec le produit, la gamme de prix et le lien
            de campagne d’où provient la visite. Les statistiques ne contiennent ni nom, ni adresse
            e-mail, ni aucune autre donnée permettant de vous identifier, et les liens de
            téléchargement sont retirés des adresses avant leur envoi. Vercel est le sous-traitant
            pour ces statistiques.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Langue et devise</h2>
          <p>
            Nous utilisons deux cookies fonctionnels strictement nécessaires pour afficher le site
            dans la bonne langue et avec les prix dans la bonne devise. Ils ne nécessitent pas de
            consentement, ne servent pas au suivi et ne sont partagés avec personne.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <code>NEXT_LOCALE</code> — mémorise la langue que vous avez choisie dans le menu des
              langues, pour que vous retrouviez la même version linguistique lors de votre
              prochaine visite. Déposé lorsque vous choisissez une langue. Durée de vie&nbsp;: 1 an.
            </li>
            <li>
              <code>sp_currency</code> — mémorise la devise dans laquelle les prix sont affichés
              (par exemple NOK ou EUR). Déposé par le site lors de votre première visite, en
              fonction du pays depuis lequel vous vous connectez. Durée de vie&nbsp;: 1 an.
            </li>
          </ul>
          <p>
            Pour choisir la langue et la devise, nous utilisons le pays auquel appartient votre
            adresse IP, que notre hébergeur Vercel transmet à chaque visite. Le pays sert
            uniquement à ce choix, et ni le pays ni votre adresse IP ne sont conservés.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Utilisation des informations</h2>
          <p>Vos données personnelles sont utilisées uniquement pour&nbsp;:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Traiter et livrer votre commande</li>
            <li>Envoyer la confirmation et le lien de téléchargement par e-mail</li>
            <li>Vous contacter en cas de problème avec votre commande</li>
            <li>
              Envoyer l’extrait gratuit, la série de bienvenue et la newsletter auxquels vous avez
              consenti
            </li>
          </ul>
          <p>
            Nous ne vendons ni ne partageons jamais vos données personnelles avec des tiers à des
            fins marketing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Conservation et sécurité</h2>
          <p>
            Les informations de commande et les adresses e-mail des inscrits sont stockées de
            manière sécurisée chez notre fournisseur de base de données (Supabase), avec
            chiffrement et contrôle d’accès. Le serveur utilise une clé de service&nbsp;; les
            navigateurs ordinaires n’ont aucun accès en lecture ni en écriture aux tables des
            inscrits. Nous conservons les données aussi longtemps que nécessaire pour exécuter la
            commande, envoyer les e-mails auxquels vous avez consenti et respecter la
            bokføringsloven (la loi norvégienne sur la comptabilité).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Vos droits</h2>
          <p>
            Conformément à la personopplysningsloven (la loi norvégienne sur les données
            personnelles) et au RGPD, vous avez le droit de&nbsp;:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Demander l’accès aux informations que nous détenons sur vous</li>
            <li>Demander la rectification d’informations inexactes</li>
            <li>Demander l’effacement de vos informations</li>
            <li>
              Introduire une réclamation auprès de Datatilsynet (l’autorité norvégienne de
              protection des données) si vous estimez que nous traitons vos données en violation
              des règles
            </li>
          </ul>
          <p>
            Contactez-nous à{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            pour exercer vos droits.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Droit applicable</h2>
          <p>
            La présente politique de confidentialité est régie par le droit norvégien, notamment
            la personopplysningsloven et le règlement général de l’UE sur la protection des
            données (RGPD).
          </p>
        </section>
      </>
    ),
  },
  vilkar: {
    metaTitle: "Conditions générales de vente — Studentplanlegger",
    metaDescription:
      "Conditions générales de vente des plannings PDF à remplir de Studentplanlegger. Prix, livraison, droit de rétractation et conditions d’utilisation.",
    orgLine: "Studentplanlegger Davidson · N° d’org. 937416156",
    title: "Conditions générales de vente",
    updated: "Dernière mise à jour : 18 novembre 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">À propos du service</h2>
          <p>
            Studentplanlegger.no vend des produits numériques sous forme de plannings PDF à
            remplir. Tous les produits sont livrés par téléchargement numérique immédiat dès que
            le paiement est effectué.
          </p>
          <p>
            <strong>Vendeur&nbsp;:</strong> entreprise individuelle (immatriculation en cours via
            Altinn)
          </p>
          <p>
            <strong>Contact&nbsp;:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Prix et paiement</h2>
          <p>
            Les prix sont affichés dans votre devise locale lorsque nous la prenons en charge (NOK,
            SEK, DKK, EUR, GBP ou USD), sinon en dollars américains, et incluent la taxe sur la
            valeur ajoutée (TVA). Vous payez le montant affiché lors du paiement.
          </p>
          <p>
            Nous proposons le paiement par carte via Stripe dans toutes ces devises, et Vipps pour
            les paiements en couronnes norvégiennes (NOK). Le paiement s’effectue avant la
            livraison du produit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Livraison</h2>
          <p>
            Dès que le paiement est effectué, vous recevez immédiatement un lien de
            téléchargement. Vous recevez également une confirmation par e-mail contenant un lien
            vers le téléchargement.
          </p>
          <p>
            Le lien de téléchargement est valable <strong>7 jours</strong> à compter de l’achat,
            avec un maximum de <strong>10 téléchargements</strong> par commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Droit de rétractation</h2>
          <p>
            Conformément à l’article 22, point n), de l’angrerettloven (la loi norvégienne sur le
            droit de rétractation), le droit de rétractation ne s’applique pas à la fourniture
            d’un contenu numérique non livré sur un support matériel lorsque l’exécution a
            commencé avec l’accord préalable exprès du consommateur et que celui-ci a reconnu
            perdre ainsi son droit de rétractation.
          </p>
          <p>
            En finalisant l’achat, vous consentez à la livraison immédiate du contenu numérique et
            acceptez la perte de votre droit de rétractation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Conditions d’utilisation des produits</h2>
          <p>
            Les produits que vous achetez sont destinés à un <strong>usage personnel</strong>{" "}
            uniquement. Vous n’êtes pas autorisé à&nbsp;:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Revendre ou distribuer les produits</li>
            <li>Partager le lien de téléchargement avec d’autres personnes</li>
            <li>Utiliser les produits à des fins commerciales sans accord écrit</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Réclamations et assistance</h2>
          <p>
            Si vous rencontrez un problème de téléchargement ou si le produit ne fonctionne pas
            comme prévu, contactez-nous à{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            et nous vous aiderons.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Droit applicable</h2>
          <p>
            Les présentes conditions de vente sont régies par le droit norvégien. Tout litige sera
            de préférence réglé à l’amiable. À défaut, l’affaire pourra être portée devant
            Forbrukerrådet (le Conseil norvégien des consommateurs) ou devant les tribunaux
            ordinaires.
          </p>
        </section>
      </>
    ),
  },
};
