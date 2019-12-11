import { NextFunction, Request, RequestHandler, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { getRepository } from 'typeorm';
import uuidv4 from 'uuid/v4';
import { Image } from '../entities/image';

export function saveImages(tableName: string): RequestHandler {
    return async (req: Request, _: Response, next: NextFunction) => {
        // First save image on disk
        const dir = path.join(__dirname, '../images/', tableName);
        await fs.ensureDir(dir).catch();
        const uuid = uuidv4();
        await sharp(req.file.buffer)
            .resize(300, 220) // keep ratio
            .toFormat('jpeg')
            .toFile(path.join(dir, `${uuid}_sm.jpeg`));
        await sharp(req.file.buffer)
            .resize(320, 235)
            .toFormat('jpeg')
            .toFile(path.join(dir, `${uuid}_md.jpeg`));
        await sharp(req.file.buffer)
            .resize(420, 308)
            .toFormat('jpeg')
            .toFile(path.join(dir, `${uuid}.jpeg`));
        req.file.path = path.join(dir, `${uuid}`);

        // Next save it in the database
        const image = new Image();
        image.path = path.join('images', tableName, `${uuid}.jpeg`);
        try {
            await getRepository(Image).save(image);
            req.imageID = image.id;
            req.image = image;
        } catch (e) { // error, remove files
            await fs.remove(path.join(dir, `${uuid}_sm.jpeg`));
            await fs.remove(path.join(dir, `${uuid}_md.jpeg`));
            await fs.remove(path.join(dir, `${uuid}.jpeg`));
        }
        next();
    };
}
