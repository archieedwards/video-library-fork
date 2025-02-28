import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Skeleton className="mb-4 aspect-video w-full rounded-lg" />

      <div className="mb-4">
        <Skeleton className="mb-2 h-8 w-3/4" />
        <div className="flex flex-wrap items-center justify-between gap-y-3">
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-6">
        <Skeleton className="mb-2 h-5 w-16" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
