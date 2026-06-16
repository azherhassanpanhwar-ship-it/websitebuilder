/**
 * Persistence module barrel (Task 1.4)
 * ────────────────────────────────────
 * Re-exports the public surface of `apps/web/src/persistence/`.
 * The editor imports from `@/persistence` — never reaches into the
 * individual files. Keeps the module boundary honest.
 *
 * Skill 4 (Headless) is honoured here: the persistence module
 * imports Yjs (the substrate), but it does NOT import the editor
 * or the UI layer. The reverse direction (`@/editor` importing
 * `@/persistence`) is fine; the editor calls into persistence,
 * persistence never calls back.
 */
export { getSupabaseClient, setSupabaseClient, resetSupabaseClient } from "./supabase";
export { encodeDoc, decodeDoc } from "./docCodec";
export {
  saveDoc,
  saveDocDebounced,
  type SaveResult,
  type DebouncedSaver,
  type DocSnapshotRow,
} from "./saveDoc";
export { loadDoc, subscribeDoc, type LoadResult } from "./loadDoc";
