import type { CSSProperties } from "react";
import { themeToCssVars, type SiteSettingsData } from "@/lib/site-settings-shared";

export function SiteTheme({ settings }: { settings: SiteSettingsData | null }) {
  const vars = themeToCssVars(settings?.themeConfig ?? null);
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { ${Object.entries(vars)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ")} }`,
      }}
    />
  );
}

export function themeStyle(settings: SiteSettingsData | null): CSSProperties {
  return themeToCssVars(settings?.themeConfig ?? null) as CSSProperties;
}
