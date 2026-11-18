import type { Guide } from "../guides";

// English versions of the guides in lib/guides.ts — same slugs, products and categories.

export const guidesEn: Guide[] = [
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
      "Daily Planner is a fillable PDF sheet with agenda, focus areas and to-dos for NOK 39. The same category also has Daily Schedule and Daily Review. The planners are in Norwegian (Bokmål).",
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
      "Weekly Planner is a simple fillable weekly plan for studies and everyday life, NOK 39. Weekly Plan has focus areas and daily blocks, and Weekly To-Dos gives you room for tasks on each day. The planners are in Norwegian (Bokmål).",
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
      "Pomodoro Planner is a fillable sheet for planning study sessions and noting your productivity, NOK 39. It sits alongside the other productivity sheets. The planners are in Norwegian (Bokmål).",
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
      "Habit Tracker is a monthly grid with room for your own categories, so you can see your progress, NOK 39. 30-Day Challenge is a more focused sheet for new habits or goals. The planners are in Norwegian (Bokmål).",
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
];
