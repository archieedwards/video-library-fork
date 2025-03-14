import { PrismaClient } from "@prisma/client";
import videosData from "../src/data/videos.json";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.video.deleteMany();
  await prisma.tag.deleteMany();

  // Create videos with their tags
  for (const video of videosData.videos) {
    await prisma.video.create({
      data: {
        id: video.id, // Keep original IDs
        title: video.title,
        thumbnailUrl: video.thumbnail_url,
        createdAt: new Date(video.created_at),
        duration: video.duration,
        views: video.views,
        tags: {
          connectOrCreate: video.tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
    });
  }

  console.log("Database has been seeded. 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
