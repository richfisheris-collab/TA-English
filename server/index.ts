import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import routes from "./routes";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(routes);

async function start() {
  const vite = await createViteServer({
    root: path.resolve(import.meta.dirname, "../client"),
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  app.use("/{*splat}", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(
        path.resolve(import.meta.dirname, "../client/index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch(console.error);
