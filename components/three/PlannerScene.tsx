"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import Notebook from "./Notebook";
import Sheet from "./Sheet";
import {
  LOGO_TEXTURE,
  POSES_DESKTOP,
  POSES_MOBILE,
  SHEET_COUNT,
  SHEET_TEXTURES,
  type Transform,
} from "./poses";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

useTexture.preload(SHEET_TEXTURES);
useTexture.preload(LOGO_TEXTURE);

function asColorTexture(t: THREE.Texture | THREE.Texture[]) {
  for (const tex of Array.isArray(t) ? t : [t]) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }
}

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
 * textured with real product pages. Poses per section come from poses.ts and
 * are played by a scroll-scrubbed GSAP timeline (lagged, eased, sheets
 * staggered) so nothing ever snaps. `notebook` toggles the notebook.
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
  const textures = useTexture(SHEET_TEXTURES, asColorTexture);
  const logo = useTexture(LOGO_TEXTURE, asColorTexture);

  // Textures are decoded once we get here (useTexture suspends until then)
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const poses = low ? POSES_MOBILE : POSES_DESKTOP;
  const sheetCount = low ? 4 : SHEET_COUNT;

  // Current transforms, mutated by GSAP and read every frame
  const [live] = useState(() => ({
    notebook: toLive(poses[0].notebook),
    sheets: poses[0].sheets.map(toLive),
  }));
  const notebookRef = useRef<THREE.Group>(null);
  const sheetRefs = useRef<(THREE.Group | null)[]>([]);

  useGSAP(
    () => {
      if (!animate) return;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2, // ~1s of lag so the scene glides after the scroll
        },
      });
      // Timeline time == page progress. Each segment eases from one pose to the
      // next; the notebook leads and the sheets follow in a short stagger.
      for (let k = 1; k < poses.length; k++) {
        const from = poses[k - 1];
        const to = poses[k];
        const dur = to.p - from.p;
        tl.to(live.notebook, { ...toLive(to.notebook), duration: dur * 0.85 }, from.p);
        for (let i = 0; i < sheetCount; i++) {
          tl.to(live.sheets[i], { ...toLive(to.sheets[i]), duration: dur * 0.6 }, from.p + i * dur * 0.05);
        }
      }
    },
    { dependencies: [animate, poses, sheetCount, live] }
  );

  useFrame(() => {
    apply(notebookRef.current, live.notebook);
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
            <Notebook logo={logo} low={low} />
          </group>
        </Float>
      )}

      {textures.slice(0, sheetCount).map((texture, i) => (
        <Float
          key={SHEET_TEXTURES[i]}
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
