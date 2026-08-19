import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

function getClient() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function isR2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_BASE_URL,
  );
}

function extForType(type: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export async function uploadImageToR2(
  file: File,
  folder: "covers" | "chapters" | "banners",
) {
  if (!isR2Configured()) {
    throw new Error("R2 chưa cấu hình. Xem Requirement/External-Setup.md");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Chỉ chấp nhận ảnh JPEG, PNG, WebP, GIF");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Ảnh tối đa 10MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extForType(file.type);
  const key = `${folder}/${randomUUID()}.${ext}`;
  const bucket = process.env.R2_BUCKET_NAME!;

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  const base = process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "");
  return `${base}/${key}`;
}
