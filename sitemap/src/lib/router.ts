import { getRoutes } from "solid-start-sitemap";

// Utility functions
function splitRoute(route: string): string[] {
  return route.split("/").filter(Boolean);
}

function isDynamicSegment(segment: string): boolean {
  return segment.startsWith(":");
}

function isWildcardSegment(segment: string): boolean {
  return segment === "*";
}

// Recursive object creation
async function createRouteObject() {
  const routes = (await getRoutes())
    .filter((r) => r.page)
    .map((r) => r.path.replace(/\(.*?\)/gi, "").replace(/\/\//gi, "/"));
  const routeObj: any = {};

  routes.forEach((route) => {
    const segments = splitRoute(route);

    let current = routeObj;
    segments.forEach((segment, index) => {
      if (isDynamicSegment(segment)) {
        const paramName = segment.slice(1);

        current[paramName] =
          current[paramName] ||
          ((paramValue: string) => {
            const next = segments.slice(index + 1).join("/");
            return `/${segments.slice(0, index).join("/")}/${paramValue}${next ? `/${next}` : ""}`;
          });
      } else if (isWildcardSegment(segment)) {
        current["*"] = (...args: string[]) => {
          return `/${segments.slice(0, index).join("/")}/${args.join("/")}`;
        };
      } else {
        current[segment] = current[segment] || {};
        current = current[segment];
      }
    });
  });

  return routeObj as RoutesType<typeof routes>;
}

export const Routes = await createRouteObject();

// Type-safe route map
type ExtractDynamicParam<S extends string> = S extends `:${infer Param}` ? Param : never;

type SplitRoute<S extends string> = S extends `${infer Head}/${infer Tail}` ? [Head, ...SplitRoute<Tail>] : [S];

type BuildRoutes<Segments extends string[]> = Segments extends [
  infer Head extends string | number | symbol,
  ...infer Tail,
]
  ? Head extends `:${infer Param}`
    ? { [key in Param]: BuildRoutes<Tail extends string[] ? Tail : never> }
    : Head extends "*"
    ? { [key: string]: string }
    : { [key in Head]: BuildRoutes<Tail extends string[] ? Tail : never> }
  : string;

type RouteMap<Routes extends readonly string[]> = {
  [R in Routes[number] as SplitRoute<R>[0]]: BuildRoutes<SplitRoute<R>>;
};

// Type inference
type RoutesType<T extends readonly string[]> = RouteMap<T>;
