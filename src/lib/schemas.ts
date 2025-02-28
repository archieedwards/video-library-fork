import { z } from "zod";

export const sortSchema = z.enum([
  "newest",
  "oldest",
  "alphabetical",
  "reverse-alphabetical",
]);

export const filterSchemaState = z.object({
  search: z.string(),
  sort: sortSchema,
  tags: z.array(z.string()),
  page: z.number(),
  dateFrom: z.date().nullable(),
  dateTo: z.date().nullable(),
});

export type FilterState = z.infer<typeof filterSchemaState>;

export type DateRange = {
  from: z.infer<typeof filterSchemaState>["dateFrom"];
  to: z.infer<typeof filterSchemaState>["dateTo"];
};

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail_url: z.string(),
  created_at: z.string(),
  duration: z.number(),
  views: z.number(),
  tags: z.array(z.string()),
});

export type Video = z.infer<typeof videoSchema>;
