/**
 * useAwareness (Task 1.5)
 * ───────────────────────
 * Subscribes to the awareness state of every other peer in the room.
 * Re-renders the consumer when the set of peers or any peer's state
 * changes. Returns a Map keyed by clientID for easy rendering.
 *
 * Usage
 *   const peers = useAwareness(awareness);
 *   peers.forEach((state, clientId) => {
 *     if (clientId === awareness.clientID) return; // skip self
 *     // render state.user.name, state.cursor, etc.
 *   });
 */
"use client";

import * as React from "react";
import type { Awareness } from "y-protocols/awareness";

export interface AwarenessState {
  // The local user (see LatticeProvider for the exact shape).
  user?: {
    id: string;
    name: string;
    color: string;
  };
  // Cursor in editor coordinates; null when the cursor left the canvas.
  cursor?: { x: number; y: number } | null;
  // Free-form: theme authors can attach anything they want to the
  // awareness channel (selection ranges, hover states, etc.).
  [key: string]: unknown;
}

export function useAwareness(awareness: Awareness): Map<number, AwarenessState> {
  const [states, setStates] = React.useState<Map<number, AwarenessState>>(
    () => new Map(awareness.getStates() as Map<number, AwarenessState>),
  );

  React.useEffect(() => {
    const update = (): void => {
      setStates(new Map(awareness.getStates() as Map<number, AwarenessState>));
    };
    awareness.on("change", update);
    return () => {
      awareness.off("change", update);
    };
  }, [awareness]);

  return states;
}
