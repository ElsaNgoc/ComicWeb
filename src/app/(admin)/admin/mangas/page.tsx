import Link from "next/link";
import { MangaList } from "@/components/admin/MangaAdmin";
import { requireAdmin } from "@/lib/admin-guard";
import { adminListMangas } from "@/lib/admin-manga";

export const dynamic = "force-dynamic";

export default async function AdminMangasPage() {
  await requireAdmin();
  const mangas = await adminListMangas();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Truyện</h1>
          <p className="mt-1 text-sm text-[#7a6f62]">
            Tạo, sửa, upload bìa và quản lý chương.
          </p>
        </div>
        <Link
          href="/admin/mangas/new"
          className="rounded bg-[#5a7d68] px-4 py-2 text-sm font-semibold text-white"
        >
          + Truyện mới
        </Link>
      </div>
      <MangaList mangas={mangas} />
    </div>
  );
}
