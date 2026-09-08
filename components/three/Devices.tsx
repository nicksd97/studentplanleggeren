"use client";

import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

/**
 * Code-built devices showing planner pages on their screens, for the
 * "Fungerer på alle enheter" section. Both render at the origin; the parent
 * group carries the pose. Sizes are in the same world units as the notebook
 * (its cover is 2.15 x 2.95).
 */

/** Product page shown like a PDF in a viewer: light screen, page centred */
function ScreenContent({
  texture,
  width,
  height,
  z,
  pagePortion = 0.92,
}: {
  texture: THREE.Texture;
  width: number;
  height: number;
  z: number;
  pagePortion?: number;
}) {
  const pageH = height * pagePortion;
  const pageW = pageH / 1.414;
  return (
    <group position={[0, 0, z]}>
      {/* screen background (viewer chrome) */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#EFEBE4" roughness={0.6} emissive="#EFEBE4" emissiveIntensity={0.25} />
      </mesh>
      {/* the planner page, lit like a display */}
      <mesh position={[0, -height * 0.01, 0.002]}>
        <planeGeometry args={[pageW, pageH]} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
    </group>
  );
}

const TABLET_W = 2.0;
const TABLET_H = 2.8;
const TABLET_T = 0.06;

/** Portrait tablet: rounded space-grey body, black bezel, page on screen */
export function Tablet({ texture, low }: { texture: THREE.Texture; low: boolean }) {
  return (
    <group>
      <RoundedBox args={[TABLET_W, TABLET_H, TABLET_T]} radius={0.11} smoothness={low ? 2 : 4}>
        <meshStandardMaterial color="#2E2E32" roughness={0.38} metalness={0.55} />
      </RoundedBox>
      {/* bezel */}
      <mesh position={[0, 0, TABLET_T / 2 + 0.001]}>
        <planeGeometry args={[TABLET_W - 0.14, TABLET_H - 0.14]} />
        <meshStandardMaterial color="#0B0B0D" roughness={0.3} metalness={0.2} />
      </mesh>
      <ScreenContent texture={texture} width={TABLET_W - 0.28} height={TABLET_H - 0.28} z={TABLET_T / 2 + 0.003} pagePortion={0.94} />
      {/* front camera */}
      <mesh position={[0, TABLET_H / 2 - 0.1, TABLET_T / 2 + 0.002]}>
        <circleGeometry args={[0.02, 12]} />
        <meshStandardMaterial color="#1A1D24" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

const LAPTOP_W = 3.6;
const LAPTOP_D = 2.4;
const LAPTOP_T = 0.1;
const LID_H = 2.3;
const LID_T = 0.05;

/** Laptop: silver base with keyboard and trackpad, lid open ~110°, page on screen */
export function Laptop({ texture, low }: { texture: THREE.Texture; low: boolean }) {
  const smooth = low ? 2 : 4;
  return (
    <group>
      {/* base */}
      <RoundedBox args={[LAPTOP_W, LAPTOP_T, LAPTOP_D]} radius={0.04} smoothness={smooth}>
        <meshStandardMaterial color="#C9CBD0" roughness={0.35} metalness={0.7} />
      </RoundedBox>
      {/* keyboard well */}
      <mesh position={[0, LAPTOP_T / 2 + 0.001, -0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LAPTOP_W - 0.5, 1.15]} />
        <meshStandardMaterial color="#2B2C30" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* trackpad */}
      <mesh position={[0, LAPTOP_T / 2 + 0.001, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial color="#B9BBC0" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* lid on a hinge at the back edge, tilted back ~20° from vertical */}
      <group position={[0, LAPTOP_T / 2, -LAPTOP_D / 2 + 0.06]} rotation={[0.35, 0, 0]}>
        <RoundedBox args={[LAPTOP_W, LID_H, LID_T]} radius={0.04} smoothness={smooth} position={[0, LID_H / 2, 0]}>
          <meshStandardMaterial color="#C9CBD0" roughness={0.35} metalness={0.7} />
        </RoundedBox>
        {/* bezel */}
        <mesh position={[0, LID_H / 2, LID_T / 2 + 0.001]}>
          <planeGeometry args={[LAPTOP_W - 0.16, LID_H - 0.16]} />
          <meshStandardMaterial color="#0B0B0D" roughness={0.3} metalness={0.2} />
        </mesh>
        <group position={[0, LID_H / 2, 0]}>
          <ScreenContent texture={texture} width={LAPTOP_W - 0.3} height={LID_H - 0.3} z={LID_T / 2 + 0.003} pagePortion={0.9} />
        </group>
      </group>
    </group>
  );
}
