import { EntityRepository, getRepository, Repository, SelectQueryBuilder } from "typeorm";
import { Scenario } from "../entities/scenario";
import { Theme } from "../entities/theme";
import { Question } from "../entities/question";

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

  public async findWithQuestionsCount(params: { themeId: number; languageCode?: string; isDefault?: boolean; userId?: number }): Promise<Array<Scenario>> {
    // eslint-disable-next-line
    let query: SelectQueryBuilder<any> = this.manager
      .createQueryBuilder()
      .select("scenario")
      .addSelect("count(question.id)", "questionsCount")
      .from(Scenario, "scenario")
      .leftJoin(Question, "question", "scenario.id = question.scenarioId and scenario.languageCode = question.languageCode and question.isDefault = true");

    let themequery = "`scenario`.`themeId`";
    let userquery = "`scenario`.`userId`";
    if (process.env.DB_TYPE && process.env.DB_TYPE === "postgres") {
      themequery = '"scenario"."themeId"';
      userquery = '"scenario"."userId"';
    }

    if (params.isDefault !== undefined && params.languageCode !== undefined) {
      query = query.where(`${themequery} = :themeId AND scenario.isDefault = :isDefault AND scenario.languageCode = :languageCode`, params);
      if (params.userId !== undefined) {
        query = query.orWhere(`${themequery} = :themeId AND ${userquery} = :userId`, params);
      }
    } else if (params.isDefault !== undefined) {
      query = query.where(`${themequery} = :themeId AND scenario.isDefault = :isDefault`, params);
      if (params.userId !== undefined) {
        query = query.orWhere(`${themequery} = :themeId AND ${userquery} = :userId`, params);
      }
    } else if (params.languageCode !== undefined) {
      query = query.where(`${themequery} = :themeId AND scenario.languageCode = :languageCode`, params);
      if (params.userId !== undefined) {
        query = query.orWhere(`${themequery} = :themeId AND ${userquery} = :userId`, params);
      }
    } else if (params.userId !== undefined) {
      query = query.where(`${themequery} = :themeId AND ${userquery} = :userId`, params);
    } else {
      query = query.where(`${themequery} = :themeId`, params);
    }

    // eslint-disable-next-line
    const results: any[] = await query
      .groupBy("scenario.id")
      .addGroupBy("scenario.languageCode")
      .getRawMany();

    const scenarios: Scenario[] = [];
    for (const result of results) {
      const scenario = new Scenario();
      scenario.id = result.scenario_id;
      scenario.languageCode = result.scenario_languageCode;
      scenario.name = result.scenario_name;
      scenario.isDefault = result.scenario_isDefault === 1;
      scenario.description = result.scenario_description;
      scenario.questionsCount = result.questionsCount;
      scenarios.push(scenario);
    }

    return scenarios;
  }
}
