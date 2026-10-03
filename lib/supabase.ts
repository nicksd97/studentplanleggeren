import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export function isLoopbackSupabaseHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0";
  } catch {
    return false;
  }
}

function getSupabase(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    );
  }
  return browserClient;
}

function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
    if (isLoopbackSupabaseHost(url)) {
      throw Object.assign(new Error('TypeError: fetch failed'), {
        code: 'ECONNREFUSED',
        details:
          'Caused by: Error: connect ECONNREFUSED loopback (ECONNREFUSED). NEXT_PUBLIC_SUPABASE_URL is a loopback host.',
      });
    }
    adminClient = createClient(url, requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return adminClient;
}

function lazyClient(getClient: () => SupabaseClient): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_target, prop, _receiver) {
      const client = getClient();
      const value = Reflect.get(client, prop, client);
      return typeof value === 'function' ? value.bind(client) : value;
    },
  });
}

// Client-side (public, limited access)
export const supabase = lazyClient(getSupabase);

// Server-side (full access, only use in API routes)
export const supabaseAdmin = lazyClient(getSupabaseAdmin);
