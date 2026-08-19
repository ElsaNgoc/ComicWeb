import { MangaForm } from "@/components/admin/MangaForm";
import { requireAdmin } from "@/lib/admin-guard";
import { adminListTags } from "@/lib/admin-manga";

export const dynamic = "force-dynamic";

export default async function NewMangaPage() {
  await requireAdmin();
  const tags = await adminListTags();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Truyện mới</h1>
      <MangaForm tags={tags} />
    </div>
  );
}
