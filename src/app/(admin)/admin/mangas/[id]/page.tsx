import { notFound } from "next/navigation";
import { ChapterList } from "@/components/admin/ChapterAdmin";
import { MangaForm } from "@/components/admin/MangaForm";
import { requireAdmin } from "@/lib/admin-guard";
import { adminGetManga, adminListTags } from "@/lib/admin-manga";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditMangaPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const [manga, tags] = await Promise.all([
    adminGetManga(id),
    adminListTags(),
  ]);

  if (!manga) notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Sửa truyện</h1>
      <MangaForm
        tags={tags}
        manga={{
          id: manga.id,
          title: manga.title,
          description: manga.description,
          coverImage: manga.coverImage,
          tags: manga.tags,
        }}
      />
      <ChapterList mangaId={manga.id} chapters={manga.chapters} />
    </div>
  );
}
