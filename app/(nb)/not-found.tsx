import NotFoundPage from "@/components/pages/NotFoundPage";

export const metadata = {
  title: "Siden finnes ikke — Studentplanlegger",
  description:
    "Denne siden finnes ikke. Gå til Studentplanlegger for å se de fyllbare PDF-planleggerne.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage locale="nb" />;
}
