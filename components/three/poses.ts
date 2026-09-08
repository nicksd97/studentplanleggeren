/**
 * Product-themed scene data: which planner pages float as 3D sheets, and one
 * pose (position / rotation / scale of the notebook and every sheet) per
 * section, keyed by page progress `p` (0 = top, 1 = bottom). PlannerScene
 * turns these into a scroll-scrubbed GSAP timeline.
 */

export type Vec3 = [number, number, number];
export type Transform = { pos: Vec3; rot: Vec3; scale: number };
export type Pose = { p: number; notebook: Transform; sheets: Transform[] };

/** Product images used as sheet textures (see scripts/generate-3d-textures.mjs) */
export const SHEET_PRODUCTS = [
  "daglig-planlegger",
  "ukentlig-plan",
  "pomodoro-planlegger",
  "vane-tracker",
  "maanedlig-planlegger",
  "aarlig-planlegger",
  "maal-planlegger",
  "gjoremal-liste",
];
export const SHEET_COUNT = SHEET_PRODUCTS.length;

export const SHEET_TEXTURES = SHEET_PRODUCTS.map((n) => `/images/products/3d/${n}.webp`);
export const LOGO_TEXTURE = "/images/products/3d/logo.webp";

/** A5-ish sheet in world units */
export const SHEET_W = 1.5;
export const SHEET_H = SHEET_W * 1.414;

const t = (pos: Vec3, rot: Vec3, scale: number): Transform => ({ pos, rot, scale });

/** Deterministic small offsets so piles and stacks look hand-placed */
const JITTER = [0.0, 0.07, -0.05, 0.03, -0.08, 0.06, -0.02, 0.04];

/** Sheets slipped inside the notebook: same place, slightly smaller, behind the cover */
function inside(nb: Transform): Transform[] {
  return Array.from({ length: SHEET_COUNT }, (_, i) =>
    t(
      [nb.pos[0] + 0.02 * i, nb.pos[1] - 0.01 * i, nb.pos[2] - 0.06 - 0.03 * i],
      nb.rot,
      nb.scale * 0.8
    )
  );
}

/** Sheets tucked behind the cover as a slightly fanned bundle (hero) */
function tucked(nb: Transform): Transform[] {
  return Array.from({ length: SHEET_COUNT }, (_, i) =>
    t(
      [nb.pos[0] + 0.25 + 0.07 * i, nb.pos[1] + 0.12 + 0.05 * i, nb.pos[2] - 0.3 - 0.06 * i],
      [nb.rot[0], nb.rot[1], nb.rot[2] + 0.035 * i],
      nb.scale * 0.95
    )
  );
}

/** A row of `count` sheets tilted back like screens on a desk */
function row(center: Vec3, width: number, count: number, tilt: number): Transform[] {
  return Array.from({ length: count }, (_, i) => {
    const f = count === 1 ? 0.5 : i / (count - 1);
    return t(
      [center[0] - width / 2 + f * width, center[1] + JITTER[i] * 0.6, center[2] + Math.abs(f - 0.5) * -0.6],
      [tilt, (0.5 - f) * 0.5, JITTER[i] * 0.4],
      0.9
    );
  });
}

/** `count` sheets fanned around a pivot like a hand of cards */
function fan(pivot: Vec3, radius: number, from: number, to: number, count: number): Transform[] {
  return Array.from({ length: count }, (_, i) => {
    const f = count === 1 ? 0.5 : i / (count - 1);
    const a = from + f * (to - from);
    return t(
      [pivot[0] + Math.sin(a) * radius, pivot[1] + Math.cos(a) * radius, pivot[2] + i * 0.04],
      [0.05, 0, -a],
      0.9
    );
  });
}

/** A neat stack with tiny offsets */
function stack(center: Vec3, count: number, scale: number): Transform[] {
  return Array.from({ length: count }, (_, i) =>
    t(
      [center[0] + JITTER[i] * 0.3, center[1] + JITTER[(i + 3) % 8] * 0.3, center[2] + i * 0.035],
      [0.08, -0.12, JITTER[i] * 0.5],
      scale
    )
  );
}

/** A loose pile around a point */
function pile(center: Vec3, spread: number, count: number): Transform[] {
  return Array.from({ length: count }, (_, i) =>
    t(
      [
        center[0] + JITTER[i] * spread * 4,
        center[1] + JITTER[(i + 2) % 8] * spread * 3,
        center[2] + JITTER[(i + 5) % 8] * spread * 2,
      ],
      [JITTER[(i + 1) % 8] * 2, JITTER[(i + 4) % 8] * 2, JITTER[i] * 3],
      0.85
    )
  );
}

/* --------------------------------------------------------------------------
 * Desktop: sheets lead, the notebook stays small and further back.
 * p values follow the section order in app/page.tsx.
 * ------------------------------------------------------------------------ */
const D_HERO = t([3.7, -0.6, -2.4], [-0.2, -0.75, 0.12], 0.78);
const D_DEVICES = t([5.6, 1.6, -4.5], [-0.15, -0.6, 0.1], 0.55);
const D_CATEGORIES = t([6.2, 0.2, -5], [-0.1, -0.5, 0.1], 0.5);
const D_PAIN = t([5.3, 2.3, -4.5], [0, -0.15, 0.05], 0.55);
const D_BUNDLE_HEAD = t([-5.6, -1.4, -5.5], [-0.15, 0.45, -0.05], 0.45);
const D_BUNDLE_PRICE = t([-5.4, -1.6, -5.5], [-0.2, 0.5, -0.06], 0.45);
const D_STEPS = t([-6.8, -5.6, -5], [-0.3, 0.35, -0.05], 0.7);
const D_TESTIMONIALS = t([4.6, -3.7, -4.5], [-0.3, -0.5, 0.05], 0.5);
const D_FAQ = t([-3.6, -1.9, -4.5], [-0.2, 0.5, -0.05], 0.55);
const D_NEWSLETTER = t([-4.6, -3.1, -5], [-0.2, 0.5, -0.05], 0.45);

export const POSES_DESKTOP: Pose[] = [
  {
    p: 0,
    notebook: D_HERO,
    sheets: [
      t([1.55, 0.55, 0.2], [0.05, -0.35, 0.12], 1),
      t([2.35, 1.45, -0.5], [0.1, -0.45, -0.08], 0.9),
      t([1.15, -1.25, 0.6], [-0.05, -0.3, 0.18], 0.85),
      ...tucked(D_HERO).slice(3),
    ],
  },
  // Fungerer på alle enheter: six pages in a row under the device cards
  { p: 0.16, notebook: D_DEVICES, sheets: [...row([0, -3.1, -3], 9, 6, -0.35), ...tucked(D_DEVICES).slice(6)] },
  // Hva trenger du: a fan of seven, bottom right, next to the category pills
  { p: 0.29, notebook: D_CATEGORIES, sheets: [...fan([3.0, -3.6, -2.5], 2.6, -0.75, 0.75, 7), ...tucked(D_CATEGORIES).slice(7)] },
  // For deg som: the fan drifts back and down, the notebook turns to face you
  { p: 0.37, notebook: D_PAIN, sheets: [...fan([2.5, -5.0, -5], 3.2, -0.6, 0.6, 7), ...tucked(D_PAIN).slice(7)] },
  // Komplett heading: a loose pile gathers bottom-left, under the product fan
  { p: 0.46, notebook: D_BUNDLE_HEAD, sheets: pile([-3.0, -1.2, -5.5], 0.7, SHEET_COUNT) },
  // Price: everything cascades into one neat stack beside the notebook, away from the price column
  { p: 0.52, notebook: D_BUNDLE_PRICE, sheets: stack([-2.8, -1.4, -5.5], SHEET_COUNT, 0.6) },
  // Slik fungerer det: the stack slides straight down into the notebook, bottom-left
  { p: 0.6, notebook: D_STEPS, sheets: inside(D_STEPS) },
  // Testimonials: notebook rests small, bottom right
  { p: 0.72, notebook: D_TESTIMONIALS, sheets: inside(D_TESTIMONIALS) },
  // FAQ: left column, under the sticky heading
  { p: 0.83, notebook: D_FAQ, sheets: inside(D_FAQ) },
  // Newsletter: one page floats up behind the glass panel like a letter
  { p: 0.94, notebook: D_NEWSLETTER, sheets: [t([5.4, -0.4, -5], [0.05, -0.25, 0.08], 1), ...inside(D_NEWSLETTER).slice(1)] },
  { p: 1, notebook: D_NEWSLETTER, sheets: [t([5.2, 1.0, -5.5], [0.05, -0.2, 0.05], 1), ...inside(D_NEWSLETTER).slice(1)] },
];

/* --------------------------------------------------------------------------
 * Phones: four sheets, everything hugs the edges so the copy stays clear.
 * ------------------------------------------------------------------------ */
const M_HERO = t([2.7, 4.6, -4.5], [-0.15, -0.6, 0.1], 0.5);
const M_DEVICES = t([3.0, 4.2, -6], [-0.1, -0.5, 0.1], 0.4);
const M_CATEGORIES = t([3.2, 0.5, -6.5], [-0.1, -0.5, 0.1], 0.4);
const M_BUNDLE = t([3.9, 2.0, -6], [-0.1, -0.4, 0.06], 0.4);
const M_STEPS = t([-2.4, -3.9, -5], [-0.3, 0.4, -0.05], 0.55);
const M_TESTIMONIALS = t([4.1, -4.7, -6], [-0.3, -0.5, 0.05], 0.45);
const M_FAQ = t([-3.4, -2.5, -6.5], [-0.2, 0.5, -0.05], 0.45);
const M_NEWSLETTER = t([-3.4, -3.2, -6.5], [-0.2, 0.5, -0.05], 0.4);

export const POSES_MOBILE: Pose[] = [
  {
    p: 0,
    notebook: M_HERO,
    sheets: [
      t([1.1, 4.2, -3.6], [0.05, -0.3, 0.14], 0.55),
      t([1.8, 5.2, -4.0], [0.1, -0.4, -0.06], 0.5),
      t([0.4, 5.3, -3.8], [-0.05, -0.25, 0.22], 0.45),
      ...tucked(M_HERO).slice(3),
    ],
  },
  { p: 0.15, notebook: M_DEVICES, sheets: [...row([0.2, -4.4, -5], 5.2, 4, -0.35), ...tucked(M_DEVICES).slice(4)] },
  { p: 0.33, notebook: M_CATEGORIES, sheets: [...fan([4.3, -5.0, -5], 2.0, -0.55, 0.35, 4), ...tucked(M_CATEGORIES).slice(4)] },
  { p: 0.5, notebook: M_BUNDLE, sheets: stack([3.4, -3.2, -5.5], SHEET_COUNT, 0.6) },
  { p: 0.63, notebook: M_STEPS, sheets: inside(M_STEPS) },
  { p: 0.75, notebook: M_TESTIMONIALS, sheets: inside(M_TESTIMONIALS) },
  { p: 0.88, notebook: M_FAQ, sheets: inside(M_FAQ) },
  { p: 0.96, notebook: M_NEWSLETTER, sheets: [t([0.2, 4.3, -7], [0.05, -0.1, 0.06], 0.9), ...inside(M_NEWSLETTER).slice(1)] },
  { p: 1, notebook: M_NEWSLETTER, sheets: [t([0.2, 5.2, -7.5], [0.05, -0.1, 0.04], 0.9), ...inside(M_NEWSLETTER).slice(1)] },
];
