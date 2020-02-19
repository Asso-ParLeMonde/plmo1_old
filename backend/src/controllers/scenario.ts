import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ScenarioRepository } from "../customRepositories/scenarioRepository";
import { Scenario } from "../entities/scenario";
import { Controller, get, post, put } from "./controller";

interface ScenarioResponse {
  id: undefined | number;
  names: { [key: string]: string };
  descriptions: { [key: string]: string };
  themeId: undefined | number;
}

const EMPTY_SCENRAIO_RESPONSE = {
  id: undefined,
  names: {},
  descriptions: {},
  themeId: undefined,
};

function formatedResponse(scenarios: Scenario[]): ScenarioResponse[] {
  const scenarioObject: { [key: string]: ScenarioResponse } = {};

  for (let i = 0; i < scenarios.length; i++) {
    if (Object.keys(scenarioObject).includes(scenarios[i].id.toString())) {
      scenarioObject[scenarios[i].id].names[scenarios[i].languageCode] = scenarios[i].name;
      scenarioObject[scenarios[i].id].descriptions[scenarios[i].languageCode] = scenarios[i].description;
    } else {
      console.log(scenarios[i].id);
      const newScenario: ScenarioResponse = {
        ...EMPTY_SCENRAIO_RESPONSE,
        id: scenarios[i].id,
        themeId: scenarios[i].theme.id,
      };

      console.log("hello");
      newScenario.names[scenarios[i].languageCode] = scenarios[i].name;
      newScenario.descriptions[scenarios[i].languageCode] = scenarios[i].description;

      scenarioObject[scenarios[i].id] = newScenario;
    }
  }

  console.log(scenarioObject);
  const scenarioIdList = Object.keys(scenarioObject);
  const scenarioResponse: ScenarioResponse[] = [];

  for (let j = 0; j < scenarioIdList.length; j++) {
    scenarioResponse.push(scenarioObject[scenarioIdList[j]]);
  }

  return scenarioResponse;
}

async function getScenario(req: Request): Promise<Scenario[] | undefined> {
  const scenarioId: number = parseInt(req.params.id, 10) || 0;
  return await getCustomRepository(ScenarioRepository).findById({ id: scenarioId });
}

export class ScenariosController extends Controller {
  constructor() {
    super("scenarios");
  }

  @get()
  public async getScenarios(req: Request, res: Response): Promise<void> {
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
  public async getScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
    const scenariosById: Scenario[] | undefined = await getScenario(req);
    if (scenariosById === undefined) {
      next(); // will send 404 error
      return;
    }

    const response = formatedResponse(scenariosById)[0] || {};
    res.sendJSON(response);
  }

  @post()
  public async addScenarios(req: Request, res: Response): Promise<void> {
    const labels: { [key: string]: string } = req.body.names || {};
    const descriptions: { [key: string]: string } = req.body.descriptions || {};
    const languages = Object.keys(labels);

    const scenarioId: number = await getCustomRepository(ScenarioRepository).getNextID();
    const scenariosToAdd = [];
    for (let i = 0; i < languages.length; i++) {
      const scenario: Scenario = new Scenario(); // create a new scenario
      scenario.description = descriptions[languages[i]] || "";
      scenario.languageCode = languages[i] || "fr";
      scenario.name = labels[languages[i]] || "";
      scenario.id = scenarioId;

      scenariosToAdd.push(getCustomRepository(ScenarioRepository).saveScenario(scenario, parseInt(req.body.themeId, 10) || 0)); // 0 because there is no theme with this id
    }

    await Promise.all(scenariosToAdd);

    const response: ScenarioResponse = {
      id: scenarioId,
      names: req.body.names,
      descriptions: req.body.descriptions,
      themeId: req.body.themeId,
    };

    res.sendJSON(response);
  }

  @put({ path: "/:id" })
  public async editScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
    const scenarios: Scenario[] | undefined = await getScenario(req);
    if (scenarios === undefined) {
      next(); // will send 404 error
      return;
    }

    const languages = Object.keys(req.body.names);
    const scenariosToModify = [];

    for (let i = 0; i < languages.length; i++) {
      const scenario = new Scenario();
      scenario.id = parseInt(req.params.id, 10) || 0;

      if (scenario.id === 0) {
        next(); // will send 404 error
        return;
      }

      scenario.languageCode = languages[i];
      scenario.description = req.body.descriptions[languages[i]];
      scenario.name = req.body.names[languages[i]];

      scenariosToModify.push(getCustomRepository(ScenarioRepository).saveScenario(scenario, parseInt(req.body.themeId, 10) || 0)); // 0 because there is no theme with this id
    }

    await Promise.all(scenariosToModify);

    const response: ScenarioResponse = {
      id: parseInt(req.params.id, 10) || 0,
      names: req.body.names,
      descriptions: req.body.descriptions,
      themeId: req.body.themeId,
    };

    res.sendJSON(response);
  }
}
