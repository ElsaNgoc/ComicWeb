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
};

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
  };
}
