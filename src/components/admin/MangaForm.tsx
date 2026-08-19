"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Tag = { id: string; name: string };

type Props = {
  tags: Tag[];
  manga?: {
    id: string;
    title: string;
    description: string | null;
    coverImage: string;
    tags: { tag: Tag }[];
  };
};

export function MangaForm({ tags, manga }: Props) {
  const router = useRouter();
  const isEdit = Boolean(manga);
  const [title, setTitle] = useState(manga?.title ?? "");
  const [description, setDescription] = useState(manga?.description ?? "");
  const [coverUrl, setCoverUrl] = useState(manga?.coverImage ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    manga?.tags.map((t) => t.tag.id) ?? [],
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleTag(id: string) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData();
    form.set("title", title);
    form.set("description", description);
    form.set("tagIds", selectedTags.join(","));
    if (coverFile) form.set("cover", coverFile);
    else if (coverUrl) form.set("coverUrl", coverUrl);

    const url = isEdit ? `/api/admin/mangas/${manga!.id}` : "/api/admin/mangas";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: form,
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Lưu thất bại.");
      return;
    }

    const saved = (await res.json()) as { id: string };
    router.push(`/admin/mangas/${saved.id}`);
    router.refresh();
  }

  const preview = coverFile ? URL.createObjectURL(coverFile) : coverUrl;

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-[#ddd6cc] bg-white p-5">
      <Field label="Tên truyện" value={title} onChange={setTitle} required />
      <label className="block text-sm">
        <span className="font-medium">Mô tả</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded border border-[#ddd6cc] px-3 py-2"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Ảnh bìa (upload)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>
        <Field
          label="Hoặc URL bìa"
          value={coverUrl}
          onChange={setCoverUrl}
          hint="Dùng khi chưa cấu hình R2"
        />
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-40 w-28 object-cover border" />
      )}

      {tags.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium">Thể loại</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-1 rounded border border-[#ddd6cc] px-2 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-[#5a7d68] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : isEdit ? "Cập nhật truyện" : "Tạo truyện"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-[#7a6f62]">{hint}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded border border-[#ddd6cc] px-3 py-2"
      />
    </label>
  );
}
