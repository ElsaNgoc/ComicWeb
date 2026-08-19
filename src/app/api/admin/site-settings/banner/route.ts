import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { uploadImageToR2 } from "@/lib/r2";
import { updateSiteSettings } from "@/lib/site-settings";

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get("banner");
  const url = String(form.get("bannerUrl") ?? "").trim();

  let bannerImage = url;
  if (file instanceof File && file.size > 0) {
    try {
      bannerImage = await uploadImageToR2(file, "banners");
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Upload thất bại" },
        { status: 400 },
      );
    }
  }

  if (!bannerImage) {
    return NextResponse.json({ error: "Chọn ảnh hoặc dán URL" }, { status: 400 });
  }

  await updateSiteSettings({ bannerImage });
  return NextResponse.json({ bannerImage });
}

export async function DELETE() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  await updateSiteSettings({ bannerImage: null });
  return NextResponse.json({ ok: true });
}
