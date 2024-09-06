import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { Button } from "~/components/ui/button";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Suspense>
            <ErrorBoundary
              fallback={(err, reset) => {
                return (
                  <div>
                    <p>{err.message}</p>
                    <Button onClick={reset}>Try again</Button>
                  </div>
                );
              }}
            >
              <Nav />
              <ColorModeScript />
              <ColorModeProvider>{props.children}</ColorModeProvider>
            </ErrorBoundary>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
