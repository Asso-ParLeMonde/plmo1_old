import {
    DeleteResult,
    EntityRepository,
    FindConditions,
    getCustomRepository,
    getRepository,
    ObjectID,
    Repository, SelectQueryBuilder,
} from 'typeorm';
import { Image } from '../entities/image';
import { Label } from '../entities/label';
import { Theme } from '../entities/theme';
import { deleteImage } from '../fileUpload';
import { LabelRepository } from './labelRepository';

@EntityRepository(Theme)
export class ThemeRepository extends Repository<Theme> {
    public async saveWithLabels(theme: Theme, labels: { [key: string]: string }): Promise<void> {
        if (Object.keys(labels).length === 0 && theme.id === undefined) {
            throw new Error('Error, labels for new theme are empty !');
        }
        theme.names = theme.names || { };
        await this.manager.transaction(async (transactionalEntityManager) => {
            let error = false;
            const promises: Array<Promise<Label | Theme>> = [];
            for (const lang of Object.keys(labels)) {
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
                throw new Error('There is an error with one or many labels...');
            }
        });
        delete theme.labelID;
    }

    public async findAll(params: { isPublished: boolean | null }) {
        let entitiesQuery: SelectQueryBuilder<Theme> = this.manager
            .createQueryBuilder()
            .select('theme')
            .from(Theme, 'theme')
            .leftJoinAndSelect('theme.image', 'image')
            .leftJoinAndMapMany('theme.labels', 'label', 'label', 'theme.labelID = label.id');
        if (params.isPublished !== null) {
            entitiesQuery = entitiesQuery.where('theme.isPublished = :isPublished', params);
        }
        const entities: Theme[] = await entitiesQuery.getMany();
        for (const entity of entities) {
            delete entity.labelID;
            entity.names = entity.labels.reduce((n: { [key: string]: string }, label: Label) => {
                n[label.languageCode] = label.label;
                return n;
            }, { });
            delete entity.labels;
        }
        return entities;
    }

    public async findOneWithLabels(id: number) {
        const entity: Theme | undefined = await this.manager
            .createQueryBuilder()
            .select('theme')
            .from(Theme, 'theme')
            .leftJoinAndSelect('theme.image', 'image')
            .leftJoinAndSelect('theme.scenarios', 'scenario')
            .leftJoinAndMapMany('theme.labels', 'label', 'label', 'theme.labelID = label.id')
            .where(`theme.id = ${id}`)
            .getOne();
        if (entity === undefined) {
            return undefined;
        }
        delete entity.labelID;
        entity.names = entity.labels.reduce((n: { [key: string]: string }, label: Label) => {
            n[label.languageCode] = label.label;
            return n;
        }, { });
        delete entity.labels;
        return entity;
    }

    public async delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Theme>): Promise<DeleteResult> {
        if (typeof criteria === 'number' || typeof criteria === 'string' || typeof criteria === typeof ObjectID) {
            const theme: Theme | undefined = await this.findOne(criteria as string | number | ObjectID);
            if (theme !== undefined) {
                await getRepository(Label).delete({ id: theme.labelID });
                await this.deleteThemeImage(theme.id);
            }
        }
        return await getRepository(Theme).delete(criteria);
    }

    public async deleteThemeImage(themeID: number) {
        const theme: Theme | undefined = await this.findOne(themeID, { relations: ['image'] });
        if (theme === undefined) {
            return;
        }
        if (theme.image === null || theme.image === undefined) {
            return;
        }
        await deleteImage(theme.image.uuid, theme.image.localPath);
        await this.query('UPDATE `PLMO`.`theme` SET imageId = NULL WHERE `theme`.`id` = ?', [themeID]);
        await getRepository(Image).delete(theme.image.id);
    }
}
