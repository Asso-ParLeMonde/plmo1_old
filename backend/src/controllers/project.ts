import { Request, Response } from "express";
import { Controller, get } from "./controller";
import { htmlToPDF, PDF } from "../pdf";
import { Question } from "../entities/question";
import { Plan } from "../entities/plan";

type QuestionsFromBody = Array<{ question?: string; plans?: Array<{ url?: string; description?: string }> }>;

export class ProjectController extends Controller {
  constructor() {
    super("project");
  }

  @get({ path: "/pdf" })
  public async getProjectPDF(req: Request, res: Response): Promise<void> {
    const questions: Question[] = [];
    for (const q of (req.body.questions || []) as QuestionsFromBody) {
      const question = new Question();
      question.question = q.question || "";
      question.plans = [];
      for (const p of q.plans || []) {
        const plan = new Plan();
        plan.url = p.url || "";
        plan.description = p.description || "";
        question.plans.push(plan);
      }
      questions.push(question);
    }

    const url = await htmlToPDF(PDF.PLAN_DE_TOURNAGE, {
      themeName: req.body.themeName || "",
      scenarioName: req.body.scenarioName || "",
      scenarioDescription: req.body.scenarioDescription || "",
      pseudo: req.user !== undefined ? req.user.pseudo : undefined,
      questions,
    });
    res.sendJSON({ url });
  }
}
