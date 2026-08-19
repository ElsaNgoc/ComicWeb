import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminDeleteTag } from "@/lib/admin-manga";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  try {
    await adminDeleteTag(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }
}
