import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminCreateChapter } from "@/lib/admin-manga";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id: mangaId } = await params;
  const body = (await request.json().catch(() => null)) as {
    chapterNumber?: number;
    isLocked?: boolean;
    password?: string | null;
    shopeeAffiliateLink?: string | null;
  } | null;

  if (body?.chapterNumber == null || Number.isNaN(body.chapterNumber)) {
    return NextResponse.json({ error: "Thiếu chapterNumber" }, { status: 400 });
  }

  try {
    const chapter = await adminCreateChapter(mangaId, {
      chapterNumber: body.chapterNumber,
      isLocked: body.isLocked,
      password: body.password,
      shopeeAffiliateLink: body.shopeeAffiliateLink,
    });
    return NextResponse.json(chapter, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Không tạo được chap (trùng số hoặc manga không tồn tại)" },
      { status: 400 },
    );
  }
}
