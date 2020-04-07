import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image";
import { Label } from "./label";
import { Scenario } from "./scenario";

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

  @Column()
  public order: number;

  @Column({ default: false })
  public isPublished: boolean;

  @OneToOne(() => Image, { onDelete: "SET NULL" })
  @JoinColumn()
  public image: Image;

  public labels: Label[];
  public names: { [key: string]: string };
}
