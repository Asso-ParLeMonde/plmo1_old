import { NextFunction, Request, RequestHandler, Response } from "express";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import uuidv4 from "uuid/v4";
import { Image } from "../entities/image";
import { uploadImage } from "../fileUpload";

export function saveTemporaryImage(tableName: string): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    // First save image on disk to resize it.
    const dir = path.join(__dirname, "../images/temp", tableName);
    await fs.ensureDir(dir).catch();
    const uuid = uuidv4();
    await sharp(req.file.buffer)
      .resize(null, 500) // keep ratio
      .flatten({
        background: {
          r: 255,
          g: 255,
          b: 255,
        },
      })
      .toFormat("jpeg")
      .toFile(path.join(dir, `${uuid}.jpeg`));

    // then send file to server
    const filePath: string | null = await uploadImage(uuid, path.join("images/temp", tableName));
    if (filePath !== null) {
      const image = new Image();
      image.path = filePath;
      image.uuid = uuid;
      image.localPath = path.join("images/temp", tableName);
      req.image = image;
    }
    next();
  };
}
