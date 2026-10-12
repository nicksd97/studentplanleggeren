/**
 * Manual import of existing Resend segment contacts into Supabase `leads`.
 * Not part of build, test or deploy. Default is dry-run; pass --apply to write.
 *
 * Records source gratis-ukeplan and campaign gratis-sample only.
 * Does not enroll anyone in the welcome series.
 */
import { Resend } from "resend";
import {
  contactsFromListPage,
  createSupabaseLeadStore,
  importResendContact,
  leadFromResendContact,
} from "../lib/leads";

const PAGE_SIZE = 100;

function flag(name: string): boolean {
  return process.argv.slice(2).includes(name);
}

async function main() {
  const apply = flag("--apply");
  const segmentId = process.env.RESEND_LEAD_SEGMENT_ID;
  const apiKey = process.env.RESEND_API_KEY;
  if (!segmentId || !apiKey) {
    console.error("Resend is not configured for this script.");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const store = apply ? createSupabaseLeadStore() : null;

  let after: string | undefined;
  let fetched = 0;
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  do {
    const { data, error } = await resend.contacts.list({
      segmentId,
      limit: PAGE_SIZE,
      ...(after ? { after } : {}),
    });
    if (error) {
      console.error("Could not list segment contacts.");
      process.exit(1);
    }

    const page = contactsFromListPage(data);
    fetched += page.contacts.length;

    for (const contact of page.contacts) {
      try {
        if (!apply) {
          if (leadFromResendContact(contact)) {
            imported += 1;
          } else {
            skipped += 1;
          }
          continue;
        }
        if (!store) {
          continue;
        }
        const result = await importResendContact(store, contact);
        if (result === "imported") {
          imported += 1;
        } else {
          skipped += 1;
        }
      } catch {
        errors += 1;
      }
    }

    after = page.hasMore ? page.nextAfter : undefined;
  } while (after);

  const mode = apply ? "Applied" : "Dry-run";
  console.log(
    `${mode}: ${fetched} contacts, ${imported} imported, ${skipped} skipped, ${errors} errors.`,
  );
  if (!apply) {
    console.log("Re-run with --apply to write rows. Welcome series is not started.");
  }
}

main().catch(() => {
  console.error("Backfill failed.");
  process.exit(1);
});
