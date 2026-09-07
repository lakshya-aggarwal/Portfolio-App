"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/media";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";

/**
 * L3/L4 — The Assembly. Your stack as physical objects: carved tiles dropped
 * into a bounded space under gravity, grabbable and throwable, and clicking one
 * filters the work below. That last part is what makes it navigation instead of
 * a toy.
 *
 * Budget discipline (see the blueprint's numbers):
 *  · DPR capped at 2 — retina at 3x doubles the fill cost for no visible gain.
 *  · Body count capped: 14 desktop / 8 mobile.
 *  · The whole canvas stops when scrolled out of view or the tab is hidden.
 *  · Rapier sleeps bodies at rest, so a settled pile costs almost nothing.
 */

const DRAG_STIFFNESS = 18;
const DRAG_DAMPING = 6;
const REST_DAMPING = 0.4;

/**
 * Draws just the lettering into a transparent canvas texture, sized to the
 * label plane's aspect ratio. Avoids shipping a 3D font file.
 *
 * This deliberately does NOT texture the RoundedBox itself: a rounded box's UVs
 * wrap around the whole solid, so a face-mapped texture comes out smeared and
 * clipped. The label gets its own flat plane in front of the stone instead.
 */
function useLabelTexture(
  text: string,
  width: number,
  height: number,
  accent: boolean,
) {
  return useMemo(() => {
    const pxPerUnit = 280;
    const w = Math.round(width * pxPerUnit);
    const h = Math.round(height * pxPerUnit);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = accent ? "#ffffff" : "#15151a";
    ctx.font = `500 ${Math.round(h * 0.56)}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2 + h * 0.03);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, [text, width, height, accent]);
}

type TileProps = {
  label: string;
  index: number;
  selected: boolean;
  onSelect: (label: string) => void;
  spawn: [number, number];
  /** Viewport-relative size factor — see Tiles. */
  scale: number;
};

function Tile({ label, index, selected, onSelect, spawn, scale }: TileProps) {
  const body = useRef<RapierRigidBody>(null);
  const dragging = useRef(false);
  const moved = useRef(0);
  const { pointer, viewport } = useThree();

  // Wider names get wider tiles, so the label never overruns the stone. The
  // whole tile is then scaled to the viewport: at 390px "PostgreSQL" would
  // otherwise be almost as wide as the entire frame, and rotating it punched
  // the tile through the walls.
  const width = (0.62 + label.length * 0.155) * scale;
  const height = 0.52 * scale;
  const labelWidth = width * 0.9;
  const labelHeight = height * 0.55;
  const texture = useLabelTexture(label, labelWidth, labelHeight, selected);

  useFrame(() => {
    const rb = body.current;
    if (!rb || !dragging.current) return;
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;
    const at = rb.translation();
    // A spring toward the pointer rather than teleporting: the tile keeps its
    // momentum, so letting go throws it.
    rb.applyImpulse(
      {
        x: (targetX - at.x) * DRAG_STIFFNESS * rb.mass(),
        y: (targetY - at.y) * DRAG_STIFFNESS * rb.mass(),
        z: -at.z * DRAG_STIFFNESS * rb.mass(),
      },
      true,
    );
    moved.current += 1;
  });

  const grab = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    dragging.current = true;
    moved.current = 0;
    body.current?.setLinearDamping(DRAG_DAMPING);
    body.current?.wakeUp();
  };

  useEffect(() => {
    const release = () => {
      if (!dragging.current) return;
      dragging.current = false;
      body.current?.setLinearDamping(REST_DAMPING);
      // A grab that never moved is a click. Filter rather than throw.
      if (moved.current < 4) onSelect(label);
    };
    window.addEventListener("pointerup", release);
    return () => window.removeEventListener("pointerup", release);
  }, [label, onSelect]);

  return (
    <RigidBody
      ref={body}
      colliders="cuboid"
      position={[spawn[0], spawn[1], 0]}
      rotation={[0, 0, (index % 3) * 0.2 - 0.2]}
      restitution={0.22}
      friction={0.85}
      linearDamping={REST_DAMPING}
      angularDamping={0.7}
      // Keep the pile in the plane of the screen.
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
    >
      <RoundedBox
        args={[width, height, 0.22 * scale]}
        radius={0.05 * scale}
        smoothness={3}
        onPointerDown={grab}
      >
        <meshStandardMaterial
          color={selected ? "#3f5bd6" : "#ddd8cc"}
          roughness={0.8}
          metalness={0.03}
        />
      </RoundedBox>
      {texture ? (
        <mesh position={[0, 0, 0.116 * scale]} onPointerDown={grab}>
          <planeGeometry args={[labelWidth, labelHeight]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      ) : null}
    </RigidBody>
  );
}

/** Bounds sized to the actual viewport, rebuilt when it resizes. */
function Bounds() {
  const { viewport } = useThree();
  const w = viewport.width / 2;
  // Floor sits above the very bottom edge so the settled pile does not bury
  // the caption printed over the canvas.
  const h = viewport.height / 2 - 0.42;
  const t = 0.5;
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[w + t, t, 4]} position={[0, -h - t, 0]} />
      <CuboidCollider args={[t, h * 2, 4]} position={[-w - t, 0, 0]} />
      <CuboidCollider args={[t, h * 2, 4]} position={[w + t, 0, 0]} />
      {/* No ceiling: tiles fall in from above the frame. */}
    </RigidBody>
  );
}

/**
 * Spawn positions have to be derived from the real viewport, not hardcoded.
 * At zoom 92 on a 500px-tall canvas the visible world is only ~5.5 units high,
 * so a fixed `y = 3.2 + i * 0.85` put every tile above the top edge — where,
 * with physics paused until the section scrolls into view, they stayed.
 *
 * They now start inside the frame, spread across the top. That also gives the
 * section a sensible still first frame instead of an empty box.
 */
function Tiles({
  labels,
  selected,
  onSelect,
}: {
  labels: string[];
  selected: string | null;
  onSelect: (label: string) => void;
}) {
  const { viewport } = useThree();
  // Fit the WIDEST tile to the frame rather than scaling against a nominal
  // desktop width — the latter shrank phone tiles to the point of being
  // unreadable. On any real phone this stays at 1; it only bites on very
  // narrow frames, which is exactly when it should.
  const widest = Math.max(...labels.map((l) => 0.62 + l.length * 0.155), 1);
  const scale = Math.min(1, (viewport.width * 0.8) / widest);
  // A loose central cluster rather than neat columns: the tiles then collide on
  // the way down and settle into an irregular pile, which is the whole point.
  const spread = Math.min(viewport.width * 0.5, 5.5);

  return (
    <>
      {labels.map((label, i) => {
        // Deterministic jitter — a seeded offset, so the layout is stable across
        // renders but doesn't look laid out on a grid.
        const jitter = Math.sin(i * 12.9898) * 0.5 * scale;
        const x = ((i % 3) - 1) * (spread / 3) + jitter;
        const y = viewport.height / 2 - 0.7 - i * 0.34 * scale;
        return (
          <Tile
            key={label}
            label={label}
            index={i}
            spawn={[x, y]}
            scale={scale}
            selected={selected === label}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}

export type AssemblyProps = {
  tech: string[];
  selected: string | null;
  onSelect: (label: string) => void;
};

export default function Assembly({ tech, selected, onSelect }: AssemblyProps) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  // Body-count budget: 14 desktop / 8 mobile. Read as an external store rather
  // than set from an effect, so there is no cascading render on mount.
  const isNarrow = useMediaQuery("(max-width: 48rem)", false);
  const limit = isNarrow ? 8 : 14;

  // Pause when off-screen or backgrounded. A physics sim behind a hidden tab is
  // pure battery theft.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let onScreen = false;
    const sync = () => setLive(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = Boolean(entry?.isIntersecting);
        sync();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const tiles = tech.slice(0, limit);

  return (
    <div
      ref={host}
      className="absolute inset-0"
      data-cursor="drag"
      data-live={live ? "yes" : "no"}
      // The tiles duplicate the filter buttons rendered in the DOM below, which
      // are the accessible path. This layer is decoration plus a shortcut.
      aria-hidden="true"
    >
      <Canvas
        orthographic
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], zoom: 92 }}
        frameloop={live ? "always" : "demand"}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 7, 9]} intensity={1.5} />
        <directionalLight position={[-5, -2, 4]} intensity={0.35} />
        <Physics gravity={[0, -16, 0]} paused={!live}>
          <Bounds />
          <Tiles labels={tiles} selected={selected} onSelect={onSelect} />
        </Physics>
      </Canvas>
    </div>
  );
}
