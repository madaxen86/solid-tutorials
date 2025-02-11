import { defineConfig } from "@solidjs/start/config";
import { Plugin } from "vinxi";
import path from "path";
import fs from "fs";

const app = defineConfig({
  vite: {
    plugins: [plugin()],
  },
  server: {
    preset: "firebase",
  }, //{ experimental: { tasks: true }, scheduledTasks: { "* * * * *": ["cms:cron"] } },
});
export default app;

// app.hooks.addHooks({
//   app: {
//     plugins: [sitemap()],
//   },
// });

async function plugin(
  options: { exclude?: string[]; dynamicRoutes?: string[] | ((routes: string[]) => string[]) } = { dynamicRoutes: [] }
) {
  return {
    name: "sitemap",
    apply: "build",
    enforce: "post",
    async configResolved(config) {
      const router = config.router.internals.routes;
      if (router) {
        const fileroutes = await router.getRoutes();
        if (!fileroutes) return;
        // fileroutes
        //   .filter((r) => !!r.path && !r.path.includes("404") && !options.exclude?.includes(r.path))
        //   .map((r) => r);
        const dynamic = fileroutes.filter((r) => r.path.includes(":") || r.path.includes("*")).map((r) => r.path);
        console.log(
          "fileroutes",
          fileroutes.map((r) => r)
        );
        const { dynamicRoutes } = options;
        if (typeof dynamicRoutes === "function") {
          dynamicRoutes(dynamic);
        }

        fs.writeFileSync(path.resolve("./public/robots.txt"), "some awesome text");
      }
    },
  } as Plugin;
}
