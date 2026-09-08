"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { scrollStore } from "@/lib/scroll-store";
import { particleVertex, particleFragment } from "./shaders";

const BOUNDS = { x: 16, yMin: -14, yMax: 8, zMin: -12, zMax: 3 };

/** Small seeded PRNG (mulberry32) so the field is identical on every render */
function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGeometry(count: number) {
  const rand = seededRandom(20260908);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() * 2 - 1) * BOUNDS.x;
    positions[i * 3 + 1] = BOUNDS.yMin + rand() * (BOUNDS.yMax - BOUNDS.yMin);
    positions[i * 3 + 2] = BOUNDS.zMin + rand() * (BOUNDS.zMax - BOUNDS.zMin);
    sizes[i] = 0.4 + Math.pow(rand(), 3) * 1.6;
    seeds[i] = rand();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return g;
}

export default function Particles({
  count,
  animate,
}: {
  count: number;
  animate: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => buildGeometry(count), [count]);
  const gl = useThree((s) => s.gl);

  // Point size depends on the pixel ratio; set it once so the static
  // (reduced-motion) scene is right even though useFrame never runs
  useLayoutEffect(() => {
    if (material.current) material.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
  }, [gl]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 2.2 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color("#E8D5B5") },
      uOpacity: { value: 0.9 },
    }),
    []
  );

  useFrame((state, delta) => {
    const m = material.current;
    const pts = points.current;
    if (!animate || !m || !pts) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    // Dim while text-heavy sections are in view, brighten again at the end
    const p = scrollStore.progress;
    m.uniforms.uOpacity.value = 0.9 - 0.45 * Math.sin(Math.min(p * 2.2, 1) * Math.PI);
    pts.rotation.y += delta * 0.015;
    pts.position.y = -p * 4;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
