import { getManifest } from "vinxi/manifest";

type ConfigOptions = {
  publicDir: string;
  sitemap: SitemapOptions;
};
type SitemapOptions = {
  dynamicRoutes?: string[];
};
type APIOutput = {
  apiRouteSitemap: string;
  apiRouteRobotsTxt: string;
};

export default function createSitemap(
  {}: ConfigOptions = {
    publicDir: "public",
  }
) {
  console.log("routes", getManifest("client"));
}

function generateSitemap(config: SitemapOptions) {}
