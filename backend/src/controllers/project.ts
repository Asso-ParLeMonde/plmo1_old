import { Request, Response } from "express";
import { Controller, post } from "./controller";
import { htmlToPDF, PDF } from "../pdf";
import { Question } from "../entities/question";
import { Plan } from "../entities/plan";
import { getRepository, getCustomRepository } from "typeorm";
import { Theme } from "../entities/theme";
import { Scenario } from "../entities/scenario";
import { AppError, ErrorCode } from "../middlewares/handleErrors";
import { ThemeRepository } from "../customRepositories/themeRepository";
import { PDFDownload } from "../entities/pdfDownload";

type QuestionsFromBody = Array<{ question?: string; plans?: Array<{ url?: string; description?: string }> }>;

export class ProjectController extends Controller {
  constructor() {
    super("project");
  }

  @post({ path: "/pdf" })
  public async getProjectPDF(req: Request, res: Response): Promise<void> {
    const languageCode: string = req.body.languageCode || "fr";
    const theme: Theme | undefined = await getCustomRepository(ThemeRepository).findOneWithLabels(req.body.themeId || 0);
    let scenario: Scenario | undefined = await getRepository(Scenario).findOne({
      where: {
        id: req.body.scenarioId || 0,
        languageCode,
      },
    });
    if (theme === undefined) {
      throw new AppError("Invalid data", ErrorCode.INVALID_DATA);
    }
    if (scenario === undefined) {
      if (req.body.scenarioName !== undefined && req.body.scenarioDescription !== undefined) {
        scenario = new Scenario();
        scenario.name = req.body.scenarioName;
        scenario.description = req.body.scenarioDescription;
      } else {
        throw new AppError("Invalid data", ErrorCode.INVALID_DATA);
      }
    }

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
      themeName: theme.names.fr,
      scenarioName: scenario.name,
      scenarioDescription: scenario.description,
      pseudo: req.user !== undefined ? req.user.pseudo : undefined,
      questions,
    });
    //For PDF Download statistics
    const pdfEntry = new PDFDownload();
    await getRepository(PDFDownload).save(pdfEntry);
    res.sendJSON({ url });
  }
}
