/**
 * useLatticeRoom (Task 1.5)
 * ─────────────────────────
 * Hook that returns the live Y.Doc + provider from the nearest
 * `LatticeProvider`. Mirrors the `useDoc()` pattern that other
 * multiplayer React apps (Liveblocks, tldraw) use so the editor
 * components can stay unaware of the transport layer.
 */
"use client";

import * as Y from "yjs";
import type { WebsocketProvider } from "y-websocket";
import type { Awareness } from "y-protocols/awareness";

import {
  useLattice,
  type LatticeConnectionStatus,
  type LatticeContextValue,
} from "./LatticeProvider";

export interface UseLatticeRoomResult {
  doc: Y.Doc;
  provider: WebsocketProvider;
  awareness: Awareness;
  status: LatticeConnectionStatus;
  /** True once the first sync round-trip with the server has completed. */
  synced: boolean;
}

export function useLatticeRoom(): UseLatticeRoomResult {
  const ctx = useLattice();
  // `synced` flips once after the first sync; we read it directly from
  // the provider (it's a boolean on the WebsocketProvider instance).
  const synced = (ctx.provider as { synced?: boolean }).synced === true;
  const result: UseLatticeRoomResult = {
    doc: ctx.doc,
    provider: ctx.provider,
    awareness: ctx.awareness,
    status: ctx.status,
    synced,
  };
  return result;
}

export type { LatticeContextValue };
