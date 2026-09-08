"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

const COVER_W = 2.15;
const COVER_H = 2.95;
const COVER_T = 0.07;
const RING_COUNT = 14;
/** Spine x position: the left edge of the covers */
const SPINE_X = 0.05 - COVER_W / 2;

/**
 * A spiral-bound planner built from primitives: cream page block, two rounded
 * covers in dark bronze, gold rings along the spine and the wordmark as a
 * softly glowing gold decal. The front cover hangs on a pivot at the spine
 * (`coverRef`) so the parent can swing it open. Rendered at the origin; the
 * parent group carries the pose.
 */
export default function Notebook({
  logo,
  low,
  coverRef,
}: {
  logo: THREE.Texture;
  low: boolean;
  coverRef: RefObject<THREE.Group | null>;
}) {
  const rings = useRef<THREE.InstancedMesh>(null);

  // Lay the rings out along the spine, wrapping around it
  useLayoutEffect(() => {
    const mesh = rings.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const s = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < RING_COUNT; i++) {
      const y = -COVER_H / 2 + 0.28 + (i * (COVER_H - 0.56)) / (RING_COUNT - 1);
      m.compose(new THREE.Vector3(SPINE_X - 0.07, y, 0), q, s);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  const segments = low ? 2 : 4;

  return (
    <group>
      {/* Page block */}
      <mesh position={[0.06, 0, 0]}>
        <boxGeometry args={[COVER_W - 0.12, COVER_H - 0.1, 0.3]} />
        <meshStandardMaterial color="#EFE7DA" roughness={0.95} />
      </mesh>

      {/* Back cover */}
      <RoundedBox args={[COVER_W, COVER_H, COVER_T]} radius={0.05} smoothness={segments} position={[0.05, 0, -0.19]}>
        <meshStandardMaterial color="#4A382A" roughness={0.42} metalness={0.2} />
      </RoundedBox>

      {/* Front cover on a spine pivot; rotation.y swings it open */}
      <group ref={coverRef} position={[SPINE_X, 0, 0.19]}>
        <RoundedBox args={[COVER_W, COVER_H, COVER_T]} radius={0.05} smoothness={segments} position={[COVER_W / 2, 0, 0]}>
          <meshStandardMaterial color="#4A382A" roughness={0.42} metalness={0.2} />
        </RoundedBox>
        {/* Wordmark decal, gold with a soft glow so it reads on the dark cover */}
        <mesh position={[COVER_W / 2 + 0.07, 0.15, COVER_T / 2 + 0.003]}>
          <planeGeometry args={[1.45, (1.45 * 256) / 974]} />
          <meshStandardMaterial
            map={logo}
            transparent
            color="#E6CC9C"
            emissive="#C4A882"
            emissiveMap={logo}
            emissiveIntensity={0.7}
            roughness={0.35}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Spiral rings */}
      <instancedMesh ref={rings} args={[undefined, undefined, RING_COUNT]}>
        <torusGeometry args={[0.14, 0.022, 8, low ? 16 : 28]} />
        <meshStandardMaterial color="#D8B98A" roughness={0.28} metalness={0.9} />
      </instancedMesh>
    </group>
  );
}
