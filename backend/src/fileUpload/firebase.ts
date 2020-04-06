import { Bucket } from "@google-cloud/storage";
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

    // local dir
    const dir: string = path.join(__dirname, "../..", "dist", filePath);

    // upload image on stockage server
    try {
      await this.bucket.upload(`${dir}/${filename}.jpeg`, {
        destination: `${filePath}/${filename}.jpeg`,
      });
    } catch (e) {
      logger.error(`File ${filename} could not be sent to firebase !`);
      return "";
    }

    // delete local file
    try {
      await fs.remove(`${dir}/${filename}.jpeg`);
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }

    // return url to image
    return `https://firebasestorage.googleapis.com/v0/b/cs-par-le-monde-1.appspot.com/o/${filePath.replace(/\//gim, "%2F")}%2F${filename}.jpeg?alt=media`;
  }

  public async deleteImage(filename: string, filePath: string): Promise<void> {
    if (process.env.STOCKAGE_PROVIDER_NAME !== "firebase") {
      return;
    }

    try {
      await this.bucket.file(`${filePath}/${filename}.jpeg`).delete();
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }
  }

  public async getFile(filename: string): Promise<Buffer | null> {
    let fileBuffer: Buffer | null = null;
    try {
      fileBuffer = (await this.bucket.file(filename).download())[0];
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }
    return fileBuffer;
  }

  public async uploadFile(filename: string, filedata: Buffer): Promise<void> {
    try {
      await this.bucket.file(filename).save(filedata);
    } catch (e) {
      logger.error(`Error while uploading ${filename}.`);
    }
  }
}
