import { createIntersectionObserver } from "@solid-primitives/intersection-observer";

import { cache, createAsync } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { Card } from "~/components/ui/card";
//make array of 30 posts
const defaultStep = 5;
const posts = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
}));

const getPosts = cache(async ({ amount = defaultStep, offset = 0 }: { amount?: number; offset?: number }) => {
  "use server";

  offset > 0 && (await new Promise((resolve) => setTimeout(resolve, 500)));
  return { data: posts.slice(offset, offset + amount), hasNext: offset + amount < posts.length };
}, "getPosts");

export default function Home() {
  return (
    <main>
      <div class="grid gap-8 w-72 mx-auto">
        <Posts />
      </div>
    </main>
  );
}

function Posts(props: { offset?: number }) {
  const [el, setEl] = createSignal<HTMLDivElement[]>([]);
  const [next, setNext] = createSignal(false);
  const posts = createAsync(() => getPosts({ offset: props.offset || 0 }));

  createIntersectionObserver(el, (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setNext(true);
      }
    });
  });

  return (
    <Suspense fallback={<h1 class="text-gray-500 p-16">Loading posts...</h1>}>
      <For each={posts()?.data}>
        {(post) => (
          <Card class="p-5 border-white">
            <h4>{post.title}</h4>
          </Card>
        )}
      </For>

      <Show
        when={next()}
        fallback={
          <Show when={posts()?.hasNext}>
            {/* trigger for the next elements when intersecting the viewport */}
            <div ref={(el) => setEl((prev) => [...prev, el])} />
          </Show>
        }
      >
        <Posts offset={(props.offset || 0) + defaultStep} />
      </Show>
    </Suspense>
  );
}
