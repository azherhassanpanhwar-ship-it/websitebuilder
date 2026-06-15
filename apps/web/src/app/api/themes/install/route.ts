/**
 * POST /api/themes/install
 * Marketplace install endpoint. Validates the install request, returns a
 * stub install record. Real DB integration lands in a later task.
 *
 * Skill 3 — Zod at the boundary
 *   The request is parsed with `ThemeInstallRequestSchema.safeParse()`.
 *   Validation failures return a 400 with the `ApiError` envelope.
 */

import { NextResponse, type NextRequest } from "next/server";

import {
  ApiErrorSchema,
  ThemeInstallRequestSchema,
  type ThemeInstallResponse,
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

  const parsed = ThemeInstallRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      ApiErrorSchema.parse({
        error: "validation_failed",
        message: "Theme install payload did not validate",
        issues: parsed.error.flatten(),
      }),
      { status: 400 },
    );
  }

  const req = parsed.data;
  // Resolve the version: the request may pin a specific semver, or
  // accept whatever the marketplace returns as latest. The stub picks
  // the pinned version if present, else the request's semver-less form
  // is the placeholder "latest".
  const version = req.version ?? "latest";
  const installId = `inst_${shortHash(req.themeSlug + req.siteId + version)}` as const;

  const response: ThemeInstallResponse = {
    installId: installId as unknown as ThemeInstallResponse["installId"],
    siteId: req.siteId,
    themeSlug: req.themeSlug,
    version,
    presetId: req.presetId ?? null,
    installedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 200 });
}

function shortHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36).slice(0, 6);
}
