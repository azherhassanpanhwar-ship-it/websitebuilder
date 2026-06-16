/**
 * LATTICE Save Doc (Task 1.4)
 * ───────────────────────────
 * Writes a Y.Doc snapshot to the `y_doc_snapshots` Supabase table.
 *
 * Schema (run via Supabase SQL editor or a migration):
 *
 *   create table y_doc_snapshots (
 *     site_id     text        primary key,
 *     snapshot    text        not null,           -- base64-encoded Y.Doc
 *     byte_size   integer     not null,           -- for storage budget alerts
 *     updated_at  timestamptz not null default now(),
 *     updated_by  text        not null            -- user id from Supabase Auth
 *   );
 *
 *   -- RLS: a user may only read/write their own snapshots
 *   alter table y_doc_snapshots enable row level security;
 *   create policy "own snapshots" on y_doc_snapshots
 *     for all using (auth.uid()::text = updated_by)
 *     with check (auth.uid()::text = updated_by);
 *
 * Debouncing
 *   `saveDocDebounced` is the public surface most callers want. It
 *   collapses a burst of "doc changed" events into one Supabase write
 *   per `delayMs` window. On `flush()` (called from `beforeunload`)
 *   the latest snapshot is written immediately.
 *
 * Concurrency
 *   The last write wins. The unique `site_id` primary key means a
 *   concurrent save from another tab upserts; the larger `updated_at`
 *   will overwrite a smaller one in case of a true race. The
 *   timestamp is set client-side (cheap clock skew) — switch to a
 *   Postgres-side `default now()` if you need stricter ordering.
 */
import type * as Y from "yjs";
import { getSupabaseClient } from "./supabase";
import { encodeDoc } from "./docCodec";

export interface SaveResult {
  ok: boolean;
  byteSize: number;
  updatedAt: string;
  error?: string;
}

/**
 * The shape the `y_doc_snapshots` row takes. The table is `text` for
 * `snapshot` (base64) so we get greppable storage in the Supabase
 * dashboard; the binary form lives in Postgres as `bytea` once we
 * move past the MVP.
 */
export interface DocSnapshotRow {
  site_id: string;
  snapshot: string;
  byte_size: number;
  updated_at: string;
  updated_by: string;
}

/**
 * Save a Y.Doc immediately. Returns the result rather than throwing
 * so the caller can decide how loud to be (e.g. a toast vs. a console
 * warning during a debounced background write).
 */
export async function saveDoc(args: {
  siteId: string;
  doc: Y.Doc;
  userId: string;
}): Promise<SaveResult> {
  const { siteId, doc, userId } = args;
  const snapshot = encodeDoc(doc);
  const byteSize = new TextEncoder().encode(snapshot).byteLength;
  const updatedAt = new Date().toISOString();

  const row: DocSnapshotRow = {
    site_id: siteId,
    snapshot,
    byte_size: byteSize,
    updated_at: updatedAt,
    updated_by: userId,
  };

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("y_doc_snapshots").upsert(row, { onConflict: "site_id" });
    if (error) return { ok: false, byteSize, updatedAt, error: error.message };
    return { ok: true, byteSize, updatedAt };
  } catch (err) {
    return {
      ok: false,
      byteSize,
      updatedAt,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── Debounced save ─────────────────────────────────────────────────────

export interface DebouncedSaver {
  /** Call this on every doc change. Triggers a save after `delayMs`. */
  schedule: (doc: Y.Doc) => void;
  /** Force the latest snapshot to be written right now. */
  flush: () => Promise<SaveResult | null>;
  /** Cancel any pending timer without saving. */
  cancel: () => void;
}

/**
 * Build a debounced saver. The latest doc reference is captured at
 * `schedule()` time and used when the timer fires; subsequent calls
 * during the delay window overwrite the pending doc.
 */
export function saveDocDebounced(args: {
  siteId: string;
  userId: string;
  delayMs?: number;
}): DebouncedSaver {
  const { siteId, userId, delayMs = 1500 } = args;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingDoc: Y.Doc | null = null;
  let inFlight: Promise<SaveResult | null> | null = null;

  const run = async (): Promise<SaveResult | null> => {
    if (!pendingDoc) return null;
    const doc = pendingDoc;
    pendingDoc = null;
    timer = null;
    return saveDoc({ siteId, doc, userId });
  };

  return {
    schedule(doc) {
      pendingDoc = doc;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        inFlight = run();
      }, delayMs);
    },
    async flush() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      inFlight = run();
      return inFlight;
    },
    cancel() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      pendingDoc = null;
    },
  };
}
