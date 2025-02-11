import { json } from "@solidjs/router";
import { createSitemap, getRoutes } from "solid-start-sitemap";
export const GET = async () => {
  try {
    const routes = await getRoutes();
    await createSitemap({
      hostname: process.env.NITRO_HOST || "http://localhost:3000",
      replaceRouteParams: { ":id": [1, 2, 3, "test"], ":locale": ["en", "de"] },
    });

    return json(routes);
  } catch (e) {
    console.log(e);

    return new Response("Error", { status: 500 });
  }
};
