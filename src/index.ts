import express from "express";
import next from "next";
import { parse } from "url";
import { app as fileUpload } from "./routes/upload";

const app = express();

app.use("/upload", fileUpload);

const dev = process.env.NODE_ENV !== "production";
const prod = process.env.NODE_ENV === "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.use((req, res) => {
    const parsedUrl = parse(req.url, true);
    nextHandler(req, res, parsedUrl);
  });
  if (prod) listen();
});

function listen() {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log("Listening on http://localhost:" + PORT);
  });
}

if (dev) listen();
