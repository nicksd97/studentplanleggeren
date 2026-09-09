/**
 * Product-themed scene data: which planner pages float as 3D sheets, and one
 * pose (position / rotation / scale of the notebook and every sheet, plus how
 * far the notebook cover is open) per section, keyed by page progress `p`
 * (0 = top, 1 = bottom). PlannerScene turns these into a scroll-scrubbed GSAP
 * timeline.
 */

export type Vec3 = [number, number, number];
export type Transform = { pos: Vec3; rot: Vec3; scale: number };
export type Devices = { laptop: Transform; tablet: Transform };
/**
 * Where a pose is reached, relative to a landing-page section (`main > section`
 * index) or to an element inside it (`selector`): the point `offset` * height
 * below the element top sits at `anchor` * viewportHeight. Layout-relative keys
 * survive design changes.
 */
export type At = { section: number; offset: number; anchor?: number; selector?: string };
export type Pose = { at: At; notebook: Transform; cover: number; sheets: Transform[]; devices: Devices };

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

/** The first sheets are the ones that come close to the camera (hero) */
export const NEAR_SHEETS = 3;

export function sheetTexture(name: string, large: boolean) {
  return `/images/products/3d/${name}${large ? "-lg" : ""}.webp`;
}
export const LOGO_TEXTURE = "/images/products/3d/logo.webp";

/** A5-ish sheet in world units */
export const SHEET_W = 1.5;
export const SHEET_H = SHEET_W * 1.414;

const t = (pos: Vec3, rot: Vec3, scale: number): Transform => ({ pos, rot, scale });

/** Deterministic small offsets so piles and stacks look hand-placed */
const JITTER = [0.0, 0.07, -0.05, 0.03, -0.08, 0.06, -0.02, 0.04];

/** Sheets slipped inside the notebook: same place, slightly smaller, behind the cover */
export function inside(nb: Transform): Transform[] {
  return Array.from({ length: SHEET_COUNT }, (_, i) =>
    t(
      [nb.pos[0] + 0.02 * i, nb.pos[1] - 0.01 * i, nb.pos[2] - 0.06 - 0.03 * i],
      nb.rot,
      nb.scale * 0.8
    )
  );
}

/** Sheets tucked behind the cover as a slightly fanned bundle */
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
function row(center: Vec3, width: number, count: number, tilt: number, scale = 0.9): Transform[] {
  return Array.from({ length: count }, (_, i) => {
    const f = count === 1 ? 0.5 : i / (count - 1);
    return t(
      [center[0] - width / 2 + f * width, center[1] + JITTER[i] * 0.4, center[2] + Math.abs(f - 0.5) * -0.6],
      [tilt, (0.5 - f) * 0.5, JITTER[i] * 0.3],
      scale
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

/** Devices parked outside the viewport (below by default, above with `above`) at their
 *  section x/z, scale 0, so they rise in from below and leave upwards */
function parked(d: Devices, above = false): Devices {
  const hide = (x: Transform): Transform => t([x.pos[0], above ? 9 : -9, x.pos[2]], x.rot, 0);
  return { laptop: hide(d.laptop), tablet: hide(d.tablet) };
}

const BAND = "[data-devices-band]";

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
 * Poses are keyed to sections (see At); helpers below build the arrangements. `cover` is 1 while the
 * book is open and the pages are out, 0 once they have slid back in.
 * ------------------------------------------------------------------------ */
const D_HERO = t([3.7, -0.6, -2.4], [-0.2, -0.75, 0.12], 0.78);
const D_CATEGORIES = t([6.2, 0.2, -5], [-0.1, -0.5, 0.1], 0.5);
const D_PAIN = t([5.3, 2.3, -4.5], [0, -0.15, 0.05], 0.55);
const D_BUNDLE_HEAD = t([-5.6, -1.4, -5.5], [-0.15, 0.45, -0.05], 0.45);
const D_BUNDLE_PRICE = t([-5.4, -1.6, -5.5], [-0.2, 0.5, -0.06], 0.45);
const D_STEPS = t([-6.8, -5.6, -5], [-0.3, 0.35, -0.05], 0.7);
const D_TESTIMONIALS = t([4.6, -3.7, -4.5], [-0.3, -0.5, 0.05], 0.5);
const D_FAQ = t([-3.6, -1.9, -4.5], [-0.2, 0.5, -0.05], 0.55);
const D_NEWSLETTER = t([-4.6, -3.1, -5], [-0.2, 0.5, -0.05], 0.45);
/** The "alle enheter" band: laptop, tablet, four pages and the notebook lined up in the
 *  open space under the heading. `dy` lifts the whole row so it follows the band as it
 *  scrolls up, instead of sitting still while the cards come up over it. */
function deviceBandDesktop(dy: number) {
  const nb = t([5.3, 0.15 + dy, -3.5], [-0.15, -0.6, 0.1], 0.45);
  return {
    notebook: nb,
    cover: 1,
    sheets: [...row([1.9, 0.1 + dy, -3], 3.4, 4, -0.3, 0.64), ...tucked(nb).slice(4)],
    devices: {
      laptop: t([-4.8, dy, -3.2], [0.12, 0.42, 0], 0.7),
      tablet: t([-1.7, 0.2 + dy, -2.9], [0.06, 0.12, 0.03], 0.66),
    },
  };
}
const D_PARKED = parked(deviceBandDesktop(0).devices);

export const POSES_DESKTOP: Pose[] = [
  {
    at: { section: 0, offset: 0, anchor: 1 },
    notebook: D_HERO,
    cover: 1,
    sheets: [
      t([1.55, 0.55, 0.2], [0.05, -0.35, 0.12], 1),
      t([2.35, 1.45, -0.5], [0.1, -0.45, -0.08], 0.9),
      t([1.15, -1.25, 0.6], [-0.05, -0.3, 0.18], 0.85),
      ...inside(D_HERO).slice(3),
    ],
    devices: D_PARKED,
  },
  // Fungerer på alle enheter: the devices rise into the open band under the heading (band
  // centred on screen), then ride up with it before sinking away for the categories
  { at: { section: 1, selector: BAND, offset: 0.5, anchor: 0.5 }, ...deviceBandDesktop(0) },
  { at: { section: 1, selector: BAND, offset: 0.5, anchor: 0.26 }, ...deviceBandDesktop(2.2) },
  // …and out through the top, so nothing crosses the two cards below
  { at: { section: 1, selector: BAND, offset: 0.5, anchor: 0.04 }, ...deviceBandDesktop(5.0), devices: parked(deviceBandDesktop(0).devices, true) },
  // Hva trenger du: a fan of seven, bottom right, next to the category pills
  { at: { section: 2, offset: 0.5 }, notebook: D_CATEGORIES, cover: 1, sheets: [...fan([3.0, -3.6, -2.5], 2.6, -0.75, 0.75, 7), ...tucked(D_CATEGORIES).slice(7)], devices: D_PARKED },
  // For deg som: the fan drifts back and down, the notebook turns to face you
  { at: { section: 3, offset: 0.5 }, notebook: D_PAIN, cover: 1, sheets: [...fan([2.5, -5.0, -5], 3.2, -0.6, 0.6, 7), ...tucked(D_PAIN).slice(7)], devices: D_PARKED },
  // Komplett heading: a loose pile gathers bottom-left, under the product fan
  { at: { section: 4, offset: 0.15 }, notebook: D_BUNDLE_HEAD, cover: 1, sheets: pile([-3.0, -1.2, -5.5], 0.7, SHEET_COUNT), devices: D_PARKED },
  // Price: everything cascades into one neat stack beside the notebook, away from the price column
  { at: { section: 4, offset: 0.55 }, notebook: D_BUNDLE_PRICE, cover: 1, sheets: stack([-2.8, -1.4, -5.5], SHEET_COUNT, 0.6), devices: D_PARKED },
  // Slik fungerer det: the stack slides into the notebook and the cover closes
  { at: { section: 5, offset: 0.35 }, notebook: D_STEPS, cover: 0, sheets: inside(D_STEPS), devices: D_PARKED },
  // Testimonials: notebook rests small, bottom right
  { at: { section: 6, offset: 0.5 }, notebook: D_TESTIMONIALS, cover: 0, sheets: inside(D_TESTIMONIALS), devices: D_PARKED },
  // FAQ: left column, under the sticky heading
  { at: { section: 7, offset: 0.5 }, notebook: D_FAQ, cover: 0, sheets: inside(D_FAQ), devices: D_PARKED },
  // Newsletter: one page floats up beside the glass panel like a letter
  { at: { section: 8, offset: 0.5 }, notebook: D_NEWSLETTER, cover: 0, sheets: [t([5.4, -0.4, -5], [0.05, -0.25, 0.08], 1), ...inside(D_NEWSLETTER).slice(1)], devices: D_PARKED },
  { at: { section: 8, offset: 1.2 }, notebook: D_NEWSLETTER, cover: 0, sheets: [t([5.2, 1.0, -5.5], [0.05, -0.2, 0.05], 1), ...inside(D_NEWSLETTER).slice(1)], devices: D_PARKED },
];

/* --------------------------------------------------------------------------
 * Phones: four sheets, everything hugs the edges so the copy stays clear.
 * ------------------------------------------------------------------------ */
const M_HERO = t([2.7, 4.6, -4.5], [-0.15, -0.6, 0.1], 0.5);
const M_CATEGORIES = t([3.2, 0.5, -6.5], [-0.1, -0.5, 0.1], 0.4);
const M_BUNDLE = t([3.9, 2.0, -6], [-0.1, -0.4, 0.06], 0.4);
const M_STEPS = t([-2.4, -3.9, -5], [-0.3, 0.4, -0.05], 0.55);
const M_TESTIMONIALS = t([4.1, -4.7, -6], [-0.3, -0.5, 0.05], 0.45);
const M_FAQ = t([-3.4, -2.5, -6.5], [-0.2, 0.5, -0.05], 0.45);
const M_NEWSLETTER = t([-3.4, -3.2, -6.5], [-0.2, 0.5, -0.05], 0.4);
/** Phones: tablet left, two pages and the notebook right; the laptop stays parked (never rendered) */
function deviceBandMobile(dy: number) {
  const nb = t([2.3, -0.9 + dy, -6], [-0.1, -0.5, 0.1], 0.32);
  return {
    notebook: nb,
    cover: 1,
    sheets: [...row([1.9, 0.3 + dy, -5.5], 1.3, 2, -0.3, 0.5), ...tucked(nb).slice(2)],
    devices: {
      laptop: t([-9, -9, -6], [0, 0, 0], 0),
      tablet: t([-0.7, 0.1 + dy, -4.5], [0.05, -0.15, 0.03], 0.78),
    },
  };
}
const M_PARKED = parked(deviceBandMobile(0).devices);

export const POSES_MOBILE: Pose[] = [
  {
    at: { section: 0, offset: 0, anchor: 1 },
    notebook: M_HERO,
    cover: 1,
    sheets: [
      t([1.1, 4.2, -3.6], [0.05, -0.3, 0.14], 0.55),
      t([1.8, 5.2, -4.0], [0.1, -0.4, -0.06], 0.5),
      t([0.4, 5.3, -3.8], [-0.05, -0.25, 0.22], 0.45),
      ...inside(M_HERO).slice(3),
    ],
    devices: M_PARKED,
  },
  { at: { section: 1, selector: BAND, offset: 0.5, anchor: 0.5 }, ...deviceBandMobile(0) },
  { at: { section: 1, selector: BAND, offset: 0.5, anchor: 0.26 }, ...deviceBandMobile(2.2) },
  { at: { section: 1, selector: BAND, offset: 0.5, anchor: 0.04 }, ...deviceBandMobile(5.0), devices: parked(deviceBandMobile(0).devices, true) },
  { at: { section: 2, offset: 0.5 }, notebook: M_CATEGORIES, cover: 1, sheets: [...fan([4.3, -5.0, -5], 2.0, -0.55, 0.35, 4), ...tucked(M_CATEGORIES).slice(4)], devices: M_PARKED },
  { at: { section: 4, offset: 0.55 }, notebook: M_BUNDLE, cover: 1, sheets: stack([3.4, -3.2, -5.5], SHEET_COUNT, 0.6), devices: M_PARKED },
  { at: { section: 5, offset: 0.35 }, notebook: M_STEPS, cover: 0, sheets: inside(M_STEPS), devices: M_PARKED },
  { at: { section: 6, offset: 0.5 }, notebook: M_TESTIMONIALS, cover: 0, sheets: inside(M_TESTIMONIALS), devices: M_PARKED },
  { at: { section: 7, offset: 0.5 }, notebook: M_FAQ, cover: 0, sheets: inside(M_FAQ), devices: M_PARKED },
  { at: { section: 8, offset: 0.5 }, notebook: M_NEWSLETTER, cover: 0, sheets: [t([0.2, 4.3, -7], [0.05, -0.1, 0.06], 0.9), ...inside(M_NEWSLETTER).slice(1)], devices: M_PARKED },
  { at: { section: 8, offset: 1.2 }, notebook: M_NEWSLETTER, cover: 0, sheets: [t([0.2, 5.2, -7.5], [0.05, -0.1, 0.04], 0.9), ...inside(M_NEWSLETTER).slice(1)], devices: M_PARKED },
];
