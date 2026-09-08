// Generates WebP textures for the landing-page 3D scene from the full-size
// product images. Two tiers: 640px for far sheets and phones, 1280px ("-lg")
// for the sheets nearest the camera on desktop.
// Run once after adding/changing products:  node scripts/generate-3d-textures.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "public/images/products";
const OUT = "public/images/products/3d";
const TIERS = [
  { width: 640, suffix: "", quality: 80 },
  { width: 1280, suffix: "-lg", quality: 82 },
];

const products = [
  "daglig-planlegger",
  "ukentlig-plan",
  "pomodoro-planlegger",
  "vane-tracker",
  "maanedlig-planlegger",
  "aarlig-planlegger",
  "maal-planlegger",
  "gjoremal-liste",
];

await mkdir(OUT, { recursive: true });

for (const name of products) {
  for (const tier of TIERS) {
    const out = path.join(OUT, `${name}${tier.suffix}.webp`);
    const info = await sharp(path.join(SRC, `${name}.jpg`))
      .resize({ width: tier.width })
      .webp({ quality: tier.quality })
      .toFile(out);
    console.log(`${name}${tier.suffix}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
  }
}

// Brand wordmark for the notebook cover as a white alpha mask, so the 3D
// material can tint it gold (the source PNG is dark text on transparency)
const alpha = await sharp("public/images/brand/Studentplanlegger_Text-removebg-preview.png")
  .resize({ width: 1024 })
  .ensureAlpha()
  .extractChannel("alpha")
  .toBuffer();
const { width, height } = await sharp(alpha).metadata();
const logo = await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
  .joinChannel(alpha)
  .webp({ quality: 90 })
  .toFile(path.join(OUT, "logo.webp"));
console.log(`logo.webp ${logo.width}x${logo.height} ${Math.round(logo.size / 1024)}KB (white alpha mask)`);
