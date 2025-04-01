import {
  createAsync,
  redirect,
  useAction,
  useSubmission,
  json,
  query,
  action,
  reload,
  RouteDefinition,
} from "@solidjs/router";
import { Suspense } from "solid-js";

import { db, wait } from "~/db";

const getUser = query(async () => {
  "use server";
  await wait(500);
  return await db.queryUser();
}, "_getUser");

const mutateUser = action(async (formData: FormData) => {
  "use server";
  const id = formData.get("id") as string;
  const skills = formData.get("skills") as string;
  const name = formData.get("name") as string;

  await db.updateUser({ id, name, skills });

  //return reload({ revalidate: [getUser.key] });
  //return json({ message: "updated skill" }, { revalidate: [getUser.key] });
  return redirect("/about", { revalidate: [getUser.key] });
}, "mutateUser");

const getDate = query(async () => {
  "use server";
  await wait(2000);
  return new Date().toLocaleTimeString();
}, "getDate");

/**
 * Routes
 */

export const route = {
  preload: () => {
    getUser();
    getDate();
  },
} satisfies RouteDefinition;

export default function Home() {
  const date = createAsync(() => getDate());
  const user = createAsync(() => getUser());

  const submit = useSubmission(mutateUser);
  const mutate = useAction(mutateUser);
  return (
    <main class="text-center mx-auto  p-4 text-3xl container flex flex-col gap-3">
      <h1 class="max-6-xs text-6xl text-sky-400   mt-12 mb-4">Actions in SolidStart</h1>
      <h2 class="text-sky-400  ">Revalidate queries through actions</h2>
      <h2 class="text-sky-400  mb-8">How to leverage Single-Flight-Mutations</h2>
      <Suspense fallback={<p>Loading...</p>}>
        <Suspense fallback={<p>fetching date...</p>}>
          <p>Date: {date()}</p>
        </Suspense>

        {/* Display data */}
        <p>Name: {user()?.name}</p>
        <p>Skills: {user()?.skills.split(",").join(", ")}</p>

        <form
          action={mutateUser}
          method="post"
          // onSubmit={async (e) => {
          //   e.preventDefault();
          //   console.log("submitting");

          //   const data = new FormData(e.currentTarget);
          //   // const check = validate(Object.fromEntries(data));
          //   await mutate(data);
          // }}
          class="flex flex-col gap-5  bg-stone-600 p-8 rounded-lg"
        >
          <input
            name="id"
            hidden
            value={user()?.id}
          />
          <input
            name="name"
            value={user()?.name}
            disabled={submit?.pending}
            class="text-black p-2 rounded-lg "
          />
          <input
            name="skills"
            type="text"
            value={user()?.skills}
            disabled={submit?.pending}
            class="text-black p-2 rounded-lg "
          />
          <button
            disabled={submit?.pending}
            class="disabled:opacity-50 border rounded-lg p1"
          >
            {submit?.pending ? "Updating..." : "Submit"}
          </button>
        </form>
      </Suspense>
    </main>
  );
}
