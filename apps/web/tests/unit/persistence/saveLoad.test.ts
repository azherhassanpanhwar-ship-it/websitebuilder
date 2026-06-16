/**
 * saveDoc + loadDoc unit tests (Task 1.4)
 * ────────────────────────────────────────
 * Verifies the save/load round-trip with a mocked Supabase client. We
 * do NOT hit a real network — `setSupabaseClient` swaps in a fake
 * that records every `upsert` / `select` call.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as Y from "yjs";

// Mock the supabase client before importing the module under test.
const upsertMock = vi.fn();
const selectMock = vi.fn();
const eqMock = vi.fn();
const maybeSingleMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/persistence/supabase", () => {
  return {
    getSupabaseClient: () => ({
      from: fromMock,
    }),
    setSupabaseClient: vi.fn(),
    resetSupabaseClient: vi.fn(),
  };
});

import { saveDoc, saveDocDebounced, loadDoc, setSupabaseClient } from "@/persistence";

beforeEach(() => {
  upsertMock.mockReset();
  selectMock.mockReset();
  eqMock.mockReset();
  maybeSingleMock.mockReset();
  fromMock.mockReset();
  upsertMock.mockResolvedValue({ error: null });
  maybeSingleMock.mockResolvedValue({ data: null, error: null });
  eqMock.mockReturnValue({ maybeSingle: maybeSingleMock });
  selectMock.mockReturnValue({ eq: eqMock });
  fromMock.mockReturnValue({ upsert: upsertMock, select: selectMock });
  setSupabaseClient({ from: fromMock } as never);
});

describe("saveDoc", () => {
  it("writes a row to y_doc_snapshots with the encoded snapshot", async () => {
    const doc = new Y.Doc();
    doc.getMap("site").set("title", "Test Site");
    const result = await saveDoc({ siteId: "site_1", doc, userId: "user_1" });
    expect(result.ok).toBe(true);
    expect(fromMock).toHaveBeenCalledWith("y_doc_snapshots");
    expect(upsertMock).toHaveBeenCalledTimes(1);
    const row = upsertMock.mock.calls[0]?.[0];
    expect(row.site_id).toBe("site_1");
    expect(row.updated_by).toBe("user_1");
    expect(typeof row.snapshot).toBe("string");
    expect(row.snapshot.length).toBeGreaterThan(0);
    expect(row.byte_size).toBe(new TextEncoder().encode(row.snapshot).byteLength);
    expect(upsertMock.mock.calls[0]?.[1]).toEqual({ onConflict: "site_id" });
  });

  it("returns ok=false when the Supabase call errors", async () => {
    upsertMock.mockResolvedValue({ error: { message: "network down" } });
    const doc = new Y.Doc();
    const result = await saveDoc({ siteId: "site_1", doc, userId: "user_1" });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("network down");
  });
});

describe("saveDocDebounced", () => {
  it("coalesces multiple schedule() calls into one save", async () => {
    const doc = new Y.Doc();
    doc.getMap("k").set("v", 1);
    const saver = saveDocDebounced({ siteId: "site_d", userId: "user_d", delayMs: 30 });
    saver.schedule(doc);
    doc.getMap("k").set("v", 2);
    saver.schedule(doc);
    doc.getMap("k").set("v", 3);
    saver.schedule(doc);
    await new Promise((r) => setTimeout(r, 80));
    expect(upsertMock).toHaveBeenCalledTimes(1);
  });

  it("flush() saves immediately even before the timer fires", async () => {
    const doc = new Y.Doc();
    doc.getMap("k").set("v", 1);
    const saver = saveDocDebounced({ siteId: "site_f", userId: "user_f", delayMs: 10_000 });
    saver.schedule(doc);
    const result = await saver.flush();
    expect(result?.ok).toBe(true);
    expect(upsertMock).toHaveBeenCalledTimes(1);
  });

  it("cancel() drops a pending save without firing", async () => {
    const doc = new Y.Doc();
    const saver = saveDocDebounced({ siteId: "site_c", userId: "user_c", delayMs: 30 });
    saver.schedule(doc);
    saver.cancel();
    await new Promise((r) => setTimeout(r, 80));
    expect(upsertMock).not.toHaveBeenCalled();
  });
});

describe("loadDoc", () => {
  it("returns found=false when no row exists", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    const doc = new Y.Doc();
    const result = await loadDoc({ siteId: "site_empty", doc });
    expect(result.found).toBe(false);
    expect(result.error).toBeUndefined();
  });

  it("applies the snapshot to the doc when a row exists", async () => {
    // Build a snapshot from a separate doc, then have loadDoc apply it.
    const source = new Y.Doc();
    source.getMap("config").set("theme", "dark");
    const snapshotB64 = (await import("@/persistence/docCodec")).encodeDoc(source);
    maybeSingleMock.mockResolvedValue({
      data: {
        site_id: "site_x",
        snapshot: snapshotB64,
        byte_size: snapshotB64.length,
        updated_at: new Date().toISOString(),
        updated_by: "user_other",
      },
      error: null,
    });
    const target = new Y.Doc();
    const result = await loadDoc({ siteId: "site_x", doc: target });
    expect(result.found).toBe(true);
    expect(target.getMap("config").get("theme")).toBe("dark");
  });

  it("returns an error when the Supabase call fails", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: { message: "permission denied" } });
    const doc = new Y.Doc();
    const result = await loadDoc({ siteId: "site_err", doc });
    expect(result.found).toBe(false);
    expect(result.error).toBe("permission denied");
  });
});
