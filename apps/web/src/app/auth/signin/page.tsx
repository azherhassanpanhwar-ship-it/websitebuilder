/**
 * Sign-in page (Task 1.4)
 * ──────────────────────
 * Minimal email/password sign-in form. The Supabase Auth client
 * issues a JWT that the rest of the app (persistence + realtime WS)
 * picks up via the `SupabaseAuthProvider` context.
 *
 * Post-signin behaviour
 *   We read `?next=<path>` from the URL (default `/editor`) and
 *   `router.push(next)` on success. The middleware / editor page
 *   itself does the auth check; this page is the entry point, not
 *   the gate.
 *
 * Next.js requires `useSearchParams()` inside a Suspense boundary, so
 * the default export wraps the consumer in one.
 */
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabaseAuth } from "@/auth/SupabaseAuthProvider";

export default function SignInPage() {
  return (
    <React.Suspense
      fallback={
        <main className="flex min-h-screen w-full items-center justify-center text-[color:var(--color-text-muted)]">
          Loading…
        </main>
      }
    >
      <SignInForm />
    </React.Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/editor";
  const { signIn, session, loading } = useSupabaseAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && session) {
      router.replace(next);
    }
  }, [loading, session, router, next]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    router.replace(next);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-[var(--space-6)] px-[var(--space-6)] py-[var(--space-9)]">
      <header className="flex flex-col items-center gap-[var(--space-2)] text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--space-7)] font-semibold tracking-tight">
          Sign in to LATTICE
        </h1>
        <p className="text-[length:var(--space-4)] text-[color:var(--color-text-muted)]">
          Use the email + password from your Supabase project. Sessions persist in this tab.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)]"
      >
        <label className="flex flex-col gap-[var(--space-2)]">
          <span className="text-[length:var(--space-3)] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--space-4)] text-[color:var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-focus-ring)]"
          />
        </label>
        <label className="flex flex-col gap-[var(--space-2)]">
          <span className="text-[length:var(--space-3)] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
            Password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--space-4)] text-[color:var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring-2)] focus-visible:outline-[color:var(--color-focus-ring)]"
          />
        </label>
        {error ? (
          <p
            role="alert"
            className="rounded-[var(--radius-md)] border border-[color:var(--color-error)] bg-[color:var(--color-surface-alt)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--space-4)] text-[color:var(--color-error)]"
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-[var(--space-5)] py-[var(--space-3)] text-[length:var(--space-4)] font-semibold text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color] duration-[var(--duration-base)] ease-[ease] hover:bg-[color:var(--color-primary-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-focus-ring)] disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
