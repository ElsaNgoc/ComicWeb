import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminAddChapterImages } from "@/lib/admin-manga";
import { uploadImageToR2 } from "@/lib/r2";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id: chapterId } = await params;
  const form = await request.formData();
  const files = form.getAll("images").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Chưa chọn ảnh" }, { status: 400 });
  }

  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    try {
      urls.push(await uploadImageToR2(file, "chapters"));
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Upload thất bại" },
        { status: 400 },
      );
    }
  }

  if (urls.length === 0) {
    return NextResponse.json({ error: "Không có ảnh hợp lệ" }, { status: 400 });
  }

  const images = await adminAddChapterImages(chapterId, urls);
  return NextResponse.json(images, { status: 201 });
}
