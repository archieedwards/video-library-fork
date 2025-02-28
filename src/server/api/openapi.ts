import { generateOpenApiDocument } from "trpc-to-openapi";
import { appRouter } from "~/server/api/root";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Video App API",
  description: "OpenAPI compliant REST API",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
  tags: ["videos"],
});
