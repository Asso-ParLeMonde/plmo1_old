import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { School } from "./school";

export enum Type {
  CLASS = "class",
  ADMIN = "admin",
  PLMO_ADMIN = "plmo_admin",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 2 })
  public languageCode: string;

  @Column({ type: "varchar", length: 50 })
  public managerLastName: string;

  @Column({ type: "varchar", length: 50 })
  public managerFirstName: string;

  @Column({ type: "varchar", length: 150 })
  public mail: string;

  @Column({ type: "varchar", length: 50 })
  public level: string;

  @Column({ type: "varchar", length: 50 })
  public name: string;

  @ManyToOne(
    () => School,
    (school: School) => school.users,
  )
  public school: School;

  /*@Column({ type: "varchar", length: 50 })
  public passwordHash: string;

  @Column({ type: "varchar", length: 50 })
  public verificationHash: string;*/

  @Column({
    type: "enum",
    enum: Type,
    default: "class",
  })
  type: Type;
}
