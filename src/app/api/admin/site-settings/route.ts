import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteSettings, updateSiteSettings, type SiteSettingsInput } from "@/lib/site-settings";

export async function GET() {
  const authed = await isAdminAuthenticated().catch(() => false);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const authed = await isAdminAuthenticated().catch(() => false);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const settings = await updateSiteSettings({
    siteName: typeof body.siteName === "string" ? body.siteName : undefined,
    tagline: typeof body.tagline === "string" ? body.tagline : null,
    bannerTitle: typeof body.bannerTitle === "string" ? body.bannerTitle : null,
    bannerSubtitle:
      typeof body.bannerSubtitle === "string" ? body.bannerSubtitle : null,
    welcomeTitle: typeof body.welcomeTitle === "string" ? body.welcomeTitle : null,
    welcomeText: typeof body.welcomeText === "string" ? body.welcomeText : null,
    sidebarQuote:
      typeof body.sidebarQuote === "string" ? body.sidebarQuote : null,
    sidebarIntro:
      typeof body.sidebarIntro === "string" ? body.sidebarIntro : null,
    sidebarCornerTitle:
      typeof body.sidebarCornerTitle === "string"
        ? body.sidebarCornerTitle
        : null,
    sidebarCornerCaption:
      typeof body.sidebarCornerCaption === "string"
        ? body.sidebarCornerCaption
        : null,
    sidebarNotesTitle:
      typeof body.sidebarNotesTitle === "string" ? body.sidebarNotesTitle : null,
    sidebarNotes:
      typeof body.sidebarNotes === "string" ? body.sidebarNotes : null,
    footerText: typeof body.footerText === "string" ? body.footerText : null,
    themeConfig:
      body.themeConfig && typeof body.themeConfig === "object"
        ? (body.themeConfig as SiteSettingsInput["themeConfig"])
        : undefined,
    layoutConfig:
      body.layoutConfig && typeof body.layoutConfig === "object"
        ? (body.layoutConfig as SiteSettingsInput["layoutConfig"])
        : undefined,
  });

  return NextResponse.json(settings);
}
