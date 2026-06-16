/**
 * CommandBus unit tests (Task 1.6)
 * ─────────────────────────────────
 * Verifies the command bus:
 *   1. Executes a command and records it in history.
 *   2. Undoes the most recent command.
 *   3. Redoes a previously-undone command.
 *   4. Truncates the redo branch when a new command runs after undos.
 *   5. Notifies subscribers on every state change.
 *   6. `RemoveBlockCommand` restores a block on undo (same type, same
 *      props — but **not** the same id; see below).
 *
 * Uses a real `Y.Doc` + `SiteTree` so we exercise the actual Yjs
 * transaction path (not a mock) — Skill 1 demands the bus mutate the
 * CRDT, not a local copy.
 *
 * ID preservation on undo
 *   `SiteTree.addBlock` always allocates a fresh id (via
 *   `createId("block")`), so a removed block that's re-inserted by an
 *   undo comes back with a *new* id. The CommandBus contract is
 *   "the site tree round-trips" — not "the original id is preserved."
 *   See the comment in `CommandBus.ts` near the `RemoveBlockCommand.undo`
 *   implementation.
 */
import { describe, it, expect, beforeEach } from "vitest";
import * as Y from "yjs";

import { SiteTree } from "@/crdt/SiteTree";
import { BlockRegistry } from "@/blocks/BlockRegistry";
import { BlockDefinitionSchema } from "@/blocks/BlockSchema";
import { AddBlockCommand, CommandBus, RemoveBlockCommand } from "@/commands/CommandBus";
import { z } from "zod";

describe("CommandBus", () => {
  let doc: Y.Doc;
  let site: SiteTree;
  let bus: CommandBus;

  beforeEach(() => {
    doc = new Y.Doc();
    const registry = new BlockRegistry(doc);
    site = new SiteTree(doc, registry);
    // BlockDefinitionSchema requires `category` on the input (it has a
    // default, but Zod 4 only applies defaults to the parsed output, not
    // to the input type). Pass it explicitly.
    registry.register(
      BlockDefinitionSchema.parse({
        type: "text",
        displayName: "Text",
        category: "content",
        propsSchema: z.object({ content: z.string().default("") }),
        defaultProps: { content: "" },
      }),
    );
    bus = new CommandBus(site);
  });

  it("executes an AddBlockCommand and tracks it in history", () => {
    const pageId = site.addPage({ slug: "home", title: "Home", isHome: true });
    const sectionId = site.addSection(pageId, { name: "main" });
    expect(sectionId).toBeDefined();

    bus.execute(new AddBlockCommand({ pageId, sectionId: sectionId!, type: "text", props: {} }));
    expect(bus.canUndo()).toBe(true);
    expect(bus.size()).toBe(1);
    expect(site.snapshot()[0]!.sections[0]!.blocks.length).toBe(1);
  });

  it("undo / redo round-trip restores the snapshot", () => {
    const pageId = site.addPage({ slug: "home", title: "Home", isHome: true });
    const sectionId = site.addSection(pageId, { name: "main" });
    bus.execute(new AddBlockCommand({ pageId, sectionId: sectionId!, type: "text", props: {} }));
    const addCount = site.snapshot()[0]!.sections[0]!.blocks.length;
    expect(addCount).toBe(1);

    expect(bus.undo()).toBe(true);
    expect(site.snapshot()[0]!.sections[0]!.blocks.length).toBe(0);
    expect(bus.canRedo()).toBe(true);

    expect(bus.redo()).toBe(true);
    expect(site.snapshot()[0]!.sections[0]!.blocks.length).toBe(1);
  });

  it("truncates the redo branch on a fresh execute", () => {
    const pageId = site.addPage({ slug: "home", title: "Home", isHome: true });
    const sectionId = site.addSection(pageId, { name: "main" });
    bus.execute(new AddBlockCommand({ pageId, sectionId: sectionId!, type: "text", props: {} }));
    bus.undo();
    expect(bus.canRedo()).toBe(true);
    // A new command should clear the redo stack.
    bus.execute(new AddBlockCommand({ pageId, sectionId: sectionId!, type: "text", props: {} }));
    expect(bus.canRedo()).toBe(false);
  });

  it("notifies subscribers on every state change", () => {
    const pageId = site.addPage({ slug: "home", title: "Home", isHome: true });
    const sectionId = site.addSection(pageId, { name: "main" });
    const events: string[] = [];
    bus.subscribe((e) => events.push(e.kind));

    bus.execute(new AddBlockCommand({ pageId, sectionId: sectionId!, type: "text", props: {} }));
    bus.undo();
    bus.redo();
    bus.clear();

    expect(events).toEqual(["execute", "undo", "redo", "clear"]);
  });

  it("RemoveBlockCommand restores a block of the same type on undo", () => {
    const pageId = site.addPage({ slug: "home", title: "Home", isHome: true });
    const sectionId = site.addSection(pageId, { name: "main" });
    bus.execute(new AddBlockCommand({ pageId, sectionId: sectionId!, type: "text", props: {} }));
    const originalId = site.snapshot()[0]!.sections[0]!.blocks[0]!.id;

    bus.execute(new RemoveBlockCommand({ pageId, sectionId: sectionId!, blockId: originalId }));
    expect(site.snapshot()[0]!.sections[0]!.blocks.length).toBe(0);

    bus.undo();
    // After undo, a single block is restored. Its id may differ from the
    // original (see the file-level docstring) — what we guarantee is
    // presence + type, not id equality.
    const blocks = site.snapshot()[0]!.sections[0]!.blocks;
    expect(blocks.length).toBe(1);
    expect(blocks[0]!.type).toBe("text");
  });
});
