import { A, action, cache, createAsync, json, redirect, reload, useAction, useSubmission } from "@solidjs/router";
import { Suspense } from "solid-js";
import Counter from "~/components/Counter";

/**
 * db mock
 */
let db = {
  name: "John Dev",
  skills: ["React"],
};

const getDate = cache(async () => {
  "use server";
  return new Date().toLocaleString();
}, "getDate");

const getUser = cache(async function getUser() {
  "use server";
  return db;
}, "getUser");

const addSkill = action(async (formData: FormData) => {
  "use server";
  await new Promise((r) => setTimeout(r, 3000));
  const skill = formData.get("skill") as string;
  db.skills = skill.split(", ");
  //return reload({ revalidate: [getUser.key, "session"] });
  //return json({ message: "updated skill" }, { revalidate: [getUser.key, "session"] });
  return redirect("/", { revalidate: [getUser.key, "session"] });
});

export default function Home() {
  const date = createAsync(() => getDate());
  const user = createAsync(() => getUser());

  const updateSkill = useAction(addSkill);
  const submit = useSubmission(addSkill);
  return (
    <main class="text-center mx-auto  p-4 text-3xl">
      <h1 class="max-6-xs text-6xl text-sky-700   my-16">Actions in SolidStart</h1>
      <Suspense>
        <p class="pb-4">Date: {date()}</p>
        <p>Name: {user()?.name}</p>
        <p>Skills: {user()?.skills.join(", ")}</p>
        <form
          // action={addSkill}
          // method="post"
          onSubmit={(e) => {
            e.preventDefault();
            if (submit?.pending) return;
            const formData = new FormData(e.target as HTMLFormElement);
            updateSkill(formData);
          }}
          class="flex flex-col gap-5"
          classList={{ "opacity-50": submit?.pending }}
        >
          <input
            name="skill"
            type="text"
            value={user()?.skills.join(", ")}
            class="text-black"
            disabled={submit?.pending}
          />
          <button
            disabled={submit?.pending}
            class="disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </Suspense>
    </main>
  );
}
