import { describe, expect, test, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";

import {
  withNuqsTestingAdapter,
  NuqsTestingAdapter,
  type UrlUpdateEvent,
} from "nuqs/adapters/testing";

import VideoDashboardPage from "~/app/page";
import { customRender } from "tests/setup";
import mockRouter from "next-router-mock";
import { ROUTES } from "~/lib/routes";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

const VIDEOS = [
  {
    id: "v-001",
    title: "Introduction to VEED's Video Editor",
    thumbnail_url: "https://picsum.photos/seed/video1/300/200",
    created_at: "2025-01-15T14:23:11Z",
    duration: 184,
    views: 12453,
    tags: ["tutorial", "beginner", "video editing"],
  },
  {
    id: "v-002",
    title: "Advanced Color Correction Techniques",
    thumbnail_url: "https://picsum.photos/seed/video2/300/200",
    created_at: "2025-01-10T09:45:22Z",
    duration: 842,
    views: 8741,
    tags: ["tutorial", "advanced", "color grading"],
  },
];

describe("Video Dashboard", () => {
  afterEach(() => vi.resetModules());
  test("should render the page", async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    customRender(
      await VideoDashboardPage({ searchParams: Promise.resolve({}) }),
      {
        wrapper: withNuqsTestingAdapter({
          onUrlUpdate,
        }),
      },
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Video Dashboard" }),
    ).toBeDefined();
    expect(await screen.findByText("Creating Video Portfolios")).toBeDefined();
  });
  test("should render empty message if there aren't videos", async () => {
    vi.doMock("~/data/videos.json", () => ({
      default: {
        videos: [],
      },
    }));

    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    customRender(
      await VideoDashboardPage({ searchParams: Promise.resolve({}) }),
      {
        wrapper: withNuqsTestingAdapter({
          onUrlUpdate,
        }),
      },
    );
    expect(
      await screen.findByRole("heading", { level: 2, name: "No videos found" }),
    ).toBeDefined();
  });

  test("should filter videos by search", async () => {
    vi.doMock("~/data/videos.json", () => ({
      default: {
        videos: VIDEOS,
      },
    }));
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    const { user } = customRender(
      await VideoDashboardPage({ searchParams: Promise.resolve({}) }),
      {
        wrapper: withNuqsTestingAdapter({
          onUrlUpdate,
        }),
      },
    );

    expect(await screen.findAllByTestId("video-card")).toHaveLength(2);
    expect(
      screen.getByText("Introduction to VEED's Video Editor"),
    ).toBeVisible();
    expect(
      screen.getByText("Advanced Color Correction Techniques"),
    ).toBeVisible();

    const searchInput = await screen.findByPlaceholderText(/Search/i);
    await user.type(searchInput, "veed");
    await screen.findByDisplayValue("veed");

    await waitFor(() =>
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: "?search=veed",
        }),
      ),
    );
    await waitFor(() =>
      expect(screen.queryAllByTestId("video-card")).toHaveLength(1),
    );
    expect(
      screen.getByText("Introduction to VEED's Video Editor"),
    ).toBeVisible();
    expect(
      screen.queryByText("Advanced Color Correction Techniques"),
    ).toBeNull();
  });
  test("should navigate to detail page on card click", async () => {
    const video = VIDEOS[0]!;
    vi.doMock("~/data/videos.json", () => ({
      default: {
        videos: [video],
      },
    }));
    const { user } = customRender(
      await VideoDashboardPage({ searchParams: Promise.resolve({}) }),
      {
        wrapper: ({ children }) => (
          <MemoryRouterProvider>
            <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
          </MemoryRouterProvider>
        ),
      },
    );

    const videoCard = await screen.findByTestId("video-card");
    await user.click(videoCard);

    await waitFor(() =>
      expect(mockRouter.asPath).toEqual(
        ROUTES.VIDEO_DETAILS.replace(":id", video.id),
      ),
    );
  });
});
