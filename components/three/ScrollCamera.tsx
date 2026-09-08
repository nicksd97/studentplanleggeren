"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollStore } from "@/lib/scroll-store";
import { sampleKeys, type Keyframe } from "./keyframes";

type CamKey = { pos: number[]; look: number[] };

// Gentle drift and tilt; the shapes do most of the travelling
const CAMERA_KEYS: Keyframe<CamKey>[] = [
  { p: 0.0, pos: [0, 0, 9], look: [0, 0, 0] },
  { p: 0.2, pos: [-0.4, -0.2, 9], look: [0.2, 0, 0] },
  { p: 0.5, pos: [0.3, -0.3, 9.6], look: [0, -0.3, 0] },
  { p: 0.75, pos: [0.2, 0.3, 9.4], look: [0, 0.4, -1] },
  { p: 1.0, pos: [0, 0.6, 10], look: [0, 1, -2] },
];

export default function ScrollCamera({
  animate,
  parallax,
}: {
  animate: boolean;
  parallax: boolean;
}) {
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: PointerEvent) => {
      scrollStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [parallax]);

  useFrame(({ camera }, delta) => {
    if (!animate) return;
    const dt = Math.min(delta, 0.05);
    const k = sampleKeys(CAMERA_KEYS, scrollStore.progress);

    targetPos.current.set(
      k.pos[0] + scrollStore.mouseX * 0.5,
      k.pos[1] - scrollStore.mouseY * 0.3,
      k.pos[2]
    );
    targetLook.current.set(k.look[0], k.look[1], k.look[2]);

    const lambda = 1 - Math.pow(0.001, dt);
    camera.position.lerp(targetPos.current, lambda);
    currentLook.current.lerp(targetLook.current, lambda);
    camera.lookAt(currentLook.current);
  });

  return null;
}
