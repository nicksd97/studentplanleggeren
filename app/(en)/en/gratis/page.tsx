import GratisPage from "@/components/pages/GratisPage";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Free weekly plan sample — Studentplanlegger",
  description:
    "Download a free fillable weekly plan sample in Norwegian (Bokmål). One page to try the format — not the whole product. Full weekly plan from NOK 39.",
  path: "/gratis",
  locale: "en",
});

export default function Gratis() {
  return <GratisPage locale="en" />;
}
