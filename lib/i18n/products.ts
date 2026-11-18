import type { Locale } from "./config";
import type { Bundle, Product } from "../products";

// English copy for the catalog in lib/products.ts. Ids, prices and files are unchanged;
// cart items keep their Bokmål name so orders look the same whatever the page language.

export const IN_NORWEGIAN = "In Norwegian (Bokmål).";

type ProductCopy = { name: string; description: string; features: string[] };

const productsEn: Record<string, ProductCopy> = {
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
};

const bundlesEn: Record<string, { name: string; description: string; badge?: string }> = {
  komplett: {
    name: "Studentplanlegger Complete",
    description:
      "All 25 planners. Everything you need to stay fully on top of your studies. The planners are in Norwegian (Bokmål).",
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
};

const categoryLabelsEn: Record<string, string> = {
  alle: "All",
  daglig: "Daily",
  ukentlig: "Weekly",
  maanedlig: "Monthly",
  aarlig: "Yearly",
  produktivitet: "Productivity",
  helse: "Health & lifestyle",
  sporing: "Tracking",
};

export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale === "nb") return product;
  const copy = productsEn[product.id];
  if (!copy) return product;
  return {
    ...product,
    name: copy.name,
    description: `${copy.description} ${IN_NORWEGIAN}`,
    features: copy.features,
    categoryLabel: categoryLabelsEn[product.category] ?? product.categoryLabel,
  };
}

export function localizeBundle(bundle: Bundle, locale: Locale): Bundle {
  if (locale === "nb") return bundle;
  const copy = bundlesEn[bundle.id];
  if (!copy) return bundle;
  return { ...bundle, name: copy.name, description: copy.description, badge: copy.badge ?? bundle.badge };
}

export function categoryLabel(key: string, fallback: string, locale: Locale): string {
  if (locale === "nb") return fallback;
  return categoryLabelsEn[key] ?? fallback;
}

/** Display name for a cart or order line; the stored name stays Bokmål. */
export function itemDisplayName(item: { id: string; name: string }, locale: Locale): string {
  if (locale === "nb") return item.name;
  return productsEn[item.id]?.name ?? bundlesEn[item.id]?.name ?? item.name;
}
