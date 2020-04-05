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
}
