"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  chapterId: string;
  chapterNumber: number;
  shopeeAffiliateLink: string | null;
};

export function UnlockModal({
  chapterId,
  chapterNumber,
  shopeeAffiliateLink,
}: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Mật khẩu không đúng. Thử lại nhé.");
        return;
      }
      setToast(true);
      router.refresh();
    } catch {
      setError("Không kết nối được. Thử lại sau.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3a342f]/40 p-4 sm:items-center animate-fade-in">
      <div
        role="dialog"
        aria-labelledby="unlock-title"
        className="w-full max-w-md border border-border bg-paper p-6 shadow-xl animate-fade-up"
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Chương {chapterNumber}
        </p>
        <h2
          id="unlock-title"
          className="font-display mt-2 text-2xl text-foreground"
        >
          Chương đang được khóa
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Mật khẩu giúp hạn chế công cụ quét tự động lấy mất bản dịch. Nhập pass
          để đọc trong 24 giờ.
        </p>

        {shopeeAffiliateLink && (
          <a
            href={shopeeAffiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center border border-ribbon bg-ribbon px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-link"
          >
            Lấy mật khẩu trên Shopee
          </a>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Gợi ý: mở link Shopee, tìm mật khẩu ở tên shop hoặc mã sản phẩm (SKU),
          rồi quay lại dán vào ô bên dưới.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Mật khẩu
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="mt-1.5 w-full border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-link"
              placeholder="Nhập mật khẩu chương"
              required
            />
          </label>
          {error && <p className="text-sm text-link">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full border border-coral bg-coral px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            {pending ? "Đang mở…" : "Mở khóa"}
          </button>
        </form>

        {toast && (
          <p className="mt-3 text-center text-sm text-purple">
            Đã mở trong 24 giờ. Đang tải ảnh…
          </p>
        )}
      </div>
    </div>
  );
}
