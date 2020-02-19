import { Bucket, DeleteFileResponse, UploadResponse } from "@google-cloud/storage";
import { credential, initializeApp, ServiceAccount, storage } from "firebase-admin";
import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";
import { Provider } from "./provider";

export class FirebaseUtils extends Provider {
  private bucket: Bucket;

  constructor() {
    super();
    if (process.env.STOCKAGE_PROVIDER_NAME !== "firebase") {
      return;
    }

    const serviceAccount: ServiceAccount = {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      projectId: process.env.FIREBASE_PROJECT_ID,
    };

    initializeApp({
      credential: credential.cert(serviceAccount),
      databaseURL: "https://cs-par-le-monde-1.firebaseio.com",
    });

    this.bucket = storage().bucket("gs://cs-par-le-monde-1.appspot.com");
  }

  public async uploadImage(filename: string, filePath: string): Promise<string> {
    if (process.env.STOCKAGE_PROVIDER_NAME !== "firebase") {
      return "";
    }

    const dir: string = path.join(__dirname, "../..", "dist", filePath);

    // upload images on stockage server
    try {
      const uploadTasks: Array<Promise<UploadResponse>> = [];
      uploadTasks.push(
        this.bucket.upload(`${dir}/${filename}.jpeg`, {
          destination: `${filePath}/${filename}/normal.jpeg`,
        }),
      );
      uploadTasks.push(
        this.bucket.upload(`${dir}/${filename}_md.jpeg`, {
          destination: `${filePath}/${filename}/medium.jpeg`,
        }),
      );
      uploadTasks.push(
        this.bucket.upload(`${dir}/${filename}_sm.jpeg`, {
          destination: `${filePath}/${filename}/small.jpeg`,
        }),
      );
      await Promise.all(uploadTasks);
    } catch (e) {
      logger.error(`File ${filename} could not be sent to firebase !`);
      return "";
    }

    // delete local files
    try {
      const deleteTasks: Array<Promise<void>> = [];
      deleteTasks.push(fs.remove(`${dir}/${filename}.jpeg`));
      deleteTasks.push(fs.remove(`${dir}/${filename}_md.jpeg`));
      deleteTasks.push(fs.remove(`${dir}/${filename}_sm.jpeg`));
      await Promise.all(deleteTasks);
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }

    // return path to image
    return `https://firebasestorage.googleapis.com/v0/b/cs-par-le-monde-1.appspot.com/o/${filePath.replace(/\//gim, "%2F")}%2F${filename}%2Fnormal.jpeg?alt=media`;
  }

  public async deleteImage(filename: string, filePath: string): Promise<void> {
    if (process.env.STOCKAGE_PROVIDER_NAME !== "firebase") {
      return;
    }

    try {
      const deleteTasks: Array<Promise<DeleteFileResponse>> = [];
      deleteTasks.push(this.bucket.file(`${filePath}/${filename}/normal.jpeg`).delete());
      deleteTasks.push(this.bucket.file(`${filePath}/${filename}/medium.jpeg`).delete());
      deleteTasks.push(this.bucket.file(`${filePath}/${filename}/small.jpeg`).delete());
      await Promise.all(deleteTasks);
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }
  }
}
