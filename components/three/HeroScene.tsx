"use client";

import { Component, Suspense, useCallback, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { detectTier } from "./useDeviceTier";
import Particles from "./Particles";
import PlannerScene from "./PlannerScene";
import ScrollCamera from "./ScrollCamera";

/** Flip to false to judge the floating sheets without the notebook */
const SHOW_NOTEBOOK = true;

/** If a texture fails to load, drop the scene instead of taking the page down */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Fixed full-viewport WebGL backdrop for the landing page.
 * Loaded client-side only (see LandingShell). Renders nothing without WebGL
 * or after a lost context, leaving the CSS background in place.
 */
export default function HeroScene() {
  const [tier] = useState(detectTier);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

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
          antialias: !tier.low,
          alpha: true,
          stencil: false,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 45, near: 0.1, far: 60, position: [0, 0, 9] }}
        frameloop={animate ? "always" : "demand"}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setLost(true);
          });
        }}
      >
        <Particles count={tier.low ? 500 : 1800} animate={animate} />
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <PlannerScene low={tier.low} animate={animate} notebook={SHOW_NOTEBOOK} onReady={onReady} />
          </Suspense>
        </SceneErrorBoundary>
        <ScrollCamera animate={animate} parallax={!tier.low && !tier.coarse} />
      </Canvas>
    </div>
  );
}
