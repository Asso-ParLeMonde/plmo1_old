import { Request, Response } from "express";
// import { getRepository, getCustomRepository } from "typeorm";
// import { Language } from "../entities/language";
import { Controller, get } from "./controller";
import { getRepository } from "typeorm";
import { PDFDownload } from "../entities/pdfDownload";
import { User, UserType } from "../entities/user";

export class StatisticsController extends Controller {
  constructor() {
    super("statistics");
  }

  @get({ path: "/project" })
  public getProjectStatistiques(_req: Request, res: Response) {
    res.sendJSON({ nbProjects: 0 });
  }

  @get({ path: "/PDF" })
  public async getPDFStatistiques(_req: Request, res: Response) {
    const pdfEntries = await getRepository(PDFDownload).find();
    res.sendJSON(pdfEntries);
  }

  @get({ path: "/classroom" })
  public async getClassroomStatistiques(_req: Request, res: Response) {
    const classNb = await getRepository(User).count({ where: [{ type: UserType.CLASS }, { type: UserType.ADMIN }] });
    res.sendJSON({ classNb });
  }
}
