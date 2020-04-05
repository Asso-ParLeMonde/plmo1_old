import { Request, Response } from "express";
import { Controller, get } from "./controller";
import { getRepository, createQueryBuilder } from "typeorm";
import { PDFDownload } from "../entities/pdfDownload";
import { User, UserType } from "../entities/user";
import { School } from "../entities/school";

export class StatisticsController extends Controller {
  constructor() {
    super("statistics");
  }

  @get({ path: "/basics" })
  public async getBasicsStatistics(_req: Request, res: Response): Promise<void> {
    const classNb = await getRepository(User).count({ where: [{ type: UserType.CLASS }] });
    const countriesNb = await createQueryBuilder(School)
      .distinctOn(["country"])
      .getCount();
    const projectsNb = 0;
    const pdfsNb = await getRepository(PDFDownload).count();
    res.sendJSON({ classNb, countriesNb, projectsNb, pdfsNb });
  }

  @get({ path: "/projects" })
  public getProjectStatistiques(_req: Request, res: Response): void {
    res.sendJSON({ projectsNb: 0 });
  }

  @get({ path: "/PDFs" })
  public async getPDFStatistiques(_req: Request, res: Response): Promise<void> {
    const pdfsNb = await getRepository(PDFDownload).count();
    res.sendJSON(pdfsNb);
  }

  @get({ path: "/PDFs/repartition" })
  public async getPDFsRepartitionStatistiques(_req: Request, res: Response): Promise<void> {
    const pdfRepartition = await getRepository(PDFDownload)
      .createQueryBuilder("pdfDownload")
      .select("pdfDownload.date AS label")
      .addSelect("COUNT(*) AS nb")
      .groupBy("pdfDownload.date")
      .getRawMany();
    res.sendJSON(pdfRepartition);
  }

  @get({ path: "/classrooms" })
  public async getClassroomStatistiques(_req: Request, res: Response): Promise<void> {
    const classNb = await getRepository(User).count({ where: [{ type: UserType.CLASS }] });
    res.sendJSON({ classNb });
  }

  @get({ path: "/classrooms/repartition" })
  public async getClassroomRepartitionStatistiques(_req: Request, res: Response): Promise<void> {
    const classRepartition = await getRepository(User)
      .createQueryBuilder("user")
      .select("user.level AS label")
      .addSelect("COUNT(*) AS nb")
      .groupBy("user.level")
      .getRawMany();
    res.sendJSON(classRepartition);
  }

  @get({ path: "/countries" })
  public async getCountryStatistiques(_req: Request, res: Response): Promise<void> {
    const countriesNb = await getRepository(School)
      .createQueryBuilder("school")
      .distinctOn(["school.country"])
      .getCount();

    res.sendJSON({ countriesNb });
  }

  @get({ path: "/countries/repartition" })
  public async getCountryRepartitionStatistiques(_req: Request, res: Response): Promise<void> {
    const countriesRepartition = await getRepository(School)
      .createQueryBuilder("school")
      .select("school.country AS country")
      .addSelect("COUNT(*) AS nb")
      .groupBy("school.country")
      .getRawMany();

    res.sendJSON(countriesRepartition);
  }
}
