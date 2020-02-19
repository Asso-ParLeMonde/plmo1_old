import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 280 })
  public question: string;

  @Column()
  public isDefault: boolean;

  @Column()
  public scenarioId: number;

  @PrimaryColumn({ type: "varchar", length: 2 })
  public languageCode: string;
}
