import type { Content } from "./types";

// English page metadata, catalog, FAQ, guides and order email. Reference for the other languages.

export const en: Content = {
  meta: {
    home: {
      title: "Studentplanlegger — Get your studies organised",
      description:
        "25 fillable PDF planners for students. {single} each, 5-pack {fivePack}, theme bundles {theme} and the complete bundle {komplett}.",
      keywords: [
        "student planner",
        "weekly planner",
        "daily planner",
        "habit tracker",
        "pomodoro planner",
        "fillable pdf",
        "study planner",
      ],
    },
    gratis: {
      title: "Free weekly plan sample — Studentplanlegger",
      description:
        "Download a free fillable weekly plan sample. One page to try the format — not the whole product. Full weekly plan from {single}.",
    },
    kasse: {
      title: "Checkout — Studentplanlegger",
      description: "Complete your purchase of fillable PDF planners from Studentplanlegger.",
    },
    takk: {
      title: "Thank you for your purchase — Studentplanlegger",
      description: "Download the planners you bought from Studentplanlegger.",
    },
    notFound: {
      title: "Page not found — Studentplanlegger",
      description:
        "This page doesn't exist. Visit Studentplanlegger to see the fillable PDF planners.",
    },
    ogImageAlt: "Studentplanlegger — 25 fillable PDF planners",
  },
  catalog: {
    alle: {
      title: "All planners — Studentplanlegger",
      description:
        "25 fillable PDF planners for students. {single} each, any five for {fivePack}, or bundles from {theme}.",
      heading: "All planners",
    },
    daglig: {
      title: "Daily planners — Studentplanlegger",
      description:
        "5 daily PDF planners for students. Agenda, schedule, health and productivity — fill them in on screen or print them.",
      heading: "Daily planners",
    },
    ukentlig: {
      title: "Weekly planners — Studentplanlegger",
      description:
        "5 weekly PDF planners for students: weekly plan, to-dos, meal plan and weekly review.",
      heading: "Weekly planners",
    },
    maanedlig: {
      title: "Monthly planners — Studentplanlegger",
      description:
        "Monthly budget, monthly review and monthly planner as fillable PDFs for students.",
      heading: "Monthly planners",
    },
    aarlig: {
      title: "Yearly planner — Studentplanlegger",
      description:
        "Yearly planner with a month-by-month overview and goals for the year. A fillable PDF for students.",
      heading: "Yearly planner",
    },
    produktivitet: {
      title: "Productivity planners — Studentplanlegger",
      description:
        "Pomodoro, project plan, to-do list, action plan and goal planner as fillable PDFs.",
      heading: "Productivity planners",
    },
    helse: {
      title: "Health & lifestyle — Studentplanlegger",
      description:
        "Health planner, home planner and travel planner. Fillable PDFs for students.",
      heading: "Health & lifestyle",
    },
    sporing: {
      title: "Tracking tools — Studentplanlegger",
      description:
        "Habit tracker, finance tracker and 30-day challenge. Fillable PDFs for students.",
      heading: "Tracking tools",
    },
  },
  faqLanguage: {
    question: "What language are the planners in?",
    available:
      "The planners are available in English: the headings and labels inside the PDFs are in English, and you get the English files when you buy on the English site.",
    norwegian:
      "The planners are written in Norwegian (Bokmål). This website is available in English, but the headings and labels inside the PDFs are in Norwegian.",
  },
  faq: [
    {
      question: "What is a fillable PDF?",
      answer:
        "A fillable PDF has interactive fields you can type into directly on your computer, tablet or phone — no printing needed. You can also print it and fill it in by hand if you prefer.",
    },
    {
      question: "Can I print the planners?",
      answer:
        "Absolutely! All the planners are designed for A4 printing with a clean, readable layout. Perfect for your wall or your study space.",
    },
    {
      question: "Do they work on phones and tablets?",
      answer:
        "Yes! Open the PDFs in a PDF reader and fill in the fields directly. We recommend Adobe Acrobat Reader (free) for the best experience.",
    },
    {
      question: "How do I download after buying?",
      answer:
        "You get access to the files right after payment. You are taken to a download page, and you also receive an email with download links that are valid for 7 days.",
    },
    {
      question: "How can I pay?",
      answer:
        "By card (Visa/Mastercard), in your local currency where we support it. If you pay in Norwegian kroner, you can also use Vipps.",
    },
    {
      question: "Is it a subscription?",
      answer:
        "No — you pay once and own the planners forever. No subscription, no hidden costs.",
    },
    {
      question: "What if I'm not happy?",
      answer:
        "Because these are digital products delivered instantly, we don't normally offer refunds. But if you're unhappy, get in touch — we'll find a solution.",
    },
    {
      question: "What's included in the complete bundle?",
      answer:
        "Studentplanlegger Complete contains all 25 planners (daily, weekly, monthly, yearly, productivity, health and tracking), all as fillable PDFs. The bundle costs {komplett}.",
    },
    {
      question: "How much do the planners cost?",
      answer:
        "Each single planner costs {single}. Any five single planners in the cart cost {fivePack}. Theme bundles cost {theme}, and Studentplanlegger Complete costs {komplett}.",
    },
  ],
  fivePack: {
    name: "5-pack",
    description: "Choose any five single planners and pay {fivePack}.",
  },
  email: {
    subject: "Thank you for your purchase! Here is your download link",
    heading: "Thank you for your purchase, {firstName}!",
    intro: "Here is a summary of your order:",
    discount: "Discount {code} (−{percent}%) — −{amount}",
    total: "Total — {amount}",
    downloadIntro: "Download your products using the link below:",
    button: "Download the planners",
    validity:
      "The link is valid for 7 days from the time of purchase. Any questions? Contact us at",
  },
  guides: [
    {
      slug: "planlegg-studiedagen",
      title: "How to plan your study day — Studentplanlegger",
      description:
        "Pick a few priorities, set aside time for reading and breaks, and finish with a short review. A practical method for your study day.",
      heading: "How to plan your study day",
      summary:
        "A long list is rarely a plan. Here's how to choose what happens today and let the rest wait.",
      footerLabel: "Plan your study day",
      catalogKey: "daglig",
      productSlug: "daglig-planlegger",
      productLead:
        "Daily Planner is a fillable PDF sheet with agenda, focus areas and to-dos for {single}. The same category also has Daily Schedule and Daily Review.",
      productCta: "See the daily planners",
      sections: [
        {
          heading: "A long list is rarely a plan",
          paragraphs: [
            "Many study days start with everything you should have done and end with whatever happened to be at the top of the list. What usually works better is choosing a few tasks that will actually get done, and setting aside time for them — breaks included.",
            "You don't need a complicated system. You need an order: what is fixed, what matters today, and what can wait.",
          ],
        },
        {
          heading: "Write down what has to happen, then pick one to three tasks",
          paragraphs: [
            "Start with lectures, deadlines and appointments. Then choose one to three study tasks that get a slot. The rest belongs in a weekly plan or on tomorrow's list.",
            "If everything feels equally important, ask: what gets harder if I put it off until tomorrow? That answer is often today's first session.",
          ],
        },
        {
          heading: "Schedule time, not just tasks",
          paragraphs: [
            "“Read chapter 4” is a wish. “Read chapter 4 between 10 and 11:30” is a plan. You don't need a schedule for the whole day. It's enough to block the two or three sessions that matter most and leave the rest of the day some breathing room.",
            "Plan a half-hour buffer if you can. Then the day can handle a lecture running late without the evening falling apart.",
          ],
        },
        {
          heading: "Finish with three lines",
          paragraphs: [
            "Before you put the books away: what got done, what went badly, and what is the first task tomorrow? It takes a couple of minutes and makes the next morning calmer.",
          ],
        },
      ],
    },
    {
      slug: "ukentlig-studieplan",
      title: "Weekly study plan: an overview before Monday — Studentplanlegger",
      description:
        "Make a weekly plan that fits lectures, reading and free time. Here's how to spread the work so it doesn't pile up before the weekend.",
      heading: "How to make a weekly study plan",
      summary:
        "Look at fixed appointments first, then at the time you really have for the syllabus. That way, everything doesn't end up on Sunday.",
      footerLabel: "Weekly study plan",
      catalogKey: "ukentlig",
      productSlug: "ukentlig-planlegger",
      productLead:
        "Weekly Planner is a simple fillable weekly plan for studies and everyday life, {single}. Weekly Plan has focus areas and daily blocks, and Weekly To-Dos gives you room for tasks on each day.",
      productCta: "See the weekly planners",
      sections: [
        {
          heading: "Days without a weekly plan quickly become random",
          paragraphs: [
            "Monday fills up, Wednesday disappears, and Sunday goes to what you meant to do on Tuesday. A simple overview of the week makes it easier to see where the work actually fits — before the week gets going.",
          ],
        },
        {
          heading: "Fill in the fixed things first",
          paragraphs: [
            "Lectures, seminars, work and appointments you can't move go in before you promise yourself eight hours of reading. What's left is the real time for reading and assignments. It's almost always less than you think.",
          ],
        },
        {
          heading: "Spread out the heavy work",
          paragraphs: [
            "Don't put three heavy reading sessions on the same day as two lectures. Move one session to a quieter day. A weekly plan is useful precisely because it shows clashes before they happen.",
            "It's fine for the days to be different. A weekly plan should describe the week you have, not a week without classes.",
          ],
        },
        {
          heading: "Give free time and housework a place too",
          paragraphs: [
            "Food, exercise and an evening off belong in the overview. If they don't have a place, they take one anyway — just more randomly. A short check on Wednesday or Thursday is enough to move whatever has slipped.",
          ],
        },
      ],
    },
    {
      slug: "pomodoro-til-eksamen",
      title: "Pomodoro when studying for exams — Studentplanlegger",
      description:
        "Short work sessions and fixed breaks make it easier to stay focused on the syllabus. Here's how to set up a study plan you'll actually follow.",
      heading: "How to use Pomodoro when studying for exams",
      summary:
        "Open-ended “all day” sessions often drag. Short blocks with breaks in between are easier to start — and to keep going.",
      footerLabel: "Pomodoro for exams",
      catalogKey: "produktivitet",
      productSlug: "pomodoro-planlegger",
      productLead:
        "Pomodoro Planner is a fillable sheet for planning study sessions and noting your productivity, {single}. It sits alongside the other productivity sheets.",
      productCta: "See Pomodoro Planner",
      sections: [
        {
          heading: "Long, open-ended sessions often drag",
          paragraphs: [
            "When the syllabus piles up, it's tempting to set aside the whole day. Many people notice their focus fading after an hour, and the evening goes to catching up on the morning. Short work blocks with fixed breaks — often called Pomodoro — make getting started less heavy.",
          ],
        },
        {
          heading: "What the method actually is",
          paragraphs: [
            "A common version is 25 minutes of focused work and a 5-minute break. After four sessions like that, you take a longer break. The times can be adjusted. The point isn't the clock, but that the work has a start and an end.",
          ],
        },
        {
          heading: "Give each session one goal",
          paragraphs: [
            "Choose one chapter, one problem set or one set of notes. “Study for the exam” is too vague to start on. When the session ends, tick off what you got done — not what you hoped to get done.",
            "An exam week becomes more manageable if you plan a number of sessions, not a number of hours. Sessions are easier to move if a lecture eats up the morning.",
          ],
        },
        {
          heading: "A break means a break",
          paragraphs: [
            "If the break turns into new email or a new tab, the next session starts more slowly. Get up, fetch some water, or look out of the window. The screen can wait until the next work block.",
          ],
        },
      ],
    },
    {
      slug: "bygg-studievaner",
      title: "How to build study habits that last — Studentplanlegger",
      description:
        "Start with one small habit, make it visible, and mark your progress. That way you avoid starting too big and giving up after a week.",
      heading: "How to build a study habit that lasts",
      summary:
        "One small habit you repeat beats three big plans you drop. Here's how to keep it visible through the month.",
      footerLabel: "Build study habits",
      catalogKey: "sporing",
      productSlug: "vane-tracker",
      productLead:
        "Habit Tracker is a monthly grid with room for your own categories, so you can see your progress, {single}. 30-Day Challenge is a more focused sheet for new habits or goals.",
      productCta: "See Habit Tracker",
      sections: [
        {
          heading: "Big plans fail more often than small habits",
          paragraphs: [
            "“Read for two hours every day” from the first Monday of the semester rarely lasts more than a week. What lasts is usually smaller, visible and easy to repeat — also on days with lectures and poor sleep.",
          ],
        },
        {
          heading: "Pick one habit, and make it almost too small",
          paragraphs: [
            "Don't start exercise, reading, food and sleep all at once. Pick one: for example 20 minutes of reading before lunch, or packing your bag the night before. Once it sticks, you can add the next one.",
            "If two hours is too much on a busy day, ten minutes isn't. A habit you keep on a bad day is worth more than an ambitious plan you drop.",
          ],
        },
        {
          heading: "Mark progress where you can see it",
          paragraphs: [
            "A grid on the fridge, in your notebook or as a fillable PDF makes the habit visible. Empty squares are honest. It's easier to keep a streak going than to start over every Monday.",
          ],
        },
        {
          heading: "One missed day isn't a ruined project",
          paragraphs: [
            "Start again the next day without “catching up” on everything. Punishing yourself with a double session makes it more likely you'll drop the whole habit. Count the days you did it, not the days that were perfect.",
          ],
        },
      ],
    },
  ],
};
