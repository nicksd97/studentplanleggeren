import HomePage from "@/components/pages/HomePage";
import { pageMeta } from "@/lib/site";

export const metadata = {
  ...pageMeta({
    title: "Studentplanlegger — Få orden på studiene",
    description:
      "25 fyllbare PDF-planleggere for norske studenter. 39 kr per stykk, 5-pakke 99 kr, temapakker 149 kr og komplett pakke 249 kr.",
    path: "/",
  }),
  keywords: [
    "studentplanlegger",
    "planlegger student",
    "ukentlig plan",
    "daglig planlegger",
    "vane tracker",
    "pomodoro planlegger",
    "fyllbar pdf",
    "studieplanlegger",
  ],
};

export default function Home() {
  return <HomePage locale="nb" />;
}
