/**
 * LATTICE Doc Codec (Task 1.4)
 * ────────────────────────────
 * Convert a Y.Doc ⇄ opaque string for transport / storage. Postgres
 * `bytea` is the ideal target type; we additionally base64-encode so
 * the same `text` column can hold a snapshot for debugging.
 *
 * Why base64 instead of raw bytes
 *   - The Supabase JS client takes JSON-friendly types; passing a
 *     `Uint8Array` is supported but the REST shape is opaque. Storing
 *     the snapshot as `text` makes it greppable in the dashboard.
 *   - The size overhead is ~33%, acceptable for our payload (a Y.Doc
 *     is a few KB after the initial sync).
 *
 * The codec is intentionally small and dependency-free. It is the
 * only place in the codebase that calls `Y.encodeStateAsUpdate` /
 * `Y.applyUpdate` — every other layer calls `encodeDoc` / `decodeDoc`.
 */
import * as Y from "yjs";

/**
 * Serialize a Y.Doc to a base64 string. Includes the full state vector
 * (every update the doc has ever received) — there is no incremental
 * "since X" mode here. Callers that want diffs should compute them
 * out-of-band with `Y.encodeStateAsUpdate(doc, stateVector)`.
 */
export function encodeDoc(doc: Y.Doc): string {
  const bytes = Y.encodeStateAsUpdate(doc);
  return bytesToBase64(bytes);
}

/**
 * Apply a base64-encoded snapshot to a Y.Doc. Merges — does not
 * replace. Safe to call on a fresh doc or one that already has
 * updates; Yjs handles the dedup via the update's origin metadata.
 */
export function decodeDoc(doc: Y.Doc, snapshot: string): void {
  if (!snapshot) return;
  const bytes = base64ToBytes(snapshot);
  Y.applyUpdate(doc, bytes);
}

// ─── Base64 helpers (Node + browser safe, no Buffer dependency) ──────────
//
// We avoid `Buffer` so this module imports cleanly in both the Vitest
// (Node) and the editor (browser / Turbopack) environments. The
// conversion is RFC 4648 §4 — standard alphabet, no URL-safe variant.

const B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function bytesToBase64(bytes: Uint8Array): string {
  let out = "";
  const len = bytes.length;
  let i = 0;
  for (; i + 2 < len; i += 3) {
    // Bounds checks are explicit in the `for` condition above; the `!`
    // is a hint to TS that the `noUncheckedIndexedAccess` flag's
    // `T | undefined` narrowing doesn't need to be repeated at every
    // arithmetic step.
    const b0: number = bytes[i]!;
    const b1: number = bytes[i + 1]!;
    const b2: number = bytes[i + 2]!;
    const s0 = B64_ALPHABET[b0 >> 2]!;
    const s1 = B64_ALPHABET[((b0 & 0x03) << 4) | (b1 >> 4)]!;
    const s2 = B64_ALPHABET[((b1 & 0x0f) << 2) | (b2 >> 6)]!;
    const s3 = B64_ALPHABET[b2 & 0x3f]!;
    out += s0 + s1 + s2 + s3;
  }
  if (i < len) {
    const b0: number = bytes[i]!;
    const s0 = B64_ALPHABET[b0 >> 2]!;
    out += s0;
    if (i + 1 < len) {
      const b1: number = bytes[i + 1]!;
      const s1 = B64_ALPHABET[((b0 & 0x03) << 4) | (b1 >> 4)]!;
      const s2 = B64_ALPHABET[(b1 & 0x0f) << 2]!;
      out += s1 + s2 + "=";
    } else {
      const s1 = B64_ALPHABET[(b0 & 0x03) << 4]!;
      out += s1 + "==";
    }
  }
  return out;
}

function base64ToBytes(b64: string): Uint8Array {
  // Strip whitespace + length-validate.
  const cleaned = b64.replace(/\s+/g, "");
  if (cleaned.length % 4 !== 0) {
    throw new Error("base64 input length is not a multiple of 4");
  }
  const lookup = new Int8Array(256).fill(-1);
  for (let i = 0; i < B64_ALPHABET.length; i++) {
    lookup[B64_ALPHABET.charCodeAt(i)] = i;
  }
  const padding = (cleaned.match(/=+$/)?.[0] ?? "").length;
  const outLen = (cleaned.length / 4) * 3 - padding;
  const out = new Uint8Array(outLen);
  let outIdx = 0;
  for (let i = 0; i < cleaned.length; i += 4) {
    const c0: number = lookup[cleaned.charCodeAt(i)] ?? -1;
    const c1: number = lookup[cleaned.charCodeAt(i + 1)] ?? -1;
    const c2: number =
      cleaned.charCodeAt(i + 2) === 61 /* '=' */ ? 0 : (lookup[cleaned.charCodeAt(i + 2)] ?? -1);
    const c3: number =
      cleaned.charCodeAt(i + 3) === 61 ? 0 : (lookup[cleaned.charCodeAt(i + 3)] ?? -1);
    if (c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0) {
      throw new Error("base64 input contains non-alphabet characters");
    }
    out[outIdx++] = (c0 << 2) | (c1 >> 4);
    if (outIdx < outLen) out[outIdx++] = ((c1 & 0x0f) << 4) | (c2 >> 2);
    if (outIdx < outLen) out[outIdx++] = ((c2 & 0x03) << 6) | c3;
  }
  return out;
}
