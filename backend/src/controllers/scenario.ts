import { NextFunction, Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { ScenarioRepository } from '../customRepositories/scenarioRepository';
import { Scenario } from '../entities/scenario';
import { Controller, del, get, post, put } from './controller';

async function getScenario(req: Request): Promise<Scenario | undefined> {
    const themeId: number = parseInt(req.params.themeId, 10) || 0;
    const scenarioIDS: string[] = (req.params.scenarioIDS || '_').split('_');
    const scenarioId: number = parseInt(scenarioIDS[0], 10) || 0;
    const languageCode: string = scenarioIDS[1] || 'fr';
    return await getRepository(Scenario).findOne({ where: { id: scenarioId, theme: { id: themeId }, languageCode } });
}

export class ScenarioController extends Controller {
    constructor() {
        super('themes/:themeId/scenarios');
    }

    @get()
    public async getScenarios(req: Request, res: Response) {
        const themeId: number = parseInt(req.params.themeId, 10) || 0;
        let scenarios: Scenario[];
        const conditions: { where: { theme: { id: number }, languageCode?: string }  } = { where: { theme: { id: themeId } } };
        if (req.query.languageCode !== undefined) {
            conditions.where.languageCode = req.query.languageCode;
        }
        scenarios = await getRepository(Scenario).find(conditions);
        res.sendJSON(scenarios);
    }

    @get({ path: '/:scenarioIDS' })
    public async getScenario(req: Request, res: Response,  next: NextFunction) {
        const scenario: Scenario | undefined = await getScenario(req);
        if (scenario === undefined) {
            next(); // will send 404 error
            return;
        }
        res.sendJSON(scenario);
    }

    @post()
    public async addScenarios(req: Request, res: Response) {
        const scenario: Scenario = new Scenario(); // create a new scenario
        scenario.description = req.body.description || '';
        scenario.languageCode = req.body.languageCode || 'fr';
        scenario.name = req.body.name || '';
        scenario.id = req.body.id || '';
        await getCustomRepository(ScenarioRepository).saveScenario(scenario, parseInt(req.params.themeId, 10) || 0); // 0 because there is no theme with this id
        res.sendJSON(scenario);
    }

    @put({ path: '/:scenarioIDS' })
    public async editScenario(req: Request, res: Response,  next: NextFunction) {
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

    @del({ path: '/:scenarioIDS' })
    public async deleteScenario(req: Request, res: Response) {
        const themeId: number = parseInt(req.params.themeId, 10) || 0;
        const scenarioIDS: string[] = (req.params.scenarioIDS || '_').split('_');
        const scenarioId: number = parseInt(scenarioIDS[0], 10) || 0;
        const languageCode: string = scenarioIDS[1] || '';
        if (languageCode.length > 0) { // get one and delete
            const scenario: Scenario | undefined = await getRepository(Scenario).findOne({ where: { id: scenarioId, languageCode, theme: { id: themeId } } });
            if (scenario === undefined) { // Check theme relation
                res.status(204).send();
                return;
            }
            await getRepository(Scenario).delete({ id: scenarioId, languageCode });
        } else { // get all scenarios and delete them
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
