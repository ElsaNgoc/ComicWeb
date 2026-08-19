import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import {
  adminDeleteChapter,
  adminGetChapter,
  adminUpdateChapter,
} from "@/lib/admin-manga";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const chapter = await adminGetChapter(id);
  if (!chapter) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }
  return NextResponse.json(chapter);
}

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    chapterNumber?: number;
    isLocked?: boolean;
    password?: string | null;
    shopeeAffiliateLink?: string | null;
  } | null;

  try {
    const chapter = await adminUpdateChapter(id, {
      chapterNumber: body?.chapterNumber,
      isLocked: body?.isLocked,
      password: body?.password,
      shopeeAffiliateLink: body?.shopeeAffiliateLink,
    });
    return NextResponse.json(chapter);
  } catch {
    return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  try {
    await adminDeleteChapter(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }
}
