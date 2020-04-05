import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Theme } from "./theme";
import { Scenario } from "./scenario";
import { Question } from "./question";
import { User } from "./user";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 200, nullable: true })
  public title: string;

  @ManyToOne(() => Theme)
  public theme: Theme;

  @ManyToOne(() => Scenario)
  public scenario: Scenario;

  @ManyToOne(() => User)
  public user: User;

  @OneToMany(
    () => Question,
    question => question.project,
  )
  public questions: Question[];
}
