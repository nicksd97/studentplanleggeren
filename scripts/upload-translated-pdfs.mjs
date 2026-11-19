#!/usr/bin/env node
// Upload translated planner PDFs and free samples to Supabase Storage (bucket `products`).
// Paid PDFs are never committed; they live in the git-ignored assets/source/i18n/<lang>/.
//
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-translated-pdfs.mjs [--dry-run]
//
// Layout (see lib/downloads.ts):
//   assets/source/i18n/<lang>/<slug>.pdf                 -> planners/<lang>/<slug>.pdf
//   assets/lead-magnet/<lang>/gratis-ukentlig-plan-smakebit.pdf -> leads/<lang>/gratis-ukentlig-plan-smakebit.pdf
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const LANGS = ["en", "de", "sv", "da", "es", "fr"];
const dryRun = process.argv.includes("--dry-run");
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!dryRun && (!url || !key)) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or use --dry-run).");
  process.exit(1);
}
const supabase = dryRun ? null : createClient(url, key, { auth: { persistSession: false } });

const jobs = [];
for (const lang of LANGS) {
  const dir = join("assets/source/i18n", lang);
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".pdf"))) {
      jobs.push([join(dir, f), `planners/${lang}/${f}`]);
    }
  }
  const sample = join("assets/lead-magnet", lang, "gratis-ukentlig-plan-smakebit.pdf");
  if (existsSync(sample)) jobs.push([sample, `leads/${lang}/gratis-ukentlig-plan-smakebit.pdf`]);
}

let failed = 0;
for (const [local, remote] of jobs) {
  if (dryRun) {
    console.log(`would upload ${local} -> products/${remote}`);
    continue;
  }
  const { error } = await supabase.storage
    .from("products")
    .upload(remote, readFileSync(local), { contentType: "application/pdf", upsert: true });
  if (error) {
    failed++;
    console.error(`FAILED ${remote}: ${error.message}`);
  } else {
    console.log(`uploaded products/${remote}`);
  }
}
console.log(`${jobs.length - failed}/${jobs.length} files ${dryRun ? "planned" : "uploaded"}`);
process.exit(failed ? 1 : 0);
