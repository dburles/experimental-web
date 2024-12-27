// @ts-check

import { createMiddleware } from "hono/factory";
import { serveStatic } from "@hono/node-server/serve-static";

const majesticNpm = createMiddleware(
  serveStatic({
    root: "./node_modules",
    rewriteRequestPath: (path) => path.replace(/^\/static\/npm/, ""),
  })
);

export default majesticNpm;
