/**
 * LATTICE Marketplace API Schemas
 * ──────────────────────────────────
 * Zod-validated request / response payloads for the three marketplace
 * endpoints: submit, install, review. Shared between the route handlers
 * (`apps/web/src/app/api/themes/.../route.ts`) and any client-side code
 * that hits the API.
 *
 * Skill 3 — Zod Schema Validation
 *   Every API boundary has a Zod schema. The route handlers use
 * `.safeParse()` to validate incoming JSON; the inferred TS types are
 * re-exported from `apps/web/src/types/LatticeTypes.ts` so consumers
 * never hand-write parallel interfaces.
 *
 * The schemas are intentionally strict — minimum lengths, kebab-case
 * slugs, valid semver, valid email, etc. — so the marketplace can't
 * accept malformed submissions.
 */

import { z } from "zod";
import { Theme } from "../../engine/theme/ThemeSchema";

// ─── Shared primitives ──────────────────────────────────────────────────────

const Slug = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/, "slug must be kebab-case")
  .min(2)
  .max(64);

const SemVer = z.string().regex(/^\d+\.\d+\.\d+$/, "version must be semver (e.g. 1.0.0)");

const Email = z.string().email().max(254);

const Url = z.string().url().max(2048).optional();

/** A short, deterministic id (kebab-case, 4–32 chars). */
const ShortId = z.string().regex(/^[a-z][a-z0-9-]{3,31}$/, "id must be kebab-case, 4–32 chars");

/** A screenshot / asset URL (https or relative). */
const AssetUrl = z
  .string()
  .min(1)
  .max(2048)
  .refine(
    (s) => s.startsWith("https://") || s.startsWith("http://") || s.startsWith("/"),
    "asset must be an http(s) URL or a root-relative path",
  );

// ─── Author block (reused across submit + review) ──────────────────────────

export const AuthorSchema = z
  .object({
    name: z.string().min(1).max(80),
    email: Email,
    url: Url,
    organization: z.string().max(80).optional(),
  })
  .strict();
export type Author = z.infer<typeof AuthorSchema>;

// ─── Theme submit ──────────────────────────────────────────────────────────

export const ThemeSubmitRequestSchema = z
  .object({
    /** The full theme artifact, validated against the canonical Theme schema. */
    theme: Theme,
    /** Author / vendor attribution for the marketplace listing. */
    author: AuthorSchema,
    /** Marketplace screenshots — usually 1, up to 6. */
    screenshots: z.array(AssetUrl).min(1).max(6),
    /** Markdown changelog describing what changed in this version. */
    changelog: z.string().min(20).max(8000),
    /** Optional list of tags for the marketplace filter. */
    tags: z.array(z.string().min(1).max(32)).max(16).optional(),
  })
  .strict();
export type ThemeSubmitRequest = z.infer<typeof ThemeSubmitRequestSchema>;

export const ThemeSubmitResponseSchema = z
  .object({
    /** The marketplace-assigned review id. */
    reviewId: ShortId,
    /** Echo of the submitted slug for the client's correlation. */
    slug: Slug,
    /** Echo of the submitted semver. */
    version: SemVer,
    /** Initial review state — every submission starts as `pending`. */
    status: z.literal("pending"),
    /** Server-assigned submitter id (different from author.email). */
    submitterId: z.string().min(1).max(64),
    /** ISO-8601 timestamp of the submission. */
    submittedAt: z.string().datetime(),
  })
  .strict();
export type ThemeSubmitResponse = z.infer<typeof ThemeSubmitResponseSchema>;

// ─── Theme install ─────────────────────────────────────────────────────────

export const ThemeInstallRequestSchema = z
  .object({
    /** The marketplace slug of the theme to install. */
    themeSlug: Slug,
    /** Optional pinned semver — if absent, the latest approved version is used. */
    version: SemVer.optional(),
    /** The site the theme is being installed onto. */
    siteId: z.string().min(1).max(64),
    /** Optional preset id (e.g. "bold") to activate on install. */
    presetId: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/)
      .max(32)
      .optional(),
  })
  .strict();
export type ThemeInstallRequest = z.infer<typeof ThemeInstallRequestSchema>;

export const ThemeInstallResponseSchema = z
  .object({
    installId: ShortId,
    siteId: z.string().min(1).max(64),
    themeSlug: Slug,
    version: SemVer,
    presetId: z.string().min(1).max(32).nullable(),
    /** ISO-8601 timestamp the install was applied. */
    installedAt: z.string().datetime(),
  })
  .strict();
export type ThemeInstallResponse = z.infer<typeof ThemeInstallResponseSchema>;

// ─── Theme review ──────────────────────────────────────────────────────────

export const ThemeReviewAction = z.enum(["approve", "reject", "request-changes"]);
export type ThemeReviewAction = z.infer<typeof ThemeReviewAction>;

export const ThemeReviewRequestSchema = z
  .object({
    reviewId: ShortId,
    action: ThemeReviewAction,
    /** The reviewer's user id (Supabase auth.uid() at runtime). */
    reviewerId: z.string().min(1).max(64),
    /** Optional reviewer notes (required for `reject` and `request-changes`). */
    notes: z.string().max(4000).optional(),
  })
  .strict()
  .refine(
    (req) =>
      req.action === "approve" || (typeof req.notes === "string" && req.notes.trim().length >= 10),
    {
      message: "notes (≥ 10 chars) are required when rejecting or requesting changes",
      path: ["notes"],
    },
  );
export type ThemeReviewRequest = z.infer<typeof ThemeReviewRequestSchema>;

export const ThemeReviewResponseSchema = z
  .object({
    reviewId: ShortId,
    status: z.enum(["pending", "approved", "rejected", "changes-requested"]),
    reviewerId: z.string().min(1).max(64),
    notes: z.string().max(4000).nullable(),
    reviewedAt: z.string().datetime(),
  })
  .strict();
export type ThemeReviewResponse = z.infer<typeof ThemeReviewResponseSchema>;

// ─── Error envelope (shared across all endpoints) ──────────────────────────

export const ApiErrorSchema = z
  .object({
    error: z.string().min(1).max(120),
    message: z.string().min(1).max(1024),
    /**
     * Optional Zod issues when validation fails. The shape matches
     * Zod's `flatten()` output — `{ formErrors: string[], fieldErrors:
     * Record<string, string[]> }`.
     */
    issues: z
      .object({
        formErrors: z.array(z.string()),
        fieldErrors: z.record(z.string(), z.array(z.string())),
      })
      .optional(),
  })
  .strict();
export type ApiError = z.infer<typeof ApiErrorSchema>;
