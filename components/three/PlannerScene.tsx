"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import { scrollStore } from "@/lib/scroll-store";
import Notebook from "./Notebook";
import Sheet from "./Sheet";
import {
  LOGO_TEXTURE,
  NEAR_SHEETS,
  POSES_DESKTOP,
  POSES_MOBILE,
  SHEET_COUNT,
  SHEET_PRODUCTS,
  inside,
  sheetTexture,
  type Transform,
} from "./poses";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/** How far the front cover swings open (radians about the spine) */
const COVER_OPEN_ANGLE = -2.8;

/** Flat, tweenable copy of a Transform (GSAP animates plain numbers) */
type Live = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number };
const toLive = (t: Transform): Live => ({
  x: t.pos[0], y: t.pos[1], z: t.pos[2], rx: t.rot[0], ry: t.rot[1], rz: t.rot[2], s: t.scale,
});

function apply(group: THREE.Object3D | null, l: Live) {
  if (!group) return;
  group.position.set(l.x, l.y, l.z);
  group.rotation.set(l.rx, l.ry, l.rz);
  group.scale.setScalar(l.s);
}

/**
 * The product scene: a spiral planner notebook and floating planner sheets
 * textured with real product pages.
 * - On load the notebook opens its cover and the first pages slide out (~1.4s).
 * - Then a scroll-scrubbed GSAP timeline (lagged, eased, sheets staggered)
 *   plays one pose per section from poses.ts, so nothing ever snaps.
 * `notebook` toggles the notebook.
 */
export default function PlannerScene({
  low,
  animate,
  notebook,
  onReady,
}: {
  low: boolean;
  animate: boolean;
  notebook: boolean;
  onReady?: () => void;
}) {
  const gl = useThree((s) => s.gl);
  const poses = low ? POSES_MOBILE : POSES_DESKTOP;
  const sheetCount = low ? 4 : SHEET_COUNT;

  // Sheets nearest the camera get the 1280px tier on desktop; phones stay at 640px
  const urls = useMemo(
    () => SHEET_PRODUCTS.slice(0, sheetCount).map((n, i) => sheetTexture(n, !low && i < NEAR_SHEETS)),
    [low, sheetCount]
  );
  const maxAniso = Math.min(gl.capabilities.getMaxAnisotropy(), low ? 4 : 8);
  const configure = (t: THREE.Texture | THREE.Texture[]) => {
    for (const tex of Array.isArray(t) ? t : [t]) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = maxAniso;
      tex.needsUpdate = true;
    }
  };
  const textures = useTexture(urls, configure);
  const logo = useTexture(LOGO_TEXTURE, configure);

  // Textures are decoded once we get here (useTexture suspends until then)
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Current transforms, mutated by GSAP and read every frame
  const [live] = useState(() => ({
    notebook: toLive(poses[0].notebook),
    cover: { open: poses[0].cover },
    sheets: poses[0].sheets.map(toLive),
  }));
  const notebookRef = useRef<THREE.Group>(null);
  const coverRef = useRef<THREE.Group>(null);
  const sheetRefs = useRef<(THREE.Group | null)[]>([]);

  useGSAP(
    () => {
      if (!animate) return;

      // Scroll choreography: timeline time == page progress. Each segment eases
      // from one pose to the next; the notebook leads and the sheets follow in a
      // short stagger. Built after the entrance so the two never fight.
      const buildScrollTimeline = () => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2, // ~1s of lag so the scene glides after the scroll
          },
        });
        for (let k = 1; k < poses.length; k++) {
          const from = poses[k - 1];
          const to = poses[k];
          const dur = to.p - from.p;
          tl.to(live.notebook, { ...toLive(to.notebook), duration: dur * 0.85 }, from.p);
          tl.to(live.cover, { open: to.cover, duration: dur * 0.6 }, from.p);
          for (let i = 0; i < sheetCount; i++) {
            tl.to(live.sheets[i], { ...toLive(to.sheets[i]), duration: dur * 0.6 }, from.p + i * dur * 0.05);
          }
        }
      };

      // Entrance: closed book, cover opens, the first pages slide out. Skipped
      // when the page loads already scrolled (refresh mid-page, hash links).
      const scrolledAway = scrollStore.progress > 0.02 || window.scrollY > 40;
      if (scrolledAway) {
        buildScrollTimeline();
        return;
      }
      const hero = poses[0];
      const start = inside(hero.notebook);
      gsap.set(live.cover, { open: 0 });
      for (let i = 0; i < NEAR_SHEETS; i++) gsap.set(live.sheets[i], toLive(start[i]));

      const entrance = gsap.timeline({ onComplete: buildScrollTimeline });
      entrance.to(live.cover, { open: 1, duration: 0.6, ease: "power2.out" }, 0.1);
      for (let i = 0; i < NEAR_SHEETS; i++) {
        entrance.to(
          live.sheets[i],
          { ...toLive(hero.sheets[i]), duration: 0.8, ease: "power3.out" },
          0.35 + i * 0.12
        );
      }
    },
    { dependencies: [animate, poses, sheetCount, live] }
  );

  useFrame(() => {
    apply(notebookRef.current, live.notebook);
    if (coverRef.current) coverRef.current.rotation.y = COVER_OPEN_ANGLE * live.cover.open;
    for (let i = 0; i < sheetCount; i++) apply(sheetRefs.current[i], live.sheets[i]);
  });

  return (
    <>
      <ambientLight intensity={0.55} color="#fff3e2" />
      <directionalLight position={[4, 6, 7]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-6, 3, -4]} intensity={1.8} color="#C4A882" />
      <pointLight position={[2, -3, 3]} intensity={14} distance={14} color="#C4A882" />

      {notebook && (
        <Float enabled={animate} speed={1} rotationIntensity={0.12} floatIntensity={0.4}>
          <group ref={notebookRef}>
            <Notebook logo={logo} low={low} coverRef={coverRef} />
          </group>
        </Float>
      )}

      {textures.map((texture, i) => (
        <Float
          key={urls[i]}
          enabled={animate}
          speed={1.1 + i * 0.13}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <group
            ref={(el) => {
              sheetRefs.current[i] = el;
            }}
          >
            <Sheet texture={texture} />
          </group>
        </Float>
      ))}
    </>
  );
}
