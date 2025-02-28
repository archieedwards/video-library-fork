import VideoDashboard from "~/app/video-dashboard";
import { api, HydrateClient } from "~/trpc/server";
import type { SearchParams } from "nuqs/server";
import { loadVideoFiltersSearchParams } from "~/lib/search-params";
import { Suspense } from "react";
import { LoadingSkeleton } from "~/app/loading-skeleton";
import Link from "next/link";
import { ROUTES } from "~/lib/routes";

export const revalidate = 30;

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function VideoDashboardPage({ searchParams }: Props) {
  const filterState = await loadVideoFiltersSearchParams(searchParams);

  void api.video.get.prefetch(filterState);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container mx-auto px-4 py-8">
          <Link href={ROUTES.VIDEOS_DASHBOARD} className="inline-block">
            <h1 className="mb-8 text-3xl font-bold">Video Dashboard</h1>
          </Link>
          <Suspense fallback={<LoadingSkeleton />}>
            <VideoDashboard />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
