"use client";

/**
 * Editor page (Tasks 1.4 + 1.5)
 * ─────────────────────────────
 * Hosts the Y.Doc for a single site and connects it to:
 *   1. The Supabase persistence layer (Task 1.4) — loads the latest
 *      snapshot on mount, debounces saves on every change, flushes on
 *      `beforeunload` so closing the tab doesn't lose unsaved work.
 *   2. The y-websocket realtime channel (Task 1.5) — connects via
 *      `LatticeProvider`, syncs the same Y.Doc with every other
 *      connected peer.
 *
 * The two are intentionally decoupled:
 *   - Realtime is the *transport* (live edits, < 100 ms).
 *   - Persistence is the *durability* (snapshot every 1.5 s + on
 *     tab close). If realtime is offline, the editor still works;
 *     saves just queue up locally.
 *
 * Auth
 *   If the user is not signed in, we redirect to `/auth/signin?next=…`
 *   preserving the current `?site=…` so they land back here.
 *
 * Site id
 *   Read from `?site=<id>`. If absent, we generate a fresh
 *   `site_<uuid>` and update the URL via `router.replace` so the user
 *   can share the link.
 */
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LatticeDoc } from "@/crdt/LatticeDoc";
import { BlockRegistry } from "@/blocks/BlockRegistry";
import { ThemeProvider } from "@/engine/theme/ThemeProvider";
import { EditorCanvas } from "@/editor/EditorCanvas";
import { SupabaseAuthProvider, useSupabaseAuth } from "@/auth/SupabaseAuthProvider";
import { LatticeProvider, useLatticeRoom } from "@/realtime";
import { loadDoc, saveDocDebounced, type DebouncedSaver, type SaveResult } from "@/persistence";

export default function EditorPage() {
  // The Supabase browser client needs NEXT_PUBLIC_SUPABASE_URL and
  // NEXT_PUBLIC_SUPABASE_ANON_KEY at build time. If the developer
  // hasn't filled them in yet, render a friendly "not configured"
  // message instead of crashing the SSR pass.
  const hasSupabaseEnv = Boolean(
    process.env["NEXT_PUBLIC_SUPABASE_URL"] && process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  );
  if (!hasSupabaseEnv) {
    return <SupabaseNotConfigured />;
  }
  return (
    <SupabaseAuthProvider>
      <EditorPageInner />
    </SupabaseAuthProvider>
  );
}

function SupabaseNotConfigured() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-[var(--space-6)] px-[var(--space-6)] py-[var(--space-9)] text-center">
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--space-7)] font-semibold tracking-tight text-[color:var(--color-text)]">
        Supabase env vars not set
      </h1>
      <p className="text-[length:var(--space-4)] text-[color:var(--color-text-muted)]">
        Copy{" "}
        <code className="rounded bg-[color:var(--color-surface-alt)] px-[var(--space-2)] py-[var(--space-1)] font-mono text-[length:var(--space-3)]">
          .env.example
        </code>{" "}
        to{" "}
        <code className="rounded bg-[color:var(--color-surface-alt)] px-[var(--space-2)] py-[var(--space-1)] font-mono text-[length:var(--space-3)]">
          .env.local
        </code>{" "}
        and fill in{" "}
        <code className="rounded bg-[color:var(--color-surface-alt)] px-[var(--space-2)] py-[var(--space-1)] font-mono text-[space-3]">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        and{" "}
        <code className="rounded bg-[color:var(--color-surface-alt)] px-[var(--space-2)] py-[var(--space-1)] font-mono text-[length:var(--space-3)]">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>
        . Restart{" "}
        <code className="rounded bg-[color:var(--color-surface-alt)] px-[var(--space-2)] py-[var(--space-1)] font-mono text-[length:var(--space-3)]">
          pnpm dev
        </code>{" "}
        after editing.
      </p>
    </main>
  );
}

/**
 * Inner page — runs INSIDE both the SupabaseAuthProvider (for
 * `useSupabaseAuth`) and the LatticeProvider (for `useLatticeRoom`).
 */
function EditorPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteIdParam = searchParams.get("site");
  const { session, loading: authLoading } = useSupabaseAuth();

  // Stable site id. Generated once per mount, then written back to
  // the URL via router.replace so the user can share the link.
  const [siteId] = React.useState<string>(() => siteIdParam ?? `site_${crypto.randomUUID()}`);

  // Redirect to /auth/signin if not authenticated.
  React.useEffect(() => {
    if (authLoading) return;
    if (!session) {
      const next = `/editor?site=${encodeURIComponent(siteId)}`;
      router.replace(`/auth/signin?next=${encodeURIComponent(next)}`);
    }
  }, [authLoading, session, siteId, router]);

  // Reflect the generated site id back into the URL.
  React.useEffect(() => {
    if (!siteIdParam && siteId) {
      router.replace(`/editor?site=${encodeURIComponent(siteId)}`);
    }
  }, [siteIdParam, siteId, router]);

  if (authLoading || !session) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]">
        Loading editor…
      </main>
    );
  }

  return (
    <LatticeProvider siteId={siteId}>
      <EditorRoom siteId={siteId} userId={session.user.id} />
    </LatticeProvider>
  );
}

/**
 * The actual room — has access to both the realtime Y.Doc (from
 * LatticeProvider) and the persistence module. Wires the two together.
 */
function EditorRoom({ siteId, userId }: { siteId: string; userId: string }) {
  const { doc, status } = useLatticeRoom();
  const [hydrated, setHydrated] = React.useState<boolean>(false);
  const [lastSave, setLastSave] = React.useState<SaveResult | null>(null);

  // Set up the substrate (LatticeDoc + BlockRegistry) once.
  const env = React.useMemo(() => {
    const registry = new BlockRegistry(doc);
    const lattice = new LatticeDoc(doc);
    return { lattice, registry };
  }, [doc]);

  // 1. On mount: try to load the latest snapshot from Supabase.
  //    If none exists, seed the default scaffold.
  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await loadDoc({ siteId, doc });
      if (cancelled) return;
      if (!result.found) {
        seedDefaultSite(env.lattice);
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [siteId, doc, env]);

  // 2. On every change: schedule a debounced save.
  const saverRef = React.useRef<DebouncedSaver | null>(null);
  if (saverRef.current === null) {
    saverRef.current = saveDocDebounced({ siteId, userId, delayMs: 1500 });
  }
  React.useEffect(() => {
    if (!hydrated) return;
    const saver = saverRef.current!;
    const handler = (): void => saver.schedule(doc);
    doc.on("update", handler);
    return () => {
      doc.off("update", handler);
    };
  }, [doc, hydrated]);

  // 3. On tab close: flush the pending save synchronously enough
  //    that the browser actually sends the request.
  React.useEffect(() => {
    if (!hydrated) return;
    const saver = saverRef.current!;
    const handler = (): void => {
      void saver.flush().then((r) => {
        if (r) setLastSave(r);
      });
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hydrated]);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]">
        Loading site…
      </main>
    );
  }

  return (
    <ThemeProvider doc={doc}>
      <div className="flex min-h-screen w-full flex-col bg-[color:var(--color-surface)] text-[color:var(--color-text)]">
        <header className="flex items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-[var(--space-6)] py-[var(--space-3)] text-[length:var(--space-3)] text-[color:var(--color-text-muted)]">
          <span>
            Site: <code className="font-mono text-[length:var(--space-3)]">{siteId}</code>
          </span>
          <span aria-live="polite">
            Realtime: {status}
            {lastSave
              ? ` · Last save: ${lastSave.ok ? `${lastSave.byteSize} B` : `error: ${lastSave.error}`}`
              : ""}
          </span>
        </header>
        <main className="flex-1">
          <EditorCanvas doc={doc} className="mx-auto w-full max-w-[1440px]" />
        </main>
      </div>
    </ThemeProvider>
  );
}

// ─── Default scaffold (used when no snapshot exists) ────────────────────

function seedDefaultSite(lattice: LatticeDoc): void {
  const pageId = lattice.addPage({
    slug: "home",
    title: "Home",
    description: "The LATTICE demo page.",
    isHome: true,
  });
  const sectionId = lattice.addSection(pageId, { name: "Main", layout: "contained" });
  if (!sectionId) return;
  lattice.addBlock(pageId, sectionId, {
    type: "hero",
    props: {
      title: "LATTICE — built for the next 500 themes",
      subtitle:
        "WCAG 2.2 AA, Lighthouse 95+, zero hardcoded values. The visual website builder that ships.",
      ctaLabel: "Get started",
      ctaHref: "#",
      pattern: "full-bleed-image",
      alignment: "center",
    },
  });
  lattice.addBlock(pageId, sectionId, {
    type: "text",
    props: {
      content:
        "LATTICE themes are token-driven from the ground up. No hex literals, no hardcoded px — every visual primitive flows through CSS variables.",
      align: "center",
      size: "md",
      variant: "body",
    },
  });
}
