import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const manga = await prisma.manga.upsert({
    where: { slug: "demo-xa-dong" },
    update: {
      title: "Demo Xà Động",
      description:
        "Bản demo cho blog Xà Động. Chap 1 mở sẵn; chap 2 khóa mật khẩu (SHOPDEMO) để thử luồng chống quét.",
      isNsfw: false,
      coverImage: "https://picsum.photos/seed/xadong/600/800",
    },
    create: {
      title: "Demo Xà Động",
      slug: "demo-xa-dong",
      coverImage: "https://picsum.photos/seed/xadong/600/800",
      description:
        "Bản demo cho blog Xà Động. Chap 1 mở sẵn; chap 2 khóa mật khẩu (SHOPDEMO) để thử luồng chống quét.",
      isNsfw: false,
      chapters: {
        create: [
          {
            chapterNumber: 1,
            isLocked: false,
            password: null,
            shopeeAffiliateLink: null,
            images: {
              create: [
                {
                  orderIndex: 1,
                  imageUrl: "https://picsum.photos/seed/xadong-c1-1/800/1200",
                },
                {
                  orderIndex: 2,
                  imageUrl: "https://picsum.photos/seed/xadong-c1-2/800/1200",
                },
              ],
            },
          },
          {
            chapterNumber: 2,
            isLocked: true,
            password: "SHOPDEMO",
            shopeeAffiliateLink: "https://shope.ee/example",
            images: {
              create: [
                {
                  orderIndex: 1,
                  imageUrl: "https://picsum.photos/seed/xadong-c2-1/800/1200",
                },
                {
                  orderIndex: 2,
                  imageUrl: "https://picsum.photos/seed/xadong-c2-2/800/1200",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seeded manga:", manga.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
