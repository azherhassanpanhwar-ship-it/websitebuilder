/**
 * POST /api/themes/submit
 * Marketplace submission endpoint. Validates the incoming Theme + author
 * metadata with `ThemeSubmitRequestSchema`, then returns a stub
 * response with a deterministic review id.
 *
 * Skill 3 — Zod at the boundary
 *   Every payload crossing this route is parsed with `.safeParse()`. A
 *   failure returns a 400 with the `ApiError` envelope; success returns
 *   the validated `ThemeSubmitResponse`. The runtime never sees a
 *   partially-typed object.
 *
 * Determinism note
 *   The stub review id is derived from the request's `theme.metadata.slug`
 *   + a stable hash of the changelog. The submittedAt timestamp is
 *   produced by the runtime (Date) — a future task can swap to a
 *   deterministic clock for testing without touching this route.
 */

import { NextResponse, type NextRequest } from "next/server";

import {
  ApiErrorSchema,
  ThemeSubmitRequestSchema,
  type ThemeSubmitResponse,
} from "../../../../api/themes/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      ApiErrorSchema.parse({
        error: "invalid_json",
        message: "Request body must be valid JSON",
      }),
      { status: 400 },
    );
  }

  const parsed = ThemeSubmitRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      ApiErrorSchema.parse({
        error: "validation_failed",
        message: "Theme submission payload did not validate",
        issues: parsed.error.flatten(),
      }),
      { status: 400 },
    );
  }

  const req = parsed.data;
  // Deterministic review id — slug + a 4-char hash of the changelog so
  // re-submitting the same content yields the same id (idempotent on
  // the marketplace side).
  const hash = shortHash(req.changelog + req.theme.metadata.slug);
  const reviewId = `rev_${req.theme.metadata.slug}-${hash}` as const;
  const submitterId = `sub_${shortHash(req.author.email)}` as const;

  const response: ThemeSubmitResponse = {
    reviewId: reviewId as unknown as ThemeSubmitResponse["reviewId"],
    slug: req.theme.metadata.slug,
    status: "pending",
    submitterId: submitterId as unknown as ThemeSubmitResponse["submitterId"],
    submittedAt: new Date().toISOString(),
    version: req.theme.metadata.version,
  };

  return NextResponse.json(response, { status: 200 });
}

/**
 * Tiny, deterministic, no-deps short hash. djb2 — fast, good enough
 * for the marketplace stub (NOT a cryptographic hash).
 */
function shortHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36).slice(0, 6);
}
