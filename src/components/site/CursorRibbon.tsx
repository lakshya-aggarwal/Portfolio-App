"use client";

import { useEffect, useRef } from "react";

/**
 * An interactive WebGL ribbon that trails the cursor, rendered on a fixed,
 * pointer-events-none overlay across the whole site.
 *
 * This is a deliberate, documented exception to the "no WebGL" rule in
 * CLAUDE.md / docs/design.md - see the "Cursor ribbon" note there. To keep the
 * cost contained:
 *   - OGL (~50KB, zero deps) is dynamically imported *inside* the effect, so it
 *     is code-split out of the initial bundle and never loaded on the server.
 *   - It only initializes on a fine-pointer, hover-capable device with motion
 *     allowed - touch/mobile and prefers-reduced-motion visitors get nothing and
 *     never download OGL.
 *
 * The ribbon is an OGL Polyline: ~30 points that lag toward the cursor, rebuilt
 * into a ribbon mesh each frame. A custom fragment shader gives it a neon core
 * (bright centre feathering to transparent edges) and a tail that dissolves. Its
 * colour is read from the live --sem-accent token and follows the theme toggle.
 */
export function CursorRibbon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only a hover-capable, fine-pointer device with motion allowed gets the
    // effect (and, via the early return, ever downloads OGL).
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let raf = 0;
    let disposed = false;
    let cleanup = () => {};

    const accentHex = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--sem-accent")
        .trim() || "#0047ab";

    (async () => {
      const { Renderer, Color, Polyline, Vec3 } = await import("ogl");
      if (disposed) return;

      const renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      // Screen-space vertex shader: the points are already in clip space
      // (-1..1), so we do NOT use camera matrices (we render without a camera).
      // Aspect-corrected miter + pixel thickness, adapted from OGL's Polyline
      // default with the modelView/projection multiply removed.
      const vertex = /* glsl */ `
        precision highp float;
        attribute vec3 position;
        attribute vec3 next;
        attribute vec3 prev;
        attribute vec2 uv;
        attribute float side;
        uniform vec2 uResolution;
        uniform float uDPR;
        uniform float uThickness;
        uniform float uMiter;
        varying vec2 vUv;
        vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 currentScreen = current.xy * aspect;
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 dir1 = normalize(currentScreen - prevScreen);
          vec2 dir2 = normalize(nextScreen - currentScreen);
          vec2 dir = normalize(dir1 + dir2);
          vec2 normal = vec2(-dir.y, dir.x);
          normal /= mix(1.0, max(0.3, dot(normal, vec2(-dir1.y, dir1.x))), uMiter);
          normal /= aspect;
          float pixelWidth = 1.0 / (uResolution.y / uDPR);
          normal *= pixelWidth * uThickness;
          current.xy -= normal * side;
          return current;
        }
        void main() {
          vUv = uv;
          gl_Position = getPosition();
        }
      `;

      // Bright core -> feathered edges across the width (vUv.x), dissolving tail
      // along the length (vUv.y, 0 = head at the cursor). Core lifts toward white
      // for the hot neon centre.
      const fragment = /* glsl */ `
        precision highp float;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
          float glow = smoothstep(0.0, 1.0, edge);
          float taper = 1.0 - vUv.y;
          float alpha = glow * taper;
          vec3 col = mix(uColor, vec3(1.0), pow(edge, 4.0) * 0.5);
          gl_FragColor = vec4(col, alpha);
        }
      `;

      const count = 30;
      const points = Array.from({ length: count }, () => new Vec3());

      const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(accentHex()) },
          uThickness: { value: 22 },
        },
      });
      // Alpha blend so the neon reads on both the light and dark canvas.
      polyline.program.transparent = true;
      polyline.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        polyline.resize();
      };
      resize();
      window.addEventListener("resize", resize);

      // Cursor target in clip space (-1..1, y up). Seed off-screen; the first
      // pointer move snaps every point to the cursor so no line whips in from 0,0.
      const mouse = new Vec3(-2, -2, 0);
      let seeded = false;
      const onMove = (e: PointerEvent) => {
        mouse.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          (e.clientY / window.innerHeight) * -2 + 1,
          0,
        );
        if (!seeded) {
          seeded = true;
          for (const p of points) p.copy(mouse);
        }
      };
      window.addEventListener("pointermove", onMove);

      // Keep the ribbon colour in sync with the theme toggle.
      const themeObserver = new MutationObserver(() => {
        polyline.program.uniforms.uColor.value.set(accentHex());
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      const update = () => {
        raf = requestAnimationFrame(update);
        // High -> low so each point reads its predecessor's *previous* position,
        // producing the trailing lag. Head chases the cursor.
        for (let i = points.length - 1; i >= 0; i--) {
          const p = points[i];
          if (!p) continue;
          if (i === 0) {
            p.lerp(mouse, 0.4);
          } else {
            const prev = points[i - 1];
            if (prev) p.lerp(prev, 0.45);
          }
        }
        polyline.updateGeometry();
        renderer.render({ scene: polyline.mesh });
      };
      raf = requestAnimationFrame(update);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        themeObserver.disconnect();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
