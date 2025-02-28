/* eslint-disable @typescript-eslint/consistent-type-imports */
import { vi } from "vitest";

import { render, type RenderOptions } from "@testing-library/react";
import omit from "lodash.omit";
import userEvent from "@testing-library/user-event";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";

import { type ReactElement } from "react";
import superjson from "superjson";
import "@testing-library/jest-dom";
import { appRouter, AppRouter } from "~/server/api/root";
import { createCallerFactory } from "~/server/api/trpc";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { httpLink } from "@trpc/client";

const mockedTRPC = createTRPCReact<AppRouter>();

const mockedTRPCClient = mockedTRPC.createClient({
  links: [
    httpLink({
      transformer: superjson,
      url: "http://localhost:3000/api/trpc",
      headers() {
        return {
          "content-type": "application/json",
        };
      },
      fetch,
    }),
  ],
});

const mockedQueryClient = new QueryClient();

export const MockedTRPCProvider = (props: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <mockedTRPC.Provider
        client={mockedTRPCClient}
        queryClient={mockedQueryClient}
      >
        {props.children}
      </mockedTRPC.Provider>
    </QueryClientProvider>
  );
};

export const createCaller = createCallerFactory(appRouter);

vi.mock("src/trpc/server", () => {
  const caller = createCaller({
    headers: new Headers(),
  });

  const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
    caller,
    () => mockedQueryClient,
  );
  return {
    api,
    HydrateClient,
  };
});

vi.mock("react", async () => {
  const actual = await import("react").then((mod) =>
    "default" in mod ? mod.default : mod,
  );
  return {
    ...actual,
    cache<T, CachedFunction extends () => T>(fn: CachedFunction) {
      let cache: T | undefined = undefined;
      function cachedFn() {
        cache ??= fn();
        return cache;
      }
      return cachedFn;
    },
  };
});

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  const { useRouter } =
    await vi.importActual<typeof import("next-router-mock")>(
      "next-router-mock",
    );
  const usePathname = vi.fn().mockImplementation(() => {
    const router = useRouter();
    return router.pathname;
  });
  const useSearchParams = vi.fn().mockImplementation(() => {
    const router = useRouter();
    return new URLSearchParams(JSON.stringify(router.query));
  });
  const useParams = vi.fn().mockImplementation(() => {
    const router = useRouter();
    return router.asPath;
  });
  return {
    ...actual,
    useRouter: vi.fn().mockImplementation(useRouter),
    usePathname,
    useSearchParams,
    useParams,
  };
});

vi.mock("server-only", () => {
  return {};
});

vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers()),
}));

export const customRender = (
  ui: ReactElement,
  renderOptions?: RenderOptions,
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: (props) => {
        const renderedComponent = renderOptions?.wrapper ? (
          <renderOptions.wrapper {...props} />
        ) : (
          props.children
        );
        return <MockedTRPCProvider>{renderedComponent}</MockedTRPCProvider>;
      },
      ...(renderOptions ? omit(renderOptions, "wrapper") : {}),
    }),
  };
};

export * from "@testing-library/react";
