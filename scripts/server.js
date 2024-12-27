// @ts-check

import { serve } from "@hono/node-server";
import { Hono } from "hono";

import * as config from "../config.js";
// import { logger } from "hono/logger";
import majesticApp from "./middleware/majesticApp.js";
import majesticNpm from "./middleware/majesticNpm.js";
import generateIndexHtml from "./lib/generateIndexHtml.js";
import majesticPreload from "./middleware/majesticPreload.js";

const app = new Hono();

// app.use(logger());

app.use("*", majesticPreload);
app.use("/static/*", majesticApp);
app.use("/static/npm/*", majesticNpm);
app.use("*", async (c) => c.html(generateIndexHtml()));

serve({ fetch: app.fetch, port: config.PORT }, (info) => {
  console.log(`server listening on http://localhost:${info.port}`);
});
