/**
 * LATTICE LatticeProvider (Task 1.5)
 * ───────────────────────────────────
 * React context that owns the `WebsocketProvider` for a single room.
 * The provider is a thin wrapper around `y-websocket`'s
 * `WebsocketProvider` — it adds:
 *   1. Awareness state (user identity + cursor position).
 *   2. A typed `status` reflecting the connection state.
 *   3. The `?token=…` query param pulled from the current Supabase
 *      session, so the realtime server can authenticate the upgrade.
 *   4. Clean teardown on unmount (no leaked WS connections).
 *
 * React 19 strict-mode patterns
 *   - Doc + provider live in `useState`, not `useRef`. React's rules
 *     disallow accessing refs during render; `useState` lazy init
 *     gives us the same "stable per mount" guarantee without
 *     triggering `react-hooks/refs`.
 *   - The status comes from `useSyncExternalStore` subscribing to the
 *     provider's `status` event. This is the React-blessed way to
 *     mirror an external store (the WS connection) into state.
 *
 * Why a single provider, not one per site
 *   The editor opens one site at a time. If multi-site tabs are ever
 *   supported, we'll add a `LatticeRoom` sub-provider keyed by site.
 */
"use client";

import * as React from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import type { Awareness } from "y-protocols/awareness";

import { useSupabaseAuth } from "@/auth/SupabaseAuthProvider";

export type LatticeConnectionStatus = "connecting" | "connected" | "disconnected";

export interface LatticeContextValue {
  doc: Y.Doc;
  provider: WebsocketProvider;
  awareness: Awareness;
  status: LatticeConnectionStatus;
  /** Local user identity broadcast on the awareness channel. */
  localUser: { id: string; name: string; color: string } | null;
}

const LatticeContext = React.createContext<LatticeContextValue | null>(null);

export interface LatticeProviderProps {
  siteId: string;
  children: React.ReactNode;
  /**
   * Override the WS URL. Defaults to `NEXT_PUBLIC_WS_URL` (which
   * `.env.example` sets to `ws://localhost:1234`).
   */
  url?: string;
}

function pickColor(seed: string): string {
  // Deterministic color from a user id — same id always picks the
  // same color, so each collaborator has a stable cursor color.
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 50%)`;
}

/**
 * Read the current WS connection status from the provider. The
 * y-websocket WebsocketProvider exposes `wsconnected: boolean` and
 * `wsconnecting: boolean`. We map them to our 3-state enum.
 */
function readProviderStatus(provider: WebsocketProvider | null): LatticeConnectionStatus {
  if (!provider) return "connecting";
  if (provider.wsconnected) return "connected";
  if (provider.wsconnecting) return "connecting";
  return "disconnected";
}

/** Subscribe to the provider's `status` event for useSyncExternalStore. */
function subscribeStatus(provider: WebsocketProvider | null, callback: () => void): () => void {
  if (!provider) return () => {};
  provider.on("status", callback);
  return () => {
    provider.off("status", callback);
  };
}

export function LatticeProvider({ siteId, children, url }: LatticeProviderProps) {
  const { session } = useSupabaseAuth();

  // Doc is created exactly once per mount. useState lazy init is
  // called only on the first render; subsequent renders reuse the
  // existing instance.
  const [doc] = React.useState(() => new Y.Doc());

  // Provider starts as null; the effect creates it once we have a
  // token. The first render always shows "Connecting…" so the
  // component's children never see a half-set-up state.
  const [provider, setProvider] = React.useState<WebsocketProvider | null>(null);

  // Resolve WS URL + token from the runtime env + session.
  const wsUrl = url ?? process.env["NEXT_PUBLIC_WS_URL"] ?? "ws://localhost:1234";
  const token = session?.access_token ?? null;

  React.useEffect(() => {
    if (!token) return; // user will be redirected to /auth/signin
    const p = new WebsocketProvider(wsUrl, siteId, doc, {
      params: { token },
      connect: true,
    });

    // Broadcast the local user identity on the awareness channel.
    if (session?.user) {
      const userId = session.user.id;
      p.awareness.setLocalStateField("user", {
        id: userId,
        name: session.user.email ?? "Anonymous",
        color: pickColor(userId),
      });
    }

    // setState in effect is intentional here: the WebsocketProvider
    // is the external resource, and we need it in state so the
    // component re-renders with the provider mounted. This is the
    // canonical "create an external connection in a useEffect"
    // pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProvider(p);

    return () => {
      p.destroy();
    };
  }, [siteId, token, wsUrl, doc, session?.user]);

  // useSyncExternalStore is React's blessed way to mirror external
  // state (the provider's `status` event) into render output. It
  // also handles SSR / concurrent rendering correctly.
  const status = React.useSyncExternalStore<LatticeConnectionStatus>(
    React.useCallback((cb) => subscribeStatus(provider, cb), [provider]),
    () => readProviderStatus(provider),
    () => "connecting",
  );

  if (!provider) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]">
        Connecting to realtime…
      </div>
    );
  }

  const localUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.email ?? "Anonymous",
        color: pickColor(session.user.id),
      }
    : null;

  const value: LatticeContextValue = {
    doc,
    provider,
    awareness: provider.awareness,
    status,
    localUser,
  };

  return <LatticeContext.Provider value={value}>{children}</LatticeContext.Provider>;
}

export function useLattice(): LatticeContextValue {
  const ctx = React.useContext(LatticeContext);
  if (!ctx) {
    throw new Error("useLattice must be used inside <LatticeProvider>");
  }
  return ctx;
}
