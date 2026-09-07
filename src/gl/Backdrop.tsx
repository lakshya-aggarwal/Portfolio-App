"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { useScrollSignal } from "@/motion/SmoothScroll";
import { useMediaQuery, useTheme } from "@/lib/media";
import { reliefFragment, reliefVertex } from "@/gl/relief.glsl";

/**
 * L3 - the ambient relief backdrop. A fixed, full-viewport shader behind all
 * page content, warped by scroll velocity.
 *
 * It reads the scroll signal from the same ref the Lenis loop writes, inside
 * useFrame, so it never triggers a React render. Velocity is smoothed again
 * here because the raw Lenis value is spiky enough to make the shear judder.
 *
 * Pointer events are off and it is aria-hidden: this layer is atmosphere, it
 * carries no information.
 */

const PALETTE = {
  dark: {
    ground: "#0b0b0d",
    ridge: "#3a3a4a",
    accent: "#3f5bd6",
    intensity: 1,
  },
  light: {
    ground: "#e8e4dc",
    ridge: "#c6bfad",
    accent: "#3f5bd6",
    // The relief has to be much quieter on paper or it fights the text: light
    // mode has far less contrast headroom above the ground than dark does.
    intensity: 0.38,
  },
} as const;

function Relief({ theme }: { theme: "dark" | "light" }) {
  const signal = useScrollSignal();
  const { size, viewport } = useThree();
  const smoothed = useRef(0);

  // A ref, not useMemo: these objects are mutated every frame by design (that
  // is how three.js uniforms work), and useMemo values are meant to be treated
  // as immutable.
  const uniformsRef = useRef<{
    uTime: { value: number };
    uScroll: { value: number };
    uVelocity: { value: number };
    uResolution: { value: THREE.Vector2 };
    uGround: { value: THREE.Color };
    uRidge: { value: THREE.Color };
    uAccent: { value: THREE.Color };
    uIntensity: { value: number };
  } | null>(null);

  uniformsRef.current ??= {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uVelocity: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uGround: { value: new THREE.Color(PALETTE.dark.ground) },
    uRidge: { value: new THREE.Color(PALETTE.dark.ridge) },
    uAccent: { value: new THREE.Color(PALETTE.dark.accent) },
    uIntensity: { value: 1 },
  };
  const uniforms = uniformsRef.current;

  // Theme is a prop rather than a uniform read: recolouring is rare, so it can
  // afford a render, and this keeps the frame loop free of branching.
  useEffect(() => {
    const p = PALETTE[theme];
    uniforms.uGround.value.set(p.ground);
    uniforms.uRidge.value.set(p.ridge);
    uniforms.uAccent.value.set(p.accent);
    uniforms.uIntensity.value = p.intensity;
  }, [theme, uniforms]);

  useEffect(() => {
    uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr,
    );
  }, [size, viewport.dpr, uniforms]);

  useFrame((_, delta) => {
    const { progress, velocity } = signal.current;
    // Critically-damped-ish follow so the shear eases in and out instead of
    // snapping with every wheel tick.
    smoothed.current += (velocity - smoothed.current) * Math.min(1, delta * 6);
    uniforms.uTime.value += delta;
    uniforms.uScroll.value = progress;
    uniforms.uVelocity.value = smoothed.current;
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        vertexShader={reliefVertex}
        fragmentShader={reliefFragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export default function Backdrop() {
  const [theme] = useTheme();
  // Reduced motion gets the flat token background instead. A slowly breathing
  // relief is exactly the kind of ambient movement people turn this off for.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 print:hidden"
    >
      <Canvas
        // 1.5 rather than 2: this is a full-viewport fragment shader with three
        // fbm taps per pixel, and the extra resolution buys nothing visible.
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Relief theme={theme} />
      </Canvas>
    </div>
  );
}
