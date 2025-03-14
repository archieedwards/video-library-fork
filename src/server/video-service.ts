import { PrismaClient } from "@prisma/client";
import { LIST_ENTITY_PAGE_SIZE } from "~/lib/constants";
import { type FilterState } from "~/lib/schemas";

const prisma = new PrismaClient();

type VideoWithTags = {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
};

async function getVideos(input: Partial<FilterState>) {
  const dbVideos = await prisma.video.findMany({
    include: {
      tags: true,
    },
  });

  let videos: VideoWithTags[] = dbVideos.map((video) => ({
    id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnailUrl,
    created_at: video.createdAt.toISOString(),
    duration: video.duration,
    views: video.views,
    tags: video.tags.map((tag) => tag.name),
  }));

  const sort = input.sort ?? "newest";

  // Filtering by search
  if (input.search) {
    const searchQuery = input.search.toLowerCase();
    videos = videos.filter((video) =>
      video.title.toLowerCase().includes(searchQuery),
    );
  }

  // Filtering by tags
  if (input.tags && input.tags.length > 0) {
    videos = videos.filter((video) =>
      input.tags!.some((tag) => video.tags.includes(tag)),
    );
  }

  // Sorting logic
  if (sort === "newest") {
    videos.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } else if (sort === "oldest") {
    videos.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  } else if (sort === "alphabetical") {
    videos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "reverse-alphabetical") {
    videos.sort((a, b) => b.title.localeCompare(a.title));
  }

  // Filtering by date range
  if (input.dateFrom) {
    videos = videos.filter(
      (video) => new Date(video.created_at) >= input.dateFrom!,
    );
  }

  if (input.dateTo) {
    videos = videos.filter(
      (video) => new Date(video.created_at) <= input.dateTo!,
    );
  }

  // Get all unique tags from the videos we already have
  const availableTags = [
    ...new Set(dbVideos.flatMap((v) => v.tags.map((t) => t.name))),
  ];

  // Pagination logic
  const page = input.page ?? 1;
  const pageSize = LIST_ENTITY_PAGE_SIZE;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedVideos = videos.slice(startIndex, endIndex);

  return {
    videos: paginatedVideos,
    pagination: {
      total: videos.length,
      page,
      pageSize,
    },
    availableTags,
  };
}

async function getById(id: string) {
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!video) return null;

  return {
    id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnailUrl,
    created_at: video.createdAt.toISOString(),
    duration: video.duration,
    views: video.views,
    tags: video.tags.map((tag) => tag.name),
  };
}

const videoService = {
  getVideos,
  getById,
};

export default videoService;
