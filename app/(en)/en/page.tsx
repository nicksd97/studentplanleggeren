import HomePage from "@/components/pages/HomePage";
import { pageMeta } from "@/lib/site";

export const metadata = {
  ...pageMeta({
    title: "Studentplanlegger — Get your studies organised",
    description:
      "25 fillable PDF planners for students, in Norwegian (Bokmål). NOK 39 each, 5-pack NOK 99, theme bundles NOK 149 and the complete bundle NOK 249.",
    path: "/",
    locale: "en",
  }),
  keywords: [
    "student planner",
    "norwegian student planner",
    "weekly planner",
    "daily planner",
    "habit tracker",
    "pomodoro planner",
    "fillable pdf",
    "study planner",
  ],
};

export default function Home() {
  return <HomePage locale="en" />;
}
