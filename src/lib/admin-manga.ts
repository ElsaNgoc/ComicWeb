import { prisma } from "@/lib/db";
import { uniqueSlug } from "@/lib/slug";

export async function adminListMangas() {
  return prisma.manga.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      chapters: {
        orderBy: { chapterNumber: "desc" },
        select: { id: true, chapterNumber: true, isLocked: true },
      },
      tags: {
        include: { tag: true },
      },
    },
  });
}

export async function adminGetManga(id: string) {
  return prisma.manga.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { chapterNumber: "desc" },
        include: {
          _count: { select: { images: true } },
        },
      },
      tags: { include: { tag: true } },
    },
  });
}

export async function adminCreateManga(input: {
  title: string;
  description?: string | null;
  coverImage: string;
  tagIds?: string[];
}) {
  const slug = await uniqueSlug(input.title, async (s) => {
    const found = await prisma.manga.findUnique({ where: { slug: s } });
    return Boolean(found);
  });

  return prisma.manga.create({
    data: {
      title: input.title.trim(),
      slug,
      description: input.description?.trim() || null,
      coverImage: input.coverImage,
      tags: input.tagIds?.length
        ? {
            create: input.tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
  });
}

export async function adminUpdateManga(
  id: string,
  input: {
    title?: string;
    description?: string | null;
    coverImage?: string;
    tagIds?: string[];
  },
) {
  const current = await prisma.manga.findUnique({ where: { id } });
  if (!current) return null;

  const title = input.title?.trim() ?? current.title;
  const slug =
    input.title != null
      ? await uniqueSlug(
          title,
          async (s) => {
            const found = await prisma.manga.findUnique({ where: { slug: s } });
            return Boolean(found && found.id !== id);
          },
          current.slug,
        )
      : current.slug;

  if (input.tagIds) {
    await prisma.mangaTag.deleteMany({ where: { mangaId: id } });
    if (input.tagIds.length > 0) {
      await prisma.mangaTag.createMany({
        data: input.tagIds.map((tagId) => ({ mangaId: id, tagId })),
      });
    }
  }

  return prisma.manga.update({
    where: { id },
    data: {
      title,
      slug,
      description:
        input.description !== undefined
          ? input.description?.trim() || null
          : undefined,
      coverImage: input.coverImage,
    },
  });
}

export async function adminDeleteManga(id: string) {
  return prisma.manga.delete({ where: { id } });
}

export async function adminCreateChapter(
  mangaId: string,
  input: {
    chapterNumber: number;
    isLocked?: boolean;
    password?: string | null;
    shopeeAffiliateLink?: string | null;
  },
) {
  return prisma.chapter.create({
    data: {
      mangaId,
      chapterNumber: input.chapterNumber,
      isLocked: input.isLocked ?? true,
      password: input.password?.trim() || null,
      shopeeAffiliateLink: input.shopeeAffiliateLink?.trim() || null,
    },
  });
}

export async function adminGetChapter(id: string) {
  return prisma.chapter.findUnique({
    where: { id },
    include: {
      manga: { select: { id: true, title: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" } },
    },
  });
}

export async function adminUpdateChapter(
  id: string,
  input: {
    chapterNumber?: number;
    isLocked?: boolean;
    password?: string | null;
    shopeeAffiliateLink?: string | null;
  },
) {
  return prisma.chapter.update({
    where: { id },
    data: {
      chapterNumber: input.chapterNumber,
      isLocked: input.isLocked,
      password:
        input.password !== undefined ? input.password?.trim() || null : undefined,
      shopeeAffiliateLink:
        input.shopeeAffiliateLink !== undefined
          ? input.shopeeAffiliateLink?.trim() || null
          : undefined,
    },
  });
}

export async function adminDeleteChapter(id: string) {
  return prisma.chapter.delete({ where: { id } });
}

export async function adminAddChapterImages(
  chapterId: string,
  urls: string[],
) {
  const last = await prisma.image.findFirst({
    where: { chapterId },
    orderBy: { orderIndex: "desc" },
    select: { orderIndex: true },
  });
  let next = (last?.orderIndex ?? 0) + 1;

  await prisma.image.createMany({
    data: urls.map((url) => ({
      chapterId,
      imageUrl: url,
      orderIndex: next++,
    })),
  });

  return prisma.image.findMany({
    where: { chapterId },
    orderBy: { orderIndex: "asc" },
  });
}

export async function adminDeleteImage(id: string) {
  return prisma.image.delete({ where: { id } });
}

export async function adminReorderChapterImages(
  chapterId: string,
  imageIds: string[],
) {
  await prisma.$transaction(
    imageIds.map((id, index) =>
      prisma.image.update({
        where: { id, chapterId },
        data: { orderIndex: index + 1 },
      }),
    ),
  );

  return prisma.image.findMany({
    where: { chapterId },
    orderBy: { orderIndex: "asc" },
  });
}

export async function adminListTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function adminCreateTag(name: string) {
  const slug = await uniqueSlug(name, async (s) => {
    const found = await prisma.tag.findUnique({ where: { slug: s } });
    return Boolean(found);
  });

  return prisma.tag.create({
    data: { name: name.trim(), slug },
  });
}

export async function adminDeleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}
