// @ts-check

import { readFile } from "node:fs/promises";

export default async function generateIndexHtml() {
  const html = (await readFile("./index.html")).toString();
  const importMap = await readFile("./importmap.json", { encoding: "utf-8" });
  return html.replace(
    "<!-- {importmap} -->",
    '<script type="importmap">\n' + importMap + "</script>"
  );
}
