/**
 * Spacing scale multipliers.
 *
 * The base 4/8px scale (CLAUDE.md §6.5 Design Law 3) is multiplied by these
 * factors per `spacing_scale` / `layout_density`. The generator applies
 * the multiplier at build time and emits the resulting dimensions as
 * `--space-N` CSS variables.
 *
 * The values are pure numbers (no Date / no Math.random) so the generator
 * remains deterministic.
 */

export const SPACING_SCALE_MULTIPLIERS: Record<"compact" | "comfortable" | "spacious", number> = {
  compact: 0.875,
  comfortable: 1.0,
  spacious: 1.25,
};

/** The base space scale in raw px. Source of truth. */
export const BASE_SPACE_PX: Record<string, number> = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 24,
  "6": 32,
  "7": 48,
  "8": 64,
  "9": 96,
  "10": 128,
  "11": 160,
};

/**
 * Apply a multiplier to the base space scale and return px strings.
 * Always returns 12 entries keyed "0" … "11".
 */
export function scaleSpace(multiplier: number): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(BASE_SPACE_PX)) {
    out[k] = v === 0 ? "0px" : `${Math.round(v * multiplier)}px`;
  }
  return out;
}
