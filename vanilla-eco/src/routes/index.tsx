import { For } from "solid-js";
import SelectoWrapper from "~/components/SelectoWrapper";

export default function Home() {
  return (
    <main class="mx-auto p-4 text-center text-gray-700">
      <h1 class="max-6-xs my-16 text-6xl font-thin text-sky-700">
        Integrate any vanilla js lib - e.g. Selecto
      </h1>
      <SelectoWrapper>
        <For each={new Array(100)}>
          {(_, i) => (
            <li class="grid size-10 place-items-center rounded-lg border text-white data-[selected]:bg-sky-700">
              {i() + 1}
            </li>
          )}
        </For>
      </SelectoWrapper>
    </main>
  );
}
