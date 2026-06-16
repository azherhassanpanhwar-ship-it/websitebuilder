/**
 * LATTICE Site Tree (Task 1.3)
 * ────────────────────────────
 * Higher-level Yjs substrate for the site tree. Wraps a single `Y.Doc`
 * (the same one the LatticeDoc substrate uses — see `LatticeDoc` for the
 * raw version) and exposes typed accessors for Site → Pages → Sections →
 * Blocks, with first-class support for routing and per-page metadata.
 *
 * Skill 1 — CRDT Architecture
 *   Every persistent byte — site metadata, the pages array, every page's
 *   sections, every section's blocks, every block's props and children —
 *   is a Yjs shared type. No `useState` anywhere.
 *
 * Tree shape:
 *   doc
 *   ├── site         : Y.Map<unknown>   (site-level metadata — name, locale, theme id)
 *   └── site-pages   : Y.Array<Y.Map>   (pages)
 *       └── Page     : Y.Map
 *           ├── id / slug / route / title / description / isHome / order
 *           ├── meta   : Y.Map          (SEO metadata: ogImage, noindex, canonical, …)
 *           └── sections : Y.Array<Y.Map>
 *               └── Section : Y.Map
 *                   ├── id / name / layout / order
 *                   └── blocks   : Y.Array<Y.Map>   (Block instances from BlockRegistry)
 *                       └── Block : Y.Map
 *                           ├── id / type
 *                           ├── props   : Y.Map  (token-driven — see Skill 2)
 *                           └── children: Y.Array (recursive)
 */

import * as Y from "yjs";
import { createId } from "./ids";
import { BlockRegistry } from "../blocks/BlockRegistry";
import { BlockType } from "../blocks/BlockSchema";

// ─── Section layout (the role a section plays in its page) ────────────────

export const SectionLayout = ["full-bleed", "contained", "split", "grid", "stack"] as const;
export type SectionLayout = (typeof SectionLayout)[number];

// ─── Plain-JS snapshots (view side) ────────────────────────────────────────

export interface PageMeta {
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
}

export interface Page {
  id: string;
  slug: string;
  /** Full route, e.g. "/about" or "/products/widget". Defaults to /{slug}. */
  route: string;
  title: string;
  description: string;
  isHome: boolean;
  order: number;
  meta: PageMeta;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  layout: SectionLayout;
  order: number;
  blocks: BlockInstance[];
}

export interface BlockInstance {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

// ─── The SiteTree class ───────────────────────────────────────────────────

export class SiteTree {
  private readonly doc: Y.Doc;
  private readonly registry: BlockRegistry;
  private readonly site: Y.Map<unknown>;
  private readonly pages: Y.Array<Y.Map<unknown>>;

  constructor(doc: Y.Doc, registry: BlockRegistry) {
    this.doc = doc;
    this.registry = registry;
    this.site = doc.getMap("site");
    this.pages = doc.getArray<Y.Map<unknown>>("site-pages");
  }

  // ─── Accessors ────────────────────────────────────────────────────────

  getDoc(): Y.Doc {
    return this.doc;
  }
  getRegistry(): BlockRegistry {
    return this.registry;
  }
  getSiteMap(): Y.Map<unknown> {
    return this.site;
  }
  getPages(): Y.Array<Y.Map<unknown>> {
    return this.pages;
  }

  // ─── Site-level metadata ──────────────────────────────────────────────

  setSiteMeta(key: string, value: unknown): void {
    this.doc.transact(() => this.site.set(key, value));
  }

  getSiteMeta<T = unknown>(key: string): T | undefined {
    return this.site.get(key) as T | undefined;
  }

  // ─── Pages ────────────────────────────────────────────────────────────

  addPage(input: {
    slug: string;
    title: string;
    description?: string;
    isHome?: boolean;
    /** Explicit route override. Defaults to "/{slug}". */
    route?: string;
    meta?: PageMeta;
    order?: number;
  }): string {
    const id = createId("page");
    this.doc.transact(() => {
      const page = new Y.Map<unknown>();
      page.set("id", id);
      page.set("slug", input.slug);
      page.set("route", input.route ?? `/${input.slug}`);
      page.set("title", input.title);
      page.set("description", input.description ?? "");
      page.set("isHome", input.isHome ?? false);
      page.set("order", input.order ?? this.pages.length);

      const meta = new Y.Map<unknown>();
      const metaSeed: PageMeta = { title: input.title, ...input.meta };
      for (const [k, v] of Object.entries(metaSeed)) {
        if (v !== undefined) meta.set(k, v);
      }
      page.set("meta", meta);

      page.set("sections", new Y.Array<Y.Map<unknown>>());
      this.pages.push([page]);
    });
    return id;
  }

  getPageMap(id: string): Y.Map<unknown> | undefined {
    return this.findById(this.pages, id);
  }

  /** Find a page by its public route, e.g. "/about". */
  getPageByRoute(route: string): Y.Map<unknown> | undefined {
    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages.get(i);
      if (p.get("route") === route) return p;
    }
    return undefined;
  }

  /** Find a page by slug (no leading slash). */
  getPageBySlug(slug: string): Y.Map<unknown> | undefined {
    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages.get(i);
      if (p.get("slug") === slug) return p;
    }
    return undefined;
  }

  removePage(id: string): boolean {
    return this.removeById(this.pages, id);
  }

  // ─── Sections ─────────────────────────────────────────────────────────

  addSection(
    pageId: string,
    input: {
      name: string;
      layout?: SectionLayout;
      order?: number;
    },
  ): string | undefined {
    const page = this.getPageMap(pageId);
    if (!page) return undefined;
    const id = createId("section");
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

  getSectionMap(pageId: string, sectionId: string): Y.Map<unknown> | undefined {
    const page = this.getPageMap(pageId);
    if (!page) return undefined;
    const sections = page.get("sections") as Y.Array<Y.Map<unknown>>;
    return this.findById(sections, sectionId);
  }

  // ─── Blocks ───────────────────────────────────────────────────────────

  /**
   * Add a block of the given registered type to a section. The block
   * instance is produced by the BlockRegistry so its props default to the
   * catalog values and respect Skill 2 (no hex / px).
   */
  addBlock(
    pageId: string,
    sectionId: string,
    type: string,
    overrides?: Record<string, unknown>,
  ): string | undefined {
    const section = this.getSectionMap(pageId, sectionId);
    if (!section) return undefined;
    if (!this.registry.has(type)) {
      throw new Error(
        `Block type "${type}" is not registered. Call BlockRegistry.register() first.`,
      );
    }
    const block = this.registry.createInstance(type, overrides);
    this.doc.transact(() => {
      (section.get("blocks") as Y.Array<Y.Map<unknown>>).push([block]);
    });
    return String(block.get("id"));
  }

  /** Remove a block from a section. */
  removeBlock(pageId: string, sectionId: string, blockId: string): boolean {
    const section = this.getSectionMap(pageId, sectionId);
    if (!section) return false;
    const blocks = section.get("blocks") as Y.Array<Y.Map<unknown>>;
    return this.removeById(blocks, blockId);
  }

  // ─── Serialization ────────────────────────────────────────────────────

  /**
   * Snapshot the whole site as plain JS, in `order`. Safe to JSON.stringify.
   */
  snapshot(): Page[] {
    return this.pages
      .toArray()
      .sort((a, b) => Number(a.get("order") ?? 0) - Number(b.get("order") ?? 0))
      .map((p) => this.snapshotPage(p))
      .filter((p): p is Page => Boolean(p));
  }

  // ─── Internals ────────────────────────────────────────────────────────

  private findById(arr: Y.Array<Y.Map<unknown>>, id: string): Y.Map<unknown> | undefined {
    for (let i = 0; i < arr.length; i++) {
      if (arr.get(i).get("id") === id) return arr.get(i);
    }
    return undefined;
  }

  private removeById(arr: Y.Array<Y.Map<unknown>>, id: string): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr.get(i).get("id") === id) {
        this.doc.transact(() => arr.delete(i, 1));
        return true;
      }
    }
    return false;
  }

  private snapshotPage(page: Y.Map<unknown>): Page | undefined {
    const sections = page.get("sections") as Y.Array<Y.Map<unknown>>;
    return {
      id: String(page.get("id")),
      slug: String(page.get("slug")),
      route: String(page.get("route")),
      title: String(page.get("title")),
      description: String(page.get("description") ?? ""),
      isHome: Boolean(page.get("isHome")),
      order: Number(page.get("order") ?? 0),
      meta: ((page.get("meta") as Y.Map<unknown>).toJSON() as PageMeta) ?? {},
      sections: sections.toArray().map((s) => this.snapshotSection(s)),
    };
  }

  private snapshotSection(section: Y.Map<unknown>): Section {
    const blocks = section.get("blocks") as Y.Array<Y.Map<unknown>>;
    return {
      id: String(section.get("id")),
      name: String(section.get("name")),
      layout: (section.get("layout") as SectionLayout) ?? "contained",
      order: Number(section.get("order") ?? 0),
      blocks: blocks.toArray().map((b) => ({
        id: String(b.get("id")),
        type: b.get("type") as BlockType,
        props: ((b.get("props") as Y.Map<unknown>).toJSON() as Record<string, unknown>) ?? {},
      })),
    };
  }
}
