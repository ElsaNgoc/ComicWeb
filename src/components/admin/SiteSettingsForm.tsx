"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettingsData } from "@/lib/site-settings-shared";

type Props = {
  initial: SiteSettingsData;
};

type FormState = {
  siteName: string;
  tagline: string;
  bannerTitle: string;
  bannerSubtitle: string;
  welcomeTitle: string;
  welcomeText: string;
  sidebarQuote: string;
  sidebarIntro: string;
  sidebarCornerTitle: string;
  sidebarCornerCaption: string;
  sidebarNotesTitle: string;
  sidebarNotes: string;
  footerText: string;
};

function toFormState(data: SiteSettingsData): FormState {
  return {
    siteName: data.siteName,
    tagline: data.tagline ?? "",
    bannerTitle: data.bannerTitle ?? "",
    bannerSubtitle: data.bannerSubtitle ?? "",
    welcomeTitle: data.welcomeTitle ?? "",
    welcomeText: data.welcomeText ?? "",
    sidebarQuote: data.sidebarQuote ?? "",
    sidebarIntro: data.sidebarIntro ?? "",
    sidebarCornerTitle: data.sidebarCornerTitle ?? "",
    sidebarCornerCaption: data.sidebarCornerCaption ?? "",
    sidebarNotesTitle: data.sidebarNotesTitle ?? "",
    sidebarNotes: data.sidebarNotes ?? "",
    footerText: data.footerText ?? "",
  };
}

export function SiteSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Lưu thất bại.");
      return;
    }

    setMessage("Đã lưu. Trang user sẽ cập nhật ngay.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-lg border border-[#ddd6cc] bg-white p-5">
        <h2 className="font-semibold">Header & banner</h2>
        <p className="mt-1 text-sm text-[#7a6f62]">
          Phần trên cùng của site user. Để trống thì user không thấy dòng đó.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Tên site"
            value={form.siteName}
            onChange={(v) => updateField("siteName", v)}
          />
          <Field
            label="Tagline (dưới tên site)"
            value={form.tagline}
            onChange={(v) => updateField("tagline", v)}
          />
          <Field
            label="Banner title"
            value={form.bannerTitle}
            onChange={(v) => updateField("bannerTitle", v)}
          />
          <Field
            label="Banner subtitle"
            value={form.bannerSubtitle}
            onChange={(v) => updateField("bannerSubtitle", v)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#ddd6cc] bg-white p-5">
        <h2 className="font-semibold">Trang chủ · Lời chào</h2>
        <div className="mt-4 grid gap-4">
          <Field
            label="Tiêu đề lời chào"
            value={form.welcomeTitle}
            onChange={(v) => updateField("welcomeTitle", v)}
            hint="Để trống sẽ dùng: Chào mừng đến {tên site}"
          />
          <TextArea
            label="Nội dung lời chào"
            value={form.welcomeText}
            onChange={(v) => updateField("welcomeText", v)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#ddd6cc] bg-white p-5">
        <h2 className="font-semibold">Sidebar</h2>
        <div className="mt-4 grid gap-4">
          <TextArea
            label="Quote (in nghiêng)"
            value={form.sidebarQuote}
            onChange={(v) => updateField("sidebarQuote", v)}
          />
          <TextArea
            label="Đoạn giới thiệu"
            value={form.sidebarIntro}
            onChange={(v) => updateField("sidebarIntro", v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Tiêu đề góc nhỏ"
              value={form.sidebarCornerTitle}
              onChange={(v) => updateField("sidebarCornerTitle", v)}
            />
            <Field
              label="Caption góc nhỏ"
              value={form.sidebarCornerCaption}
              onChange={(v) => updateField("sidebarCornerCaption", v)}
            />
          </div>
          <Field
            label="Tiêu đề mục ghi chú"
            value={form.sidebarNotesTitle}
            onChange={(v) => updateField("sidebarNotesTitle", v)}
          />
          <TextArea
            label="Danh sách ghi chú (mỗi dòng một ý)"
            value={form.sidebarNotes}
            onChange={(v) => updateField("sidebarNotes", v)}
            rows={5}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#ddd6cc] bg-white p-5">
        <h2 className="font-semibold">Footer</h2>
        <div className="mt-4">
          <TextArea
            label="Nội dung footer (mỗi dòng một câu)"
            value={form.footerText}
            onChange={(v) => updateField("footerText", v)}
            rows={4}
          />
        </div>
      </section>

      {message && <p className="text-sm text-[#5a7d68]">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#5a7d68] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Lưu giao diện"}
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="text-sm underline">
          Mở trang user
        </a>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-[#7a6f62]">{hint}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-[#ddd6cc] px-3 py-2 outline-none focus:border-[#ad82d9]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-[#7a6f62]">{hint}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full rounded border border-[#ddd6cc] px-3 py-2 outline-none focus:border-[#ad82d9]"
      />
    </label>
  );
}
