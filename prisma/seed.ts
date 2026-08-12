import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const manga = await prisma.manga.upsert({
    where: { slug: "demo-truyen-18" },
    update: {},
    create: {
      title: "Demo Truyện 18+",
      slug: "demo-truyen-18",
      coverImage: "https://img.example.com/covers/demo.jpg",
      description: "Truyện demo để kiểm tra schema & unlock flow.",
      isNsfw: true,
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
                  imageUrl: "https://img.example.com/demo/ch1/01.webp",
                },
                {
                  orderIndex: 2,
                  imageUrl: "https://img.example.com/demo/ch1/02.webp",
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
                  imageUrl: "https://img.example.com/demo/ch2/01.webp",
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
