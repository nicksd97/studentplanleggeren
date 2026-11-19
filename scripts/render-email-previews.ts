/**
 * Renders every subscriber email in every language to HTML for review:
 *   <out>/<locale>/lead-magnet.html, welcome-1.html, welcome-2.html, welcome-3.html
 * Welcome templates get a sample BUNDLE_PRICE in the language's usual currency and a dummy
 * unsubscribe URL; the lead magnet gets a dummy download URL. Sends nothing.
 *
 *   npm run render-emails                         # -> /workspace/sp-email-previews
 *   npm run render-emails -- --out=/tmp/previews --screenshots
 *
 * --screenshots also writes <name>.png for each file with headless Chrome/Chromium, if installed.
 * The email image is pointed at public/images/email/smakebit.png so previews work offline.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defaultCurrencyForLocale } from "../lib/currency";
import { LEAD_MAGNET_IMAGE_URL, buildLeadMagnetEmail } from "../lib/emails/lead-magnet";
import { bundlePrice, buildWelcomeSeries } from "../lib/emails/welcome";
import { locales } from "../lib/i18n/config";

const DEFAULT_OUT = "/workspace/sp-email-previews";
const DUMMY_DOWNLOAD = "https://example.supabase.co/storage/v1/object/sign/products/leads/smakebit.pdf?token=preview";
const DUMMY_UNSUBSCRIBE = "https://example.com/unsubscribe?preview=1";
const HEIGHTS: Record<string, number> = { "lead-magnet": 2350, "welcome-1": 760, "welcome-2": 860, "welcome-3": 860 };

function argValue(name: string): string | undefined {
  const prefix = `${name}=`;
  return process.argv.slice(2).find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function findChrome(): string | null {
  for (const bin of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    try {
      execFileSync("which", [bin], { stdio: "ignore" });
      return bin;
    } catch {
      // try the next one
    }
  }
  return null;
}

function main() {
  const out = resolve(argValue("--out") ?? DEFAULT_OUT);
  const screenshots = process.argv.includes("--screenshots");
  const localImage = pathToFileURL(resolve("public/images/email/smakebit.png")).href;
  const written: string[] = [];

  for (const locale of locales) {
    const dir = join(out, locale);
    mkdirSync(dir, { recursive: true });
    const currency = defaultCurrencyForLocale(locale);
    const lead = buildLeadMagnetEmail(DUMMY_DOWNLOAD, { locale, currency });
    const files: Array<[string, string]> = [["lead-magnet", lead.html.split(LEAD_MAGNET_IMAGE_URL).join(localImage)]];
    for (const email of buildWelcomeSeries(locale, {
      bundlePrice: bundlePrice(locale, currency),
      unsubscribeUrl: DUMMY_UNSUBSCRIBE,
    })) {
      files.push([`welcome-${email.step}`, email.html]);
    }
    for (const [name, html] of files) {
      const file = join(dir, `${name}.html`);
      writeFileSync(file, html);
      written.push(file);
    }
  }
  console.log(`Wrote ${written.length} HTML previews to ${out}`);

  if (!screenshots) return;
  const chrome = findChrome();
  if (!chrome) {
    console.error("No Chrome/Chromium found; skipped screenshots.");
    process.exit(1);
  }
  for (const file of written) {
    const png = file.replace(/\.html$/, ".png");
    const name = file.split("/").pop()!.replace(/\.html$/, "");
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--allow-file-access-from-files",
        `--window-size=640,${HEIGHTS[name] ?? 1200}`,
        `--screenshot=${png}`,
        pathToFileURL(file).href,
      ],
      { stdio: "ignore", timeout: 60_000 },
    );
    if (!existsSync(png)) throw new Error(`Screenshot failed: ${png}`);
  }
  console.log(`Wrote ${written.length} PNG screenshots with ${chrome}`);
}

main();
