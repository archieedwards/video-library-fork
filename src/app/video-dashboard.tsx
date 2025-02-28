"use client";

import { useTransition, useDeferredValue } from "react";
import { VideoCard } from "~/components/video-card";
import { SearchBar } from "~/app/search-bar";
import { DateRangePicker } from "~/app/date-range-picker";
import { TagFilter } from "~/app/tag-filter";
import { SortOptions } from "~/app/sort-options";
import { api } from "~/trpc/react";
import { useQueryStates } from "nuqs";
import Pagination from "~/components/pagination";
import { videoFiltersSearchParams } from "~/lib/search-params";
import { type DateRange, type FilterState } from "~/lib/schemas";
import { cn } from "~/lib/utils";

const INITIAL_STATE: FilterState = {
  search: "",
  sort: "newest",
  tags: [],
  page: 1,
  dateFrom: null,
  dateTo: null,
};

export default function VideoDashboard() {
  const [isPending, startTransition] = useTransition();
  const [filtersState, setFilters] = useQueryStates(videoFiltersSearchParams, {
    startTransition,
    shallow: true,
  });

  // If the filter state changes too quickly, we don't want to suspend (displays fallback)
  const deferredFiltersState = useDeferredValue(filtersState);

  function setQuery(search: string) {
    void setFilters({ ...INITIAL_STATE, search });
  }

  function setTags(tags: string[]) {
    void setFilters({ tags, page: 1 });
  }

  function setPage(page: number) {
    void setFilters(
      { page },
      {
        scroll: true,
      },
    );
  }

  function setSort(sort: FilterState["sort"]) {
    void setFilters({ sort, page: 1 });
  }

  function setDateRange({ from, to }: DateRange) {
    void setFilters({ dateFrom: from, dateTo: to, page: 1 });
  }

  const [{ videos, pagination, availableTags }] =
    api.video.get.useSuspenseQuery(deferredFiltersState);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid items-start gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <SearchBar defaultValue={filtersState.search} onChange={setQuery} />
        <DateRangePicker
          value={{ from: filtersState.dateFrom, to: filtersState.dateTo }}
          onChange={setDateRange}
        />
        <TagFilter
          tags={availableTags}
          selectedTags={filtersState.tags}
          onChange={setTags}
        />
        <SortOptions value={filtersState.sort} onChange={setSort} />
      </div>

      <span className="text-sm text-muted-foreground">
        Showing {videos.length} of {pagination.total} videos
      </span>

      {videos.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="text-xl font-medium">No videos found</h2>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            isPending && "transition-d animate-pulse",
          )}
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
      <Pagination
        onChange={setPage}
        currentPage={filtersState.page}
        totalElements={pagination.total}
        pageSize={pagination.pageSize}
        className="my-8"
      />
    </div>
  );
}
