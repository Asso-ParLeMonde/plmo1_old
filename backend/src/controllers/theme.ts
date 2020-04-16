import { NextFunction, Request, Response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { ThemeRepository } from "../customRepositories/themeRepository";
import { Image } from "../entities/image";
import { Theme } from "../entities/theme";
import { deleteImage } from "../fileUpload";
import { Controller, del, get, oneImage, post, put } from "./controller";
import { UserType, User } from "../entities/user";

export class ThemesController extends Controller {
  constructor() {
    super("themes");
  }

  @get()
  public async getThemes(req: Request, res: Response): Promise<void> {
    const { query } = req;
    const params: { isPublished: boolean | null; userId: number | null } = { isPublished: null, userId: null };
    if (query.isPublished !== undefined) {
      if (query.isPublished === "null") {
        params.isPublished = null;
      } else {
        params.isPublished = query.isPublished === "true";
      }
    }
    if ((query.userId !== undefined || query.user !== undefined) && req.user !== undefined) {
      params.userId = req.user.id;
    }
    const themes: Theme[] = await getCustomRepository(ThemeRepository).findAll(params);
    res.sendJSON(themes);
  }

  @get({ path: "/:id" })
  public async getTheme(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const theme: Theme | undefined = await getCustomRepository(ThemeRepository).findOneWithLabels(id);
    if (theme === undefined) {
      next(); // will send 404 error
      return;
    }
    res.sendJSON(theme);
  }

  @post({ userType: UserType.CLASS })
  public async addTheme(req: Request, res: Response): Promise<void> {
    const labels: { [key: string]: string } = req.body.names || {};
    const isPublished = req.body.isPublished || false;
    const theme: Theme = new Theme(); // create a new theme
    theme.isPublished = isPublished;

    if (theme.isPublished) {
      const themeNb = await getRepository(Theme).count({ where: { isPublished: true } });
      theme.order = themeNb + 1;
    }

    if (req.body.userId !== undefined && req.user !== undefined) {
      theme.user = new User();
      theme.user.id = req.user.id;
    }

    await getCustomRepository(ThemeRepository).saveWithLabels(theme, labels); // save new theme
    res.sendJSON(theme); // send new theme
  }

  @put({ path: "/updateOrder", userType: UserType.CLASS })
  public async editThemeOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    const themeOrder = [];
    const themes = req.body;

    for (let i = 0; i < req.body.length; i++) {
      const id: number = parseInt(themes[i].id, 10) || 0;
      const labels: { [key: string]: string } = themes[i].names || {};
      const theme: Theme | undefined = await getRepository(Theme).findOne(id);
      if (theme === undefined) {
        next();
        return;
      }

      theme.order = i;
      themeOrder.push(getCustomRepository(ThemeRepository).saveWithLabels(theme, labels));
    }

    res.status(204).send();
  }

  @put({ path: "/:id", userType: UserType.PLMO_ADMIN })
  public async editTheme(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const labels: { [key: string]: string } = req.body.names || {};
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

  @del({ path: "/:id", userType: UserType.PLMO_ADMIN })
  public async deleteTheme(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getCustomRepository(ThemeRepository).delete(id);
    res.status(204).send();
  }

  @oneImage({ path: "/:id/image", tableName: "themes", userType: UserType.PLMO_ADMIN })
  public async addImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.imageID === undefined || req.image === undefined) {
      next();
      return;
    }

    const id: number = parseInt(req.params.id, 10) || 0;
    const theme: Theme | undefined = await getRepository(Theme).findOne(id, { relations: ["image"] });
    if (theme === undefined) {
      await getRepository(Image).delete(req.imageID);
      await deleteImage(req.image);
      next();
      return;
    }

    // delete previous image
    if (theme.image) {
      await deleteImage(theme.image);
      await getRepository(Image).delete(theme.image.id);
    }

    theme.image = req.image;
    await getRepository(Theme).save(theme);
    res.sendJSON(theme.image);
  }

  @del({ path: "/:id/image", userType: UserType.PLMO_ADMIN })
  public async deleteThemeImage(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const theme: Theme | undefined = await getRepository(Theme).findOne(id, { relations: ["image"] });
    if (theme !== undefined && theme.image) {
      await deleteImage(theme.image);
      await getRepository(Image).delete(theme.image.id);
    }
    res.status(204).send();
  }
}
