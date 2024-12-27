// @ts-check

import { createMiddleware } from "hono/factory";
import createResolveLinkRelations from "modulepreload-link-relations/createResolveLinkRelations.mjs";
import formatLinkHeaderRelations from "modulepreload-link-relations/formatLinkHeaderRelations.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const importMap = await readFile("./importmap.json", { encoding: "utf-8" });

const resolveLinkRelations = createResolveLinkRelations("./", { importMap });

/**
 * @param {string} specifier
 */
function rewriteSpecifier(specifier) {
  if (specifier.startsWith("/static/npm/")) {
    return specifier.replace(/^\/static\/npm\//, "/node_modules/");
  } else if (specifier.startsWith("/static/")) {
    return specifier.replace(/^\/static\//, "/app/");
  } else {
    return specifier;
  }
}

/**
 * @param {string} link
 */
function rewriteLinkRelation(link) {
  if (link.startsWith("/node_modules/")) {
    return link.replace(/^\/node_modules\//, "/static/npm/");
  } else if (link.startsWith("/app/")) {
    return link.replace(/^\/app\//, "/static/");
  } else {
    return link;
  }
}

const majesticPreload = createMiddleware(async (c, next) => {
  const reqPath = c.req.path;
  const fileExt = path.extname(reqPath);

  if ([".mjs", ".js"].includes(fileExt)) {
    const linkRelations = await resolveLinkRelations(reqPath, {
      resolveSpecifier: rewriteSpecifier,
    });

    if (linkRelations) {
      c.res.headers.append(
        "Link",
        formatLinkHeaderRelations(linkRelations.map(rewriteLinkRelation))
      );
    }
  }

  await next();
});

export default majesticPreload;
