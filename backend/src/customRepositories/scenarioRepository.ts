import { EntityRepository, getRepository, Repository, SelectQueryBuilder } from "typeorm";
import { Scenario } from "../entities/scenario";
import { Theme } from "../entities/theme";

@EntityRepository(Scenario)
export class ScenarioRepository extends Repository<Scenario> {
  public async findAll(params: { isDefault: boolean | null }): Promise<Scenario[]> {
    let entitiesQuery: SelectQueryBuilder<Scenario> = this.manager
      .createQueryBuilder()
      .select("scenario")
      .from(Scenario, "scenario")
      .leftJoinAndSelect("scenario.theme", "theme");
    if (params.isDefault !== null) {
      entitiesQuery = entitiesQuery.where("scenario.isDefault = :isDefault", params);
    }
    const entities: Scenario[] = await entitiesQuery.getMany();
    return entities;
  }

  public async findById(params: { id: number }): Promise<Scenario[]> {
    const entitiesQuery: SelectQueryBuilder<Scenario> = this.manager
      .createQueryBuilder()
      .select("scenario")
      .from(Scenario, "scenario")
      .leftJoinAndSelect("scenario.theme", "theme")
      .where("scenario.id = :id", params);
    const entities: Scenario[] = await entitiesQuery.getMany();
    return entities;
  }

  public async saveScenario(scenario: Scenario, themeId: number): Promise<Scenario> {
    const theme: Theme | undefined = await getRepository(Theme).findOne(themeId);
    if (theme === undefined) {
      throw new Error("Error, theme not found.");
    }
    scenario.theme = theme;
    if (scenario.id === undefined || scenario.id === null) {
      scenario.id = await this.getNextID();
    }
    return await this.manager.save(scenario);
  }

  public async getNextID(): Promise<number> {
    let sequenceResult: Array<{ id: string }>;
    if (process.env.DB_TYPE && process.env.DB_TYPE === "postgres") {
      sequenceResult = await this.manager.query("SELECT nextval('scenario_sequence') as id");
    } else {
      sequenceResult = await this.manager.query("SELECT NEXT VALUE FOR SCENARIO_SEQUENCE AS id");
    }
    return parseInt(sequenceResult[0].id, 10);
  }
}
