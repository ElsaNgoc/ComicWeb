import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  coverImage: string;
  latestChapter?: number | null;
};

export function MangaCard({ slug, title, coverImage, latestChapter }: Props) {
  const hasCover = coverImage.startsWith("http");

  return (
    <Link
      href={`/manga/${slug}`}
      className="group block text-center outline-none transition hover:-translate-y-0.5"
    >
      <div className="mx-auto aspect-[3/4] w-full max-w-[180px] overflow-hidden border border-border bg-surface shadow-[0_8px_24px_-16px_rgba(40,25,10,0.45)]">
        {hasCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-end bg-gradient-to-br from-peri-soft via-pink to-coral p-3">
            <span className="font-display text-left text-sm text-white">
              {title}
            </span>
          </div>
        )}
      </div>
      <h2 className="font-display mt-3 text-[1.05rem] leading-snug text-foreground group-hover:text-link">
        {title}
      </h2>
      {latestChapter != null && (
        <p className="mt-1 text-xs text-muted">Chap {latestChapter}</p>
      )}
    </Link>
  );
}
