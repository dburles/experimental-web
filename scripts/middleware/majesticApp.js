// @ts-check

import { createMiddleware } from "hono/factory";
import { serveStatic } from "@hono/node-server/serve-static";

const majesticApp = createMiddleware(
  serveStatic({
    root: "./app",
    rewriteRequestPath: (path) => path.replace(/^\/static/, ""),
  })
);

export default majesticApp;
