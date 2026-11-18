import type { Messages } from "./types";

// English UI copy. Also the reference for the other translations.

export const en: Messages = {
  switcher: { label: "Language" },
  header: {
    planners: "Planners",
    free: "Free sample",
    bundles: "Bundles",
    faq: "FAQ",
    buyKomplett: "Buy the complete bundle with Vipps",
    cart: "Cart",
    menu: "Menu",
  },
  footer: {
    tagline: "Planners and productivity tools made for students.",
    products: "Products",
    komplett: "Complete bundle",
    daily: "Daily Bundle",
    weekly: "Weekly Bundle",
    all: "All planners",
    guides: "Guides",
    info: "Info",
    faq: "FAQ",
    free: "Free sample",
    privacy: "Privacy",
    terms: "Terms",
    madeWith: "Made with love in Norway",
    orgNo: "Org. no.",
  },
  hero: {
    label: "✦ Made for students ✦",
    tagline: "Get your studies organised.",
    intro:
      "25 fillable PDF planners for students. Daily, weekly, monthly — print them or fill them in right on your screen.",
    komplett: "See the complete bundle — {komplett}",
    explore: "Explore the planners",
    trust: ["Pay with Vipps or card", "Fillable PDFs", "Instant download"],
    trustNoVipps: "Secure card payment",
    coverAlt: "Studentplanlegger products — 25 fillable PDF planners",
  },
  devices: {
    label: "✦ Use it anywhere ✦",
    heading: "Works on every device",
    intro:
      "Fill in the planners digitally on a PC, Mac, iPad or tablet — or print them on paper. Your choice.",
    cards: [
      {
        alt: "Fill in the planner digitally on a PC, Mac, iPad or tablet",
        label: "Fill in digitally",
        subtext: "Use on a PC, Mac, iPad or tablet",
      },
      {
        alt: "Yearly, monthly, weekly and daily planners",
        label: "Yearly, monthly, weekly and daily",
        subtext: "Planners for every need",
      },
      {
        alt: "Available in several sizes: A4, A5, Letter and Half Letter",
        label: "Several sizes",
        subtext: "A4, A5, Letter and Half Letter",
      },
    ],
  },
  categories: { label: "✦ Explore the categories ✦", heading: "What do you need?", planners: "planners" },
  painPoints: {
    label: "✦ Sound familiar? ✦",
    heading: "For you if you...",
    cards: [
      {
        title: "...never know where to start",
        description:
          "Semester start, exams, projects — there's a lot to keep track of. Daily and weekly planners give you an overview from day one.",
      },
      {
        title: "...want to build better habits",
        description:
          "Starting is easy, sticking with it is hard. The Habit Tracker and the 30-Day Challenge help you actually keep it going.",
      },
      {
        title: "...want to reach your goals",
        description:
          "Whether it's grade goals, fitness goals or savings goals — the Goal Planner and the Action Plan break big goals down into concrete steps.",
      },
    ],
  },
  bundleShowcase: {
    label: "✦ Everything you need ✦",
    heading: "Studentplanlegger Complete",
    includedTitle: "25 planners included:",
    includes: [
      "5 daily planners",
      "5 weekly planners",
      "3 monthly planners",
      "1 yearly planner",
      "5 productivity tools",
      "3 health & lifestyle",
      "3 tracking tools",
    ],
    buyKomplett: "Buy the complete bundle with Vipps — {price}",
    addKomplett: "Add the complete bundle to your cart — {price}",
    seeAll: "See all 25 planners",
    orPick: "✦ Or pick a bundle ✦",
    packsNote: "Theme bundles {theme}. Put any five single planners in the cart for {fivePack}.",
    bundleMeta: "{count} planners · {price}",
    buy: "Buy",
    alreadyInCart: "Already in your cart",
    added: "Added ✓",
  },
  howItWorks: {
    label: "✦ Quick and easy ✦",
    heading: "How it works",
    step: "Step",
    steps: [
      {
        title: "Choose",
        description:
          "Pick the tool or bundle that fits your needs. Single planners from {single}, 5-pack {fivePack}, bundles from {theme}.",
      },
      {
        title: "Pay",
        description:
          "Secure payment with Vipps or bank card. No subscription — you pay once and own the product forever.",
      },
      {
        title: "Download",
        description:
          "Download the files straight away — fillable PDFs for printing or digital use. Ready in under a minute.",
      },
    ],
    payNoVipps:
      "Secure payment by card. No subscription — you pay once and own the product forever.",
  },
  testimonials: {
    label: "✦ From students like you ✦",
    heading: "What others say",
    note: "Quotes translated from Norwegian.",
    quotes: [
      {
        quote:
          "The Daily Planner has changed my morning routine. I spend 5 minutes planning the day and get much more done.",
        study: "Law, UiO",
      },
      {
        quote:
          "The Weekly Plan is brilliant for planning the semester. I can finally see the whole week at a glance instead of forgetting things.",
        study: "Nursing, NTNU",
      },
      {
        quote:
          "Love that I can fill it in directly on my iPad. No need to print, and it still looks nice.",
        study: "Economics, NHH",
      },
    ],
  },
  faq: { label: "✦ Questions? ✦", heading: "Frequently asked questions" },
  guideList: { label: "✦ Guides ✦", heading: "Tips for everyday student life", read: "Read the guide" },
  guidePage: { home: "Home", guide: "Guide" },
  newsletter: {
    heading: "Free weekly plan sample",
    subheading: "Get a fillable weekly plan sample by email — one page, not the full product.",
    buttonLabel: "Send me the sample",
    successMessage: "Thanks! Check your inbox — the sample is on its way.",
    error: "Something went wrong. Please try again.",
    emailLabel: "Email address",
    placeholder: "you@example.com",
    sending: "Sending...",
    consentBefore:
      "By submitting, you agree that we store your email address to send you the sample and regular study tips (the emails are in Norwegian). Read the ",
    consentLink: "privacy policy",
    consentAfter: ".",
  },
  gratis: {
    label: "FREE SAMPLE",
    heading: "Download a free weekly plan sample",
    intro:
      "A one-page fillable PDF, so you can try the format before you buy. This isn't the whole planner — just an excerpt from the weekly plan.",
    bullets: [
      "Fillable fields for goals, priorities, to-dos, habits and Monday–Wednesday",
      "A real page from Weekly Plan — same design as the full version",
      "The full weekly plan and 24 other PDFs are in the shop",
    ],
    formHeading: "Get the sample by email",
    formText: "Enter your email. We'll send you a download link — not the whole product.",
    cta: "See all the planners — from {single}",
    komplett: "Complete bundle with 25 planners: {komplett}.",
  },
  notFound: {
    heading: "Page not found",
    text: "We couldn't find the page you're looking for. Browse the planners, or go back to the home page.",
    home: "Go to the home page",
    planners: "See the planners",
  },
  catalog: {
    prices: "{single} per planner. Put any five in your cart and pay {fivePack}.",
    nav: "Product categories",
    allTab: "All",
  },
  productCard: {
    alreadyInCart: "Already in your cart",
    added: "Added ✓",
    badge: "Fillable PDF",
    pages: "pages",
    buy: "Buy now",
  },
  stickyBar: {
    title: "Studentplanlegger Complete — all 25 for {komplett}",
    subtitle: "All 25 fillable PDFs",
    alreadyInCart: "Already in your cart",
    added: "Added ✓",
    add: "Add to cart",
  },
  cart: {
    title: "Cart",
    close: "Close",
    empty: "Your cart is empty",
    seeProducts: "See products",
    remove: "Remove {name}",
    onePack: "5-pack: five planners for {fivePack}",
    manyPacks: "{packs} × 5-pack for {price}",
    singles: " + {count} single",
    addMore: "Add {count} more to get the 5-pack for {fivePack}.",
    total: "Total",
    checkout: "Go to checkout",
    clear: "Empty cart",
  },
  komplettVipps: {
    label: "Buy the complete bundle with Vipps",
    error: "Could not start the Vipps payment",
  },
  kasse: {
    errors: {
      firstName: "First name is required",
      lastName: "Last name is required",
      email: "Email is required",
      emailInvalid: "Invalid email address",
      confirm: "Please confirm your email",
      mismatch: "The email addresses don't match",
    },
    invalidCode: "Invalid code",
    codeActive: "Code {code} is active — {percent}% for {association}. You pay {amount}.",
    cancelled: "The payment was cancelled or failed. No order has been completed.",
    genericError: "Something went wrong. Please try again.",
    emptyTitle: "Your cart is empty",
    emptyText: "Add some products before you go to checkout.",
    seeProducts: "See products",
    title: "Checkout",
    steps: ["Details", "Payment", "Download"],
    details: "Your details",
    firstName: "First name",
    firstNamePlaceholder: "Jane",
    lastName: "Last name",
    lastNamePlaceholder: "Smith",
    email: "Email",
    emailPlaceholder: "jane@example.com",
    confirmEmail: "Confirm email",
    summary: "Order summary",
    remove: "Remove {name}",
    fivePack: "5-pack",
    singleOne: "1 single planner",
    singleOther: "{count} single planners",
    discountCode: "Discount code",
    discountPlaceholder: "e.g. ABAKUS20",
    apply: "Apply",
    listPrice: "List price {amount}",
    total: "Total",
    payVipps: "Pay with Vipps",
    recommended: "Recommended",
    or: "or",
    payCard: "Pay by card",
    cardDisabled: "Card payment isn't available yet. Please pay with Vipps.",
    secure: "Secure payment · Instant download",
    acceptTerms: "By purchasing, you accept our terms of sale",
  },
  takk: {
    errorTitle: "Something went wrong",
    errorText: "We couldn't find your order. Check your email or contact us for help.",
    home: "Back to the home page",
    paidTitle: "Thank you for your purchase!",
    cancelledTitle: "The payment was cancelled",
    pendingTitle: "Waiting for payment",
    confirmationSent: "A confirmation has been sent to",
    readyNoEmail: "Your download is ready. Keep this page if you haven't received an email.",
    cancelledText: "The payment wasn't confirmed, so the download hasn't been activated.",
    pendingText: "We're waiting for the payment to be confirmed. Please don't close this page.",
    products: "Your products",
    download: "Download",
    downloadsLeft: "{count} downloads left",
    expires: "The link expires",
    expired: "The download link has expired. Contact us for help.",
    activatesOnPayment: "Downloads are activated once the payment is confirmed",
  },
  legalNote: {
    before: "This is an English translation provided for convenience. The ",
    link: "Norwegian version",
    after: " is the legally binding one.",
  },
  pdfLanguage: {
    available: { sentence: "All planners are available in English.", short: "In English" },
    norwegian: {
      sentence: "The planners are in Norwegian (Bokmål).",
      short: "In Norwegian (Bokmål)",
    },
  },
  apiErrors: {
    "Ugyldig forespørsel": "Invalid request.",
    "Ugyldig e-postadresse": "Invalid email address.",
    "For mange forsøk. Prøv igjen senere.": "Too many attempts. Please try again later.",
    "Kunne ikke lage nedlastingslenke": "Could not create a download link.",
    "Nyhetsbrev er ikke konfigurert": "The newsletter is not set up yet.",
    "Kunne ikke lagre kontakten": "Could not save your email address.",
    "Kunne ikke sende e-post": "Could not send the email.",
    Serverfeil: "Server error. Please try again.",
    "Mangler produkter": "Your cart is empty.",
    "Ukjent produkt": "Unknown product in the cart.",
    "Ugyldig betalingsmetode": "Invalid payment method.",
    "Mangler påkrevde felt": "Please fill in all required fields.",
    "Kunne ikke starte kortbetaling": "Could not start the card payment.",
    "Kortbetaling kan ikke belastes ennå. Stripe-kontoen er ikke aktivert.":
      "Card payments can't be charged yet. The Stripe account is not activated.",
    "Kunne ikke opprette ordre": "Could not create the order.",
    "Kunne ikke starte Vipps-betaling": "Could not start the Vipps payment.",
    "Ugyldig eller utløpt rabattkode": "Invalid or expired discount code.",
    "Ugyldig kode": "Invalid code.",
    "Ugyldig valuta": "This currency isn't supported.",
    "Vipps kan bare brukes ved betaling i norske kroner (NOK)":
      "Vipps can only be used when paying in Norwegian kroner (NOK).",
  },
  genericError: "Something went wrong. Please try again.",
  products: {
    "daglig-gjennomgang": {
      name: "Daily Review",
      description:
        "Daily review and reflection sheet — sum up the day, note what went well and what you want to improve.",
      features: ["Day summary", "Reflection", "Points to improve"],
    },
    "daglig-helseplan": {
      name: "Daily Health Plan",
      description: "Daily health planner — track exercise, meals, water intake and sleep.",
      features: ["Exercise tracking", "Meal plan", "Sleep and water intake"],
    },
    "daglig-planlegger": {
      name: "Daily Planner",
      description: "Daily planner with agenda, focus areas and to-dos.",
      features: ["Daily agenda", "Focus areas", "To-do list"],
    },
    "daglig-produktivitetsplan": {
      name: "Daily Productivity Plan",
      description: "Daily productivity plan with time blocks and priorities.",
      features: ["Time blocks", "Priorities", "Productivity focus"],
    },
    "daglig-timeplan": {
      name: "Daily Schedule",
      description: "Hour-by-hour plan for the day, from morning to evening.",
      features: ["Hourly plan", "Morning to evening", "Structured day"],
    },
    "ukentlig-gjennomgang": {
      name: "Weekly Review",
      description: "Weekly summary — reflect on the week and set goals for the next one.",
      features: ["Week summary", "Reflection", "Goal setting"],
    },
    "ukentlig-gjoremaal": {
      name: "Weekly To-Dos",
      description: "Weekly to-do list with room for tasks on each day.",
      features: ["Daily tasks", "Week overview", "Priority field"],
    },
    "ukentlig-matplan": {
      name: "Weekly Meal Plan",
      description: "Weekly meal planner with a shopping list.",
      features: ["Meal plan", "Shopping list", "Week overview"],
    },
    "ukentlig-plan": {
      name: "Weekly Plan",
      description: "Complete weekly plan with focus areas and daily blocks.",
      features: ["Focus areas", "Daily blocks", "2 pages"],
    },
    "ukentlig-planlegger": {
      name: "Weekly Planner",
      description: "Simple weekly planner for studies and everyday life.",
      features: ["Simple overview", "Studies and everyday life", "Weekly plan"],
    },
    "maanedlig-budsjett": {
      name: "Monthly Budget",
      description: "Monthly budget planner — track income and expenses.",
      features: ["Income overview", "Expense tracking", "Budget balance"],
    },
    "maanedlig-gjennomgang": {
      name: "Monthly Review",
      description: "Monthly review and reflection.",
      features: ["Month summary", "Reflection", "2 pages"],
    },
    "maanedlig-planlegger": {
      name: "Monthly Planner",
      description: "Monthly planner with an overview of goals and to-dos.",
      features: ["Monthly goals", "To-do list", "Clear layout"],
    },
    "aarlig-planlegger": {
      name: "Yearly Planner",
      description: "Yearly planner with a month-by-month overview and goals for the year.",
      features: ["Monthly overview", "Goals for the year", "2 pages"],
    },
    "pomodoro-planlegger": {
      name: "Pomodoro Planner",
      description: "Pomodoro study session planner with productivity scoring.",
      features: ["Pomodoro timer", "Productivity scoring", "Session planning"],
    },
    "prosjekt-planlegger": {
      name: "Project Planner",
      description: "Project planning with a timeline and milestones.",
      features: ["Timeline", "Milestones", "Task breakdown"],
    },
    "gjoremaal-liste": {
      name: "To-Do List",
      description: "Simple to-do list with priority fields.",
      features: ["Priority fields", "Simple overview", "To-do list"],
    },
    handlingsplan: {
      name: "Action Plan",
      description: "Action plan for breaking goals down into concrete steps.",
      features: ["Goal breakdown", "Concrete steps", "Action focus"],
    },
    "maal-planlegger": {
      name: "Goal Planner",
      description: "Goal-setting sheet with actions and deadlines.",
      features: ["Goal setting", "Actions", "Deadlines"],
    },
    "helse-planlegger": {
      name: "Health Planner",
      description: "Health and fitness planner with nutrition goals.",
      features: ["Workout plan", "Nutrition goals", "Health follow-up"],
    },
    hjemmeplanlegger: {
      name: "Home Planner",
      description: "Plan meals, housework and the shopping list for your home.",
      features: ["Meal plan", "Housework", "Shopping list"],
    },
    "reise-planlegger": {
      name: "Travel Planner",
      description: "Plan trips with a budget, packing list and daily itinerary.",
      features: ["Travel budget", "Packing list", "Daily itinerary"],
    },
    "personlig-finans-tracker": {
      name: "Personal Finance Tracker",
      description: "Personal finance overview with income, expenses and savings.",
      features: ["Income", "Expenses", "Savings overview"],
    },
    "vane-tracker": {
      name: "Habit Tracker",
      description: "Monthly habit-tracking grid — build good habits.",
      features: ["Monthly grid", "Flexible categories", "Visual progress"],
    },
    "30-dagers-utfordring": {
      name: "30-Day Challenge",
      description: "30-day challenge tracker for new habits or goals.",
      features: ["30-day tracking", "Habit goals", "Daily check"],
    },
  },
  bundles: {
    komplett: {
      name: "Studentplanlegger Complete",
      description:
        "All 25 planners. Everything you need to stay fully on top of your studies.",
      badge: "Best value",
    },
    "daglig-pakke": {
      name: "Daily Bundle",
      description: "All 5 daily planners in one bundle.",
    },
    "ukentlig-pakke": {
      name: "Weekly Bundle",
      description: "All 5 weekly planners in one bundle.",
    },
    produktivitetspakken: {
      name: "Productivity Bundle",
      description: "All 5 productivity tools in one bundle.",
    },
  },
  categoryLabels: {
    alle: "All",
    daglig: "Daily",
    ukentlig: "Weekly",
    maanedlig: "Monthly",
    aarlig: "Yearly",
    produktivitet: "Productivity",
    helse: "Health & lifestyle",
    sporing: "Tracking",
  },
};
