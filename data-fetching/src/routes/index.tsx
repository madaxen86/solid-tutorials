import { cache, createAsync, revalidate, RouteDefinition } from "@solidjs/router";
import { ErrorBoundary, Show, startTransition, Suspense } from "solid-js";
import { Button } from "~/components/ui/button";

const getDate = async () => {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // if (1 === 1) throw new Error("Error");
  return new Date().toLocaleString();
};

const getCachedDate = cache(getDate, "getDate");

export const route = {
  preload: () => {
    console.log("preloading");
    getCachedDate();
  },
} satisfies RouteDefinition;

export default function Home() {
  const date = createAsync(() => getDate());
  const cachedDate = createAsync(() => getCachedDate(), { deferStream: true });

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700   my-16">Data Fetching in SolidStart</h1>
      <div class="flex flex-col gap-5">
        <ErrorBoundary
          fallback={(err, reset) => {
            return (
              <div>
                <p>{err.message}</p>
                <Button onClick={reset}>Try again</Button>
              </div>
            );
          }}
        >
          <Suspense fallback={<p class="text-5xl text-white">Loading...</p>}>
            <p class="text-5xl text-white">{date()}</p>
          </Suspense>
          <Show
            when={cachedDate()}
            fallback={"...show"}
          >
            <Suspense fallback={"..."}>
              <p class="text-5xl text-white">Cached: {cachedDate()}</p>
            </Suspense>
          </Show>
        </ErrorBoundary>
        <Button onClick={() => startTransition(() => revalidate(getCachedDate.key, true))}>Revalidate</Button>
      </div>
    </main>
  );
}

function Child() {
  //const date = createAsync(() => getDate());
  const cachedDate = createAsync(() => getCachedDate());

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <div class="flex flex-col gap-5">
        <Suspense fallback={<p class="text-5xl text-white">Loading...</p>}>
          <p class="text-5xl text-white">Cached: {cachedDate()}</p>
        </Suspense>
        <Button onClick={() => revalidate(getCachedDate.key)}>Revalidate</Button>
      </div>
    </main>
  );
}
