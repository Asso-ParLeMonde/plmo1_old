import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Image } from "./image";
import { Label } from "./label";
import { Scenario } from "./scenario";
import { User } from "./user";

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToMany(
    () => Scenario,
    (scenario: Scenario) => scenario.theme,
  )
  public scenarios: Scenario[];

  @Column()
  public labelID: number;

  @Column({ default: 0 })
  public order: number;

  @Column({ default: false })
  public isPublished: boolean;

  @OneToOne(() => Image, { onDelete: "SET NULL" })
  @JoinColumn()
  public image: Image;

  @ManyToOne(() => User)
  public user: User;

  public labels: Label[];
  public names: { [key: string]: string };
}
