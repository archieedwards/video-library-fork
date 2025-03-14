# Video Dashboard App

This is a full-stack video library application that allows users to browse and manage their video collection. The application consists of a Next.js frontend and backend using tRPC for communication.

## Tech Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [shadcn/ui](https://ui.shadcn.com/)
- [nuqs](https://nuqs.47ng.com/)
- [vitest](https://vitest.dev/)
- [trpc-openapi](https://github.com/mcampa/trpc-to-openapi)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [pnpm](https://pnpm.io/) or npm

### Installation

1.  Clone the repository:

    ```
    git clone git@github.com:damjtoh/video-library.git
    cd video-library
    ```

2.  Install dependencies:

    ```
    pnpm install
    ```

3.  Setup the database:

    ```bash
    # Create database and run migrations
    pnpm prisma migrate dev

    # Seed the database with initial data
    pnpm prisma db seed
    ```

4.  Start the development server:

    ```
    pnpm dev
    ```

    The app will be available at `http://localhost:3000`

## Project Structure

```
├── public              # Static assets (e.g., favicon, images)
├── src                 # Main Next.js app (frontend & backend)
│   ├── app             # Application pages and related files
│   │   ├── api         # API routes (server-side endpoints)
│   ├── components      # Reusable UI components
│   │   ├── ui          # Pre-built UI elements from shadcn/ui
│   ├── data            # Static data files
│   ├── lib             # Utility functions and helpers
│   ├── server          # Server-side logic and backend utilities
│   ├── styles          # Global stylesheets
│   └── trpc            # tRPC setup for server-client communication
├── tests               # Test setup files
```

## API Endpoints

The Video App API provides access to video data with filtering, sorting, and pagination options. It is implemented using tRPC for efficient server-client communication and also exposes RESTful endpoints for broader integration.
Both APIs interact with `videos.json` as the primary data source.

### REST API

#### Base URL

```
http://localhost:3000/api
```

#### List All Videos

**`GET /videos`**\
Retrieve a list of videos with optional filtering, sorting, and pagination.

#### Query Parameters:

- `search` (string) -- Filter videos by title.
- `sort` (string) -- Sort by `newest`, `oldest`, `alphabetical`, `reverse-alphabetical`.
- `tags` (array[string]) -- Filter by tags.
- `page` (number) -- Pagination.
- `dateFrom`, `dateTo` (string, nullable) -- Filter by date range.

###### Response (200 OK):

```json
{
  "videos": [
    {
      "id": "string",
      "title": "string",
      "thumbnail_url": "string",
      "created_at": "string",
      "duration": "number",
      "views": "number",
      "tags": ["string"]
    }
  ],
  "availableTags": ["string"],
  "pagination": {
    "page": "number",
    "total": "number",
    "pageSize": "number"
  }
}
```

#### Get Video by ID

**`GET /videos/{id}`**\
Retrieve details of a single video by its ID.

#### Path Parameter:

- `id` (string, required) -- The video ID.

##### Response (200 OK):

```json
{
  "id": "string",
  "title": "string",
  "thumbnail_url": "string",
  "created_at": "string",
  "duration": "number",
  "views": "number",
  "tags": ["string"]
}
```

---

For full documentation, refer to the OpenAPI spec available at: https://vl.dami.dev/api/openapi.json

### tRPC API

#### `trpc.video.get.query(input);`

Retrieves a list of videos with optional filters.

##### **Input (optional)**

A partial object based on the `FilterState` schema:

```ts
{
  search?: string;       // Search term for filtering videos
  sort?: "newest" | "oldest" | "alphabetical" | "reverse-alphabetical"; // Sorting option
  tags?: string[];       // Filter by tags
  page?: number;         // Page number for pagination
  dateFrom?: Date | null; // Filter videos from this date
  dateTo?: Date | null;  // Filter videos up to this date
}
```

##### **Output**

To see a full response refer to the **Response** section on the REST API.

##### **Example Usage**

```ts
const response = await trpc.video.get.query({
  search: "veed",
  sort: "newest",
  tags: ["tutorial"],
  page: 1,
  dateFrom: "2024-01-01",
  dateTo: "2024-02-01",
});
```

---

#### `trpc.video.getById.query(input);`

Fetches a single video by its ID.

##### **Input**

```ts
{
  id: string; // Unique video identifier
}
```

##### **Output**

To see a full response refer to the **Response** section on the REST API.

##### **Example Usage**

```ts
const response = await trpc.video.getById.query({ id: "v-001" });
```

---

## Deployment

### Live Demo

You can access the deployed version of the application here: [Deployed Version](https://vl.dami.dev/)

### Production Deployment

To build for production:

```
pnpm build
pnpm start
```

### Docker Deployment

To build and run a Docker container for the application:

1.  Before building the Docker image, update `next.config.js` in the root of the project to include:

    ```diff
    const config = {
      images: {
        ...,
      },
    +  output: "standalone",
    };
    ```

2.  Build the Docker image:

    ```
    docker build -t video-library .
    ```

3.  Run the container:

    ```
    docker run -p 3000:3000 video-library
    ```

    The app will be available at `http://localhost:3000`

## Testing

To run tests:

```
pnpm test
```

## License

This project is licensed under the MIT License.

---

If you have any questions, feel free to reach out!
