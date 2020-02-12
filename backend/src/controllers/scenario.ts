import { NextFunction, Request, Response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { ScenarioRepository } from "../customRepositories/scenarioRepository";
import { Scenario } from "../entities/scenario";
import { Controller, get, post, put } from "./controller";

interface IScenarioResponse {
  id: undefined | number;
  names: { [key: string]: string };
  descriptions: { [key: string]: string };
}

const EMPTY_SCENARIO_RESPONSE: IScenarioResponse = {
  id: undefined,
  names: {},
  descriptions: {},
};

function formatedResponse(scenarios: Scenario[]): IScenarioResponse {
  const scenarioResponse: IScenarioResponse = EMPTY_SCENARIO_RESPONSE;

  if (scenarios.length !== 0) {
    scenarioResponse.id = scenarios[0].id;
    for (let i = 0; i < scenarios.length; i++) {
      scenarioResponse.names[scenarios[i].languageCode] = scenarios[i].name;
      scenarioResponse.descriptions[scenarios[i].languageCode] = scenarios[i].description;
    }
  }

  return scenarioResponse;
}

async function getScenario(req: Request): Promise<Scenario[] | undefined> {
  const id: number = parseInt(req.params.id, 10) || 0;
  return await getRepository(Scenario).find({
    where: { id },
  });
}

export class ScenariosController extends Controller {
  constructor() {
    super("scenarios");
  }

  @get()
  public async getScenarios(req: Request, res: Response) {
    const { query } = req;
    const params: { isDefault: boolean | null } = { isDefault: null };
    if (query.isDefault !== undefined) {
      params.isDefault = query.isDefault === "true";
    }

    const scenarios: Scenario[] = await getCustomRepository(ScenarioRepository).findAll(params);

    const response = formatedResponse(scenarios);
    res.sendJSON(response);
  }

  @get({ path: "/:id" })
  public async getScenario(req: Request, res: Response, next: NextFunction) {
    const scenariosById: Scenario[] | undefined = await getScenario(req);
    if (scenariosById === undefined) {
      next(); // will send 404 error
      return;
    }

    const response = formatedResponse(scenariosById);
    res.sendJSON(response);
  }

  @post()
  public async addScenarios(req: Request, res: Response) {
    const labels: { [key: string]: string } = req.body.names || {};
    const languages = Object.keys(labels);

    let scenarioId: number = await getCustomRepository(ScenarioRepository).getNextID();
    const scenariosToAdd = [];
    for (const language in languages) {
      const scenario: Scenario = new Scenario(); // create a new scenario
      scenario.description = req.body.description || "";
      scenario.languageCode = language || "fr";
      scenario.name = labels[language] || "";
      scenario.id = scenarioId;

      scenariosToAdd.push(getCustomRepository(ScenarioRepository).saveScenario(scenario, parseInt(req.body.themeId, 10) || 0)); // 0 because there is no theme with this id
    }

    await Promise.all(scenariosToAdd);

    res.sendJSON(req.body);
  }

  @put({ path: "/:id" })
  public async editScenario(req: Request, res: Response, next: NextFunction) {
    const scenarios: Scenario[] | undefined = await getScenario(req);
    if (scenarios === undefined) {
      next(); // will send 404 error
      return;
    }

    const languages = Object.keys(req.body.names);
    const scenariosToModify = [];

    for (const language in languages) {
      const scenario = new Scenario();
      scenario.id = parseInt(req.params.id, 10) || 0;

      if (scenario.id === 0) {
        next(); // will send 404 error
        return;
      }

      scenario.languageCode = language;
      scenario.description = req.body.descriptions[language];
      scenario.name = req.body.names[language];

      scenariosToModify.push(getCustomRepository(ScenarioRepository).saveScenario(scenario, parseInt(req.body.themeId, 10) || 0)); // 0 because there is no theme with this id
    }

    await Promise.all(scenariosToModify);

    const response = formatedResponse(scenarios);
    res.sendJSON(response);
  }
}
