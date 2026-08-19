import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieOptions,
  getAdminPassword,
  signAdminToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD chưa được cấu hình." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;

  if (!body?.password || body.password !== adminPassword) {
    return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
  }

  const token = await signAdminToken();
  const jar = await cookies();
  jar.set(adminCookieOptions(token));

  return NextResponse.json({ ok: true });
}
