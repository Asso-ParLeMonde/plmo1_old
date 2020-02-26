import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Language {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public label: string;

    @Column()
    public value: string;

}
