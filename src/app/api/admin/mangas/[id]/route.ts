import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import {
  adminDeleteManga,
  adminGetManga,
  adminUpdateManga,
} from "@/lib/admin-manga";
import { uploadImageToR2 } from "@/lib/r2";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const manga = await adminGetManga(id);
  if (!manga) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }
  return NextResponse.json(manga);
}

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const title = form.get("title");
    const description = form.get("description");
    const cover = form.get("cover");
    const tagIdsRaw = form.get("tagIds");

    let coverImage: string | undefined;
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

    const tagIds =
      tagIdsRaw != null
        ? String(tagIdsRaw).split(",").map((s) => s.trim()).filter(Boolean)
        : undefined;

    const manga = await adminUpdateManga(id, {
      title: title != null ? String(title) : undefined,
      description:
        description != null ? String(description) || null : undefined,
      coverImage,
      tagIds,
    });

    if (!manga) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }
    return NextResponse.json(manga);
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string | null;
    coverImage?: string;
    tagIds?: string[];
  } | null;

  const manga = await adminUpdateManga(id, {
    title: body?.title,
    description: body?.description,
    coverImage: body?.coverImage,
    tagIds: body?.tagIds,
  });

  if (!manga) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }
  return NextResponse.json(manga);
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  try {
    await adminDeleteManga(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }
}
