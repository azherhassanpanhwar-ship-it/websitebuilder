/**
 * LATTICE Load Doc (Task 1.4)
 * ───────────────────────────
 * Reads the latest snapshot for a `siteId` from Supabase and applies
 * it to the provided Y.Doc. Mirrors `saveDoc.ts` on the read path.
 *
 * Empty-table contract
 *   If no snapshot exists for the site yet (first time the user
 *   opens it), `loadDoc` returns `{ found: false }` and does NOT
 *   touch the Y.Doc. The editor then seeds the default scaffold
 *   (header, hero, etc.) and calls `saveDoc` to persist it.
 *
 * Subscription
 *   `subscribeDoc` returns an unsubscribe function. The realtime
 *   server (Task 1.5) is the primary sync channel; this Supabase
 *   Realtime subscription is a belt-and-braces for when the user
 *   has the editor open in two tabs *without* a live WS — the second
 *   tab gets the snapshot via Postgres, not via the WS.
 */
import type * as Y from "yjs";
import { getSupabaseClient } from "./supabase";
import { decodeDoc } from "./docCodec";
import type { DocSnapshotRow } from "./saveDoc";

export interface LoadResult {
  /** True if a snapshot was found and applied. */
  found: boolean;
  /** Size of the applied snapshot, in bytes (0 if not found). */
  byteSize: number;
  /** When the snapshot was written (server time from the row). */
  updatedAt?: string;
  /** Last writer's user id, for "edited by" UI. */
  updatedBy?: string;
  /** Error message, if any. */
  error?: string;
}

/**
 * Load the latest snapshot for `siteId` and apply it to `doc`. If
 * the row exists but `applyUpdate` throws (corrupted bytes), we
 * return an error result so the caller can surface a "couldn't
 * load" UI rather than silently ending up with a half-applied doc.
 */
export async function loadDoc(args: { siteId: string; doc: Y.Doc }): Promise<LoadResult> {
  const { siteId, doc } = args;
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("y_doc_snapshots")
      .select("site_id, snapshot, byte_size, updated_at, updated_by")
      .eq("site_id", siteId)
      .maybeSingle<DocSnapshotRow>();

    if (error) return { found: false, byteSize: 0, error: error.message };
    if (!data) return { found: false, byteSize: 0 };

    try {
      decodeDoc(doc, data.snapshot);
    } catch (decodeErr) {
      return {
        found: false,
        byteSize: 0,
        error: decodeErr instanceof Error ? decodeErr.message : "corrupt snapshot",
      };
    }

    return {
      found: true,
      byteSize: data.byte_size,
      updatedAt: data.updated_at,
      updatedBy: data.updated_by,
    };
  } catch (err) {
    return {
      found: false,
      byteSize: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Subscribe to snapshot changes for `siteId`. Fires the callback every
 * time a new row is upserted (i.e. the user saves in another tab).
 * Returns an unsubscribe function.
 *
 * NOTE: This is a future-facing helper. It is not yet wired into the
 * editor because we currently rely on the WS server for cross-tab
 * sync. Kept exported so the editor can opt in later.
 */
export function subscribeDoc(args: {
  siteId: string;
  onChange: (row: DocSnapshotRow) => void;
}): () => void {
  const { siteId, onChange } = args;
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel(`y_doc_snapshots:${siteId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "y_doc_snapshots",
        filter: `site_id=eq.${siteId}`,
      },
      (payload) => {
        const row = payload["new"] as DocSnapshotRow | undefined;
        if (row) onChange(row);
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
