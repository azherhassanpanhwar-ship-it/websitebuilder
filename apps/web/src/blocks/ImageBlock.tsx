"use client";

/**
 * ImageBlock — base UI block for a responsive image with alt text.
 *
 * Skill 2 — W3C Design Tokens
 *   All visual primitives are CSS variable references. The aspect-ratio
 *   prop drives the container shape via `aspect-[var(--image-aspect)]`
 *   where `--image-aspect` is a token the runtime can override per
 *   theme. The radius uses `--radius-md` (default) and the shadow uses
 *   `--shadow-sm` — both from the theme's tokens.
 *
 * Skill 1 — CRDT
 *   Pure presentational component — receives a `src`, `alt`, and
 *   `aspectRatio` from the block's Y.Map. Re-renders are driven by the
 *   parent EditorCanvas's Y.Doc observation.
 */

import * as React from "react";

export interface ImageBlockProps {
  /** Image source — http(s) URL, root-relative path, or Pexels id resolved by the runtime. */
  src?: string;
  /** Alt text — required for a11y. Falls back to the URL if absent (still WCAG-compliant). */
  alt?: string;
  /** Aspect ratio in `w/h` notation, e.g. "16/9", "4/3", "1/1", "21/9". */
  aspectRatio?: string;
  /** Object fit policy. */
  fit?: "cover" | "contain";
  /** Show a subtle border? */
  framed?: boolean;
  /** Optional caption rendered below the image. */
  caption?: string;
}

const FIT: Record<NonNullable<ImageBlockProps["fit"]>, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

export function ImageBlock(props: ImageBlockProps) {
  const {
    src,
    alt = "",
    aspectRatio = "16/9",
    fit = "cover",
    framed = false,
    caption,
  } = props;

  return (
    <figure className="py-[var(--space-4)]">
      <div
        className={[
          "relative w-full overflow-hidden bg-[color:var(--color-surface-alt)]",
          `aspect-[${aspectRatio}]`,
          "rounded-[var(--radius-md)]",
          framed ? "border border-[color:var(--color-border)]" : "",
          framed ? "shadow-[var(--shadow-sm)]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ aspectRatio }} /* fallback for older browsers */
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className={["absolute inset-0 h-full w-full", FIT[fit]].join(" ")}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-[color:var(--color-text-muted)] text-[length:var(--space-3)]"
            role="img"
            aria-label={alt || "Image placeholder"}
          >
            No image
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-[var(--space-2)] text-center text-[length:var(--space-3)] text-[color:var(--color-text-muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default ImageBlock;
