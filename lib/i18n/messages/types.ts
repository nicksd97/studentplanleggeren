// Shape of the UI dictionary for one language (lib/i18n/messages/<lang>.ts).
//
// Only plain strings, arrays and objects: the root layout passes the dictionary of the
// current language to client components through I18nProvider, so it must be serializable
// and only that one language ends up in the page.
//
// Placeholders:
// - {single}, {fivePack}, {theme}, {komplett}: price of a single planner, the 5-pack, a theme
//   bundle and the complete bundle, filled in the visitor's currency.
// - {name}, {count}, {price}, … as documented next to each key; filled with fmt().

export type CardCopy = { title: string; description: string };

export interface Messages {
  /** Language menu. */
  switcher: { label: string };
  header: {
    planners: string;
    free: string;
    bundles: string;
    faq: string;
    buyKomplett: string;
    cart: string;
    menu: string;
  };
  footer: {
    tagline: string;
    products: string;
    komplett: string;
    daily: string;
    weekly: string;
    all: string;
    guides: string;
    info: string;
    faq: string;
    free: string;
    privacy: string;
    terms: string;
    madeWith: string;
    /** Label before the organisation number, e.g. "Org.nr:" / "Org. no." */
    orgNo: string;
  };
  hero: {
    label: string;
    tagline: string;
    intro: string;
    /** Button; uses {komplett}. */
    komplett: string;
    explore: string;
    /** Three trust signals; the first mentions Vipps. */
    trust: [string, string, string];
    /** Replaces trust[0] when the visitor pays in a currency Vipps doesn't support. */
    trustNoVipps: string;
    coverAlt: string;
  };
  devices: {
    label: string;
    heading: string;
    intro: string;
    cards: [
      { alt: string; label: string; subtext: string },
      { alt: string; label: string; subtext: string },
      { alt: string; label: string; subtext: string },
    ];
  };
  categories: { label: string; heading: string; planners: string };
  painPoints: { label: string; heading: string; cards: [CardCopy, CardCopy, CardCopy] };
  bundleShowcase: {
    label: string;
    heading: string;
    includedTitle: string;
    includes: string[];
    /** Vipps button for the complete bundle; {price}. */
    buyKomplett: string;
    /** Add-to-cart button for the complete bundle when Vipps isn't available; {price}. */
    addKomplett: string;
    seeAll: string;
    orPick: string;
    /** Uses {theme} and {fivePack}. */
    packsNote: string;
    /** "{count} planners · {price}" */
    bundleMeta: string;
    buy: string;
    alreadyInCart: string;
    added: string;
  };
  howItWorks: {
    label: string;
    heading: string;
    step: string;
    /** Step 1 uses {single}, {fivePack}, {theme}; step 2 mentions Vipps. */
    steps: [CardCopy, CardCopy, CardCopy];
    /** Replaces steps[1].description when Vipps isn't available for the visitor's currency. */
    payNoVipps: string;
  };
  testimonials: {
    label: string;
    heading: string;
    /** E.g. "Quotes translated from Norwegian."; null on the Bokmål site. */
    note: string | null;
    quotes: [
      { quote: string; study: string },
      { quote: string; study: string },
      { quote: string; study: string },
    ];
  };
  faq: { label: string; heading: string };
  guideList: { label: string; heading: string; read: string };
  guidePage: { home: string; guide: string };
  newsletter: {
    heading: string;
    subheading: string;
    buttonLabel: string;
    successMessage: string;
    error: string;
    emailLabel: string;
    placeholder: string;
    sending: string;
    /** Consent text: before + <link to privacy policy> + after. */
    consentBefore: string;
    consentLink: string;
    consentAfter: string;
  };
  gratis: {
    label: string;
    heading: string;
    intro: string;
    bullets: [string, string, string];
    formHeading: string;
    formText: string;
    /** Uses {single}. */
    cta: string;
    /** Uses {komplett}. */
    komplett: string;
  };
  notFound: { heading: string; text: string; home: string; planners: string };
  catalog: {
    /** Uses {single} and {fivePack}. */
    prices: string;
    nav: string;
    /** Label of the "all" tab. */
    allTab: string;
  };
  productCard: {
    alreadyInCart: string;
    added: string;
    badge: string;
    pages: string;
    buy: string;
  };
  stickyBar: {
    /** Uses {komplett}. */
    title: string;
    subtitle: string;
    alreadyInCart: string;
    added: string;
    add: string;
  };
  cart: {
    title: string;
    close: string;
    empty: string;
    seeProducts: string;
    /** aria-label; {name}. */
    remove: string;
    /** Uses {fivePack}. */
    onePack: string;
    /** {packs} and {price} (total for the packs). */
    manyPacks: string;
    /** Appended after the pack line; {count}. Starts with " + ". */
    singles: string;
    /** {count} and {fivePack}. */
    addMore: string;
    total: string;
    checkout: string;
    clear: string;
  };
  komplettVipps: { label: string; error: string };
  kasse: {
    errors: {
      firstName: string;
      lastName: string;
      email: string;
      emailInvalid: string;
      confirm: string;
      mismatch: string;
    };
    invalidCode: string;
    /** {code}, {percent}, {association}, {amount} (formatted total). */
    codeActive: string;
    cancelled: string;
    genericError: string;
    emptyTitle: string;
    emptyText: string;
    seeProducts: string;
    title: string;
    steps: [string, string, string];
    details: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    confirmEmail: string;
    summary: string;
    /** aria-label; {name}. */
    remove: string;
    fivePack: string;
    singleOne: string;
    /** {count} */
    singleOther: string;
    discountCode: string;
    discountPlaceholder: string;
    apply: string;
    /** {amount} */
    listPrice: string;
    total: string;
    payVipps: string;
    recommended: string;
    or: string;
    payCard: string;
    cardDisabled: string;
    secure: string;
    acceptTerms: string;
  };
  takk: {
    errorTitle: string;
    errorText: string;
    home: string;
    paidTitle: string;
    cancelledTitle: string;
    pendingTitle: string;
    confirmationSent: string;
    readyNoEmail: string;
    cancelledText: string;
    pendingText: string;
    products: string;
    download: string;
    /** {count} */
    downloadsLeft: string;
    expires: string;
    expired: string;
    activatesOnPayment: string;
  };
  /** Note on translated legal pages: before + <link to the Norwegian version> + after. */
  legalNote: { before: string; link: string; after: string };
  /**
   * What language the PDFs are in. `available` is used when translated PDFs exist for this
   * language (PDF_LANGUAGES_AVAILABLE), `norwegian` otherwise. Empty strings on the Bokmål site.
   */
  pdfLanguage: {
    available: { sentence: string; short: string };
    norwegian: { sentence: string; short: string };
  };
  /** Translations of the Bokmål error messages the /api routes return, keyed by the Bokmål text. */
  apiErrors: Record<string, string>;
  genericError: string;
  /** Product copy keyed by product id (lib/products.ts). Empty on the Bokmål site. */
  products: Record<string, { name: string; description: string; features: string[] }>;
  /** Bundle copy keyed by bundle id. Empty on the Bokmål site. */
  bundles: Record<string, { name: string; description: string; badge?: string }>;
  /** Category labels keyed by category key ("alle", "daglig", …). Empty on the Bokmål site. */
  categoryLabels: Record<string, string>;
}
