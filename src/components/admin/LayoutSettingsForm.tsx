"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DEFAULT_LAYOUT,
  type LayoutBlock,
  type LayoutConfig,
  type SiteSettingsData,
} from "@/lib/site-settings-shared";

type Props = { initial: SiteSettingsData };

const BLOCK_LABELS: Record<string, string> = {
  welcome: "Lời chào (trang chủ)",
  "manga-grid": "Lưới truyện",
  "sidebar-quote": "Sidebar · Quote",
  "sidebar-intro": "Sidebar · Giới thiệu",
  "sidebar-corner": "Sidebar · Góc nhỏ",
  "sidebar-notes": "Sidebar · Ghi chú",
};

function mergeLayout(config: LayoutConfig | null): LayoutConfig {
  if (!config) return DEFAULT_LAYOUT;
  return {
    home: config.home.length ? config.home : DEFAULT_LAYOUT.home,
    sidebar: config.sidebar.length ? config.sidebar : DEFAULT_LAYOUT.sidebar,
  };
}

function moveBlock(blocks: LayoutBlock[], id: string, dir: -1 | 1) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((b) => b.id === id);
  if (idx < 0) return sorted;
  const swap = idx + dir;
  if (swap < 0 || swap >= sorted.length) return sorted;

  const next = [...sorted];
  [next[idx], next[swap]] = [next[swap], next[idx]];
  return next.map((b, i) => ({ ...b, order: i + 1 }));
}

function BlockList({
  title,
  blocks,
  onChange,
}: {
  title: string;
  blocks: LayoutBlock[];
  onChange: (blocks: LayoutBlock[]) => void;
}) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-2">
        {sorted.map((block) => (
          <li
            key={block.id}
            className="flex items-center justify-between gap-2 rounded border border-[#e8e2da] px-3 py-2 text-sm"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.enabled}
                onChange={(e) =>
                  onChange(
                    blocks.map((b) =>
                      b.id === block.id ? { ...b, enabled: e.target.checked } : b,
                    ),
                  )
                }
              />
              {BLOCK_LABELS[block.type] ?? block.type}
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChange(moveBlock(blocks, block.id, -1))}
                className="rounded border px-2 py-0.5 text-xs"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onChange(moveBlock(blocks, block.id, 1))}
                className="rounded border px-2 py-0.5 text-xs"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LayoutSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [layout, setLayout] = useState<LayoutConfig>(() =>
    mergeLayout(initial.layoutConfig),
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layoutConfig: layout }),
    });

    setLoading(false);
    if (!res.ok) {
      setMessage("Lưu thất bại.");
      return;
    }

    setMessage("Đã lưu bố cục.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-[#ddd6cc] bg-white p-5">
      <h2 className="font-semibold">Bố cục block</h2>
      <p className="text-sm text-[#7a6f62]">
        Bật/tắt và đổi thứ tự block trên trang user.
      </p>
      <BlockList
        title="Trang chủ"
        blocks={layout.home}
        onChange={(home) => setLayout((l) => ({ ...l, home }))}
      />
      <BlockList
        title="Sidebar"
        blocks={layout.sidebar}
        onChange={(sidebar) => setLayout((l) => ({ ...l, sidebar }))}
      />
      {message && <p className="text-sm text-[#5a7d68]">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-[#5a7d68] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : "Lưu bố cục"}
      </button>
    </form>
  );
}
