"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { SHEET_H, SHEET_W } from "./poses";

/** Shared, slightly curled paper geometry (edges bend gently backwards) */
function makeSheetGeometry() {
  const g = new THREE.PlaneGeometry(SHEET_W, SHEET_H, 16, 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / (SHEET_W / 2);
    pos.setZ(i, -0.045 * x * x);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

let sharedGeometry: THREE.BufferGeometry | null = null;
function getSheetGeometry() {
  if (!sharedGeometry) sharedGeometry = makeSheetGeometry();
  return sharedGeometry;
}

/**
* One planner page: the product image on the front, plain paper on the back.
 * Rendered at the origin; the parent group carries the pose.
 */
export default function Sheet({ texture }: { texture: THREE.Texture }) {
  const geometry = useMemo(() => getSheetGeometry(), []);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial map={texture} roughness={0.85} metalness={0} />
      </mesh>
      <mesh geometry={geometry} rotation={[0, Math.PI, 0]} scale={[-1, 1, 1]}>
        <meshStandardMaterial color="#F3EEE4" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}
