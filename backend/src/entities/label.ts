import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Label {
  @PrimaryColumn()
  public id: number;

  @PrimaryColumn({ type: "varchar", length: 2 })
  public languageCode: string;

  @Column({ type: "varchar", length: 50 })
  public label: string;
}
