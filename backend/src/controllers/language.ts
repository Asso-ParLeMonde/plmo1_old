import { NextFunction, Request, Response } from "express";
import { getRepository, getCustomRepository } from "typeorm";
import { Language } from "../entities/language";
import { Controller, del, get, post, put, oneFile } from "./controller";
import { UserType } from "../entities/user";
import { Question } from "../entities/question";
import { Scenario } from "../entities/scenario";
import { ThemeRepository } from "../customRepositories/themeRepository";
import { Theme } from "../entities/theme";
import { downloadFile, uploadFile } from "../fileUpload";
import { LocaleFile, translationsToFile, fileToTranslations, defaultLocales } from "../translations";

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

  @post({ userType: UserType.PLMO_ADMIN })
  public async addLanguage(req: Request, res: Response): Promise<void> {
    const language: Language = new Language(); // create a new language
    language.label = req.body.label;
    language.value = req.body.value;
    await getRepository(Language).save(language); // save new language
    res.sendJSON(language); // send new language
  }

  @put({ path: "/:id", userType: UserType.PLMO_ADMIN })
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

  @del({ path: "/:id", userType: UserType.PLMO_ADMIN })
  public async deleteLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const deleteOperations = [];
    const putOperations = [];

    const id: number = parseInt(req.params.id, 10) || 0;
    const language: Language | undefined = await getRepository(Language).findOne(id);
    if (language === undefined) {
      next(); // will send 404 error
      return;
    }

    // Language
    deleteOperations.push(getRepository(Language).delete(id));

    // Questions
    const questions = await getRepository(Question).find({ where: { languageCode: language.value } });
    for (const question of questions) {
      deleteOperations.push(getRepository(Question).delete(question));
    }

    // Scenarios
    const scenarios: Scenario[] = await getRepository(Scenario).find({ where: { languageCode: language.value } });
    for (const scenario of scenarios) {
      deleteOperations.push(getRepository(Scenario).delete(scenario));
    }

    // Themes
    const themes: Theme[] = await getCustomRepository(ThemeRepository).findAll({ isPublished: null, userId: null });
    for (const theme of themes) {
      const labels: { [key: string]: string } = req.body.names || {};
      delete labels[language.value];
      putOperations.push(getCustomRepository(ThemeRepository).saveWithLabels(theme, labels));
    }

    await Promise.all(deleteOperations);
    await Promise.all(putOperations);

    res.status(204).send();
  }

  @put({ path: "/:value/po", userType: UserType.PLMO_ADMIN })
  public async getPOLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const language: Language | undefined = await getRepository(Language).findOne({ where: { value: req.params.value } });
    const localesFR = req.body.locales || {};
    if (language === undefined) {
      next();
      return;
    }

    const JSONlanguageBuffer: Buffer | null = await downloadFile(`locales/${language.value}.json`);
    const JSONFRlanguageBuffer: Buffer | null = await downloadFile("locales/fr.json");

    const translationsFR = { ...defaultLocales, ...localesFR, ...(JSONFRlanguageBuffer !== null ? JSON.parse(JSONFRlanguageBuffer.toString()) : {}) } as LocaleFile;
    const translations = (language.value === "fr" ? translationsFR : JSONlanguageBuffer !== null ? JSON.parse(JSONlanguageBuffer.toString()) : {}) as LocaleFile;

    const url = await translationsToFile(language.value, translations, translationsFR);
    res.sendJSON({ url });
  }

  @oneFile({ path: "/:value/po", userType: UserType.PLMO_ADMIN })
  public async addPOTranslations(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.file.buffer) {
      next();
      return;
    }

    const localesFR = JSON.parse(req.body.locales || "{}");
    const language: Language | undefined = await getRepository(Language).findOne({ where: { value: req.params.value } });
    if (language === undefined) {
      next();
      return;
    }

    const JSONFRlanguageBuffer: Buffer | null = await downloadFile("locales/fr.json");
    const translationsFR = { ...defaultLocales, ...localesFR, ...(JSONFRlanguageBuffer !== null ? JSON.parse(JSONFRlanguageBuffer.toString()) : {}) } as LocaleFile;

    const newTranslations = fileToTranslations(req.file.buffer, translationsFR);

    await uploadFile(`locales/${language.value}.json`, Buffer.from(JSON.stringify(newTranslations), "utf-8"));
    res.sendJSON({ success: true });
  }
}
