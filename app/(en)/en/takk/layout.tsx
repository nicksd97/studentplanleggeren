import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Thank you for your purchase — Studentplanlegger",
  description: "Download the planners you bought from Studentplanlegger.",
  path: "/takk",
  index: false,
  locale: "en",
});

export default function TakkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
