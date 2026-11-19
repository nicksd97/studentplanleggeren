import NotFoundContent from "@/components/pages/NotFoundContent";

// notFound() inside a language route. URLs that match no route use app/global-not-found.tsx.
export const metadata = {
  title: "404 — Studentplanlegger",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}
