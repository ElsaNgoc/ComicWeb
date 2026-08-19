import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminReorderChapterImages } from "@/lib/admin-manga";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id: chapterId } = await params;
  const body = (await request.json().catch(() => null)) as {
    imageIds?: string[];
  } | null;

  if (!body?.imageIds?.length) {
    return NextResponse.json({ error: "Thiếu imageIds" }, { status: 400 });
  }

  try {
    const images = await adminReorderChapterImages(chapterId, body.imageIds);
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Sắp xếp thất bại" }, { status: 400 });
  }
}
