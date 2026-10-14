import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { catalog } from "./catalog.mjs";
const root = resolve(".");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
};
createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/catalog") {
    const result = await catalog(url.href);
    res.writeHead(result.status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(result.body));
    return;
  }
  const path = resolve(
    root,
    "." +
      decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname),
  );
  if (
    !path.startsWith(root + sep) ||
    ![".html", ".css", ".js", ".png"].includes(extname(path))
  ) {
    res.writeHead(404);
    res.end();
    return;
  }
  try {
    const data = await readFile(path);
    res.writeHead(200, { "Content-Type": types[extname(path)] });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(4173, "127.0.0.1", () =>
  console.log("Preview: http://127.0.0.1:4173"),
);
