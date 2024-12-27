// @ts-check

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as config from "../config.js";
// import { logger } from "hono/logger";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import majesticApp from "./middleware/majesticApp.js";
import majesticNpm from "./middleware/majesticNpm.js";
import generateIndexHtml from "./lib/generateIndexHtml.js";
import majesticPreload from "./middleware/majesticPreload.js";

const app = new Hono();

const wss = new WebSocketServer({ noServer: true });

// app.use(logger());

app.use("*", majesticPreload);
app.use("/static/*", majesticApp);
app.use("/static/npm/*", majesticNpm);
app.get("/ws");
app.use("*", async (c) => {
  const html = await generateIndexHtml();
  return c.html(
    html.replace(
      "</body>",
      `
      <script>
        const ws = new WebSocket('ws://' + window.location.host);
        ws.onmessage = event => {
          if (event.data === 'reload') {
            window.location.reload();
          }
        };
      </script>
      </body>
      `
    )
  );
});

const watcher = chokidar.watch("./app", {
  ignored: /^\./, // Ignore dotfiles
  persistent: true,
});

watcher.on("change", (file) => {
  console.log(`${file} changed, reloading...`);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("reload");
    }
  });
});

const server = serve({ fetch: app.fetch, port: config.PORT }, (info) => {
  console.log(`development server listening on http://localhost:${info.port}`);
});

server.on("upgrade", async (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
