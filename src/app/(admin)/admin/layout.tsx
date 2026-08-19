import Link from "next/link";
import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const authed = await isAdminAuthenticated().catch(() => false);

  return (
    <div className="min-h-screen bg-[#f4f2ef] text-[#2c2418]">
        {authed && (
          <header className="border-b border-[#ddd6cc] bg-white">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6f62]">
                  Xà Động Admin
                </p>
                <p className="text-sm text-[#5c5348]">CMS — chỉ bạn truy cập</p>
              </div>
              <nav className="flex flex-wrap items-center gap-4 text-sm">
                <Link href="/admin/mangas" className="font-medium hover:underline">
                  Truyện
                </Link>
                <Link href="/admin/site" className="font-medium hover:underline">
                  Giao diện
                </Link>
                <Link href="/" target="_blank" className="text-[#7a6f62] hover:underline">
                  Xem site ↗
                </Link>
                <form action="/api/admin/logout" method="post">
                  <button
                    type="submit"
                    className="rounded border border-[#ddd6cc] px-3 py-1.5 text-[#5c5348] hover:bg-[#faf8f5]"
                  >
                    Đăng xuất
                  </button>
                </form>
              </nav>
            </div>
          </header>
        )}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
      </div>
  );
}
