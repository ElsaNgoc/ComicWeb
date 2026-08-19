import {
  googleFontsHref,
  themeToCssVars,
  type SiteSettingsData,
} from "@/lib/site-settings-shared";

export function SiteTheme({ settings }: { settings: SiteSettingsData | null }) {
  const theme = settings?.themeConfig ?? null;
  const vars = themeToCssVars(theme);
  const fontHref = googleFontsHref(theme);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href={fontHref} rel="stylesheet" />
      <style
        dangerouslySetInnerHTML={{
          __html: `:root { ${Object.entries(vars)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; ")} }`,
        }}
      />
    </>
  );
}
