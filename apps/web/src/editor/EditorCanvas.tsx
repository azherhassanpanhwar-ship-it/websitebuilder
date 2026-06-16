"use client";

/**
 * LATTICE Editor Canvas (parity-rendered)
 * ───────────────────────────────────────
 * Renders a LATTICE site tree (Pages → Sections → Blocks) by reading
 * the Yjs CRDT directly. "Parity" means the canvas output is
 * byte-identical to the published site — no transform, no
 * placeholder, no "edit mode" overlay. The same components the
 * publish pipeline renders, the editor renders.
 *
 * Skill 1 — CRDT Architecture
 *   The canvas NEVER stores content in local React state. Every
 *   text, image URL, and structural decision lives in the Y.Doc.
 *   We subscribe to `Y.Array.observeDeep` on the pages array; the
 *   handler updates a `tick` state to re-render. The render itself
 *   reads from the live Y types each pass.
 *
 *   The Y.Doc is supplied by the parent (typically the editor's
 *   host page). The parent ALSO wraps this component in
 *   <ThemeProvider doc={doc} /> so the CSS variables are in scope
 *   when the block components render.
 *
 * Skill 2 — W3C Design Tokens
 *   The block components under BLOCK_COMPONENTS consume tokens
 *   directly (`bg-[var(--color-primary)]`, etc.). The canvas
 *   itself doesn't invent any values — it's a tree walker.
 *
 * Skill 3 — Zod at the boundary
 *   Block instance validation (every block's props) is done by
 *   BlockRegistry.validateBlock at the editor's boundary. The
 *   canvas trusts that the data in the Y.Doc is well-typed; an
 *   invalid block renders a placeholder.
 */

import * as React from "react";
import * as Y from "yjs";

import { BLOCK_COMPONENTS, type BlockComponentProps } from "@/blocks";
import type { BlockType } from "@/blocks/BlockSchema";

/** Y.Doc key for the pages array — matches the SiteTree convention. */
const PAGES_KEY = "site-pages";

/** Y.Map field keys for a Page (mirrors SiteTree / LatticeDoc). */
const PAGE_KEYS = {
  id: "id",
  slug: "slug",
  route: "route",
  title: "title",
  description: "description",
  meta: "meta",
  sections: "sections",
} as const;

/** Y.Map field keys for a Section. */
const SECTION_KEYS = {
  id: "id",
  name: "name",
  layout: "layout",
  blocks: "blocks",
} as const;

/** Y.Map field keys for a Block. */
const BLOCK_KEYS = {
  id: "id",
  type: "type",
  props: "props",
  content: "content",
} as const;

// ─── Public component ─────────────────────────────────────────────────────

export interface EditorCanvasProps {
  /**
   * The Y.Doc the editor is operating on. The canvas reads the pages
   * array from `doc.getArray("site-pages")` and observes it for
   * multiplayer changes.
   */
  doc: Y.Doc;
  /**
   * Optional fallback content shown while the Y.Doc is empty. Use
   * this to seed a brand-new editor with a single page so the canvas
   * is never blank. Defaults to no fallback.
   */
  fallback?: React.ReactNode;
  /**
   * Optional wrapper class for the canvas root. Use to constrain
   * width, add padding, etc. The default is `w-full`.
   */
  className?: string;
}

export function EditorCanvas({ doc, fallback, className = "w-full" }: EditorCanvasProps) {
  // The `tick` state exists ONLY to trigger re-renders. The content
  // itself is read from the Y.Doc on every render.
  const [tick, setTick] = React.useState(0);
  // Memoize the Y.Array so the useEffect dependency is stable across
  // renders (otherwise observe/unobserve churns on every render).
  const pages = React.useMemo(() => doc.getArray<Y.Map<unknown>>(PAGES_KEY), [doc]);

  React.useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    pages.observeDeep(handler);
    return () => pages.unobserveDeep(handler);
  }, [pages]);

  if (pages.length === 0) {
    return <div className={className}>{fallback ?? null}</div>;
  }

  return (
    <div className={className} data-editor-canvas data-tick={tick}>
      {pages.toArray().map((page) => (
        <PageView key={String(page.get(PAGE_KEYS.id))} page={page} />
      ))}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────

interface PageViewProps {
  page: Y.Map<unknown>;
}

function PageView({ page }: PageViewProps) {
  const id = String(page.get(PAGE_KEYS.id) ?? "");
  const route = String(page.get(PAGE_KEYS.route) ?? "/");
  const title = String(page.get(PAGE_KEYS.title) ?? "(untitled)");
  const sections = page.get(PAGE_KEYS.sections) as Y.Array<Y.Map<unknown>> | undefined;

  return (
    <article
      id={id}
      data-page-id={id}
      data-route={route}
      aria-label={title}
      className="flex w-full flex-col"
    >
      {sections
        ? sections
            .toArray()
            .map((section) => (
              <SectionView key={String(section.get(SECTION_KEYS.id))} section={section} />
            ))
        : null}
    </article>
  );
}

// ─── Section ────────────────────────────────────────────────────────────

interface SectionViewProps {
  section: Y.Map<unknown>;
}

function SectionView({ section }: SectionViewProps) {
  const id = String(section.get(SECTION_KEYS.id) ?? "");
  const name = String(section.get(SECTION_KEYS.name) ?? "");
  const layout = (section.get(SECTION_KEYS.layout) as string) ?? "contained";
  const blocks = section.get(SECTION_KEYS.blocks) as Y.Array<Y.Map<unknown>> | undefined;

  return (
    <section
      data-section-id={id}
      data-layout={layout}
      aria-label={name}
      className={layoutWrapperClass(layout)}
    >
      <div className={layoutInnerClass(layout)}>
        {blocks
          ? blocks
              .toArray()
              .map((block) => <BlockView key={String(block.get(BLOCK_KEYS.id))} block={block} />)
          : null}
      </div>
    </section>
  );
}

// ─── Block ──────────────────────────────────────────────────────────────

interface BlockViewProps {
  block: Y.Map<unknown>;
}

function BlockView({ block }: BlockViewProps) {
  const id = String(block.get(BLOCK_KEYS.id) ?? "");
  const type = (block.get(BLOCK_KEYS.type) as BlockType | undefined) ?? null;
  const propsMap = block.get(BLOCK_KEYS.props) as Y.Map<unknown> | undefined;
  const content = block.get(BLOCK_KEYS.content) as Y.Text | undefined;

  if (!type) {
    return <UnknownBlock id={id} reason="missing-type" message="This block has no `type` field." />;
  }

  const Component = BLOCK_COMPONENTS[type];
  if (!Component) {
    return (
      <UnknownBlock
        id={id}
        reason="no-component"
        message={`No component is registered for block type "${type}".`}
      />
    );
  }

  // Extract the block's props to a plain JS object. `Y.Map.toJSON()`
  // recursively converts Y types to plain values (Y.Map → object,
  // Y.Array → array, Y.Text → string). This is what the component
  // contract expects.
  const props = (propsMap?.toJSON() ?? {}) as BlockComponentProps;

  // Pre-rendered rich text (Y.Text) is exposed as `contentText` for
  // components that want the raw string. The base 5 components
  // don't use it — they render from `props` — but it's here for
  // future components.
  if (content) {
    props.contentText = content.toString();
  }

  return (
    <div data-block-id={id} data-block-type={type} className="block w-full">
      <Component type={type} {...props} />
    </div>
  );
}

// ─── Unknown block fallback ─────────────────────────────────────────────

function UnknownBlock({ id, reason, message }: { id: string; reason: string; message: string }) {
  return (
    <div
      data-block-id={id}
      data-block-reason={reason}
      role="status"
      className={[
        "my-[var(--space-4)] flex flex-col items-start gap-[var(--space-2)]",
        "rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-border)]",
        "bg-[color:var(--color-surface-alt)] p-[var(--space-4)]",
      ].join(" ")}
    >
      <span className="text-[length:var(--space-3)] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
        Unsupported block
      </span>
      <span className="text-[length:var(--space-4)] text-[color:var(--color-text)]">{message}</span>
    </div>
  );
}

// ─── Layout helpers (token-driven) ───────────────────────────────────────

function layoutWrapperClass(layout: string): string {
  // All values are token-driven. No hardcoded px.
  switch (layout) {
    case "full-bleed":
      return "w-full";
    case "split":
      return "w-full";
    case "grid":
      return "w-full";
    case "stack":
      return "w-full flex flex-col gap-[var(--space-4)] py-[var(--space-6)]";
    case "contained":
    default:
      return "w-full py-[var(--space-7)]";
  }
}

function layoutInnerClass(layout: string): string {
  switch (layout) {
    case "full-bleed":
      return "w-full";
    case "split":
      return "mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[var(--space-6)] px-[var(--space-6)] md:grid-cols-2";
    case "grid":
      return "mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[var(--space-5)] px-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-3";
    case "stack":
      return "mx-auto flex w-full max-w-[1440px] flex-col gap-[var(--space-4)] px-[var(--space-6)]";
    case "contained":
    default:
      return "mx-auto flex w-full max-w-[1440px] flex-col gap-[var(--space-4)] px-[var(--space-6)]";
  }
}

export default EditorCanvas;
