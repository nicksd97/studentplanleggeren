"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Float, useTexture } from "@react-three/drei";
import Notebook from "./Notebook";
import Sheet from "./Sheet";
import { LOGO_TEXTURE, SHEET_TEXTURES, heroPose } from "./poses";

useTexture.preload(SHEET_TEXTURES);
useTexture.preload(LOGO_TEXTURE);

function asColorTexture(t: THREE.Texture | THREE.Texture[]) {
  for (const tex of Array.isArray(t) ? t : [t]) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }
}

/**
 * The product scene: a spiral planner notebook and floating planner sheets
 * textured with real product pages. `notebook` toggles the notebook so the
 * sheets can be judged on their own.
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

  const pose = heroPose(low);
  const sheetCount = low ? 4 : textures.length;

  return (
    <>
      <ambientLight intensity={0.55} color="#fff3e2" />
      <directionalLight position={[4, 6, 7]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-6, 3, -4]} intensity={1.8} color="#C4A882" />
      <pointLight position={[2, -3, 3]} intensity={14} distance={14} color="#C4A882" />

      {notebook && (
        <Float enabled={animate} speed={1} rotationIntensity={0.15} floatIntensity={0.5}>
          <Notebook logo={logo} transform={pose.notebook} low={low} />
        </Float>
      )}

      {textures.slice(0, sheetCount).map((texture, i) => (
        <Float
          key={SHEET_TEXTURES[i]}
          enabled={animate}
          speed={1.1 + i * 0.13}
          rotationIntensity={0.25}
          floatIntensity={0.6}
        >
          <Sheet texture={texture} transform={pose.sheets[i]} />
        </Float>
      ))}
    </>
  );
}
