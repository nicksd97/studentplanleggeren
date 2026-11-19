// Shared building blocks for the subscriber emails: brand colours, font stack, escaping.

export const C = {
  page: "#f7f3f0",
  card: "#fffffe",
  soft: "#f7f3f0",
  text: "#3a3330",
  muted: "#6f625b",
  accent: "#d4a593",
  deep: "#9c5a43",
  line: "#eae1da",
  onDeep: "#fffffe",
};

export const FONT = "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** A formatted price for HTML: escaped, and never broken across lines ("39&nbsp;kr"). */
export function htmlPrice(price: string): string {
  return escapeHtml(price).replace(/[  ]/g, "&nbsp;");
}

/** Replaces {key} placeholders. Unknown keys are left as they are. */
export function fillPlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** Copy that may contain <em> -> plain text. */
export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}
