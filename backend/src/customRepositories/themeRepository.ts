import { DeleteResult, EntityRepository, FindConditions, getCustomRepository, getRepository, ObjectID, Repository, SelectQueryBuilder } from "typeorm";
import { Image } from "../entities/image";
import { Label } from "../entities/label";
import { Theme } from "../entities/theme";
import { deleteImage } from "../fileUpload";
import { LabelRepository } from "./labelRepository";

@EntityRepository(Theme)
export class ThemeRepository extends Repository<Theme> {
  public async saveWithLabels(theme: Theme, labels: { [key: string]: string }): Promise<void> {
    if (Object.keys(labels).length === 0 && theme.id === undefined) {
      throw new Error("Error, labels for new theme are empty !");
    }
    theme.names = theme.names || {};
    await this.manager.transaction(async transactionalEntityManager => {
      let error = false;
      const promises: Array<Promise<Label | Theme>> = [];
      for (const lang of Object.keys(labels)) {
        if (labels[lang].length === 0) {
          continue;
        }
        theme.names[lang] = labels[lang];
        if (!theme.labelID) {
          try {
            const label: Label = await getCustomRepository(LabelRepository).createAndSave(labels[lang], lang, transactionalEntityManager);
            theme.labelID = label.id;
          } catch (e) {
            error = true;
          }
        } else {
          if (lang.length !== 2) {
            error = true;
            continue;
          }
          const label: Label = new Label();
          label.id = theme.labelID;
          label.languageCode = lang;
          label.label = labels[lang];
          promises.push(transactionalEntityManager.save(label));
        }
      }
      promises.push(transactionalEntityManager.save(theme));
      try {
        await Promise.all(promises);
      } catch (e) {
        error = true;
      }
      if (error) {
        throw new Error("There is an error with one or many labels...");
      }
    });
    delete theme.labelID;
  }

  public async findAll(params: { isPublished: boolean | null; userId: number | null }): Promise<Array<Theme>> {
    let entitiesQuery: SelectQueryBuilder<Theme> = this.manager
      .createQueryBuilder()
      .select("theme")
      .from(Theme, "theme")
      .leftJoinAndSelect("theme.image", "image")
      .leftJoinAndMapMany("theme.labels", "label", "label", "theme.labelID = label.id")
      .orderBy("theme.order", "ASC");
    if (params.isPublished !== null) {
      entitiesQuery = entitiesQuery.where("theme.isPublished = :isPublished", params);
      if (params.userId !== null) {
        entitiesQuery = entitiesQuery.orWhere("theme.userId = :userId", params);
      }
    } else if (params.userId !== null) {
      entitiesQuery = entitiesQuery.where("theme.userId = :userId", params);
    }
    const entities: Theme[] = await entitiesQuery.getMany();
    for (const entity of entities) {
      delete entity.labelID;
      entity.names = entity.labels.reduce((n: { [key: string]: string }, label: Label) => {
        n[label.languageCode] = label.label;
        return n;
      }, {});
      delete entity.labels;
    }
    return entities;
  }

  public async findOneWithLabels(id: number): Promise<Theme | undefined> {
    const entity: Theme | undefined = await this.manager
      .createQueryBuilder()
      .select("theme")
      .from(Theme, "theme")
      .leftJoinAndSelect("theme.image", "image")
      .leftJoinAndSelect("theme.scenarios", "scenario")
      .leftJoinAndMapMany("theme.labels", "label", "label", "theme.labelID = label.id")
      .where(`theme.id = ${id}`)
      .getOne();
    if (entity === undefined) {
      return undefined;
    }
    delete entity.labelID;
    entity.names = entity.labels.reduce((n: { [key: string]: string }, label: Label) => {
      n[label.languageCode] = label.label;
      return n;
    }, {});
    delete entity.labels;
    return entity;
  }

  public async delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Theme>): Promise<DeleteResult> {
    if (typeof criteria === "number" || typeof criteria === "string" || typeof criteria === typeof ObjectID) {
      const theme: Theme | undefined = await this.findOne(criteria as string | number | ObjectID);
      if (theme !== undefined) {
        await getRepository(Label).delete({ id: theme.labelID });
        if (theme.image) {
          await deleteImage(theme.image);
          await getRepository(Image).delete(theme.image.id);
        }
      }
    }
    return await getRepository(Theme).delete(criteria);
  }
}
