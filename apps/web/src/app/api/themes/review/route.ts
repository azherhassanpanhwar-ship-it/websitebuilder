/**
 * POST /api/themes/review
 * Marketplace review endpoint. Validates the review request and returns
 * a stub review record. Real DB integration lands in a later task.
 *
 * Skill 3 — Zod at the boundary
 *   The request is parsed with `ThemeReviewRequestSchema.safeParse()`.
 *   The schema enforces a refinement: `notes` is required for
 *   `reject` and `request-changes` actions (must be ≥ 10 chars). A
 *   validation failure returns a 400 with the `ApiError` envelope.
 */

import { NextResponse, type NextRequest } from "next/server";

import {
  ApiErrorSchema,
  ThemeReviewRequestSchema,
  type ThemeReviewResponse,
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

  const parsed = ThemeReviewRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      ApiErrorSchema.parse({
        error: "validation_failed",
        message: "Theme review payload did not validate",
        issues: parsed.error.flatten(),
      }),
      { status: 400 },
    );
  }

  const req = parsed.data;
  // Map the action to the public status. The marketplace shows
  // `pending | approved | rejected | changes-requested` — internal
  // actions collapse onto this enum.
  let status: ThemeReviewResponse["status"];
  switch (req.action) {
    case "approve":
      status = "approved";
      break;
    case "reject":
      status = "rejected";
      break;
    case "request-changes":
      status = "changes-requested";
      break;
  }

  const response: ThemeReviewResponse = {
    reviewId: req.reviewId,
    status,
    reviewerId: req.reviewerId,
    notes: req.notes ?? null,
    reviewedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 200 });
}
