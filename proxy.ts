import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, LOCALE_REQUEST_HEADER, localeFromPathname } from "@/lib/i18n/config";
import { LOCALE_VARY, decideLocale } from "@/lib/i18n/detect";

// Sends visitors outside Norway from unprefixed (Bokmål) pages to the /en twin.
// Crawlers and /en/* are never redirected, and every redirect is a 302 that CDNs must not cache.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const decision = decideLocale({
    method: request.method,
    pathname,
    search,
    cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
    userAgent: request.headers.get("user-agent"),
    country: request.headers.get("x-vercel-ip-country"),
    acceptLanguage: request.headers.get("accept-language"),
  });

  if (decision.action === "redirect") {
    const response = NextResponse.redirect(new URL(decision.location, request.url), 302);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", LOCALE_VARY);
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_REQUEST_HEADER, localeFromPathname(pathname));
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (decision.vary) {
    // Next.js sets its own Vary on App Router pages, so this may not survive self-hosted.
    response.headers.append("Vary", LOCALE_VARY);
  }
  return response;
}

export const config = {
  matcher: [
    // Pages only: skip /api, Next internals, metadata files and anything with a file extension.
    // /en/* runs too, but only to tag the language for the 404 page; it is never redirected.
    "/((?!api/|api$|_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[^/]*$).*)",
  ],
};
