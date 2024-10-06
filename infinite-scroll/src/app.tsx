import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Suspense>
            <ColorModeScript />
            <ColorModeProvider>
              <nav class="flex gap-8 p-5 sticky top-0">
                <a href="/">Index</a>
                <a href="/about">About</a>
                <a href="/infinite">Infinite</a>
              </nav>

              {props.children}
            </ColorModeProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
