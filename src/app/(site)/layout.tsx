import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteTheme } from "@/components/SiteTheme";
import { getSiteSettings } from "@/lib/site-settings";

export default async function SiteLayout({
  children,
}: LayoutProps<"/">) {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <>
      <SiteTheme settings={settings} />
      <div className="blog-shell flex min-h-[calc(100vh-3rem)] flex-col">
        <SiteHeader settings={settings} />
        <main className="flex-1 px-4 pb-8 pt-6 sm:px-8">{children}</main>
        <SiteFooter settings={settings} />
      </div>
    </>
  );
}
