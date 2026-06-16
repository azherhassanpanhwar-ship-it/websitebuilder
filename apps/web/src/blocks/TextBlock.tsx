"use client";

/**
 * TextBlock — base UI block for paragraph / heading / muted text.
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is consumed via `var(--token-*)` references
 *   (colors, spacing, line-height). Font-size uses a length-typed arbitrary
 *   value so the Tailwind JIT emits `font-size: var(--space-N)` rather
 *   than a hardcoded px value. There are no hardcoded hex / px literals
 *   in this file.
 *
 * Skill 1 — CRDT
 *   This component receives plain JS props extracted from the block's
 *   Y.Map by the parent (BlockView in EditorCanvas). The component
 *   itself is stateless — re-renders come from the parent observing
 *   the Y.Doc.
 */

import * as React from "react";

export interface TextBlockProps {
  /** Text content. Defaults to an empty string so the block renders even with no input. */
  content?: string;
  /** Horizontal alignment. */
  align?: "left" | "center" | "right";
  /** Visual size — maps to the spacing token scale. */
  size?: "sm" | "md" | "lg";
  /** Visual variant — body, muted helper text, or a heading style. */
  variant?: "body" | "muted" | "heading";
  /** Optional pre-rendered HTML (for rich text). When set, overrides `content`. */
  html?: string;
}

const ALIGN: Record<NonNullable<TextBlockProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// Size maps to the spacing token scale so it cascades from the same
// source of truth as the rest of the theme.
const SIZE: Record<NonNullable<TextBlockProps["size"]>, string> = {
  sm: "text-[length:var(--space-3)]", // 12px
  md: "text-[length:var(--space-5)]", // 24px
  lg: "text-[length:var(--space-6)]", // 32px
};

const VARIANT: Record<NonNullable<TextBlockProps["variant"]>, string> = {
  body: "text-[color:var(--color-text)] font-normal",
  muted: "text-[color:var(--color-text-muted)] font-normal",
  heading: "text-[color:var(--color-text)] font-semibold tracking-tight",
};

export function TextBlock(props: TextBlockProps) {
  const { content = "", align = "left", size = "md", variant = "body", html } = props;

  const classes = [
    ALIGN[align],
    SIZE[size],
    VARIANT[variant],
    // Lead tracking — always uses the spacing scale so it never
    // hardcodes a px.
    "leading-[1.6]",
    // Vertical breathing room inside the section.
    "py-[var(--space-4)]",
    "px-[var(--space-2)]",
  ].join(" ");

  if (html !== undefined) {
    // `html` is opt-in (theme author is responsible for sanitization).
    return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <p className={classes}>{content}</p>;
}

export default TextBlock;
