import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Question } from "./question";
import { Theme } from "./theme";
import { User } from "./user";

@Entity()
export class Scenario {
  @PrimaryColumn()
  public id: number;

  @PrimaryColumn({ type: "varchar", length: 2 })
  public languageCode: string;

  @Column({ type: "varchar", length: 50 })
  public name: string;

  @Column({ default: false })
  public isDefault: boolean;

  @ManyToOne(
    () => Theme,
    (theme: Theme) => theme.scenarios,
  )
  public theme: Theme;

  @Column({ type: "varchar", length: 280 })
  public description: string;

  @ManyToOne(() => User)
  public user: User;

  public questions: Question[];

  public questionsCount: number;
}
