import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Question } from "../entities/question";
import { Scenario } from "../entities/scenario";
import { Controller, del, get, post, put } from "./controller";
import { UserType } from "../entities/user";
import { Project } from "../entities/project";

function getOptions(req: Request): { isDefault?: boolean; scenarioId?: number; languageCode?: string } {
  const isDefault: string | undefined = req.query.isDefault || undefined;
  const scenarioId: number | undefined = parseInt(req.query.scenarioId || "", 10) || undefined;
  const languageCode: string | undefined = req.query.languageCode || undefined;

  const where: { isDefault?: boolean; scenarioId?: number; languageCode?: string } = {};
  if (isDefault !== undefined) {
    where.isDefault = isDefault === "true";
  }
  if (scenarioId !== undefined) {
    where.scenarioId = scenarioId;
  }
  if (languageCode !== undefined) {
    where.languageCode = languageCode;
  }

  return where;
}

export class QuestionController extends Controller {
  constructor() {
    super("questions");
  }

  @get()
  public async getQuestions(req: Request, res: Response): Promise<void> {
    const options = {
      where: getOptions(req),
    };
    const questions = await getRepository(Question).find(options);
    res.sendJSON(questions);
  }

  @get({ path: "/:id" })
  public async getQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = parseInt(req.params.id || "", 10) || 0;
    const options = {
      where: { id, ...getOptions(req) },
    };
    const question = await getRepository(Question).findOne(options);
    if (question === undefined) {
      next();
      return;
    }
    res.sendJSON(question);
  }

  @post({ userType: UserType.CLASS })
  public async addQuestion(req: Request, res: Response): Promise<void> {
    const scenarioId = parseInt(req.body.scenarioId || "", 10) || 0;
    const languageCode = req.body.languageCode || "";

    const scenario: Scenario | undefined = await getRepository(Scenario).findOne({
      where: { id: scenarioId, languageCode },
    });
    if (scenario === undefined) {
      throw new Error("Scenario not found !");
    }

    const q: string = (req.body.question || "").slice(0, 280);
    if (q.length === 0) {
      throw new Error("Question is empty !");
    }

    const question: Question = new Question();
    question.languageCode = scenario.languageCode;
    question.scenarioId = scenario.id;
    question.isDefault = req.body.isDefault !== undefined ? req.body.isDefault : false;
    question.question = q;
    question.index = req.body.index || 0;

    if (req.body.projectId !== undefined) {
      question.project = new Project();
      question.project.id = req.body.projectId;
    }

    await getRepository(Question).save(question);
    res.sendJSON(question);
  }

  @put({ path: "/:id", userType: UserType.CLASS })
  public async editQuestion(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id || "", 10) || 0;
    const question: Question | undefined = await getRepository(Question).findOne({
      where: { id },
    });
    if (question === undefined) {
      throw new Error("Question not found !");
    }

    question.id = id;
    if (req.body.isDefault !== undefined) {
      question.isDefault = req.body.isDefault;
    }
    if (req.body.question !== undefined && req.body.question.length > 0) {
      question.question = (req.body.question || "").slice(0, 280);
    }
    if (req.body.index !== undefined) {
      question.index = req.body.index;
    }
    await getRepository(Question).save(question);
    res.sendJSON(question);
  }

  @del({ path: "/:id", userType: UserType.CLASS })
  public async deleteQuestion(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id || "", 10) || 0;
    await getRepository(Question).delete({ id });
    res.status(204).send();
  }
}
