"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  DEFAULT_THEME,
  FONT_BODY_OPTIONS,
  FONT_DISPLAY_OPTIONS,
  getFontOption,
  googleFontsHref,
  type SiteSettingsData,
  type ThemeConfig,
} from "@/lib/site-settings-shared";

type Props = { initial: SiteSettingsData };

type ColorKey =
  | "paper"
  | "foreground"
  | "muted"
  | "link"
  | "accent"
  | "purple"
  | "ribbon"
  | "woodMid";

const COLOR_FIELDS: { key: ColorKey; label: string }[] = [
  { key: "paper", label: "Nền giấy (paper)" },
  { key: "foreground", label: "Chữ chính" },
  { key: "muted", label: "Chữ phụ" },
  { key: "link", label: "Link" },
  { key: "accent", label: "Accent / coral" },
  { key: "purple", label: "Tím banner" },
  { key: "ribbon", label: "Nền nav ribbon" },
  { key: "woodMid", label: "Peach nhạt (nền / gradient)" },
];

const VN_PREVIEW =
  "Xà Động — Chào mừng đến góc đọc truyện. Ăn quả nhớ kẻ trồng cây. đẫy, khướu, ngẫm, thưởng, lưỡi, ướt át.";

export function ThemeSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeConfig>({
    ...DEFAULT_THEME,
    ...initial.themeConfig,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fontHref = useMemo(() => googleFontsHref(theme), [theme]);
  const bodyFont = getFontOption(FONT_BODY_OPTIONS, theme.fontBody, "lora");
  const displayFont = getFontOption(
    FONT_DISPLAY_OPTIONS,
    theme.fontDisplay,
    "cormorant-garamond",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeConfig: theme }),
    });

    setLoading(false);
    if (!res.ok) {
      setMessage("Lưu thất bại.");
      return;
    }

    setMessage("Đã lưu màu và font.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border border-[#ddd6cc] bg-white p-5">
      <link rel="stylesheet" href={fontHref} />

      <div>
        <h2 className="font-semibold">Màu sắc</h2>
        <p className="mt-1 text-sm text-[#7a6f62]">
          User site áp dụng ngay sau khi lưu.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {COLOR_FIELDS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 text-sm">
              <input
                type="color"
                value={theme[key] ?? DEFAULT_THEME[key] ?? "#000000"}
                onChange={(e) => setTheme((t) => ({ ...t, [key]: e.target.value }))}
                className="h-9 w-12 cursor-pointer rounded border border-[#ddd6cc]"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold">Font chữ</h2>
        <p className="mt-1 text-sm text-[#7a6f62]">
          Chỉ liệt kê font Google có đủ dấu tiếng Việt (ă, â, ê, ô, ơ, ư + thanh).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Font nội dung (body)</span>
            <select
              value={theme.fontBody ?? "lora"}
              onChange={(e) => setTheme((t) => ({ ...t, fontBody: e.target.value }))}
              className="mt-1 w-full rounded border border-[#ddd6cc] px-3 py-2"
            >
              {FONT_BODY_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Font tiêu đề (heading)</span>
            <select
              value={theme.fontDisplay ?? "cormorant-garamond"}
              onChange={(e) =>
                setTheme((t) => ({ ...t, fontDisplay: e.target.value }))
              }
              className="mt-1 w-full rounded border border-[#ddd6cc] px-3 py-2"
            >
              {FONT_DISPLAY_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 rounded border border-[#e8e2da] bg-[#fff8f4] p-4">
          <p className="text-xs uppercase tracking-wide text-[#7a6f62]">Xem trước tiếng Việt</p>
          <p
            className="mt-2 text-2xl"
            style={{ fontFamily: displayFont.cssFamily, color: theme.foreground }}
          >
            Xà Động · scrapbook
          </p>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ fontFamily: bodyFont.cssFamily, color: theme.muted }}
          >
            {VN_PREVIEW}
          </p>
        </div>
      </div>

      {message && <p className="text-sm text-[#5a7d68]">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-[#7a4f42] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : "Lưu màu & font"}
      </button>
    </form>
  );
}
