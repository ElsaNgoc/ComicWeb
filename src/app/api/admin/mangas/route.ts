import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminCreateManga, adminListMangas } from "@/lib/admin-manga";
import { uploadImageToR2 } from "@/lib/r2";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const mangas = await adminListMangas();
  return NextResponse.json(mangas);
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const cover = form.get("cover");
    const tagIdsRaw = String(form.get("tagIds") ?? "");

    if (!title) {
      return NextResponse.json({ error: "Thiếu tên truyện" }, { status: 400 });
    }

    let coverImage = String(form.get("coverUrl") ?? "").trim();
    if (cover instanceof File && cover.size > 0) {
      try {
        coverImage = await uploadImageToR2(cover, "covers");
      } catch (e) {
        return NextResponse.json(
          { error: e instanceof Error ? e.message : "Upload bìa thất bại" },
          { status: 400 },
        );
      }
    }

    if (!coverImage) {
      return NextResponse.json(
        { error: "Cần ảnh bìa hoặc URL bìa" },
        { status: 400 },
      );
    }

    const tagIds = tagIdsRaw
      ? tagIdsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const manga = await adminCreateManga({
      title,
      description: description || null,
      coverImage,
      tagIds,
    });

    return NextResponse.json(manga, { status: 201 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    coverImage?: string;
    tagIds?: string[];
  } | null;

  if (!body?.title?.trim() || !body.coverImage?.trim()) {
    return NextResponse.json({ error: "Thiếu title hoặc coverImage" }, { status: 400 });
  }

  const manga = await adminCreateManga({
    title: body.title,
    description: body.description ?? null,
    coverImage: body.coverImage,
    tagIds: body.tagIds,
  });

  return NextResponse.json(manga, { status: 201 });
}
