import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import {
  DEFAULT_LAYOUT,
  type LayoutConfig,
  type SiteSettingsData,
  type ThemeConfig,
} from "@/lib/site-settings-shared";

export type {
  LayoutBlock,
  LayoutConfig,
  SiteSettingsData,
  ThemeConfig,
} from "@/lib/site-settings-shared";

export {
  DEFAULT_LAYOUT,
  DEFAULT_THEME,
  getEffectiveLayout,
  hasSidebarContent,
  isBlockEnabled,
  parseSidebarNotes,
  themeToCssVars,
} from "@/lib/site-settings-shared";

export type SiteSettingsInput = Partial<
  Omit<SiteSettingsData, "themeConfig" | "layoutConfig">
> & {
  themeConfig?: ThemeConfig | null;
  layoutConfig?: LayoutConfig | null;
};

const DEFAULTS: SiteSettingsData = {
  siteName: "Xà Động",
  tagline: null,
  bannerTitle: null,
  bannerSubtitle: null,
  bannerImage: null,
  welcomeTitle: null,
  welcomeText: null,
  sidebarQuote: null,
  sidebarIntro: null,
  sidebarCornerTitle: null,
  sidebarCornerCaption: null,
  sidebarNotesTitle: null,
  sidebarNotes: null,
  footerText: null,
  themeConfig: null,
  layoutConfig: null,
};

function normalize(value: string | null | undefined) {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseTheme(value: Prisma.JsonValue | null): ThemeConfig | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as ThemeConfig;
}

function parseLayout(value: Prisma.JsonValue | null): LayoutConfig | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as LayoutConfig;
  if (!Array.isArray(obj.home) || !Array.isArray(obj.sidebar)) return null;
  return obj;
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!row) return DEFAULTS;

  return {
    siteName: row.siteName || DEFAULTS.siteName,
    tagline: row.tagline,
    bannerTitle: row.bannerTitle,
    bannerSubtitle: row.bannerSubtitle,
    bannerImage: row.bannerImage,
    welcomeTitle: row.welcomeTitle,
    welcomeText: row.welcomeText,
    sidebarQuote: row.sidebarQuote,
    sidebarIntro: row.sidebarIntro,
    sidebarCornerTitle: row.sidebarCornerTitle,
    sidebarCornerCaption: row.sidebarCornerCaption,
    sidebarNotesTitle: row.sidebarNotesTitle,
    sidebarNotes: row.sidebarNotes,
    footerText: row.footerText,
    themeConfig: parseTheme(row.themeConfig),
    layoutConfig: parseLayout(row.layoutConfig),
  };
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const data = {
    siteName: normalize(input.siteName) ?? DEFAULTS.siteName,
    tagline: normalize(input.tagline),
    bannerTitle: normalize(input.bannerTitle),
    bannerSubtitle: normalize(input.bannerSubtitle),
    bannerImage:
      input.bannerImage !== undefined ? normalize(input.bannerImage) : undefined,
    welcomeTitle: normalize(input.welcomeTitle),
    welcomeText: normalize(input.welcomeText),
    sidebarQuote: normalize(input.sidebarQuote),
    sidebarIntro: normalize(input.sidebarIntro),
    sidebarCornerTitle: normalize(input.sidebarCornerTitle),
    sidebarCornerCaption: normalize(input.sidebarCornerCaption),
    sidebarNotesTitle: normalize(input.sidebarNotesTitle),
    sidebarNotes: normalize(input.sidebarNotes),
    footerText: normalize(input.footerText),
    themeConfig:
      input.themeConfig === undefined
        ? undefined
        : input.themeConfig === null
          ? Prisma.DbNull
          : (input.themeConfig as Prisma.InputJsonValue),
    layoutConfig:
      input.layoutConfig === undefined
        ? undefined
        : input.layoutConfig === null
          ? Prisma.DbNull
          : (input.layoutConfig as Prisma.InputJsonValue),
  };

  return prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
}
