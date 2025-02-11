import { A, cache, createAsync, redirect } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import Counter from "~/components/Counter";
import { all, Show } from "~/components/Show";

const getUser = cache(async () => {
  "use server";

  return new Promise<any>((resolve) =>
    setTimeout(() => {
      const rnd = Math.random();
      console.log(rnd);
      if (rnd > 0.5) {
        console.log("redirecting");

        resolve(redirect("/"));
      }
      return resolve("John Doe"), 3000;
    })
  );
}, "getUser");

export default function About() {
  const [state, setState] = createSignal<number>();
  const [page, setPage] = createSignal<number>();
  const t = () => all(state(), page());
  const [store, setStore] = createStore<{ data?: { first?: Date; last?: Date } }>({});
  const user = createAsync(() => getUser());
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">About Page</h1>
      {/* <Show
        when={all(state(), page())}
        keyed
      >
        {([s, p]) => (
          <div>
            {s} {p}
          </div>
        )}
      </Show> */}
      <p>user: {user()}</p>
    </main>
  );
}
