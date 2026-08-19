import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAdminCookieOptions } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const jar = await cookies();
  jar.set(clearAdminCookieOptions());
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
