/**
 * LATTICE Supabase Auth Provider (Task 1.4)
 * ──────────────────────────────────────────
 * React context wrapper around the Supabase browser client. Owns:
 *   - The current `Session` (or `null` when signed out)
 *   - The `signInWithPassword` / `signOut` actions
 *   - A subscription to `onAuthStateChange` so the UI re-renders when
 *     the token auto-refreshes or the user signs out from another tab.
 *
 * Why a context, not a hook alone
 *   The session is read by three places: the editor page (to know who
 *   is editing), the persistence module (to scope `updated_by` on
 *   saves), and the signin page (to redirect on success). A context
 *   means there is exactly one subscription to `onAuthStateChange` per
 *   tab, not one per consumer.
 */
"use client";

import * as React from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/persistence/supabase";

export interface SupabaseAuthContextValue {
  /** The current Supabase session, or `null` when signed out. */
  session: Session | null;
  /**
   * True until the initial `getSession()` call has resolved. Pages
   * should render a loading state while this is true.
   */
  loading: boolean;
  /** Sign in with email + password (Supabase Auth). */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Sign out the current user. */
  signOut: () => Promise<void>;
  /** Direct access to the underlying client (for places that need it). */
  client: SupabaseClient;
}

const SupabaseAuthContext = React.createContext<SupabaseAuthContextValue | null>(null);

export interface SupabaseAuthProviderProps {
  children: React.ReactNode;
  /**
   * Optional override for the Supabase client. Mostly useful in tests;
   * production code uses `getSupabaseClient()`.
   */
  client?: SupabaseClient;
}

export function SupabaseAuthProvider({ children, client }: SupabaseAuthProviderProps) {
  const supabase = client ?? getSupabaseClient();
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let mounted = true;
    // Initial fetch.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setLoading(false);
      });

    // Live updates — token refresh, sign-out from another tab, etc.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = React.useMemo<SupabaseAuthContextValue>(
    () => ({
      session,
      loading,
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? error.message : null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
      client: supabase,
    }),
    [session, loading, supabase],
  );

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

/** Read the current auth context. Throws if used outside the provider. */
export function useSupabaseAuth(): SupabaseAuthContextValue {
  const ctx = React.useContext(SupabaseAuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used inside <SupabaseAuthProvider>");
  }
  return ctx;
}
