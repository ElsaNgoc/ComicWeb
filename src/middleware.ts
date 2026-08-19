import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

function getAdminHost() {
  return process.env.ADMIN_HOST?.toLowerCase();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  const adminHost = getAdminHost();

  // Phase 6: admin chỉ truy cập qua subdomain riêng (nếu cấu hình)
  if (adminHost && pathname.startsWith("/admin")) {
    if (host !== adminHost) {
      if (pathname === "/admin/login" || pathname.startsWith("/admin/")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  if (pathname.startsWith("/api/admin")) {
    const publicApi = ["/api/admin/login"];
    if (publicApi.includes(pathname)) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_session")?.value;
    const ok = token ? await verifyAdminToken(token) : false;
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const token = request.cookies.get("admin_session")?.value;
  const ok = token ? await verifyAdminToken(token) : false;

  if (!ok) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
