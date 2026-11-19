import type { Messages } from "./messages/types";

// The /api routes answer in Bokmål and must stay unchanged; other languages translate the
// messages they know (Messages.apiErrors) and fall back to a generic one.

export function translateApiError(
  message: string | undefined | null,
  messages: Messages,
  fallback: string = messages.genericError,
): string {
  if (!message) return fallback;
  if (Object.keys(messages.apiErrors).length === 0) return message;
  return messages.apiErrors[message] ?? fallback;
}
