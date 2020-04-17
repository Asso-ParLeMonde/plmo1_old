import { NextFunction, Request, Response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { ScenarioRepository } from "../customRepositories/scenarioRepository";
import { Question } from "../entities/question";
import { Scenario } from "../entities/scenario";
import { Controller, del, get, post, put } from "./controller";
import { UserType } from "../entities/user";

async function getScenario(req: Request): Promise<Scenario | undefined> {
  const themeId: number = parseInt(req.params.themeId, 10) || 0;
  const scenarioIDS: string[] = (req.params.scenarioIDS || "_").split("_");
  const scenarioId: number = parseInt(scenarioIDS[0], 10) || 0;
  const languageCode: string = scenarioIDS[1] || "fr";
  return await getRepository(Scenario).findOne({ where: { id: scenarioId, theme: { id: themeId }, languageCode } });
}

export class ThemeScenariosController extends Controller {
  constructor() {
    super("themes/:themeId/scenarios");
  }

  @get()
  public async getScenarios(req: Request, res: Response): Promise<void> {
    const themeId: number = parseInt(req.params.themeId, 10) || 0;
    const params: { themeId: number; languageCode?: string; isDefault?: boolean; userId?: number } = { themeId };

    if (req.query.languageCode !== undefined) {
      params.languageCode = req.query.languageCode as string;
    }
    if (req.query.isDefault !== undefined) {
      params.isDefault = req.query.isDefault === "true";
    }
    if ((req.query.user !== undefined || req.query.userId !== undefined) && req.user !== undefined) {
      params.userId = req.user.id;
    }

    const scenarios: Scenario[] = await getCustomRepository(ScenarioRepository).findWithQuestionsCount(params);

    res.sendJSON(scenarios);
  }

  @get({ path: "/:scenarioIDS" })
  public async getScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
    const scenario: Scenario | undefined = await getScenario(req);
    if (scenario === undefined) {
      next(); // will send 404 error
      return;
    }
    scenario.questions = await getRepository(Question).find({
      where: {
        languageCode: scenario.languageCode,
        scenarioId: scenario.id,
      },
    });
    res.sendJSON(scenario);
  }

  @post({ userType: UserType.CLASS })
  public async addScenarios(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.user === undefined) {
      next();
      return;
    }

    const scenario: Scenario = new Scenario(); // create a new scenario
    scenario.description = req.body.description || "";
    scenario.languageCode = req.body.languageCode || "fr";
    scenario.name = req.body.name || "";
    scenario.id = req.body.id || null;
    scenario.user = req.user.userWithoutPassword();
    await getCustomRepository(ScenarioRepository).saveScenario(scenario, parseInt(req.params.themeId, 10) || 0); // 0 because there is no theme with this id
    res.sendJSON(scenario);
  }

  @put({ path: "/:scenarioIDS", userType: UserType.CLASS })
  public async editScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
    const scenario: Scenario | undefined = await getScenario(req);
    if (scenario === undefined) {
      next(); // will send 404 error
      return;
    }
    scenario.description = req.body.description;
    scenario.name = req.body.name;
    await getCustomRepository(ScenarioRepository).saveScenario(scenario, parseInt(req.params.themeId, 10) || 0); // 0 because there is no theme with this id
    res.sendJSON(scenario);
  }

  @del({ path: "/:scenarioIDS", userType: UserType.CLASS })
  public async deleteScenario(req: Request, res: Response): Promise<void> {
    const themeId: number = parseInt(req.params.themeId, 10) || 0;
    const scenarioIDS: string[] = (req.params.scenarioIDS || "_").split("_");
    const scenarioId: number = parseInt(scenarioIDS[0], 10) || 0;
    const languageCode: string = scenarioIDS[1] || "";
    if (languageCode.length > 0) {
      // get one and delete
      const scenario: Scenario | undefined = await getRepository(Scenario).findOne({ where: { id: scenarioId, languageCode, theme: { id: themeId } } });
      if (scenario === undefined) {
        // Check theme relation
        res.status(204).send();
        return;
      }
      await getRepository(Scenario).delete({ id: scenarioId, languageCode });
    } else {
      // get all scenarios and delete them
      const scenarios: Scenario[] = await getRepository(Scenario).find({ where: { id: scenarioId, theme: { id: themeId } } });
      const scenariosToDelete = [];
      for (const scenario of scenarios) {
        scenariosToDelete.push(getRepository(Scenario).delete(scenario));
      }
      await Promise.all(scenariosToDelete);
    }
    res.status(204).send();
  }
}
