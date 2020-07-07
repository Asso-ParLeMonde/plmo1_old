import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 20 })
  public token: string;

  @CreateDateColumn()
  public date: Date;
}
