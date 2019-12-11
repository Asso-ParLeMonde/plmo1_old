import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Scenario } from './scenario';

@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'varchar' })
    public name: string;

    public scenario: Scenario;
}
