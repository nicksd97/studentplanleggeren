import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Checkout — Studentplanlegger",
  description: "Complete your purchase of fillable PDF planners from Studentplanlegger.",
  path: "/kasse",
  index: false,
  locale: "en",
});

export default function KasseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
