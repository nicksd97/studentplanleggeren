/**
 * Product-themed scene data: which planner pages float as 3D sheets, and the
 * pose (position / rotation / scale) of the notebook and every sheet at a given
 * page progress. Step 1 only defines the hero pose; the scroll timeline adds
 * one pose per section on top of this.
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

export const SHEET_TEXTURES = SHEET_PRODUCTS.map((n) => `/images/products/3d/${n}.webp`);
export const LOGO_TEXTURE = "/images/products/3d/logo.webp";

/** A5-ish sheet in world units */
export const SHEET_W = 1.5;
export const SHEET_H = SHEET_W * 1.414;

const HIDDEN: Transform = { pos: [0, 0, -8], rot: [0, 0, 0], scale: 0 };

/**
 * Hero: closed notebook on the right, three sheets sliding out of it, the rest
 * tucked behind the cover as a slightly fanned bundle.
 */
export const HERO_DESKTOP: Pose = {
  p: 0,
  notebook: { pos: [3.3, -0.3, -1], rot: [-0.12, -0.55, 0.06], scale: 1 },
  sheets: [
    { pos: [1.55, 0.55, 0.2], rot: [0.05, -0.35, 0.12], scale: 1 },
    { pos: [2.35, 1.45, -0.5], rot: [0.1, -0.45, -0.08], scale: 0.9 },
    { pos: [1.15, -1.25, 0.6], rot: [-0.05, -0.3, 0.18], scale: 0.85 },
    ...[0, 1, 2, 3, 4].map((i): Transform => ({
      pos: [3.55 + i * 0.09, -0.15 + i * 0.06, -1.3 - i * 0.07],
      rot: [-0.12, -0.55, 0.06 + i * 0.035],
      scale: 0.95,
    })),
  ],
};

/** Phones: a small bundle peeking in from the top-right corner, three sheets */
export const HERO_MOBILE: Pose = {
  p: 0,
  notebook: { pos: [2.5, 4.4, -4], rot: [-0.1, -0.5, 0.08], scale: 0.6 },
  sheets: [
    { pos: [1.0, 4.1, -3.4], rot: [0.05, -0.3, 0.14], scale: 0.55 },
    { pos: [1.7, 5.1, -3.8], rot: [0.1, -0.4, -0.06], scale: 0.5 },
    { pos: [0.3, 5.2, -3.6], rot: [-0.05, -0.25, 0.22], scale: 0.45 },
    HIDDEN,
    HIDDEN,
    HIDDEN,
    HIDDEN,
    HIDDEN,
  ],
};

export function heroPose(low: boolean): Pose {
  return low ? HERO_MOBILE : HERO_DESKTOP;
}
