import { notFound } from "next/navigation";
import { ChapterEditor } from "@/components/admin/ChapterAdmin";
import { requireAdmin } from "@/lib/admin-guard";
import { adminGetChapter } from "@/lib/admin-manga";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string; chapterId: string }> };

export default async function EditChapterPage({ params }: Props) {
  await requireAdmin();
  const { chapterId } = await params;
  const chapter = await adminGetChapter(chapterId);
  if (!chapter) notFound();

  return <ChapterEditor chapter={chapter} />;
}
