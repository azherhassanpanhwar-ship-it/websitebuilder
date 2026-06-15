/**
 * Animation presets per `animation_style` (CLAUDE.md §6.5 Design Law 6).
 *
 * Three families:
 *   - none       — zero motion (medical, therapy, education)
 *   - subtle     — fade-in / translateY(8px) on scroll-enter
 *   - bold       — stagger, scale, GSAP scroll-driven (Tech / SaaS / Creative)
 *
 * All durations are emitted as CSS duration tokens (`--duration-*`). The
 * easing curves are emitted as `--easing-*` tokens.
 *
 * `respectReducedMotion: true` is a *contract* every preset honours — the
 * generated globals.css (Phase 2) will wrap all motion in a
 * `prefers-reduced-motion: reduce` block.
 */

export type AnimationPresetName = "none" | "subtle" | "bold";

export interface AnimationPreset {
  durationFast: string;
  durationBase: string;
  durationEnter: string;
  durationPage: string;
  easingStandard: string;
  easingDecelerate: string;
  easingAccelerate: string;
  respectReducedMotion: true;
}

export const ANIMATION_PRESETS: Record<AnimationPresetName, AnimationPreset> = {
  bold: {
    durationBase: "350ms",
    durationEnter: "600ms",
    durationFast: "200ms",
    durationPage: "800ms",
    easingAccelerate: "cubic-bezier(0.4, 0, 1, 1)",
    easingDecelerate: "cubic-bezier(0, 0, 0.2, 1)",
    easingStandard: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    respectReducedMotion: true,
  },
  none: {
    durationBase: "0.01ms",
    durationEnter: "0.01ms",
    durationFast: "0.01ms",
    durationPage: "0.01ms",
    easingAccelerate: "linear",
    easingDecelerate: "linear",
    easingStandard: "linear",
    respectReducedMotion: true,
  },
  subtle: {
    durationBase: "250ms",
    durationEnter: "400ms",
    durationFast: "150ms",
    durationPage: "600ms",
    easingAccelerate: "cubic-bezier(0.4, 0, 1, 1)",
    easingDecelerate: "cubic-bezier(0, 0, 0.2, 1)",
    easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
    respectReducedMotion: true,
  },
};
