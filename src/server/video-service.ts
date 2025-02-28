import { LIST_ENTITY_PAGE_SIZE } from "~/lib/constants";
import { type FilterState } from "~/lib/schemas";

async function getVideos(input: Partial<FilterState>) {
  let videos = await import("~/data/videos.json").then(
    (mod) => mod.default.videos,
  );

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

  {
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
  }

  // Tags
  const availableTags = [...new Set(videos.flatMap((video) => video.tags))];

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
  const videos = await import("~/data/videos.json").then(
    (mod) => mod.default.videos,
  );
  return videos.find((video) => video.id === id);
}

const videoService = {
  getVideos,
  getById,
};

export default videoService;
