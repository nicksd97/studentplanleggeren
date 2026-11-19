import GratisPage from "@/components/pages/GratisPage";
import { pageMeta } from "@/lib/site";

const GRATIS_DESCRIPTION =
  "Last ned en gratis fyllbar ukeplan-smakebit. Én side til å prøve formatet — ikke hele produktet. Full ukeplan fra 39 kr.";

export const metadata = pageMeta({
  title: "Gratis ukentlig plan-smakebit — Studentplanlegger",
  description: GRATIS_DESCRIPTION,
  path: "/gratis",
});

export default function Gratis() {
  return <GratisPage locale="nb" />;
}
