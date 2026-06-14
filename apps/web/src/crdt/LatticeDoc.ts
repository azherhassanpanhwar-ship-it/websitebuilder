/**
 * LATTICE Document Substrate
 * ──────────────────────────
 * The single source of truth for every persistent site-state byte in LATTICE.
 *
 * Skill 1 — CRDT Architecture (Yjs)
 *   - ALL persistent document, theme, and block data lives inside Yjs shared
 *     types. No `useState` / `useReducer` may ever back persistent state.
 *   - Sync flows through the Yjs provider layer (y-websocket / y-webrtc) — this
 *     file is provider-agnostic.
 *   - Ephemeral UI state (hover, focus, spinners) is the only React-state
 *     we permit; it lives outside this file.
 *
 * Tree shape:
 *   Doc
 *   ├── meta         : Y.Map<unknown>      (site-level metadata)
 *   ├── pages        : Y.Array<Y.Map>      (top-level: Pages)
 *   │   └── Page     : Y.Map
 *   │       ├── id / slug / title / seo…
 *   │       └── sections : Y.Array<Y.Map>  (Sections inside a Page)
 *   │           └── Section : Y.Map
 *   │               ├── id / name / layout…
 *   │               └── blocks   : Y.Array<Y.Map> (Blocks inside a Section)
 *   │                   └── Block : Y.Map
 *   │                       ├── id / type
 *   │                       ├── props   : Y.Map  (token-driven — see Skill 2)
 *   │                       └── content : Y.Text (rich text)
 *   └── theme        : Y.Map<unknown>      (Theme Settings — see ThemeSchema)
 */

import * as Y from "yjs";
import { uuidv4 } from "lib0/random";

// ─── Block identity (lightweight discriminator types) ───────────────────────

/** Built-in block kinds the runtime renders. Themes may register more. */
export type BlockType =
  | "hero"
  | "header"
  | "footer"
  | "text"
  | "image"
  | "gallery"
  | "video"
  | "form"
  | "menu"
  | "reservation"
  | "product-card"
  | "cart"
  | "checkout"
  | "testimonial"
  | "faq"
  | "cta"
  | "embed"
  | "custom";

/** Layout role a Section plays inside its parent Page. */
export type SectionLayout = "full-bleed" | "contained" | "split" | "grid" | "stack";

/** Block-level value types permitted inside `props`. */
export type BlockPropValue =
  | string
  | number
  | boolean
  | null
  | { ref: string } // token reference — see Skill 2
  | string[]
  | { [k: string]: BlockPropValue };

// ─── Strongly-typed readers (view side) ─────────────────────────────────────

export interface PageSnapshot {
  id: string;
  slug: string;
  title: string;
  description: string;
  isHome: boolean;
  order: number;
  sections: SectionSnapshot[];
}

export interface SectionSnapshot {
  id: string;
  name: string;
  layout: SectionLayout;
  order: number;
  blocks: BlockSnapshot[];
}

export interface BlockSnapshot {
  id: string;
  type: BlockType;
  props: Record<string, BlockPropValue>;
  contentText: string;
}

// ─── The LatticeDoc class ───────────────────────────────────────────────────

/**
 * LatticeDoc wraps a single Y.Doc that models one LATTICE site.
 * The class is the *only* handle through which the editor mutates persistent
 * state; React components must not call `new Y.Doc()` themselves.
 */
export class LatticeDoc {
  public readonly doc: Y.Doc;

  /** Site-level metadata (title, locale, theme id, …). */
  public readonly meta: Y.Map<unknown>;

  /** Pages, ordered by `order` field inside each Page map. */
  public readonly pages: Y.Array<Y.Map<unknown>>;

  /** Theme settings — keys mirror ThemeSchema (see src/engine/theme). */
  public readonly theme: Y.Map<unknown>;

  constructor(initialDoc?: Y.Doc) {
    this.doc = initialDoc ?? new Y.Doc();
    this.meta = this.doc.getMap("meta");
    this.pages = this.doc.getArray<Y.Map<unknown>>("pages");
    this.theme = this.doc.getMap("theme");
  }

  // ─── Pages ──────────────────────────────────────────────────────────────

  /**
   * Append a new page. Generates a stable id if one is not supplied.
   * All mutations occur inside a single Yjs transaction so peers see one update.
   */
  addPage(input: {
    id?: string;
    slug: string;
    title: string;
    description?: string;
    isHome?: boolean;
    order?: number;
  }): string {
    const id = input.id ?? createId("page");
    this.doc.transact(() => {
      const page = new Y.Map<unknown>();
      page.set("id", id);
      page.set("slug", input.slug);
      page.set("title", input.title);
      page.set("description", input.description ?? "");
      page.set("isHome", input.isHome ?? false);
      page.set("order", input.order ?? this.pages.length);
      page.set("sections", new Y.Array<Y.Map<unknown>>());
      this.pages.push([page]);
    });
    return id;
  }

  /**
   * Find a page by id. Returns the live Y.Map so callers can subscribe to
   * deep observers — do not mutate it directly, use the typed helpers.
   */
  getPageMap(id: string): Y.Map<unknown> | undefined {
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages.get(i);
      if (page.get("id") === id) return page;
    }
    return undefined;
  }

  /** Snapshot a page as a plain JSON object (for serialization, transport). */
  snapshotPage(id: string): PageSnapshot | undefined {
    const page = this.getPageMap(id);
    if (!page) return undefined;
    const sections = page.get("sections") as Y.Array<Y.Map<unknown>>;
    return {
      id: String(page.get("id")),
      slug: String(page.get("slug")),
      title: String(page.get("title")),
      description: String(page.get("description") ?? ""),
      isHome: Boolean(page.get("isHome")),
      order: Number(page.get("order") ?? 0),
      sections: sections.toArray().map((s) => this.snapshotSection(s)),
    };
  }

  /** Snapshot the entire site — pages, in `order`. */
  snapshot(): PageSnapshot[] {
    return this.pages
      .toArray()
      .sort((a, b) => Number(a.get("order") ?? 0) - Number(b.get("order") ?? 0))
      .map((p) => this.snapshotPage(String(p.get("id"))))
      .filter((p): p is PageSnapshot => Boolean(p));
  }

  removePage(id: string): boolean {
    for (let i = 0; i < this.pages.length; i++) {
      if (this.pages.get(i).get("id") === id) {
        this.doc.transact(() => this.pages.delete(i, 1));
        return true;
      }
    }
    return false;
  }

  // ─── Sections ───────────────────────────────────────────────────────────

  addSection(
    pageId: string,
    input: {
      id?: string;
      name: string;
      layout?: SectionLayout;
      order?: number;
    },
  ): string | undefined {
    const page = this.getPageMap(pageId);
    if (!page) return undefined;
    const id = input.id ?? createId("section");
    this.doc.transact(() => {
      const section = new Y.Map<unknown>();
      section.set("id", id);
      section.set("name", input.name);
      section.set("layout", input.layout ?? "contained");
      section.set("order", input.order ?? 0);
      section.set("blocks", new Y.Array<Y.Map<unknown>>());
      (page.get("sections") as Y.Array<Y.Map<unknown>>).push([section]);
    });
    return id;
  }

  // ─── Blocks ─────────────────────────────────────────────────────────────

  addBlock(
    pageId: string,
    sectionId: string,
    input: {
      id?: string;
      type: BlockType;
      props?: Record<string, BlockPropValue>;
      contentText?: string;
    },
  ): string | undefined {
    const page = this.getPageMap(pageId);
    if (!page) return undefined;
    const sections = page.get("sections") as Y.Array<Y.Map<unknown>>;
    let section: Y.Map<unknown> | undefined;
    for (let i = 0; i < sections.length; i++) {
      if (sections.get(i).get("id") === sectionId) {
        section = sections.get(i);
        break;
      }
    }
    if (!section) return undefined;

    const id = input.id ?? createId("block");
    this.doc.transact(() => {
      const block = new Y.Map<unknown>();
      block.set("id", id);
      block.set("type", input.type);
      const props = new Y.Map<unknown>();
      for (const [k, v] of Object.entries(input.props ?? {})) props.set(k, v);
      block.set("props", props);
      const content = new Y.Text();
      if (input.contentText) content.insert(0, input.contentText);
      block.set("content", content);
      (section.get("blocks") as Y.Array<Y.Map<unknown>>).push([block]);
    });
    return id;
  }

  // ─── Observability ──────────────────────────────────────────────────────

  /**
   * Subscribe to a "something changed" notification. Fires after every
   * batched transaction, whether the change came from this peer or a remote.
   * The callback receives the Yjs `Transaction` — use it to inspect
   * `transaction.changed` (a `Map<Y.AbstractType, Y.YEvent<Y.AbstractType>>`)
   * if you need fine-grained diffs.
   */
  observe(callback: (tx: Y.Transaction) => void): () => void {
    this.doc.on("afterTransaction", callback);
    return () => this.doc.off("afterTransaction", callback);
  }

  // ─── Internals ──────────────────────────────────────────────────────────

  private snapshotSection(section: Y.Map<unknown>): SectionSnapshot {
    const blocks = section.get("blocks") as Y.Array<Y.Map<unknown>> | undefined;
    return {
      id: String(section.get("id")),
      name: String(section.get("name")),
      layout: (section.get("layout") as SectionLayout) ?? "contained",
      order: Number(section.get("order") ?? 0),
      blocks: blocks
        ? blocks.toArray().map((b) => ({
            id: String(b.get("id")),
            type: b.get("type") as BlockType,
            props: ((b.get("props") as Y.Map<unknown> | undefined)?.toJSON() ??
              {}) as Record<string, BlockPropValue>,
            contentText: ((b.get("content") as Y.Text | undefined)?.toString() ?? ""),
          }))
        : [],
    };
  }
}

// ─── ID generation ──────────────────────────────────────────────────────────

/**
 * Create a prefixed id. Centralised so we can swap to ULID/nanoid later
 * without hunting through the codebase.
 */
export function createId(kind: "page" | "section" | "block"): string {
  return `${kind}_${uuidv4()}`;
}
