import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Plan } from "./plan";

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

  @OneToMany(
    () => Plan,
    plan => plan.question,
  )
  public plans: Plan[];
}
