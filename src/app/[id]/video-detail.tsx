"use client";

import { formatDistanceToNow } from "date-fns";
import { Play, ArrowLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { ROUTES } from "~/lib/routes";
import { formatDuration, formatViews } from "~/lib/utils";
import Image from "next/image";
import { type Video } from "~/lib/schemas";

export default function VideoDetail({ video }: { video: Video }) {
  const formattedDate = formatDistanceToNow(new Date(video.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className="mx-auto max-w-5xl space-y-4 px-4 py-4"
      data-testid="video-detail"
    >
      <Button variant="ghost" className="text-muted-foreground" asChild>
        <Link href={ROUTES.VIDEOS_DASHBOARD}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black">
        <Image
          fill
          priority
          src={video.thumbnail_url || "/placeholder.svg"}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex justify-end">
            <Badge variant="secondary" className="bg-black/70 text-white">
              {formatDuration(video.duration)}
            </Badge>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-white/40 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Play className="ml-1 h-8 w-8 text-white" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="mb-2 text-2xl font-bold">{video.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-y-3">
          <div className="text-muted-foreground">
            {formatViews(video.views)} • {formattedDate}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-6">
        <h2 className="mb-2 text-sm font-medium">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
