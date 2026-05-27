// app/api/auth/set-token/route.ts  — FRONTEND
// Called by AuthContext after Google sign-in to set the same httpOnly
// "token" cookie that email/password users get, but on the frontend domain.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth.config";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const u = session?.user as {
      email?: string; userId?: string; name?: string; role?: string;
    } | undefined;

    if (!u?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const token = jwt.sign(
      {
        email:  u.email,
        userId: u.userId ?? u.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_"),
        name:   u.name  ?? "",
        role:   u.role  ?? "user",
      },
      secret,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ success: true });

    // Set on the FRONTEND domain — browser will send it automatically
    // to all proxied /api/* requests including /api/chats → backend
    response.cookies.set("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7,  // 7 days
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error("set-token error:", error);
    return NextResponse.json({ error: "Failed to set token" }, { status: 500 });
  }
}