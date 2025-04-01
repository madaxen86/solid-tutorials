import { type RouteDefinition } from "@solidjs/router";
import { createAsync, query } from "@solidjs/router";

const aboutText = query(async () => {
  "use server";
  await wait(2000);
  return "About content fetched from the server";
}, "aboutText");

import { Suspense } from "solid-js";
import { wait } from "~/db";

export const route = {
  preload: () => {
    aboutText();
  },
} satisfies RouteDefinition;

const About = () => {
  const text = createAsync(() => aboutText());
  return (
    <main>
      <h1>About page</h1>
      <p>
        Some dynamic text: <Suspense>{text()}</Suspense>
      </p>
    </main>
  );
};
export default About;
