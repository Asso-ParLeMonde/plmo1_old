import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Label } from '../entities/label';

@EntityRepository(Label)
export class LabelRepository extends Repository<Label> {
    public async createAndSave(label: string, lang: string, transactionalEntityManager?: EntityManager): Promise<Label> {
        if (!/\w/gim.test(label)) { // test if name is valid
            throw new Error(`Label ${label} is not valid.`);
        }

        if (lang.length !== 2) {
            throw new Error('Language code is not valid.');
        }

        const dbLabel: Label = new Label();
        dbLabel.languageCode = lang;
        dbLabel.label = label;
        const sequenceResult: Array<{ ID: string }> = await this.manager.query('SELECT NEXT VALUE FOR LABEL_SEQUENCE AS ID');
        dbLabel.id = parseInt(sequenceResult[0].ID, 10);
        if (transactionalEntityManager !== undefined) {
            return await transactionalEntityManager.save(dbLabel);
        }
        return await this.manager.save(dbLabel);
    }
}
