import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Language } from "../entities/language";
import { Controller, del, get, post, put } from "./controller";

export class LanguageController extends Controller {
  constructor() {
    super("languages");
  }

  @get()
  public async getLanguages(_: Request, res: Response): Promise<void> {
    const languages: Language[] = await getRepository(Language).find();
    res.sendJSON(languages);
  }

  @get({ path: "/:id" })
  public async getLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const language: Language | undefined = await getRepository(Language).findOne(id);
    if (language === undefined) {
      next(); // will send 404 error
      return;
    }
    res.sendJSON(language);
  }

  @post()
  public async addLanguage(req: Request, res: Response): Promise<void> {
    const language: Language = new Language(); // create a new language
    language.label = req.body.label;
    language.value = req.body.value;
    await getRepository(Language).save(language); // save new language
    res.sendJSON(language); // send new language
  }

  @put({ path: "/:id" })
  public async editLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const language: Language | undefined = await getRepository(Language).findOne(id);
    if (language === undefined) {
      next();
      return;
    }
    language.label = req.body.label;
    language.value = req.body.value;
    await getRepository(Language).save(language);
    res.sendJSON(language); // send updated language
  }

  @del({ path: "/:id" })
  public async deleteLanguage(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(Language).delete(id);
    res.status(204).send();
  }
}
