import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Image } from "./image";
import { Question } from "./question";

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 2000 })
  public description: string;

  @Column()
  public index: number;

  @OneToOne(() => Image, { onDelete: "SET NULL" })
  @JoinColumn()
  public image: Image | null;

  @ManyToOne(
    () => Question,
    question => question.plans,
    { onDelete: "CASCADE" },
  )
  public question: Question | null;

  public url: string | null;
}
