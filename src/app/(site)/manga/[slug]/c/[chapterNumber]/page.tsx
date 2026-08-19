import { notFound } from "next/navigation";
import { ChapterReader } from "@/components/ChapterReader";
import { getChapterForReader } from "@/lib/manga";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; chapterNumber: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug, chapterNumber } = await params;
  const num = Number(chapterNumber);
  if (Number.isNaN(num)) return { title: "Chương" };
  const data = await getChapterForReader(slug, num).catch(() => null);
  if (!data) return { title: "Không tìm thấy" };
  return {
    title: `${data.manga.title} — Chap ${data.chapter.chapterNumber}`,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { slug, chapterNumber } = await params;
  const num = Number(chapterNumber);
  if (Number.isNaN(num)) notFound();

  const data = await getChapterForReader(slug, num).catch(() => null);
  if (!data) notFound();

  return (
    <ChapterReader
      mangaSlug={data.manga.slug}
      mangaTitle={data.manga.title}
      chapterId={data.chapter.id}
      chapterNumber={data.chapter.chapterNumber}
      isLocked={data.chapter.isLocked}
      unlocked={data.chapter.unlocked}
      shopeeAffiliateLink={data.chapter.shopeeAffiliateLink}
      images={data.images}
      prev={data.prev}
      next={data.next}
    />
  );
}
