import { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import { getCustomRepository, getRepository } from 'typeorm';
import { ThemeRepository } from '../customRepositories/themeRepository';
import { Image } from '../entities/image';
import { Theme } from '../entities/theme';
import { Controller, del, get, oneImage, post, put } from './controller';

export class ThemesController extends Controller {
    constructor() {
        super('themes');
    }

    @get()
    public async getThemes(req: Request, res: Response) {
        const { query } = req;
        const params: { isPublished: boolean | null } = { isPublished: null };
        if (query.isPublished !== undefined) {
            params.isPublished = query.isPublished === 'true';
        }
        const themes: Theme[] = await getCustomRepository(ThemeRepository).findAll(params);
        res.sendJSON(themes);
    }

    @get({ path: '/:id' })
    public async getTheme(req: Request, res: Response, next: NextFunction) {
        const id: number = parseInt(req.params.id, 10) || 0;
        const theme: Theme | undefined = await getCustomRepository(ThemeRepository).findOneWithLabels(id);
        if (theme === undefined) {
            next(); // will send 404 error
            return;
        }
        res.sendJSON(theme);
    }

    @post()
    public async addTheme(req: Request, res: Response) {
        const labels: { [key: string]: string } = req.body.names || { };
        const isPublished = req.body.isPublished || false;
        const theme: Theme = new Theme(); // create a new theme
        theme.isPublished = isPublished;
        await getCustomRepository(ThemeRepository).saveWithLabels(theme, labels); // save new theme
        res.sendJSON(theme); // send new theme
    }

    @put({ path: '/:id' })
    public async editTheme(req: Request, res: Response, next: NextFunction) {
        const id: number = parseInt(req.params.id, 10) || 0;
        const labels: { [key: string]: string } = req.body.names || { };
        const isPublished = req.body.isPublished;
        const theme: Theme | undefined = await getRepository(Theme).findOne(id);
        if (theme === undefined) {
            next();
            return;
        }
        if (isPublished !== undefined) {
            theme.isPublished = isPublished;
        }
        await getCustomRepository(ThemeRepository).saveWithLabels(theme, labels);
        res.sendJSON(theme); // send updated theme
    }

    @del({ path: '/:id' })
    public async deleteTheme(req: Request, res: Response) {
        const id: number = parseInt(req.params.id, 10) || 0;
        await getCustomRepository(ThemeRepository).delete(id);
        res.status(204).send();
    }

    @oneImage({ path: '/:id/image', tableName: 'themes' })
    public async addImage(req: Request, res: Response, next: NextFunction) {
        if (req.imageID === undefined || req.image === undefined) {
            next();
            return;
        }

        const id: number = parseInt(req.params.id, 10) || 0;
        const theme: Theme | undefined = await getRepository(Theme).findOne(id, { relations: ['image'] });
        if (theme === undefined) {
            await getRepository(Image).delete(req.imageID);
            const filePath = req.file.path;
            await fs.remove(`${filePath}.jpeg`);
            await fs.remove(`${filePath}_sm.jpeg`);
            await fs.remove(`${filePath}_md.jpeg`);
            next();
            return;
        }

        if (theme.image !==  undefined && theme.image !== null) {
            await getCustomRepository(ThemeRepository).deleteThemeImage(id);
        }

        theme.image = req.image;
        await getRepository(Theme).save(theme);
        res.sendJSON(theme);
    }

    @del({ path: '/:id/image' })
    public async deleteThemeImage(req: Request, res: Response) {
        const id: number = parseInt(req.params.id, 10) || 0;
        await getCustomRepository(ThemeRepository).deleteThemeImage(id);
        res.status(204).send();
    }
}
