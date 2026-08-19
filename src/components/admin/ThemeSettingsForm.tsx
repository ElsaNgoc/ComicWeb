"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DEFAULT_THEME,
  type SiteSettingsData,
  type ThemeConfig,
} from "@/lib/site-settings-shared";

type Props = { initial: SiteSettingsData };

const FIELDS: { key: keyof ThemeConfig; label: string }[] = [
  { key: "paper", label: "Nền giấy (paper)" },
  { key: "foreground", label: "Chữ chính" },
  { key: "muted", label: "Chữ phụ" },
  { key: "link", label: "Link" },
  { key: "accent", label: "Accent / coral" },
  { key: "purple", label: "Tím banner" },
  { key: "ribbon", label: "Nền nav ribbon" },
  { key: "woodMid", label: "Peach nhạt (nền / gradient)" },
];

export function ThemeSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeConfig>({
    ...DEFAULT_THEME,
    ...initial.themeConfig,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    setMessage("Đã lưu theme.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-[#ddd6cc] bg-white p-5">
      <h2 className="font-semibold">Màu sắc (CSS variables)</h2>
      <p className="text-sm text-[#7a6f62]">
        User site áp dụng ngay sau khi lưu — không cần deploy lại.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label }) => (
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
      {message && <p className="text-sm text-[#5a7d68]">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-[#5a7d68] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : "Lưu màu"}
      </button>
    </form>
  );
}
