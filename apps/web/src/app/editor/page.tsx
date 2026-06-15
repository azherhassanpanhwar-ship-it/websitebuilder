"use client";

/**
 * Editor test page
 * ─────────────────
 * A minimal page that demonstrates the ThemeProvider + EditorCanvas
 * stack end-to-end. Creates a Y.Doc, populates it with a sample site
 * tree via `LatticeDoc` (Task 1.1) + `BlockRegistry` (Task 1.2), then
 * renders the canvas wrapped in the ThemeProvider.
 *
 * This page is intentionally a single file — it serves as both a
 * smoke test for the editor stack and a worked example for future
 * editor host pages.
 *
 * Skill 1 — CRDT
 *   The Y.Doc is created once and held in a `useRef` so it survives
 *   re-renders. Every content decision lives in the doc; the
 *   component is just a tree walker.
 */

import * as React from "react";
import * as Y from "yjs";

import { LatticeDoc } from "@/crdt/LatticeDoc";
import { BlockRegistry } from "@/blocks/BlockRegistry";
import { ThemeProvider } from "@/engine/theme/ThemeProvider";
import { EditorCanvas } from "@/editor/EditorCanvas";

export default function EditorPage() {
  // Hold the Y.Doc + LatticeDoc + registry in refs so they survive
  // re-renders. Created exactly once.
  const env = React.useMemo(() => {
    const doc = new Y.Doc();
    const lattice = new LatticeDoc(doc);
    const registry = new BlockRegistry(doc);
    return { doc, lattice, registry };
  }, []);

  // Theme is stored in a Y.Map so multiplayer peers see live changes.
  // For the test page we just seed it with a minimal valid Theme.
  React.useEffect(() => {
    const themeMap = env.doc.getMap("theme");
    if (themeMap.size > 0) return;
    const theme = sampleTheme();
    env.doc.transact(() => {
      for (const [k, v] of Object.entries(theme)) {
        themeMap.set(k, v);
      }
    });

    // Seed a sample site tree: one page → one section → three blocks.
    const pageId = env.lattice.addPage({
      slug: "home",
      title: "Home",
      description: "The LATTICE demo page.",
      isHome: true,
    });
    const sectionId = env.lattice.addSection(pageId, {
      name: "Main",
      layout: "contained",
    });
    if (!sectionId) {
      return; // page disappeared between addPage and addSection (defensive)
    }
    env.lattice.addBlock(pageId, sectionId, {
      type: "hero",
      props: {
        title: "LATTICE — built for the next 500 themes",
        subtitle: "WCAG 2.2 AA, Lighthouse 95+, zero hardcoded values. The visual website builder that ships.",
        ctaLabel: "Get started",
        ctaHref: "#",
        secondaryCtaLabel: "Browse themes",
        secondaryCtaHref: "#",
        imageUrl: "",
        pattern: "full-bleed-image",
        alignment: "center",
      },
    });
    env.lattice.addBlock(pageId, sectionId, {
      type: "text",
      props: {
        content: "LATTICE themes are token-driven from the ground up. No hex literals, no hardcoded px — every visual primitive flows through CSS variables.",
        align: "center",
        size: "md",
        variant: "body",
      },
    });
    env.lattice.addBlock(pageId, sectionId, {
      type: "image",
      props: {
        src: "",
        alt: "LATTICE architecture diagram",
        aspectRatio: "16/9",
        fit: "cover",
        caption: "Components consume tokens, never values.",
      },
    });
    return () => {
      // Note: we deliberately do NOT destroy the Y.Doc on unmount
      // because the seed effect runs only on first mount.
    };
  }, [env]);

  return (
    <ThemeProvider doc={env.doc}>
      <main className="min-h-screen w-full bg-[color:var(--color-surface)] text-[color:var(--color-text)]">
        <EditorCanvas doc={env.doc} className="mx-auto w-full max-w-[1440px]" />
      </main>
    </ThemeProvider>
  );
}

// ─── Sample theme (deliberately minimal — real themes come from the generator) ──

function sampleTheme() {
  return {
    description: "Test theme for the editor scaffold.",
    metadata: {
      category: "tech-saas",
      colorMood: "cool",
      designStyle: "minimal",
      name: "Editor Test Theme",
      screenshot: "screenshot.png",
      slug: "editor-test-theme",
      subcategory: "general",
      tags: ["test", "editor"],
      targetIndustry: "general",
      authors: [],
      gallery: [],
      version: "1.0.0",
      wcagLevel: "AA",
    },
    settings: {
      color: {
        accent: "--color-accent-500",
        border: "--color-border",
        error: "--color-error",
        focusRing: "--color-focus-ring",
        onAccent: "--color-on-accent",
        onPrimary: "--color-on-primary",
        primary: "--color-primary-500",
        success: "--color-success",
        surface: "--color-surface",
        surfaceAlt: "--color-surface-alt",
        surfaceDark: "--color-surface-dark",
        text: "--color-text",
        textMuted: "--color-text-muted",
      },
      typography: {
        bodyLineHeight: 1.6,
        displayLineHeight: 1.15,
        family: { body: "--font-body", display: "--font-display" },
        scaleRatio: 1.25,
        weights: { bold: 700, medium: 500, regular: 400 },
      },
      spacing: { baseUnit: "--space-2", density: "comfortable", radius: "--radius-md" },
      shadow: { card: "--shadow-md", style: "subtle" },
      hero: {
        alignment: "bottom",
        minHeight: "--space-10",
        pattern: "full-bleed-image",
      },
      header: {
        background: "--color-surface",
        foreground: "--color-text",
        height: "--space-8",
        style: "solid-sticky",
      },
      footer: {
        background: "--color-surface-dark",
        foreground: "--color-text-muted",
        newsletter: false,
        style: "expanded",
      },
      animation: {
        durationBase: "--duration-base",
        durationEnter: "--duration-enter",
        durationFast: "--duration-fast",
        durationPage: "--duration-page",
        easingStandard: "--easing-standard",
        respectReducedMotion: true,
        style: "subtle",
      },
    },
    presets: [
      { id: "bold", label: "Bold", overrides: { animation: { style: "bold" }, shadow: { style: "pronounced" } } },
      { id: "minimal", label: "Minimal", overrides: { animation: { style: "none" }, shadow: { style: "none" } } },
      { id: "warm", label: "Warm", overrides: { animation: { style: "subtle" }, shadow: { style: "subtle" } } },
    ],
  };
}
