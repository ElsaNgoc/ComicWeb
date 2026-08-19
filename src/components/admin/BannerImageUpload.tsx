"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialUrl: string | null;
};

export function BannerImageUpload({ initialUrl }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const preview = file ? URL.createObjectURL(file) : url;

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const form = new FormData();
    if (file) form.set("banner", file);
    else if (url) form.set("bannerUrl", url);

    const res = await fetch("/api/admin/site-settings/banner", {
      method: "POST",
      body: form,
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Upload thất bại.");
      return;
    }

    const data = (await res.json()) as { bannerImage: string };
    setUrl(data.bannerImage);
    setFile(null);
    setMessage("Đã lưu ảnh bìa banner.");
    router.refresh();
  }

  async function remove() {
    if (!confirm("Gỡ ảnh bìa banner?")) return;
    await fetch("/api/admin/site-settings/banner", { method: "DELETE" });
    setUrl("");
    setFile(null);
    setMessage("Đã gỡ ảnh bìa.");
    router.refresh();
  }

  return (
    <div className="mt-4 rounded border border-[#e8e2da] bg-[#faf8f5] p-4">
      <h3 className="text-sm font-semibold">Ảnh bìa banner (header)</h3>
      <p className="mt-1 text-xs text-[#7a6f62]">
        Khung ngang dưới tên site — tỷ lệ gợi ý ~3:1 (vd 1200×400). Không upload thì
        dùng gradient mặc định.
      </p>

      {preview && (
        <div className="mt-3 overflow-hidden rounded border border-[#ddd6cc]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="max-h-40 w-full object-cover" />
        </div>
      )}

      <form onSubmit={upload} className="mt-3 space-y-3">
        <label className="block text-sm">
          Upload ảnh
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>
        <label className="block text-sm">
          Hoặc URL ảnh
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded border border-[#ddd6cc] px-3 py-2"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading || (!file && !url)}
            className="rounded bg-[#7a4f42] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu ảnh bìa"}
          </button>
          {(initialUrl || url) && (
            <button
              type="button"
              onClick={remove}
              className="rounded border border-[#ddd6cc] px-4 py-2 text-sm"
            >
              Gỡ ảnh
            </button>
          )}
        </div>
      </form>

      {message && <p className="mt-2 text-sm text-[#7a4f42]">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
