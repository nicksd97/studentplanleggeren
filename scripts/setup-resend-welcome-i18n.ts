/**
 * Creates the welcome series in Resend for every language except Bokmål:
 *   - 3 published templates per language (alias studentplanlegger-gratis-e-post-<n>-dag-<d>-<lang>),
 *     rendered from lib/emails/copy/<lang>.ts in the layout of the live Bokmål templates;
 *   - the custom event studentplanlegger.gratis_signup.<lang> (payload locale, currency, bundlePrice);
 *   - one automation per language mirroring «Studentplanlegger gratis – velkomstserie»
 *     (same delays, from and reply-to; BUNDLE_PRICE <- event.bundlePrice), created DISABLED.
 *
 * Dry-run by default: prints the plan and makes no API calls. Pass --apply to write.
 * Optional: --locales=en,de to limit the languages.
 * Idempotent-ish: templates whose alias exists, events that exist and automations with the same
 * name are skipped. The Bokmål automation and templates are never touched.
 *
 *   npm run setup-resend-welcome-i18n                 # dry-run
 *   npm run setup-resend-welcome-i18n -- --apply      # needs RESEND_API_KEY (full access)
 *
 * After --apply: review the automations in Resend, enable them, then set RESEND_WELCOME_LOCALES.
 */
import { Resend } from "resend";
import { prefixedLocales, type PrefixedLocale } from "../lib/i18n/config";
import {
  BUNDLE_PRICE_VARIABLE,
  NB_WELCOME_AUTOMATION_ID,
  WELCOME_FROM,
  WELCOME_REPLY_TO,
  WELCOME_STEPS,
  buildWelcomeSeries,
  welcomeAutomationName,
  welcomeEventName,
  type WelcomeEmail,
} from "../lib/emails/welcome";

type AutomationStep = Parameters<Resend["automations"]["create"]>[0]["steps"][number];
type AutomationConnection = Parameters<Resend["automations"]["create"]>[0]["connections"][number];

const EVENT_SCHEMA = { locale: "string", currency: "string", bundlePrice: "string" } as const;

function argValue(name: string): string | undefined {
  const prefix = `${name}=`;
  return process.argv.slice(2).find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function selectedLocales(): PrefixedLocale[] {
  const value = argValue("--locales");
  if (!value) return [...prefixedLocales];
  const wanted = value.split(",").map((part) => part.trim().toLowerCase());
  const unknown = wanted.filter((lang) => !(prefixedLocales as readonly string[]).includes(lang));
  if (unknown.length) {
    console.error(`Unknown or Bokmål locale(s): ${unknown.join(", ")}. Use any of ${prefixedLocales.join(", ")}.`);
    process.exit(1);
  }
  return prefixedLocales.filter((lang) => wanted.includes(lang));
}

/** Steps and connections for one language, given the three template ids and the delays. */
function automationDefinition(
  locale: PrefixedLocale,
  templates: { id: string; email: WelcomeEmail }[],
  delays: readonly string[],
): { steps: AutomationStep[]; connections: AutomationConnection[] } {
  const steps: AutomationStep[] = [
    { key: "trigger", type: "trigger", config: { eventName: welcomeEventName(locale) } },
  ];
  templates.forEach(({ id, email }, i) => {
    steps.push({ key: `delay_${i + 1}`, type: "delay", config: { duration: delays[i] } });
    const usesPrice = email.variables.some((v) => v.key === BUNDLE_PRICE_VARIABLE);
    steps.push({
      key: `email_${i + 1}`,
      type: "send_email",
      config: {
        template: {
          id,
          ...(usesPrice ? { variables: { [BUNDLE_PRICE_VARIABLE]: { var: "event.bundlePrice" } } } : {}),
        },
        subject: email.subject,
        from: WELCOME_FROM,
        replyTo: WELCOME_REPLY_TO,
      },
    });
  });
  const connections = steps.slice(1).map((step, i) => ({ from: steps[i].key, to: step.key, type: "default" as const }));
  return { steps, connections };
}

function isNotFound(error: unknown): boolean {
  const e = error as { name?: string; statusCode?: number } | null;
  return e?.name === "not_found" || e?.statusCode === 404;
}

function describeError(error: unknown): string {
  const e = error as { name?: string; message?: string } | null;
  return [e?.name, e?.message].filter(Boolean).join(": ") || "unknown error";
}

/** Delay durations of the live Bokmål automation, in order; the defaults if it can't be read. */
async function nbDelays(resend: Resend): Promise<string[]> {
  const fallback = WELCOME_STEPS.map((step) => step.delay);
  const { data, error } = await resend.automations.get(NB_WELCOME_AUTOMATION_ID);
  if (error || !data) {
    console.warn(`Could not read the Bokmål automation (${describeError(error)}); using ${fallback.join(", ")}.`);
    return fallback;
  }
  const delays = data.steps
    .filter((step) => step.type === "delay")
    .map((step) => (step.config as { duration?: unknown }).duration)
    .filter((duration): duration is string => typeof duration === "string");
  if (delays.length !== WELCOME_STEPS.length) {
    console.warn(`Bokmål automation has ${delays.length} delays; using ${fallback.join(", ")}.`);
    return fallback;
  }
  console.log(`Bokmål automation delays: ${delays.join(", ")}`);
  return delays;
}

async function existingAutomationNames(resend: Resend): Promise<Set<string>> {
  const names = new Set<string>();
  let after: string | undefined;
  for (let page = 0; page < 20; page += 1) {
    const { data, error } = await resend.automations.list({ limit: 100, ...(after ? { after } : {}) });
    if (error || !data) throw new Error(`Could not list automations: ${describeError(error)}`);
    for (const automation of data.data) names.add(automation.name);
    if (!data.has_more || data.data.length === 0) break;
    after = data.data[data.data.length - 1].id;
  }
  return names;
}

async function ensureTemplate(resend: Resend, email: WelcomeEmail): Promise<string> {
  const existing = await resend.templates.get(email.alias);
  if (existing.data) {
    console.log(`  = template ${email.alias} exists (${existing.data.id}), skipped`);
    return existing.data.id;
  }
  if (existing.error && !isNotFound(existing.error)) {
    throw new Error(`Could not look up template ${email.alias}: ${describeError(existing.error)}`);
  }
  const created = await resend.templates.create({
    name: email.name,
    alias: email.alias,
    subject: email.subject,
    from: WELCOME_FROM,
    replyTo: WELCOME_REPLY_TO,
    html: email.html,
    text: email.text,
    ...(email.variables.length ? { variables: email.variables } : {}),
  });
  if (created.error || !created.data) {
    throw new Error(`Could not create template ${email.alias}: ${describeError(created.error)}`);
  }
  const published = await resend.templates.publish(created.data.id);
  if (published.error) {
    throw new Error(`Could not publish template ${email.alias}: ${describeError(published.error)}`);
  }
  console.log(`  + template ${email.alias} created and published (${created.data.id})`);
  return created.data.id;
}

async function ensureEvent(resend: Resend, name: string): Promise<void> {
  const existing = await resend.events.get(name);
  if (existing.data) {
    console.log(`  = event ${name} exists, skipped`);
    return;
  }
  if (existing.error && !isNotFound(existing.error)) {
    console.warn(`  ! could not look up event ${name} (${describeError(existing.error)}); continuing`);
    return;
  }
  const created = await resend.events.create({ name, schema: { ...EVENT_SCHEMA } });
  if (created.error) {
    console.warn(`  ! could not create event ${name} (${describeError(created.error)}); continuing`);
    return;
  }
  console.log(`  + event ${name} created`);
}

function printPlan(locales: PrefixedLocale[]) {
  const delays = WELCOME_STEPS.map((step) => step.delay);
  console.log("DRY RUN — no API calls. Pass --apply to create templates, events and automations.\n");
  console.log(`Delays (the --apply run copies them from the Bokmål automation ${NB_WELCOME_AUTOMATION_ID}): ${delays.join(", ")}`);
  console.log(`From: ${WELCOME_FROM}   Reply-to: ${WELCOME_REPLY_TO}\n`);
  for (const locale of locales) {
    const series = buildWelcomeSeries(locale);
    console.log(`[${locale}] automation «${welcomeAutomationName(locale)}» (disabled), trigger ${welcomeEventName(locale)}`);
    for (const email of series) {
      const vars = email.variables.map((v) => `${v.key} (fallback ${JSON.stringify(v.fallbackValue)})`).join(", ");
      console.log(
        `  template ${email.alias}\n    subject: ${email.subject}\n    html ${Buffer.byteLength(email.html)} B, text ${Buffer.byteLength(email.text)} B${vars ? `, variables: ${vars}` : ""}`,
      );
    }
    const definition = automationDefinition(
      locale,
      series.map((email) => ({ id: `<id of ${email.alias}>`, email })),
      delays,
    );
    console.log(`  steps: ${definition.steps.map((s) => `${s.key}(${s.type})`).join(" -> ")}\n`);
  }
}

async function main() {
  const apply = process.argv.slice(2).includes("--apply");
  const locales = selectedLocales();

  if (!apply) {
    printPlan(locales);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    process.exit(1);
  }
  const resend = new Resend(apiKey);
  const delays = await nbDelays(resend);
  const automations = await existingAutomationNames(resend);

  for (const locale of locales) {
    console.log(`[${locale}]`);
    const series = buildWelcomeSeries(locale);
    const templates: { id: string; email: WelcomeEmail }[] = [];
    for (const email of series) {
      templates.push({ id: await ensureTemplate(resend, email), email });
    }
    await ensureEvent(resend, welcomeEventName(locale));

    const name = welcomeAutomationName(locale);
    if (automations.has(name)) {
      console.log(`  = automation «${name}» exists, skipped`);
      continue;
    }
    const { steps, connections } = automationDefinition(locale, templates, delays);
    const created = await resend.automations.create({ name, status: "disabled", steps, connections });
    if (created.error || !created.data) {
      throw new Error(`Could not create automation «${name}»: ${describeError(created.error)}`);
    }
    console.log(`  + automation «${name}» created, disabled (${created.data.id})`);
  }

  console.log("\nDone. Review and enable the automations in Resend, then set RESEND_WELCOME_LOCALES.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Setup failed");
  process.exit(1);
});
