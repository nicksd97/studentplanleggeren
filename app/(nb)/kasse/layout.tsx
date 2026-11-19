import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Kasse — Studentplanlegger",
  description: "Fullfør kjøpet av fyllbare PDF-planleggere hos Studentplanlegger.",
  path: "/kasse",
  index: false,
});

export default function KasseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
