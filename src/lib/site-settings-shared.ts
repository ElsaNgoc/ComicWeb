export type ThemeConfig = {
  background?: string;
  foreground?: string;
  paper?: string;
  muted?: string;
  link?: string;
  accent?: string;
  purple?: string;
  ribbon?: string;
  woodMid?: string;
  fontBody?: string;
  fontDisplay?: string;
};

export type FontOption = {
  id: string;
  label: string;
  cssFamily: string;
  google: string;
};

/** Chỉ font Google có subset tiếng Việt (đủ ă â ê ô ơ ư + dấu thanh). */
export const FONT_BODY_OPTIONS: FontOption[] = [
  { id: "be-vietnam-pro", label: "Be Vietnam Pro (chuẩn tiếng Việt)", cssFamily: '"Be Vietnam Pro", sans-serif', google: "Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400" },
  { id: "lora", label: "Lora (serif mềm · mặc định)", cssFamily: '"Lora", serif', google: "Lora:ital,wght@0,400;0,500;0,600;1,400" },
  { id: "source-serif-4", label: "Source Serif 4", cssFamily: '"Source Serif 4", serif', google: "Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600" },
  { id: "literata", label: "Literata", cssFamily: '"Literata", serif', google: "Literata:opsz,wght@7..72,400;7..72,500;7..72,600" },
  { id: "crimson-pro", label: "Crimson Pro", cssFamily: '"Crimson Pro", serif', google: "Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400" },
  { id: "eb-garamond", label: "EB Garamond", cssFamily: '"EB Garamond", serif', google: "EB+Garamond:ital,wght@0,400;0,500;0,600;1,400" },
  { id: "merriweather", label: "Merriweather", cssFamily: '"Merriweather", serif', google: "Merriweather:ital,wght@0,400;0,700;1,400" },
  { id: "nunito", label: "Nunito (sans mềm)", cssFamily: '"Nunito", sans-serif', google: "Nunito:ital,wght@0,400;0,500;0,600;0,700;1,400" },
  { id: "noto-serif", label: "Noto Serif", cssFamily: '"Noto Serif", serif', google: "Noto+Serif:ital,wght@0,400;0,500;0,600;1,400" },
  { id: "noto-sans", label: "Noto Sans", cssFamily: '"Noto Sans", sans-serif', google: "Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400" },
];

export const FONT_DISPLAY_OPTIONS: FontOption[] = [
  { id: "cormorant-garamond", label: "Cormorant Garamond (cổ trang · mặc định)", cssFamily: '"Cormorant Garamond", serif', google: "Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500" },
  { id: "eb-garamond", label: "EB Garamond", cssFamily: '"EB Garamond", serif', google: "EB+Garamond:ital,wght@0,500;0,600;0,700;1,500" },
  { id: "fraunces", label: "Fraunces", cssFamily: '"Fraunces", serif', google: "Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500" },
  { id: "literata", label: "Literata", cssFamily: '"Literata", serif', google: "Literata:opsz,wght@7..72,500;7..72,600;7..72,700" },
  { id: "lora", label: "Lora", cssFamily: '"Lora", serif', google: "Lora:wght@500;600;700" },
  { id: "source-serif-4", label: "Source Serif 4", cssFamily: '"Source Serif 4", serif', google: "Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700" },
  { id: "be-vietnam-pro", label: "Be Vietnam Pro", cssFamily: '"Be Vietnam Pro", sans-serif', google: "Be+Vietnam+Pro:wght@500;600;700" },
  { id: "crimson-pro", label: "Crimson Pro", cssFamily: '"Crimson Pro", serif', google: "Crimson+Pro:wght@500;600;700" },
];

export function getFontOption(list: FontOption[], id: string | undefined, fallbackId: string) {
  return list.find((f) => f.id === id) ?? list.find((f) => f.id === fallbackId) ?? list[0];
}

export function googleFontsHref(theme: ThemeConfig | null) {
  const t = { ...DEFAULT_THEME, ...theme };
  const body = getFontOption(FONT_BODY_OPTIONS, t.fontBody, "lora");
  const display = getFontOption(FONT_DISPLAY_OPTIONS, t.fontDisplay, "cormorant-garamond");
  const families = [body.google, display.google]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((f) => `family=${f}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export type LayoutBlock = {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
};

export type LayoutConfig = {
  home: LayoutBlock[];
  sidebar: LayoutBlock[];
};

export type SiteSettingsData = {
  siteName: string;
  tagline: string | null;
  bannerTitle: string | null;
  bannerSubtitle: string | null;
  bannerImage: string | null;
  welcomeTitle: string | null;
  welcomeText: string | null;
  sidebarQuote: string | null;
  sidebarIntro: string | null;
  sidebarCornerTitle: string | null;
  sidebarCornerCaption: string | null;
  sidebarNotesTitle: string | null;
  sidebarNotes: string | null;
  footerText: string | null;
  themeConfig: ThemeConfig | null;
  layoutConfig: LayoutConfig | null;
};

export const DEFAULT_THEME: ThemeConfig = {
  background: "#fff5f0",
  foreground: "#5c4033",
  paper: "#fff8f4",
  muted: "#8a7062",
  link: "#c96b52",
  accent: "#e88e75",
  purple: "#f8a181",
  ribbon: "#7a4f42",
  woodMid: "#fad1c5",
  fontBody: "lora",
  fontDisplay: "cormorant-garamond",
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  home: [
    { id: "welcome", type: "welcome", enabled: true, order: 1 },
    { id: "manga-grid", type: "manga-grid", enabled: true, order: 2 },
  ],
  sidebar: [
    { id: "quote", type: "sidebar-quote", enabled: true, order: 1 },
    { id: "intro", type: "sidebar-intro", enabled: true, order: 2 },
    { id: "corner", type: "sidebar-corner", enabled: true, order: 3 },
    { id: "notes", type: "sidebar-notes", enabled: true, order: 4 },
  ],
};

export function parseSidebarNotes(notes: string | null) {
  if (!notes) return [];
  return notes
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getEffectiveLayout(config: LayoutConfig | null): LayoutConfig {
  if (!config) return DEFAULT_LAYOUT;
  return {
    home: [...config.home].sort((a, b) => a.order - b.order),
    sidebar: [...config.sidebar].sort((a, b) => a.order - b.order),
  };
}

export function isBlockEnabled(
  layout: LayoutConfig | null,
  section: keyof LayoutConfig,
  type: string,
) {
  const effective = getEffectiveLayout(layout);
  const block = effective[section].find((b) => b.type === type);
  return block?.enabled ?? true;
}

export function hasSidebarContent(settings: SiteSettingsData | null) {
  if (!settings) return false;

  const layout = getEffectiveLayout(settings.layoutConfig);
  const anySidebarBlock = layout.sidebar.some((b) => b.enabled);
  if (!anySidebarBlock) return false;

  return Boolean(
    (isBlockEnabled(settings.layoutConfig, "sidebar", "sidebar-quote") &&
      settings.sidebarQuote) ||
      (isBlockEnabled(settings.layoutConfig, "sidebar", "sidebar-intro") &&
        settings.sidebarIntro) ||
      (isBlockEnabled(settings.layoutConfig, "sidebar", "sidebar-corner") &&
        (settings.sidebarCornerTitle || settings.sidebarCornerCaption)) ||
      (isBlockEnabled(settings.layoutConfig, "sidebar", "sidebar-notes") &&
        (settings.sidebarNotesTitle ||
          parseSidebarNotes(settings.sidebarNotes).length > 0)),
  );
}

export function themeToCssVars(theme: ThemeConfig | null): Record<string, string> {
  const t = { ...DEFAULT_THEME, ...theme };
  const body = getFontOption(FONT_BODY_OPTIONS, t.fontBody, "lora");
  const display = getFontOption(FONT_DISPLAY_OPTIONS, t.fontDisplay, "cormorant-garamond");
  return {
    "--background": t.background!,
    "--foreground": t.foreground!,
    "--paper": t.paper!,
    "--muted": t.muted!,
    "--ink-soft": t.muted!,
    "--link": t.link!,
    "--accent": t.accent!,
    "--coral": t.accent!,
    "--pink": t.woodMid ?? DEFAULT_THEME.woodMid!,
    "--purple": t.purple!,
    "--peri-soft": t.purple!,
    "--ribbon": t.ribbon!,
    "--peach-soft": t.woodMid ?? DEFAULT_THEME.woodMid!,
    "--peach-mid": t.purple!,
    "--peach-warm": t.purple!,
    "--peach-deep": t.accent!,
    "--wood-mid": t.woodMid!,
    "--font-body": body.cssFamily,
    "--font-display": display.cssFamily,
  };
}
