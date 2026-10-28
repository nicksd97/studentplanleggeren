# AI-søkbarhet (llms.txt, AI-crawlere, JSON-LD)

Date: 2026-10-28
Branch: `feat/ai-searchability`

## Goal

Make the shop easy for search engines and AI assistants to read, cite and recommend, without changing what humans see.

## Crawler policy

There was no earlier AI-bot block policy, so the choice is **allow**, for both training and live retrieval. The shop wants AI answers to recommend it. The paid PDFs are not public, so crawling the site does not give the product away.

`robotsRules()` in `lib/site.ts` keeps the `*` group and adds one explicit group: Googlebot, Bingbot, Google-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, anthropic-ai, PerplexityBot, Perplexity-User, Applebot and Applebot-Extended. A bot that matches a named group ignores `*`, so that group repeats the same disallows (`/kasse`, `/takk`, `/api/`). To block a bot later, give it its own group with `disallow: "/"`.

## Tasks

- [x] `public/llms.txt`: what the shop is, prices, indexable pages, guides, how to cite, contact
- [x] `public/llms-full.txt`: all 25 planners, bundles and guide summaries (no full guide text)
- [x] `app/robots.ts` → `robotsRules()` with the explicit AI/search crawler group
- [x] `<link rel="alternate" type="text/plain" href="/llms.txt">` on every page via `pageMeta()`
- [x] Product JSON-LD: `brand`, `sku`, `category`, `offers.seller` → the Organization. No ratings, reviews or invented prices.
- [x] Tests in `lib/seo.test.ts`: bots allowed, Googlebot not blocked, disallows kept, llms files list every page, match catalog prices and contain every product and guide

## Notes

- The llms files are static. If prices, products or guides change, update them. `npm test` fails if they drift from `lib/products.ts` / `lib/guides.ts`.
- `npm test` needs Node ≥ 22.6 (`--experimental-strip-types`).
