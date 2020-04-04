import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PDFDownload {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public date: Date;
}
