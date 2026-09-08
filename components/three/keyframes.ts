/**
 * Tiny keyframe sampler: `keys` sorted by `p` (0..1). Returns the value at
 * progress `p`, eased between neighbours with smoothstep.
 */
export type Keyframe<T> = { p: number } & T;

function smoothstep(t: number) {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

export function sampleKeys<T extends Record<string, number | number[]>>(
  keys: Keyframe<T>[],
  p: number
): T {
  if (p <= keys[0].p) return strip(keys[0]);
  if (p >= keys[keys.length - 1].p) return strip(keys[keys.length - 1]);

  let i = 0;
  while (keys[i + 1].p < p) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = smoothstep((p - a.p) / (b.p - a.p));

  const out: Record<string, number | number[]> = {};
  for (const k of Object.keys(a)) {
    if (k === "p") continue;
    const va = a[k];
    const vb = b[k];
    out[k] = Array.isArray(va)
      ? va.map((x, j) => x + ((vb as number[])[j] - x) * t)
      : (va as number) + ((vb as number) - (va as number)) * t;
  }
  return out as T;
}

function strip<T extends Record<string, number | number[]>>(k: Keyframe<T>): T {
  const { p: _p, ...rest } = k;
  void _p;
  return rest as unknown as T;
}
