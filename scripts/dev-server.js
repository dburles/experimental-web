import Koa from "koa";
import { readFile } from "fs/promises";
import path from "path";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import serveStatic from "koa-static";
import { parse } from "url";
import spaMiddleware from "./lib/spaMiddleware.js";
import * as config from "../config.js";

const APP_ROOT = path.resolve(config.APP_ROOT);
const NODE_MODULES = path.resolve("./node_modules");
const INDEX_HTML = path.join(APP_ROOT, config.INDEX_HTML);
const CLIENT_SCRIPT = `
  <script>
    const ws = new WebSocket('ws://' + window.location.host);
    ws.onmessage = function(event) {
      if (event.data === 'reload') {
        window.location.reload();
      }
    };
  </script>
`;

// Create a new Koa app
const app = new Koa();

// WebSocket server setup for live reload
const wss = new WebSocketServer({ noServer: true });

// Variable to track if we’ve already added the `change` listener
let fileChangeListenerAdded = false;

// WebSocket client connection
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Add file change listener only once
  if (!fileChangeListenerAdded) {
    fileChangeListenerAdded = true;

    // Send a reload message to clients when a file change occurs
    watcher.on("change", () => {
      ws.send("reload");
    });
  }

  // Handle WebSocket disconnection
  ws.on("close", () => {
    console.log("WebSocket connection closed");

    // If there are no more active WebSocket connections, we can remove the listener
    if (wss.clients.size === 0) {
      watcher.removeListener("change", () => {
        ws.send("reload");
      });
      fileChangeListenerAdded = false;
    }
  });
});

// File watcher with chokidar to trigger reload on file change
const watcher = chokidar.watch(APP_ROOT, {
  ignored: /^\./, // Ignore dotfiles
  persistent: true,
});

// Middleware to inject WebSocket script into index.html
app.use(async (ctx, next) => {
  const parsedUrl = parse(ctx.request.url, true);
  let filePath = path.join(APP_ROOT, parsedUrl.pathname || "/");

  // Serve index.html with WebSocket client script injection
  if (
    filePath === path.join(APP_ROOT, "/") ||
    filePath === path.join(APP_ROOT, "/index.html")
  ) {
    try {
      let htmlContent = await readFile(INDEX_HTML, "utf8");
      htmlContent = htmlContent.replace("</body>", `${CLIENT_SCRIPT}</body>`);
      ctx.type = "html";
      ctx.body = htmlContent;
    } catch (err) {
      ctx.status = 500;
      ctx.body = "Error reading index.html";
    }
  } else {
    await next();
  }
});

app.use(serveStatic(APP_ROOT));
app.use(serveStatic(NODE_MODULES));
app.use(spaMiddleware);

// WebSocket upgrade for live-reloading
app.server = app.listen(config.PORT_DEV, () => {
  console.log(
    `Development server is running on http://localhost:${config.PORT_DEV}`
  );
});

// Upgrade HTTP server to support WebSocket
app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
