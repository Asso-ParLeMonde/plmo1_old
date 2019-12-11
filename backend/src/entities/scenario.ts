import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Question } from './question';
import { Theme } from './theme';

@Entity()
export class Scenario {

    @PrimaryColumn()
    public id: number;

    @PrimaryColumn({ type: 'varchar', length: 2 })
    public languageCode: string;

    @Column({ type: 'varchar', length: 50 })
    public name: string;

    @ManyToOne(() => Theme, (theme: Theme) => theme.scenarios)
    public theme: Theme;

    @Column({ type: 'varchar', length: 280 })
    public description: string;

    public questions: Question[];
}
