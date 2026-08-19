"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Chapter = {
  id: string;
  chapterNumber: number;
  isLocked: boolean;
  password: string | null;
  shopeeAffiliateLink: string | null;
  images: { id: string; orderIndex: number; imageUrl: string }[];
  manga: { id: string; title: string; slug: string };
};

export function ChapterEditor({ chapter: initial }: { chapter: Chapter }) {
  const router = useRouter();
  const [chapter, setChapter] = useState(initial);
  const [num, setNum] = useState(String(initial.chapterNumber));
  const [isLocked, setIsLocked] = useState(initial.isLocked);
  const [password, setPassword] = useState(initial.password ?? "");
  const [shopee, setShopee] = useState(initial.shopeeAffiliateLink ?? "");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function saveMeta(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/admin/chapters/${chapter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterNumber: Number(num),
        isLocked,
        password: password || null,
        shopeeAffiliateLink: shopee || null,
      }),
    });
    setMessage(res.ok ? "Đã lưu chap." : "Lưu thất bại.");
    if (res.ok) router.refresh();
  }

  async function uploadImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("images", f));

    const res = await fetch(`/api/admin/chapters/${chapter.id}/images`, {
      method: "POST",
      body: form,
    });

    setUploading(false);
    e.target.value = "";

    if (!res.ok) {
      setMessage("Upload thất bại. Kiểm tra R2 trong .env");
      return;
    }

    const images = (await res.json()) as Chapter["images"];
    setChapter((c) => ({ ...c, images }));
    setMessage(`Đã thêm ${files.length} ảnh.`);
    router.refresh();
  }

  async function deleteImage(id: string) {
    if (!confirm("Xóa trang này?")) return;
    await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
    setChapter((c) => ({
      ...c,
      images: c.images.filter((img) => img.id !== id),
    }));
    router.refresh();
  }

  async function moveImage(id: string, dir: -1 | 1) {
    const sorted = [...chapter.images].sort((a, b) => a.orderIndex - b.orderIndex);
    const idx = sorted.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;

    const next = [...sorted];
    [next[idx], next[swap]] = [next[swap], next[idx]];

    const res = await fetch(
      `/api/admin/chapters/${chapter.id}/images/reorder`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: next.map((i) => i.id) }),
      },
    );

    if (res.ok) {
      const images = (await res.json()) as Chapter["images"];
      setChapter((c) => ({ ...c, images }));
      router.refresh();
    }
  }

  const sortedImages = [...chapter.images].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/mangas/${chapter.manga.id}`}
          className="text-sm text-[#7a6f62] hover:underline"
        >
          ← {chapter.manga.title}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">
          Chap {chapter.chapterNumber}
        </h1>
      </div>

      <form
        onSubmit={saveMeta}
        className="space-y-3 rounded-lg border border-[#ddd6cc] bg-white p-5"
      >
        <h2 className="font-semibold">Thông tin chap</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Số chap
            <input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              required
            />
          </label>
          <label className="flex items-end gap-2 text-sm pb-2">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
            />
            Khóa mật khẩu
          </label>
          <label className="text-sm sm:col-span-2">
            Mật khẩu
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              disabled={!isLocked}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Link Shopee affiliate
            <input
              value={shopee}
              onChange={(e) => setShopee(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </label>
        </div>
        <button
          type="submit"
          className="rounded bg-[#5a7d68] px-4 py-2 text-sm font-semibold text-white"
        >
          Lưu thông tin
        </button>
      </form>

      <section className="rounded-lg border border-[#ddd6cc] bg-white p-5">
        <h2 className="font-semibold">Ảnh trang ({sortedImages.length})</h2>
        <label className="mt-3 block text-sm">
          Upload nhiều ảnh (JPEG/PNG/WebP, max 10MB/ảnh)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={uploadImages}
            disabled={uploading}
            className="mt-1 block w-full"
          />
        </label>
        {uploading && (
          <p className="mt-2 text-sm text-[#7a6f62]">Đang upload...</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sortedImages.map((img, i) => (
            <div key={img.id} className="border border-[#ddd6cc]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt="" className="aspect-[3/4] w-full object-cover" />
              <div className="flex justify-between p-1 text-xs">
                <span>#{i + 1}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveImage(img.id, -1)}>
                    ↑
                  </button>
                  <button type="button" onClick={() => moveImage(img.id, 1)}>
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteImage(img.id)}
                    className="text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {message && <p className="text-sm text-[#5a7d68]">{message}</p>}
    </div>
  );
}

type ChapterRow = {
  id: string;
  chapterNumber: number;
  isLocked: boolean;
  _count: { images: number };
};

export function ChapterList({
  mangaId,
  chapters,
}: {
  mangaId: string;
  chapters: ChapterRow[];
}) {
  const router = useRouter();
  const [num, setNum] = useState("");
  const [error, setError] = useState("");

  async function addChapter(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/admin/mangas/${mangaId}/chapters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterNumber: Number(num), isLocked: true }),
    });
    if (!res.ok) {
      setError("Thêm chap thất bại (trùng số?).");
      return;
    }
    setNum("");
    router.refresh();
  }

  return (
    <section className="rounded-lg border border-[#ddd6cc] bg-white p-5">
      <h2 className="font-semibold">Chương</h2>
      <form onSubmit={addChapter} className="mt-3 flex gap-2">
        <input
          value={num}
          onChange={(e) => setNum(e.target.value)}
          placeholder="Số chap (vd: 1 hoặc 1.5)"
          className="flex-1 rounded border px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          className="rounded bg-[#5a7d68] px-4 py-2 text-sm font-semibold text-white"
        >
          Thêm chap
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ul className="mt-4 space-y-2">
        {chapters.map((ch) => (
          <li
            key={ch.id}
            className="flex items-center justify-between rounded border border-[#e8e2da] px-3 py-2 text-sm"
          >
            <Link href={`/admin/mangas/${mangaId}/chapters/${ch.id}`} className="hover:underline">
              Chap {ch.chapterNumber}
              {ch.isLocked && " · khóa"}
              {" · "}
              {ch._count.images} ảnh
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
