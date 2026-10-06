import assert from "node:assert/strict";
import http from "node:http";
import { createClient } from "@supabase/supabase-js";
import { describe, it } from "node:test";
import { createOrderInsertFailure } from "./order-insert-error";
import { createSupabaseOrderStore } from "./order-store";
import { isLoopbackSupabaseHost } from "./supabase";

const pending = {
  email: "probe-checkout-insert@example.com",
  first_name: "Probe",
  last_name: "Test",
  items: [{ id: "daglig-gjennomgang", name: "Daglig Gjennomgang", price: 39, type: "product" as const }],
  amount_nok: 39,
  payment_provider: "vipps",
  payment_id: "ord-probe-pending",
  payment_status: "pending",
  download_token: "download-token-probe",
  token_expires_at: "2026-10-10T12:00:00.000Z",
};

function clientWithSingleResult(result: { data: unknown; error: unknown }) {
  return {
    from() {
      return {
        insert() {
          return {
            select() {
              return {
                async single() {
                  return result;
                },
              };
            },
          };
        },
      };
    },
  };
}

describe("createSupabaseOrderStore insertPending", () => {
  it("wraps an empty PostgREST fetch code as a network insert failure", async () => {
    const store = createSupabaseOrderStore(
      clientWithSingleResult({
        data: null,
        error: {
          code: "",
          message: "TypeError: fetch failed",
          details: "Caused by: Error: getaddrinfo ENOTFOUND example.supabase.co (ENOTFOUND)",
          hint: "",
        },
      }) as never,
    );

    await assert.rejects(
      () => store.insertPending(pending),
      (error: unknown) => {
        const failure = error as ReturnType<typeof createOrderInsertFailure>;
        assert.equal(failure.message, "Kunne ikke opprette ordre");
        assert.equal(failure.code, "ENOTFOUND");
        assert.match(failure.details ?? "", /fetch failed|ENOTFOUND/i);
        return true;
      },
    );
  });

  it("returns a pending catalog order without marking it paid", async () => {
    const store = createSupabaseOrderStore(
      clientWithSingleResult({
        data: {
          id: "order-1",
          ...pending,
        },
        error: null,
      }) as never,
    );

    const order = await store.insertPending(pending);
    assert.equal(order.payment_status, "pending");
    assert.equal(order.payment_provider, "vipps");
    assert.equal(order.amount_nok, 39);
    assert.equal(order.items[0].id, "daglig-gjennomgang");
  });

  it("persists discount_code, list_amount_nok and discount_nok next to UTM on items", async () => {
    const received: Array<{ body: Record<string, unknown> }> = [];
    const server = http.createServer((request, response) => {
      const chunks: Buffer[] = [];
      request.on("data", (chunk) => chunks.push(chunk as Buffer));
      request.on("end", () => {
        if (request.method === "POST" && request.url?.startsWith("/rest/v1/orders")) {
          const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
          received.push({ body });
          response.writeHead(201, { "content-type": "application/json" });
          response.end(JSON.stringify({ id: "order-discount", ...body }));
          return;
        }
        response.writeHead(404);
        response.end();
      });
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const store = createSupabaseOrderStore(
      createClient(`http://127.0.0.1:${address.port}`, "test-anon-key", {
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    );

    try {
      const order = await store.insertPending({
        ...pending,
        amount_nok: 199,
        discount_code: "ABAKUS20",
        list_amount_nok: 249,
        discount_nok: 50,
        items: [
          {
            ...pending.items[0],
            utm_source: "abakus",
            utm_medium: "linjeforening",
            utm_campaign: "komplett",
          },
        ],
      });
      assert.equal(order.discount_code, "ABAKUS20");
      assert.equal(order.list_amount_nok, 249);
      assert.equal(order.discount_nok, 50);
      assert.equal(order.utm_source, "abakus");
      assert.equal(received[0].body.discount_code, "ABAKUS20");
      assert.equal(received[0].body.list_amount_nok, 249);
      assert.equal(received[0].body.discount_nok, 50);
      assert.equal("utm_source" in received[0].body, false);
      assert.equal((received[0].body.items as Array<{ utm_source?: string }>)[0].utm_source, "abakus");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });

  it("stores campaign tags on items and does not send unknown utm columns", async () => {
    const received: Array<{ body: Record<string, unknown> }> = [];
    const server = http.createServer((request, response) => {
      const chunks: Buffer[] = [];
      request.on("data", (chunk) => chunks.push(chunk as Buffer));
      request.on("end", () => {
        if (request.method === "POST" && request.url?.startsWith("/rest/v1/orders")) {
          const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
          received.push({ body });
          response.writeHead(201, { "content-type": "application/json" });
          response.end(JSON.stringify({ id: "order-attr", ...body }));
          return;
        }
        response.writeHead(404);
        response.end();
      });
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const store = createSupabaseOrderStore(
      createClient(`http://127.0.0.1:${address.port}`, "test-anon-key", {
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    );

    try {
      const order = await store.insertPending({
        ...pending,
        items: [
          {
            ...pending.items[0],
            utm_source: "instagram",
            utm_medium: "social",
            utm_campaign: "komplett",
          },
        ],
        utm_source: "instagram",
        utm_medium: "social",
        utm_campaign: "komplett",
      });
      assert.equal(order.utm_source, "instagram");
      assert.equal(order.items[0].utm_source, "instagram");
      assert.equal("utm_source" in received[0].body, false);
      assert.equal((received[0].body.items as Array<{ utm_source?: string }>)[0].utm_source, "instagram");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });

  it("inserts a pending row when PostgREST is reachable", async () => {
    const received: Array<{ method?: string; url?: string; body: typeof pending }> = [];
    const server = http.createServer((request, response) => {
      const chunks: Buffer[] = [];
      request.on("data", (chunk) => chunks.push(chunk as Buffer));
      request.on("end", () => {
        if (request.method === "POST" && request.url?.startsWith("/rest/v1/orders")) {
          const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
          received.push({ method: request.method, url: request.url, body });
          response.writeHead(201, { "content-type": "application/json" });
          response.end(
            JSON.stringify({
              id: "11111111-1111-1111-1111-111111111111",
              ...body,
            }),
          );
          return;
        }
        response.writeHead(404);
        response.end();
      });
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const url = `http://127.0.0.1:${address.port}`;
    const store = createSupabaseOrderStore(
      createClient(url, "test-anon-key", {
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    );

    try {
      const order = await store.insertPending(pending);
      assert.equal(order.payment_status, "pending");
      assert.equal(order.email, pending.email);
      assert.equal(received.length, 1);
      assert.equal(received[0].body.payment_status, "pending");
      assert.notEqual(received[0].body.payment_status, "completed");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});

describe("isLoopbackSupabaseHost", () => {
  it("detects loopback hosts that Vercel cannot reach", () => {
    assert.equal(isLoopbackSupabaseHost("http://127.0.0.1:54321"), true);
    assert.equal(isLoopbackSupabaseHost("http://localhost:54321"), true);
    assert.equal(isLoopbackSupabaseHost("https://example.supabase.co"), false);
  });
});
