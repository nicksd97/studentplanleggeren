import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Takk for kjøpet — Studentplanlegger",
  description: "Last ned planleggerne du har kjøpt hos Studentplanlegger.",
  path: "/takk",
  index: false,
});

export default function TakkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
