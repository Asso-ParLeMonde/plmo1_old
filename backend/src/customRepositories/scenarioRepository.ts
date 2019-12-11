import {
    EntityRepository,
    getRepository,
    Repository,
} from 'typeorm';
import { Scenario } from '../entities/scenario';
import { Theme } from '../entities/theme';

@EntityRepository(Scenario)
export class ScenarioRepository extends Repository<Scenario> {
    public async saveScenario(scenario: Scenario, themeId: number) {
        const theme: Theme | undefined = await getRepository(Theme).findOne(themeId);
        if (theme === undefined) {
            throw new Error('haha boloss (je parle d\'Alexandre)');
        }
        scenario.theme = theme;
        if (scenario.id === undefined || scenario.id === null) {
            const sequenceResult: Array<{ ID: string }> = await this.manager.query('SELECT NEXT VALUE FOR SCENARIO_SEQUENCE AS ID');
            scenario.id = parseInt(sequenceResult[0].ID, 10);
        }
        return await this.manager.save(scenario);
    }
}
