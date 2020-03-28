import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, getRepository } from "typeorm";
import { Plan } from "./plan";
import { Project } from "./project";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 280 })
  public question: string;

  @Column({ default: false })
  public isDefault: boolean;

  @Column()
  public scenarioId: number;

  @PrimaryColumn({ type: "varchar", length: 2 })
  public languageCode: string;

  @Column({ default: 0 })
  public index: number;

  @OneToMany(
    () => Plan,
    plan => plan.question,
  )
  public plans: Plan[];

  @ManyToOne(
    () => Project,
    project => project.questions,
    { onDelete: "CASCADE" },
  )
  public project: Project;

  public async getPlans(): Promise<Question> {
    this.plans = await getRepository(Plan).find({ where: { question: { id: this.id } } });
    return this;
  }
}
