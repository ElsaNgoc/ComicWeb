import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signUnlockToken, unlockCookieOptions } from "@/lib/unlock";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      chapterId?: string;
      password?: string;
    };

    const chapterId = body.chapterId?.trim();
    const password = body.password?.trim();

    if (!chapterId || !password) {
      return NextResponse.json(
        { error: "Thiếu chapter_id hoặc mật khẩu." },
        { status: 400 },
      );
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        isLocked: true,
        password: true,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Không tìm thấy chương." },
        { status: 404 },
      );
    }

    if (!chapter.isLocked) {
      return NextResponse.json({ ok: true, alreadyOpen: true });
    }

    if (!chapter.password || chapter.password !== password) {
      return NextResponse.json(
        { error: "Mật khẩu không đúng. Thử lại nhé." },
        { status: 400 },
      );
    }

    const token = await signUnlockToken(chapter.id);
    const response = NextResponse.json({ ok: true });
    const cookie = unlockCookieOptions(chapter.id, token);
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Không mở khóa được. Thử lại sau." },
      { status: 500 },
    );
  }
}
