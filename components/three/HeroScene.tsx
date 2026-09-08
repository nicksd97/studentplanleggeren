"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { detectTier } from "./useDeviceTier";
import Particles from "./Particles";
import FloatingShapes from "./FloatingShapes";
import ScrollCamera from "./ScrollCamera";

/**
 * Fixed full-viewport WebGL backdrop for the landing page.
 * Loaded client-side only (see LandingShell). Renders nothing without WebGL
 * or after a lost context, leaving the CSS background in place.
 */
export default function HeroScene() {
  const [tier] = useState(detectTier);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);

  if (!tier.webgl || lost) return null;

  const animate = !tier.reducedMotion;

  return (
    <div
      aria-hidden="true"
      // Fixed backdrop normally; under reduced motion the scene is static, so it
      // scrolls away with the hero instead of sitting behind every section.
      className={`${animate ? "fixed" : "absolute"} left-0 right-0 top-0 z-0 pointer-events-none transition-opacity duration-1000`}
      style={{ height: "100lvh", opacity: ready ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, tier.low ? 1.25 : 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          stencil: false,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 45, near: 0.1, far: 60, position: [0, 0, 9] }}
        frameloop={animate ? "always" : "demand"}
        flat
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setLost(true);
          });
          setReady(true);
        }}
      >
        <Particles count={tier.low ? 600 : 2500} animate={animate} />
        <FloatingShapes low={tier.low} animate={animate} />
        <ScrollCamera animate={animate} parallax={!tier.low && !tier.coarse} />
      </Canvas>
    </div>
  );
}
