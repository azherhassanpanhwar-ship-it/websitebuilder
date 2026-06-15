/**
 * Stable id generation for LATTICE persistent entities.
 *
 * Centralised so we can swap to ULID / nanoid later without hunting through
 * the codebase. Each id is prefixed with its entity kind for debuggability.
 *
 * Uses `lib0/random` (already a dependency via yjs) so we don't pull in
 * a second random source.
 */

import { uuidv4 } from "lib0/random";

export type IdKind = "page" | "section" | "block";

export function createId(kind: IdKind): string {
  return `${kind}_${uuidv4()}`;
}
