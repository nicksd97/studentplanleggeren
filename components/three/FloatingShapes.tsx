"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { scrollStore } from "@/lib/scroll-store";
import { sampleKeys, type Keyframe } from "./keyframes";
import { shapeVertex, shapeFragment } from "./shaders";

type Layout = { offset: number[]; spread: number; ring: number; glow: number };

// Where the cluster sits and how it is arranged as the page scrolls
const DESKTOP_KEYS: Keyframe<Layout>[] = [
  { p: 0.0, offset: [3.6, -0.2, -1.2], spread: 0, ring: 0, glow: 0.9 },
  { p: 0.15, offset: [-2.2, -0.8, -1], spread: 0.35, ring: 0, glow: 0.7 },
  { p: 0.35, offset: [0, -0.8, -3.5], spread: 1, ring: 0, glow: 0.5 },
  { p: 0.55, offset: [0, -1.4, -1.5], spread: 0.2, ring: 1, glow: 1.1 },
  { p: 0.75, offset: [0, 4.5, -4], spread: 0.6, ring: 0, glow: 0.6 },
  { p: 1.0, offset: [0, 8, -6], spread: 0.8, ring: 0, glow: 0.4 },
];

// Phones: the cluster peeks in from the edges so the copy stays legible
const MOBILE_KEYS: Keyframe<Layout>[] = [
  { p: 0.0, offset: [2.3, 4.2, -3], spread: 0, ring: 0, glow: 0.9 },
  { p: 0.15, offset: [-2.6, -1, -4], spread: 0.3, ring: 0, glow: 0.7 },
  { p: 0.35, offset: [2.6, 0, -6], spread: 0.9, ring: 0, glow: 0.5 },
  { p: 0.55, offset: [0, -1.5, -5], spread: 0.2, ring: 1, glow: 1.0 },
  { p: 0.75, offset: [0, 5, -6], spread: 0.6, ring: 0, glow: 0.6 },
  { p: 1.0, offset: [0, 8, -8], spread: 0.8, ring: 0, glow: 0.4 },
];

type ShapeDef = {
  kind: "knot" | "ico" | "ring" | "octa" | "sphere";
  radius: number;
  cluster: [number, number, number];
  wire?: boolean;
};

const SHAPES: ShapeDef[] = [
  { kind: "knot", radius: 1.05, cluster: [0, 0, 0] },
  { kind: "ico", radius: 0.8, cluster: [2.2, 1.4, -1.5], wire: true },
  { kind: "ring", radius: 1.7, cluster: [-0.3, -0.2, -0.6] },
  { kind: "octa", radius: 0.5, cluster: [-2.4, 1.2, -1] },
  { kind: "ico", radius: 0.45, cluster: [-1.8, -1.8, 0.5] },
  { kind: "sphere", radius: 0.35, cluster: [2.6, -1.3, 0.8] },
];

function makeGeometry(def: ShapeDef, low: boolean): THREE.BufferGeometry {
  switch (def.kind) {
    case "knot":
      return new THREE.TorusKnotGeometry(def.radius, 0.3, low ? 80 : 160, low ? 12 : 24);
    case "ico":
      return new THREE.IcosahedronGeometry(def.radius, low ? 1 : 2);
    case "ring":
      return new THREE.TorusGeometry(def.radius, 0.06, 12, low ? 48 : 96);
    case "octa":
      return new THREE.OctahedronGeometry(def.radius, 0);
    case "sphere":
      return new THREE.SphereGeometry(def.radius, low ? 16 : 32, low ? 12 : 24);
  }
}

export default function FloatingShapes({
  low,
  animate,
}: {
  low: boolean;
  animate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const firstMesh = useRef<THREE.Mesh>(null);
  const holders = useRef<(THREE.Object3D | null)[]>([]);
  const target = useRef(new THREE.Vector3());
  const time = useRef(0);

  const defs = useMemo(() => (low ? SHAPES.slice(0, 3) : SHAPES), [low]);
  const keys = low ? MOBILE_KEYS : DESKTOP_KEYS;

  // One shared material for every shape; uniforms are mutated through firstMesh
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: shapeVertex,
        fragmentShader: shapeFragment,
        uniforms: {
          uTime: { value: 0 },
          uWobble: { value: low ? 0 : 0.04 },
          uGlow: { value: 0.9 },
          uColorA: { value: new THREE.Color("#F0D9AE") },
          uColorB: { value: new THREE.Color("#C4A882") },
          uColorC: { value: new THREE.Color("#2A1F16") },
        },
      }),
    [low]
  );

  const wireMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#C4A882"),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    []
  );

  const geometries = useMemo(() => defs.map((d) => makeGeometry(d, low)), [defs, low]);

  // Ring layout used around the bundle section: shapes on a tilted circle
  const ringPositions = useMemo(() => {
    const n = defs.length;
    return defs.map((_, i) => {
      const a = (i / n) * Math.PI * 2;
      return [Math.cos(a) * 3.2, Math.sin(a) * 0.9, Math.sin(a) * 1.6] as const;
    });
  }, [defs]);

  useFrame((_, delta) => {
    if (!animate) return;
    const dt = Math.min(delta, 0.05);
    time.current += dt;

    const p = scrollStore.progress;
    const layout = sampleKeys(keys, p);

    const shared = firstMesh.current?.material as THREE.ShaderMaterial | undefined;
    if (shared) {
      shared.uniforms.uTime.value = time.current;
      shared.uniforms.uGlow.value = layout.glow;
    }

    const t = target.current;
    const g = group.current;
    if (g) {
      // Damp the whole cluster toward its keyframe position
      t.set(layout.offset[0], layout.offset[1], layout.offset[2]);
      g.position.lerp(t, 1 - Math.pow(0.001, dt));
      g.rotation.y += dt * 0.08;
    }

    const lambda = 1 - Math.pow(0.002, dt);
    defs.forEach((def, i) => {
      const holder = holders.current[i];
      if (!holder) return;
      const c = def.cluster;
      const s = 1 + layout.spread * 1.6;
      const r = ringPositions[i];
      const w = layout.ring;
      t.set(
        c[0] * s * (1 - w) + r[0] * w,
        c[1] * s * (1 - w) + r[1] * w,
        c[2] * s * (1 - w) + r[2] * w
      );
      holder.position.lerp(t, lambda);
      holder.rotation.x += dt * (0.15 + i * 0.05);
      holder.rotation.z += dt * 0.1;
    });
  });

  return (
    <group
      ref={group}
      position={[keys[0].offset[0], keys[0].offset[1], keys[0].offset[2]]}
      scale={low ? 0.6 : 0.85}
    >
      {defs.map((def, i) => (
        <Float
          key={i}
          enabled={animate}
          speed={1.2 + i * 0.2}
          rotationIntensity={0.4}
          floatIntensity={0.8}
        >
          <group
            ref={(el) => {
              holders.current[i] = el;
            }}
            position={def.cluster}
          >
            <mesh
              ref={i === 0 ? firstMesh : undefined}
              geometry={geometries[i]}
              material={material}
            />
            {def.wire && !low && (
              <mesh geometry={geometries[i]} material={wireMaterial} scale={1.25} />
            )}
          </group>
        </Float>
      ))}
    </group>
  );
}
