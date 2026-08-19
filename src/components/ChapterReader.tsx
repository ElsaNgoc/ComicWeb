"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UnlockModal } from "@/components/UnlockModal";

type ImageItem = {
  id: string;
  orderIndex: number;
  imageUrl: string;
};

type NavChapter = {
  chapterNumber: number;
} | null;

type Props = {
  mangaSlug: string;
  mangaTitle: string;
  chapterId: string;
  chapterNumber: number;
  isLocked: boolean;
  unlocked: boolean;
  shopeeAffiliateLink: string | null;
  images: ImageItem[];
  prev: NavChapter;
  next: NavChapter;
};

export function ChapterReader({
  mangaSlug,
  mangaTitle,
  chapterId,
  chapterNumber,
  isLocked,
  unlocked,
  shopeeAffiliateLink,
  images,
  prev,
  next,
}: Props) {
  const [chromeVisible, setChromeVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setChromeVisible(y < lastY || y < 40);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showUnlock = isLocked && !unlocked;

  return (
    <div
      className="relative min-h-[70vh]"
      onClick={() => setChromeVisible((v) => !v)}
    >
      <div
        className={`sticky top-0 z-30 border-b border-border bg-paper/95 px-2 py-3 transition-all duration-300 ${
          chromeVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/manga/${mangaSlug}`}
              className="link-soft text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              ← {mangaTitle}
            </Link>
            <p className="font-display truncate text-foreground">
              Chương {chapterNumber}
            </p>
          </div>
        </div>
      </div>

      {showUnlock ? (
        <div className="mx-auto flex max-w-[720px] flex-col gap-3 px-0 py-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] w-full animate-pulse bg-gradient-to-b from-peri-soft/50 to-pink/40"
            />
          ))}
          <UnlockModal
            chapterId={chapterId}
            chapterNumber={chapterNumber}
            shopeeAffiliateLink={shopeeAffiliateLink}
          />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-[720px] flex-col">
          {images.length === 0 ? (
            <p className="px-4 py-20 text-center text-muted">
              Chương này chưa có ảnh.
            </p>
          ) : (
            images.map((img) => (
              <div key={img.id} className="relative w-full bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={`${mangaTitle} - trang ${img.orderIndex}`}
                  className="block w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))
          )}

          <div className="flex flex-col items-center gap-3 px-4 py-10">
            {next ? (
              <Link
                href={`/manga/${mangaSlug}/c/${next.chapterNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="link-soft font-display text-base"
              >
                Chương sau · {next.chapterNumber}
              </Link>
            ) : (
              <p className="text-sm text-muted">Hết chương mới rồi.</p>
            )}
            <Link
              href={`/manga/${mangaSlug}`}
              onClick={(e) => e.stopPropagation()}
              className="link-soft text-sm"
            >
              Mục lục
            </Link>
          </div>
        </div>
      )}

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 ${
          chromeVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
      >
        <div
          className="pointer-events-auto flex w-full max-w-[720px] gap-2 border border-border bg-paper/95 p-2 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {prev ? (
            <Link
              href={`/manga/${mangaSlug}/c/${prev.chapterNumber}`}
              className="flex-1 px-3 py-3 text-center text-sm font-medium text-foreground hover:bg-pink/25"
            >
              ← Chap {prev.chapterNumber}
            </Link>
          ) : (
            <span className="flex-1 px-3 py-3 text-center text-sm text-muted">
              Đầu
            </span>
          )}
          {next ? (
            <Link
              href={`/manga/${mangaSlug}/c/${next.chapterNumber}`}
              className="flex-1 bg-ribbon px-3 py-3 text-center text-sm font-semibold text-white"
            >
              Chap {next.chapterNumber} →
            </Link>
          ) : (
            <span className="flex-1 px-3 py-3 text-center text-sm text-muted">
              Cuối
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
