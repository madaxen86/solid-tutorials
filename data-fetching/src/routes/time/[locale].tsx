import {
  action,
  cache,
  createAsync,
  revalidate,
  RouteDefinition,
  useParams,
  json,
  reload,
  redirect,
} from "@solidjs/router";
import { ErrorBoundary, Suspense } from "solid-js";
import { Button } from "~/components/ui/button";

/**
 * Server functions
 */
const getDate = async (locale: string = "en") => {
  "use server";
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  // if (1 === 1) throw new Error("Error");
  return new Date().toLocaleString(locale);
};

const getCachedDate = cache(getDate, "getDate");

/**
 * Preloading
 */
export const route = {
  preload: () => {
    console.log("preloading");
    getCachedDate();
  },
} satisfies RouteDefinition;

export default function Home() {
  const params = useParams();
  const cachedDate = createAsync(() => getCachedDate(params.locale));

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700   my-16">Data Fetching in SolidStart</h1>
      <section class="flex flex-col gap-5">
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
            <p class="text-5xl text-white">Cached: {cachedDate()}</p>
          </Suspense>
        </ErrorBoundary>
        <Button onClick={() => revalidate(getCachedDate.key)}>Revalidate</Button>
      </section>
      <section class="flex flex-col gap-5">
        <h1 class="max-6-xs text-6xl text-sky-700   my-16">Server Actions in SolidStart</h1>
      </section>
    </main>
  );
}
