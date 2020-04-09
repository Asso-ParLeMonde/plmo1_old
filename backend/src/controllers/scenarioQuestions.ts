import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Question } from "../entities/question";
import { Controller, get } from "./controller";

function getIDs(req: Request): { scenarioId: number; languageCode: string | undefined } {
  let scenarioId: number;
  let languageCode: string | undefined;
  if ((req.params.scenarioIDS || "").indexOf("_") === -1) {
    scenarioId = parseInt(req.params.scenarioIDS || "", 10) || 0;
    languageCode = (req.query.languageCode as string | undefined) || undefined;
  } else {
    const scenarioIDS: string[] = (req.params.scenarioIDS || "_").split("_");
    scenarioId = parseInt(scenarioIDS[0], 10) || 0;
    languageCode = scenarioIDS[1] || "fr";
  }
  return { scenarioId, languageCode };
}

export class ScenarioQuestionController extends Controller {
  constructor() {
    super("scenarios/:scenarioIDS/questions");
  }

  @get()
  public async getQuestions(req: Request, res: Response): Promise<void> {
    const { scenarioId, languageCode } = getIDs(req);
    const isDefault: string | undefined = (req.query.isDefault as string | undefined) || undefined;
    const options: { where: { scenarioId: number; languageCode?: string; isDefault?: boolean } } = { where: { scenarioId } };
    if (isDefault !== undefined) {
      options.where.isDefault = isDefault === "true";
    }
    if (languageCode !== undefined) {
      options.where.languageCode = languageCode;
    }
    const questions = await getRepository(Question).find(options);
    res.sendJSON(questions);
  }
}
