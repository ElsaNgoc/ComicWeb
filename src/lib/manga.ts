import { prisma } from "@/lib/db";
import { isChapterUnlocked } from "@/lib/unlock";

export async function listMangas() {
  return prisma.manga.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      chapters: {
        orderBy: { chapterNumber: "desc" },
        take: 1,
        select: { chapterNumber: true },
      },
    },
  });
}

export async function getMangaBySlug(slug: string) {
  return prisma.manga.findUnique({
    where: { slug },
    include: {
      chapters: {
        orderBy: { chapterNumber: "desc" },
        select: {
          id: true,
          chapterNumber: true,
          isLocked: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function getChapterForReader(slug: string, chapterNumber: number) {
  const manga = await prisma.manga.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      chapters: {
        orderBy: { chapterNumber: "asc" },
        select: { id: true, chapterNumber: true, isLocked: true },
      },
    },
  });

  if (!manga) return null;

  const chapter = await prisma.chapter.findUnique({
    where: {
      mangaId_chapterNumber: {
        mangaId: manga.id,
        chapterNumber,
      },
    },
    include: {
      images: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!chapter) return null;

  const unlocked =
    !chapter.isLocked || (await isChapterUnlocked(chapter.id));

  const images = unlocked
    ? chapter.images.map((img) => ({
        id: img.id,
        orderIndex: img.orderIndex,
        imageUrl: img.imageUrl,
      }))
    : [];

  const idx = manga.chapters.findIndex((c) => c.id === chapter.id);
  const prev = idx > 0 ? manga.chapters[idx - 1] : null;
  const next =
    idx >= 0 && idx < manga.chapters.length - 1
      ? manga.chapters[idx + 1]
      : null;

  return {
    manga: { id: manga.id, title: manga.title, slug: manga.slug },
    chapter: {
      id: chapter.id,
      chapterNumber: chapter.chapterNumber,
      isLocked: chapter.isLocked,
      shopeeAffiliateLink: chapter.shopeeAffiliateLink,
      unlocked,
    },
    images,
    prev,
    next,
  };
}
