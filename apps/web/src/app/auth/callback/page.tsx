/**
 * Post-signin landing page (Task 1.4)
 * ───────────────────────────────────
 * Supabase's email-link + OAuth flows redirect back to the app with
 * a `#access_token=…` hash fragment. The Supabase client auto-detects
 * the token via `detectSessionInUrl: true` (set in `supabase.ts`) and
 * the onAuthStateChange listener fires with the new session.
 *
 * All this page does is wait one tick, then forward to `?next=`.
 *
 * Next.js requires `useSearchParams()` inside a Suspense boundary, so
 * the default export wraps the consumer in one.
 */
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabaseAuth } from "@/auth/SupabaseAuthProvider";

export default function AuthCallbackPage() {
  return (
    <React.Suspense
      fallback={
        <main className="flex min-h-screen w-full items-center justify-center text-[color:var(--color-text-muted)]">
          Loading…
        </main>
      }
    >
      <AuthCallbackInner />
    </React.Suspense>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/editor";
  const { session, loading } = useSupabaseAuth();

  React.useEffect(() => {
    if (loading) return;
    router.replace(session ? next : "/auth/signin");
  }, [loading, session, router, next]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[color:var(--color-surface)] text-[color:var(--color-text)]">
      <p className="text-[length:var(--space-4)] text-[color:var(--color-text-muted)]">
        Completing sign-in…
      </p>
    </main>
  );
}
