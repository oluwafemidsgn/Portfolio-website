import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cloudinary signing algorithm: sort params alphabetically, join as
 * `key=value` with `&`, append the API secret, SHA-1 hex.
 */
function signParams(
  params: Record<string, unknown>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .filter(
      (k) => params[k] !== undefined && params[k] !== null && params[k] !== "",
    )
    .sort()
    .map((k) => {
      const v = params[k];
      return `${k}=${Array.isArray(v) ? v.join(",") : String(v)}`;
    })
    .join("&");
  return createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured: CLOUDINARY_API_SECRET is missing.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const paramsToSign =
    body && typeof body === "object"
      ? (body as { paramsToSign?: unknown }).paramsToSign
      : undefined;
  if (
    !paramsToSign ||
    typeof paramsToSign !== "object" ||
    Array.isArray(paramsToSign)
  ) {
    return NextResponse.json({ error: "Missing paramsToSign" }, { status: 400 });
  }

  return NextResponse.json({
    signature: signParams(paramsToSign as Record<string, unknown>, apiSecret),
  });
}
