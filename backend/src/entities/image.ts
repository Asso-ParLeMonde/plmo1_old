import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 200, unique: true })
  public path: string;

  @Column({ type: "varchar", length: 50, unique: true })
  public uuid: string;

  @Column({ type: "varchar", length: 150 })
  public localPath: string;
}
