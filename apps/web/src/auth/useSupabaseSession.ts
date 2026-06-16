/**
 * useSupabaseSession (Task 1.4)
 * ──────────────────────────────
 * Thin convenience hook over `useSupabaseAuth` that returns just the
 * session-shaped slice most consumers actually need. Keeps call sites
 * short and the data-dependency narrow (re-renders only when the
 * session changes, not when `loading` toggles).
 */
"use client";

import { useSupabaseAuth } from "./SupabaseAuthProvider";

export interface SessionSlice {
  userId: string | null;
  email: string | null;
  /** True until the initial getSession() resolves. */
  loading: boolean;
  /** True iff the user is signed in. */
  isAuthenticated: boolean;
}

export function useSupabaseSession(): SessionSlice {
  const { session, loading } = useSupabaseAuth();
  return {
    userId: session?.user?.id ?? null,
    email: session?.user?.email ?? null,
    loading,
    isAuthenticated: !!session,
  };
}
