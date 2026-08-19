import { BlogSidebar } from "@/components/BlogSidebar";
import { MangaCard } from "@/components/MangaCard";
import { listMangas } from "@/lib/manga";
import {
  getEffectiveLayout,
  getSiteSettings,
  hasSidebarContent,
  isBlockEnabled,
} from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let mangas: Awaited<ReturnType<typeof listMangas>> = [];
  let loadError = false;

  try {
    mangas = await listMangas();
  } catch {
    loadError = true;
  }

  const settings = await getSiteSettings().catch(() => null);
  const layout = getEffectiveLayout(settings?.layoutConfig ?? null);
  const welcomeTitle =
    settings?.welcomeTitle ?? `Chào mừng đến ${settings?.siteName ?? "Xà Động"}`;
  const showSidebar = hasSidebarContent(settings);

  const homeBlocks = layout.home.filter((b) => b.enabled);

  function renderHomeBlock(type: string) {
    switch (type) {
      case "welcome":
        if (!isBlockEnabled(settings?.layoutConfig ?? null, "home", "welcome")) {
          return null;
        }
        return (
          <section key="welcome" id="loi-chao" className="animate-fade-up text-center">
            <h1 className="font-display text-2xl text-foreground sm:text-3xl">
              {welcomeTitle}
            </h1>
            {settings?.welcomeText && (
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
                {settings.welcomeText}
              </p>
            )}
          </section>
        );
      case "manga-grid":
        if (
          !isBlockEnabled(settings?.layoutConfig ?? null, "home", "manga-grid")
        ) {
          return null;
        }
        return (
          <section key="manga-grid" id="truyen" className="mt-10">
            <h2 className="font-display text-center text-xl text-foreground">
              Truyện đang đăng
            </h2>
            <hr className="wavy-rule mx-auto mt-2" />
            {loadError ? (
              <p className="mt-8 text-center text-sm text-muted">
                Chưa kết nối được database. Kiểm tra <code>DATABASE_URL</code>.
              </p>
            ) : mangas.length === 0 ? (
              <p className="mt-8 text-center text-sm text-muted">
                Chưa có truyện.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                {mangas.map((m) => (
                  <MangaCard
                    key={m.id}
                    slug={m.slug}
                    title={m.title}
                    coverImage={m.coverImage}
                    latestChapter={m.chapters[0]?.chapterNumber ?? null}
                  />
                ))}
              </div>
            )}
          </section>
        );
      default:
        return null;
    }
  }

  return (
    <div
      className={`grid gap-10 ${showSidebar ? "lg:grid-cols-[1fr_240px] lg:gap-12" : ""}`}
    >
      <div>{homeBlocks.map((b) => renderHomeBlock(b.type))}</div>

      {showSidebar && (
        <div className="lg:border-l lg:border-border lg:pl-8">
          <BlogSidebar settings={settings} />
        </div>
      )}
    </div>
  );
}
