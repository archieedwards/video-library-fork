import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { ROUTES } from "~/lib/routes";
import { type Video } from "~/lib/schemas";
import { formatDuration, formatViews } from "~/lib/utils";

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={ROUTES.VIDEO_DETAILS.replace(":id", video.id)}
      className="group"
      data-testid="video-card"
    >
      <Card className="group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail_url || "/placeholder.svg?height=200&width=350"}
            alt={video.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-all group-hover:scale-110"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
            {formatDuration(video.duration)}
          </div>
        </div>
        <CardContent className="flex-grow pt-4">
          <h3 className="mb-1 line-clamp-2 font-semibold">{video.title}</h3>
          <p className="mb-2 text-sm text-muted-foreground">
            {formatViews(video.views)} •{" "}
            {formatDistanceToNow(new Date(video.created_at), {
              addSuffix: true,
            })}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
