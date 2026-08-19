import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminCreateTag, adminListTags } from "@/lib/admin-manga";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const tags = await adminListTags();
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as { name?: string } | null;
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "Thiếu tên tag" }, { status: 400 });
  }

  try {
    const tag = await adminCreateTag(body.name);
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Tạo tag thất bại" }, { status: 400 });
  }
}
