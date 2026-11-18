import NotFoundPage from "@/components/pages/NotFoundPage";

export const metadata = {
  title: "Page not found — Studentplanlegger",
  description:
    "This page doesn't exist. Visit Studentplanlegger to see the fillable PDF planners.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage locale="en" />;
}
