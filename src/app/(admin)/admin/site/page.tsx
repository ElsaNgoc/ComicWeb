import { BannerImageUpload } from "@/components/admin/BannerImageUpload";
import { LayoutSettingsForm } from "@/components/admin/LayoutSettingsForm";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { TagManager } from "@/components/admin/MangaAdmin";
import { ThemeSettingsForm } from "@/components/admin/ThemeSettingsForm";
import { requireAdmin } from "@/lib/admin-guard";
import { adminListTags } from "@/lib/admin-manga";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  await requireAdmin();
  const [settings, tags] = await Promise.all([
    getSiteSettings(),
    adminListTags(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Giao diện user</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#7a6f62]">
          Chỉnh text, màu, bố cục block. Ô trống = user không thấy.
        </p>
      </div>
      <SiteSettingsForm initial={settings} />
      <BannerImageUpload initialUrl={settings.bannerImage} />
      <ThemeSettingsForm initial={settings} />
      <LayoutSettingsForm initial={settings} />
      <TagManager initialTags={tags} />
    </div>
  );
}
