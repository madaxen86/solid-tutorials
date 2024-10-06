import { createIntersectionObserver } from "@solid-primitives/intersection-observer";

import { cache, createAsync, createAsyncStore } from "@solidjs/router";
import { Accessor, createEffect, createMemo, createRoot, createSignal, For, Show, Suspense } from "solid-js";
import { Card } from "~/components/ui/card";
//make array of 30 posts
const posts = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
}));

const getPosts = cache(async ({ amount = 10, offset = 0 }: { amount?: number; offset?: number }) => {
  "use server";

  offset >= 0 && (await new Promise((resolve) => setTimeout(resolve, 3000)));
  return { data: posts.slice(offset, offset + amount), hasNext: offset + amount < posts.length };
}, "getPosts");

export default function Home() {
  const [el, setEl] = createSignal<HTMLDivElement[]>([]);
  const [offset, setOffset] = createSignal(0);

  const posts = createAsync(async (prev: any) => {
    const posts = await getPosts({ offset: offset() });
    console.log("posts", posts, typeof prev === "function" ? prev() : prev);

    return {
      data: [...(prev?.data || []), ...posts.data],
      hasNext: posts.hasNext,
    };
  });

  const cached = () => latest(posts);

  createIntersectionObserver(el, (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setOffset((prev) => prev + 10);
      }
    });
  });
  createEffect(() => console.log(posts()));

  return (
    <main>
      <div class="grid gap-8 w-72 mx-auto">
        <Suspense fallback={<h1 class="text-white">Suspense...</h1>}>
          <For each={cached()?.data}>{(post) => <Posts title={post.title} />}</For>

          <Show when={cached()?.hasNext}>
            <h1
              class="text-white my-10"
              ref={(el) => setEl((prev) => [...prev, el])}
            >
              Loading...
            </h1>
          </Show>
        </Suspense>
      </div>
    </main>
  );
}

function Posts(post: { title: string }) {
  return (
    <Card class="p-5 border-white">
      <h4>{post.title}</h4>
    </Card>
  );
}

function latest<T>(signal: Accessor<T | undefined>) {
  const [latest, setLatest] = createSignal(createRoot(signal));

  createRoot(() => {
    createMemo(() => setLatest(signal));
  });

  if (latest() === undefined) return signal();
  return latest();
}
