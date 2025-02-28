import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterSchemaState, videoSchema } from "~/lib/schemas";
import videoService from "~/server/video-service";

export const videoRouter = createTRPCRouter({
  get: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/videos",
        tags: ["videos"],
        summary: "List all videos.",
      },
    })
    .input(filterSchemaState.partial())
    .output(
      z.object({
        videos: z.array(videoSchema),
        availableTags: z.array(z.string()),
        pagination: z.object({
          page: z.number(),
          total: z.number(),
          pageSize: z.number(),
        }),
      }),
    )
    .query(
      async ({
        input = {
          search: "",
          sort: "newest",
          tags: [],
          page: 1,
          dateFrom: null,
          dateTo: null,
        },
      }) => {
        return videoService.getVideos(input);
      },
    ),
  getById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/videos/{id}",
        tags: ["videos"],
        summary: "Get a video by id",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(videoSchema.nullable())
    .query(async ({ input }) => {
      const video = await videoService.getById(input.id);
      return video ?? null;
    }),
});
