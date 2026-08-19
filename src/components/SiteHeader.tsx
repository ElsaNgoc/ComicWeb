import Link from "next/link";
import type { SiteSettingsData } from "@/lib/site-settings";

type Props = {
  settings: SiteSettingsData | null;
};

export function SiteHeader({ settings }: Props) {
  const siteName = settings?.siteName ?? "Xà Động";
  const bannerTitle = settings?.bannerTitle ?? `${siteName} · scrapbook`;
  const hasBannerSubtitle = Boolean(settings?.bannerSubtitle);

  return (
    <header className="px-4 pb-0 pt-8 sm:px-8 sm:pt-10">
      <div className="text-center animate-fade-up">
        <Link
          href="/"
          className="font-display text-[1.85rem] font-semibold uppercase tracking-[0.18em] text-foreground sm:text-[2.15rem]"
        >
          {siteName}
        </Link>
        {settings?.tagline && (
          <p className="mt-2 font-display text-sm italic tracking-wide text-muted">
            {settings.tagline}
          </p>
        )}
      </div>

      <div className="banner-scroll relative mx-auto mt-6 max-w-3xl overflow-hidden border border-border">
        {settings?.bannerImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.bannerImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className={`pointer-events-none absolute inset-0 ${
            settings?.bannerImage
              ? "bg-gradient-to-b from-[rgba(255,248,244,0.55)] via-[rgba(255,248,244,0.35)] to-[rgba(255,248,244,0.65)]"
              : "opacity-50"
          }`}
          style={
            settings?.bannerImage
              ? undefined
              : {
                  backgroundImage:
                    "radial-gradient(circle at 15% 25%, rgba(248,161,129,0.45), transparent 42%), radial-gradient(circle at 85% 20%, rgba(232,142,117,0.35), transparent 38%), radial-gradient(circle at 50% 85%, rgba(255,212,178,0.5), transparent 45%)",
                }
          }
        />
        <div
          className={`relative flex flex-col items-center justify-center px-4 py-10 text-center ${
            hasBannerSubtitle ? "min-h-[140px] sm:min-h-[180px]" : "min-h-[100px] sm:min-h-[120px]"
          }`}
        >
          <p className="font-display text-lg text-[color:var(--peach-deep)] sm:text-xl">
            {bannerTitle}
          </p>
          {settings?.bannerSubtitle && (
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted sm:text-sm">
              {settings.bannerSubtitle}
            </p>
          )}
        </div>
      </div>

      <nav className="nav-ribbon mx-auto mt-0 flex max-w-3xl items-center justify-center gap-6 px-8 py-3 sm:gap-10">
        <Link href="/">Trang chủ</Link>
        <Link href="/#truyen">Truyện</Link>
        <Link href="/#loi-chao">Lời chào</Link>
      </nav>
    </header>
  );
}
