import express from "express";
import formidable from "formidable";
import { format } from "util";
import { Storage } from "@google-cloud/storage";

export const app = express.Router();

const storage = new Storage();
const cloudBucket = process.env.GCLOUD_STORAGE_BUCKET || "";
if (cloudBucket == "") {
  throw new Error("GCLOUD_STORAGE_BUCKET is not defined");
}
const bucket = storage.bucket(cloudBucket);

app.post("/", (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, { files }) => {
    if (err) {
      next(err);
      return;
    }
    const blob = bucket.file(files.name);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      next(err);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      res.status(200).send(publicUrl);
    });

    blobStream.end(files.path);
  });
});
