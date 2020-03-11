import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 50 })
  public managerLastName: string;

  @Column({ type: "varchar", length: 50 })
  public managerFirstName: string;

  @Column({ type: "varchar", length: 150 })
  public managerEmail: string;

  @Column({ type: "varchar", length: 50 })
  public name: string;

  @Column({ type: "varchar", length: 50 })
  public street: string;

  @Column({ type: "varchar", length: 15 })
  public postalCode: string;

  @Column({ type: "varchar", length: 50 })
  public city: string;

  @Column({ type: "varchar", length: 50 })
  public country: string;

  @OneToMany(
    () => User,
    (user: User) => user.school,
  )
  public users: User[];
}
