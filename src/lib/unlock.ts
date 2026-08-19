import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const MAX_AGE_SEC = 60 * 60 * 24; // 24h

function cookieName(chapterId: string) {
  return `cu_${chapterId.replace(/-/g, "")}`;
}

function getSecret() {
  const secret = process.env.UNLOCK_JWT_SECRET;
  if (!secret) {
    throw new Error("UNLOCK_JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signUnlockToken(chapterId: string) {
  return new SignJWT({ chapterId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(getSecret());
}

export async function verifyUnlockToken(token: string, chapterId: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.chapterId === chapterId;
  } catch {
    return false;
  }
}

export async function isChapterUnlocked(chapterId: string) {
  const jar = await cookies();
  const token = jar.get(cookieName(chapterId))?.value;
  if (!token) return false;
  return verifyUnlockToken(token, chapterId);
}

export function unlockCookieOptions(chapterId: string, token: string) {
  return {
    name: cookieName(chapterId),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}
