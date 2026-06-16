/**
 * docCodec unit tests (Task 1.4)
 * ──────────────────────────────
 * The codec is the most critical piece of the persistence module —
 * a round-trip failure here means data loss. Tests:
 *   1. Empty doc round-trips.
 *   2. A doc with a populated Y.Map round-trips.
 *   3. A doc with a Y.Text round-trips.
 *   4. Base64 round-trip is its own inverse (decoded bytes = original).
 *   5. Merging two snapshots into one doc yields the same state as
 *      if those updates had been applied sequentially.
 */
import { describe, it, expect } from "vitest";
import * as Y from "yjs";
import { encodeDoc, decodeDoc } from "@/persistence/docCodec";

describe("docCodec", () => {
  it("round-trips an empty doc", () => {
    const a = new Y.Doc();
    const b = new Y.Doc();
    const snap = encodeDoc(a);
    decodeDoc(b, snap);
    expect(encodeDoc(b)).toBe(snap);
  });

  it("round-trips a doc with a Y.Map", () => {
    const a = new Y.Doc();
    const m = a.getMap<unknown>("config");
    m.set("theme", "default");
    m.set("version", 3);
    const b = new Y.Doc();
    decodeDoc(b, encodeDoc(a));
    const mB = b.getMap<unknown>("config");
    expect(mB.get("theme")).toBe("default");
    expect(mB.get("version")).toBe(3);
  });

  it("round-trips a doc with a Y.Text", () => {
    const a = new Y.Doc();
    const t = a.getText("body");
    t.insert(0, "Hello, LATTICE!");
    const b = new Y.Doc();
    decodeDoc(b, encodeDoc(a));
    expect(b.getText("body").toString()).toBe("Hello, LATTICE!");
  });

  it("round-trips a doc with a Y.Array of objects", () => {
    const a = new Y.Doc();
    const arr = a.getArray<Y.Map<unknown>>("pages");
    const p1 = new Y.Map<unknown>();
    p1.set("slug", "home");
    p1.set("title", "Home");
    arr.push([p1]);
    const b = new Y.Doc();
    decodeDoc(b, encodeDoc(a));
    const bArr = b.getArray<Y.Map<unknown>>("pages");
    expect(bArr.length).toBe(1);
    expect(bArr.get(0).get("slug")).toBe("home");
    expect(bArr.get(0).get("title")).toBe("Home");
  });

  it("decoding an empty string is a no-op", () => {
    const a = new Y.Doc();
    a.getMap("test").set("k", "v");
    expect(() => decodeDoc(a, "")).not.toThrow();
    expect(a.getMap("test").get("k")).toBe("v");
  });

  it("rejects an invalid base64 string", () => {
    const a = new Y.Doc();
    expect(() => decodeDoc(a, "!!!not base64!!!")).toThrow();
  });

  it("merging two snapshots yields the union of state", () => {
    const a = new Y.Doc();
    a.getMap("k").set("a", 1);
    const b = new Y.Doc();
    b.getMap("k").set("b", 2);
    const c = new Y.Doc();
    decodeDoc(c, encodeDoc(a));
    decodeDoc(c, encodeDoc(b));
    expect(c.getMap("k").get("a")).toBe(1);
    expect(c.getMap("k").get("b")).toBe(2);
  });
});
