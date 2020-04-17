import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { School } from "./school";

export enum UserType {
  CLASS = 0,
  ADMIN = 1,
  PLMO_ADMIN = 2,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 10 })
  public languageCode: string;

  @Column({ type: "varchar", length: 50 })
  public managerLastName: string;

  @Column({ type: "varchar", length: 50 })
  public managerFirstName: string;

  @Column({ type: "varchar", length: 150, unique: true })
  public mail: string;

  @Column({ type: "varchar", length: 50, default: "" })
  public level: string;

  @Column({ type: "varchar", length: 50, unique: true })
  public pseudo: string;

  @ManyToOne(
    () => School,
    (school: School) => school.users,
  )
  public school: School;

  @Column({ default: 0 })
  public accountRegistration: number;

  @Column({ type: "varchar", length: 95 })
  public passwordHash: string;

  @Column({ type: "varchar", length: 95, default: "" })
  public verificationHash: string;

  @Column({
    type: "enum",
    enum: UserType,
    default: 0,
  })
  type: UserType;

  public userWithoutPassword(): User {
    delete this.passwordHash;
    delete this.verificationHash;
    delete this.accountRegistration;
    return this;
  }
}
