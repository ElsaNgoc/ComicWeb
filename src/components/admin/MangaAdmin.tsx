"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tag = { id: string; name: string; slug: string };

export function TagManager({ initialTags }: { initialTags: Tag[] }) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function addTag(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      setError("Tạo tag thất bại.");
      return;
    }
    const tag = (await res.json()) as Tag;
    setTags((t) => [...t, tag].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
    router.refresh();
  }

  async function removeTag(id: string) {
    if (!confirm("Xóa tag này?")) return;
    await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    setTags((t) => t.filter((x) => x.id !== id));
    router.refresh();
  }

  return (
    <section className="rounded-lg border border-[#ddd6cc] bg-white p-5">
      <h2 className="font-semibold">Thể loại (tag)</h2>
      <form onSubmit={addTag} className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên thể loại"
          className="flex-1 rounded border border-[#ddd6cc] px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          className="rounded bg-[#5a7d68] px-4 py-2 text-sm font-semibold text-white"
        >
          Thêm
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag.id}
            className="flex items-center gap-2 rounded-full border border-[#ddd6cc] px-3 py-1 text-sm"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="text-[#7a6f62] hover:text-red-600"
              aria-label={`Xóa ${tag.name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[#7a6f62]">
        Gán tag khi tạo/sửa truyện. Filter tag trên trang user làm sau.
      </p>
    </section>
  );
}

type MangaRow = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  chapters: { chapterNumber: number; isLocked: boolean }[];
  tags: { tag: Tag }[];
};

export function MangaList({ mangas }: { mangas: MangaRow[] }) {
  const router = useRouter();

  async function remove(id: string, title: string) {
    if (!confirm(`Xóa truyện "${title}" và toàn bộ chap?`)) return;
    await fetch(`/api/admin/mangas/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#ddd6cc] bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#e8e2da] bg-[#faf8f5] text-xs uppercase tracking-wide text-[#7a6f62]">
          <tr>
            <th className="px-4 py-3">Truyện</th>
            <th className="px-4 py-3">Chap</th>
            <th className="px-4 py-3">Tag</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {mangas.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-[#7a6f62]">
                Chưa có truyện.{" "}
                <Link href="/admin/mangas/new" className="underline">
                  Tạo truyện mới
                </Link>
              </td>
            </tr>
          ) : (
            mangas.map((m) => (
              <tr key={m.id} className="border-b border-[#f0ebe3] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.coverImage}
                      alt=""
                      className="h-12 w-9 object-cover border border-[#ddd6cc]"
                    />
                    <div>
                      <Link
                        href={`/admin/mangas/${m.id}`}
                        className="font-medium hover:underline"
                      >
                        {m.title}
                      </Link>
                      <p className="text-xs text-[#7a6f62]">/{m.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{m.chapters.length}</td>
                <td className="px-4 py-3">
                  {m.tags.map(({ tag }) => tag.name).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove(m.id, m.title)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
