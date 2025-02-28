import { MemoryRouterProvider } from "next-router-mock/dist/MemoryRouterProvider";
import { customRender, screen, waitFor } from "test/setup";
import { describe, expect, test } from "vitest";
import VideoDetailPage from "~/app/[id]/page";
import { formatDuration, formatViews } from "~/lib/utils";
import mockRouter from "next-router-mock";
import { ROUTES } from "~/lib/routes";

const VIDEO = {
  id: "v-001",
  title: "Introduction to VEED's Video Editor",
  thumbnail_url: "https://picsum.photos/seed/video1/300/200",
  created_at: "2025-01-15T14:23:11Z",
  duration: 184,
  views: 12453,
  tags: ["tutorial", "beginner", "video editing"],
};
describe("Video Detail Page", () => {
  test("should render the page", async () => {
    customRender(
      await VideoDetailPage({ params: Promise.resolve({ id: VIDEO.id }) }),
    );
    expect(
      screen.getByRole("heading", { level: 1, name: VIDEO.title }),
    ).toBeVisible();
    expect(
      screen.getByText(new RegExp(formatViews(VIDEO.views))),
    ).toBeVisible();
    expect(
      screen.getByText(new RegExp(formatDuration(VIDEO.duration))),
    ).toBeVisible();
  });
  test("should navigate to the dashboard on back button click", async () => {
    mockRouter.setCurrentUrl(ROUTES.VIDEO_DETAILS.replace(":id", VIDEO.id));
    expect(mockRouter.asPath).toEqual(
      ROUTES.VIDEO_DETAILS.replace(":id", VIDEO.id),
    );
    const { user } = customRender(
      await VideoDetailPage({ params: Promise.resolve({ id: VIDEO.id }) }),
      {
        wrapper: MemoryRouterProvider,
      },
    );
    const backButton = screen.getByRole("link", {
      name: /back to dashboard/i,
    });
    expect(backButton).toBeVisible();
    await user.click(backButton);
    await waitFor(() =>
      expect(mockRouter.asPath).toEqual(ROUTES.VIDEOS_DASHBOARD),
    );
  });
});
