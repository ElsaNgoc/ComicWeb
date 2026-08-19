import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogSidebar } from "@/components/BlogSidebar";
import { DescriptionClamp } from "@/components/DescriptionClamp";
import { getMangaBySlug } from "@/lib/manga";
import { getSiteSettings, hasSidebarContent } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const manga = await getMangaBySlug(slug).catch(() => null);
  if (!manga) return { title: "Không tìm thấy" };
  return { title: manga.title };
}

export default async function MangaDetailPage({ params }: Props) {
  const { slug } = await params;
  const manga = await getMangaBySlug(slug).catch(() => null);
  if (!manga) notFound();

  const settings = await getSiteSettings().catch(() => null);
  const showSidebar = hasSidebarContent(settings);
  const readTarget =
    manga.chapters.find((c) => !c.isLocked) ?? manga.chapters[0];
  const hasCover = manga.coverImage.startsWith("http");

  return (
    <div
      className={`grid gap-10 ${showSidebar ? "lg:grid-cols-[1fr_240px] lg:gap-12" : ""}`}
    >
      <article className="animate-fade-up text-center">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          {manga.title}
        </h1>

        <div className="mx-auto mt-6 w-44 overflow-hidden border border-border bg-surface shadow-md sm:w-52">
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={manga.coverImage}
              alt={manga.title}
              className="aspect-[3/4] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[3/4] items-end bg-gradient-to-br from-peri-soft via-pink to-coral p-3 text-left font-display text-white">
              {manga.title}
            </div>
          )}
        </div>

        {manga.description && (
          <div className="mx-auto mt-6 max-w-xl text-left">
            <DescriptionClamp text={manga.description} />
          </div>
        )}

        {readTarget && (
          <Link
            href={`/manga/${manga.slug}/c/${readTarget.chapterNumber}`}
            className="link-soft mt-6 inline-block font-medium"
          >
            Đọc ngay · Chương {readTarget.chapterNumber}
          </Link>
        )}

        <section className="mt-12">
          <h2 className="font-display text-2xl text-foreground">Mục lục</h2>
          <div className="mt-2 flex justify-center gap-4 text-sm">
            <a href="#mo-ta" className="link-soft">
              Văn án
            </a>
            <Link href={`/manga/${manga.slug}`} className="link-soft">
              Lời dẫn
            </Link>
          </div>

          <ul className="mx-auto mt-8 max-w-md space-y-3 text-center">
            {manga.chapters.map((ch) => (
              <li key={ch.id} className="font-display text-[1.05rem]">
                <span className="text-muted">Chương {ch.chapterNumber}: </span>
                <Link
                  href={`/manga/${manga.slug}/c/${ch.chapterNumber}`}
                  className="link-soft"
                >
                  đọc
                </Link>
                {ch.isLocked && (
                  <span className="ml-2 text-xs text-purple">(khóa)</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div id="mo-ta" className="sr-only">
          {manga.description}
        </div>
      </article>

      {showSidebar && (
        <div className="lg:border-l lg:border-border lg:pl-8">
          <BlogSidebar settings={settings} />
        </div>
      )}
    </div>
  );
}
