import { defineConfig } from "@solidjs/start/config";
import { cloudflare } from "unenv";

export default defineConfig({
  server: {
    preset: "cloudflare-pages",
    unenv: cloudflare,
    static: true,
    prerender: {
      routes: ["/", "/about"],
    },
    rollupConfig: {
      external: ["__STATIC_CONTENT_MANIFEST", "node:async_hooks"],
    },
  },
  ssr: false,
});
