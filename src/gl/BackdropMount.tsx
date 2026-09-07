"use client";

import dynamic from "next/dynamic";

/**
 * `ssr: false` is only legal inside a Client Component, so the dynamic import
 * lives here rather than in the root layout.
 */
const Backdrop = dynamic(() => import("@/gl/Backdrop"), { ssr: false });

export function BackdropMount() {
  return <Backdrop />;
}
