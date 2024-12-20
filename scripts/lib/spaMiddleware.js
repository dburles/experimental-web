import fs from "fs";
import path from "path";
import * as config from "../../config.js";

export default async function spaMiddlware(ctx, next) {
  // If the request is not for a static file, return index.html
  const requestedPath = path.join(config.APP_ROOT, ctx.path);

  try {
    // Check if the requested path is a file or directory
    const stat = await fs.promises.stat(requestedPath);

    // If it's a valid file or directory, let Koa handle it
    if (stat.isDirectory()) {
      return await next(); // Allow directory request to go through static middleware
    }
    return await next(); // Allow valid file request to be handled by static middleware
  } catch (err) {
    if (err.code === "ENOENT") {
      // If the requested file doesn't exist, serve index.html
      ctx.type = "html";
      ctx.body = fs.createReadStream(
        path.join(config.APP_ROOT, config.INDEX_HTML)
      );
    } else {
      // For other errors, pass them along
      throw err;
    }
  }
}
