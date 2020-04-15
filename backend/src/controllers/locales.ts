import { Controller, get } from "./controller";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Language } from "../entities/language";
import { downloadFile } from "../fileUpload";

export class LocalesController extends Controller {
  constructor() {
    super("locales");
  }

  @get({ path: "/:value" })
  public async getJSONLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    let value: string = req.params.value || "";
    if (value.endsWith(".json")) {
      value = value.slice(0, value.length - 5);
    }
    const language: Language | undefined = await getRepository(Language).findOne({ where: { value } });
    if (language === undefined) {
      next();
      return;
    }

    const JSONlanguageBuffer: Buffer | null = await downloadFile(`locales/${language.value}.json`);
    const locales = JSONlanguageBuffer !== null ? JSON.parse(JSONlanguageBuffer.toString()) : {};
    res.sendJSON(locales);
  }
}
