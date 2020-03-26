import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from "typeorm";
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

  @OneToOne(() => Image)
  @JoinColumn()
  public image: Image | null;

  @ManyToOne(
    () => Question,
    question => question.plans,
  )
  public question: Question | null;

  public url: string;
}
