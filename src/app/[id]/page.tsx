import { type Metadata } from "next";
import { notFound } from "next/navigation";
import VideoDetail from "~/app/[id]/video-detail";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{
    id?: string;
  }>;
};
// Revalidate at most every 5 minutes
export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const video = await api.video.getById({ id });
  if (!video) {
    notFound();
  }
  return {
    title: `${video.title} - Video App`,
    description: `Watch ${video.title}`,
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const video = await api.video.getById({ id });
  if (!video) {
    notFound();
  }
  return <VideoDetail video={video} />;
}
