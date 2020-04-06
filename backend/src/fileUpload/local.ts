import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";
import { Provider } from "./provider";

export class LocalUtils extends Provider {
  constructor() {
    super();
  }

  public async deleteImage(filename: string, filePath: string): Promise<void> {
    const provider = process.env.STOCKAGE_PROVIDER_NAME || "local";
    if (provider !== "local") {
      return;
    }

    const dir: string = path.join(__dirname, "../..", "dist", filePath);

    try {
      await fs.remove(`${dir}/${filename}.jpeg`);
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }

    return;
  }

  public async uploadImage(filename: string, filePath: string): Promise<string> {
    const provider = process.env.STOCKAGE_PROVIDER_NAME || "local";
    if (provider !== "local") {
      return "";
    }
    return `${process.env.IS_HEROKU ? "back" : "http://localhost:5000"}/${filePath}/${filename}.jpeg`;
  }

  public async getFile(filename: string): Promise<Buffer | null> {
    let fileBuffer: Buffer | null = null;
    try {
      fileBuffer = await new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "../..", "dist/files", filename), (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }
    return fileBuffer;
  }

  public async uploadFile(filename: string, filedata: Buffer): Promise<void> {
    try {
      const directory = path.join(
        __dirname,
        "../..",
        "dist/files",
        filename
          .split("/")
          .slice(0, -1)
          .join("/"),
      );
      console.log(directory);
      await fs.mkdirs(directory);
      await new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, "../..", "dist/files", filename), filedata, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (e) {
      console.log(e);
      logger.error(`Error while uploading ${filename}.`);
    }
  }
}
