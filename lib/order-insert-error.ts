const NETWORK_CODE =
  /\b(ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENETUNREACH|EAI_AGAIN|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET|UNABLE_TO_VERIFY_LEAF_SIGNATURE|CERT_HAS_EXPIRED|ERR_TLS_CERT_ALTNAME_INVALID|ConnectTimeoutError)\b/;

const JWT = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const BEARER = /Bearer\s+\S+/gi;

export type OrderInsertFailure = Error & {
  code?: string;
  details?: string;
  hint?: string;
};

export function sanitizeCheckoutErrorText(text: string): string {
  return text.replace(JWT, "[redacted]").replace(BEARER, "Bearer [redacted]");
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function networkCodeFrom(text: string): string | undefined {
  return text.match(NETWORK_CODE)?.[1];
}

function collectErrorParts(error: unknown): { code?: string; parts: string[]; hint?: string } {
  const parts: string[] = [];
  let code: string | undefined;
  let hint: string | undefined;

  if (error && typeof error === "object") {
    const value = error as {
      code?: unknown;
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      cause?: unknown;
      name?: unknown;
    };
    const rawCode = readString(typeof value.code === "string" ? value.code : undefined);
    if (rawCode) {
      code = rawCode;
    }
    if (readString(typeof value.message === "string" ? value.message : undefined)) {
      parts.push(String(value.message));
    } else if (error instanceof Error && error.message) {
      parts.push(error.message);
    }
    if (readString(typeof value.details === "string" ? value.details : undefined)) {
      parts.push(String(value.details));
    }
    hint = readString(typeof value.hint === "string" ? value.hint : undefined);
    if (value.cause) {
      const nested = collectErrorParts(value.cause);
      parts.push(...nested.parts);
      if (!code && nested.code) {
        code = nested.code;
      }
    }
  } else if (error != null) {
    parts.push(String(error));
  }

  return { code, parts, hint };
}

export function createOrderInsertFailure(error: unknown): OrderInsertFailure {
  const failure = new Error("Kunne ikke opprette ordre") as OrderInsertFailure;
  const collected = collectErrorParts(error);
  const combined = collected.parts.filter(Boolean).join(" | ");
  const code = collected.code || networkCodeFrom(combined);

  if (code) {
    failure.code = code;
  }
  if (combined) {
    failure.details = sanitizeCheckoutErrorText(combined).slice(0, 500);
  }
  if (collected.hint) {
    failure.hint = sanitizeCheckoutErrorText(collected.hint).slice(0, 200);
  }
  return failure;
}

export function insertFailureResult(error: unknown): {
  code?: string;
  details?: string;
} {
  const failure =
    error instanceof Error && error.message === "Kunne ikke opprette ordre"
      ? (error as OrderInsertFailure)
      : createOrderInsertFailure(error);
  return {
    ...(failure.code ? { code: failure.code } : {}),
    ...(failure.details ? { details: failure.details } : {}),
  };
}
