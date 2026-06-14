# src/blocks/ — Block registry (Task 1.2)

The block registry is the catalog of block types the LATTICE editor can render
into a Page tree. Each block is defined by:

- A unique `type` discriminator
- A Zod schema for its props (token-driven per Skill 2)
- A React renderer that consumes only CSS custom properties

Skill 1 — CRDT Architecture applies: every block instance is stored as a
`Y.Map` under its parent section. The block _definition_ (the type catalog)
lives in this directory and is a normal TypeScript module — only the _instances_
mutate CRDT state.

This directory is created by the Task 0.1 scaffold. The registry, schemas, and
default props will land in Task 1.2.
