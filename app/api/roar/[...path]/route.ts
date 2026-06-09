/**
 * ROAR API Proxy — frontend/app/api/roar/[...path]/route.ts
 *
 * WHY THIS EXISTS:
 * The frontend runs on :3001, the backend on :3000.
 * Next.js "rewrites" are server-to-server fetches — they do NOT forward
 * the browser's httpOnly cookies. So when /api/roar/* was proxied via
 * next.config.ts rewrites, the backend's getUser() received no "token"
 * cookie and returned 401 for everyone except users whose cookie happened
 * to be set directly on :3000.
 *
 * FIX: We intercept /api/roar/* here (this file takes priority over the
 * afterFiles rewrite because actual route files always win). We read the
 * "token" cookie — which IS available on :3001 — and forward it as an
 * Authorization: Bearer header. The backend's getUser() already handles
 * Bearer tokens (lines 39-64 in lib/getUser.ts).
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  "http://localhost:3000";

async function proxyRoar(
  req: NextRequest,
  path: string[]
): Promise<NextResponse> {
  const token =
    req.cookies.get("token")?.value ||
    req.cookies.get("admin_token")?.value;

  // Build the destination URL preserving query string
  const search = req.nextUrl.search || "";
  const targetUrl = `${BACKEND_URL}/api/roar/${path.join("/")}${search}`;

  const headers: Record<string, string> = {};

  // Forward content-type so JSON bodies are parsed correctly
  const ct = req.headers.get("content-type");
  if (ct) headers["Content-Type"] = ct;

  // THE KEY FIX: attach the JWT as a Bearer token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Also forward all original cookies so NextAuth fallback can work
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) headers["Cookie"] = cookieHeader;

  // Forward the user's real IP for any rate-limiting on the backend
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) headers["X-Forwarded-For"] = forwarded;

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = await req.text();
    } catch {
      body = undefined;
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      // Do not follow redirects automatically
      redirect: "manual",
    });

    const responseText = await backendRes.text();
    const responseCT =
      backendRes.headers.get("content-type") || "application/json";

    return new NextResponse(responseText, {
      status: backendRes.status,
      headers: {
        "Content-Type": responseCT,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(`[ROAR Proxy] Failed to reach backend at ${targetUrl}:`, err);
    return NextResponse.json(
      { error: "Backend unreachable", details: String(err) },
      { status: 502 }
    );
  }
}

// Export all HTTP methods
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRoar(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRoar(req, path);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRoar(req, path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRoar(req, path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRoar(req, path);
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
