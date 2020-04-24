import { Request, Response } from "express";
import { Controller, get } from "./controller";
import { getRepository, createQueryBuilder } from "typeorm";
import { PDFDownload } from "../entities/pdfDownload";
import { User, UserType } from "../entities/user";
import { School } from "../entities/school";
import { Project } from "../entities/project";

interface Data {
  label: string;
  nb: string;
}

interface ReformatDataObject {
  [key: string]: number;
}

function reformatDateLabels(data: Data[]): Data[] {
  const reformatDataObject: ReformatDataObject = {};

  data.forEach(d => {
    const date = d.label.toString().slice(0, 10);
    if (reformatDataObject[date]) {
      reformatDataObject[date] += parseInt(d.nb);
    } else {
      reformatDataObject[date] = parseInt(d.nb);
    }
  });

  const datesKeys = Object.keys(reformatDataObject);

  const reformatDataResult: Data[] = [];

  datesKeys.forEach(dk => {
    reformatDataResult.push({ label: dk, nb: reformatDataObject[dk].toString() });
  });

  return reformatDataResult;
}

export class StatisticsController extends Controller {
  constructor() {
    super("statistics");
  }

  @get({ path: "/basics", userType: UserType.ADMIN })
  public async getBasicsStatistics(_req: Request, res: Response): Promise<void> {
    const classNb = await getRepository(User).count({ where: [{ type: UserType.CLASS }] });

    const countries = await createQueryBuilder()
      .select("DISTINCT country")
      .from(School, "school")
      .getRawMany();
    const countriesNb = countries.length;

    const projectsNb = await getRepository(Project).count();
    const pdfsNb = await getRepository(PDFDownload).count();

    res.sendJSON({ classNb, countriesNb, projectsNb, pdfsNb });
  }

  @get({ path: "/projects", userType: UserType.ADMIN })
  public async getProjectStatistiques(_req: Request, res: Response): Promise<void> {
    const projectsNb = await getRepository(Project).count();
    res.sendJSON(projectsNb);
  }

  @get({ path: "/projects/repartition", userType: UserType.ADMIN })
  public async getProjectsRepartitionStatistiques(_req: Request, res: Response): Promise<void> {
    const projectsRepartition = await getRepository(Project)
      .createQueryBuilder("project")
      .select("project.date AS label")
      .addSelect("COUNT(*) AS nb")
      .groupBy("project.date")
      .getRawMany();

    const response = reformatDateLabels(projectsRepartition);
    res.sendJSON(response);
  }

  @get({ path: "/PDFs", userType: UserType.ADMIN })
  public async getPDFStatistiques(_req: Request, res: Response): Promise<void> {
    const pdfsNb = await getRepository(PDFDownload).count();
    res.sendJSON(pdfsNb);
  }

  @get({ path: "/PDFs/repartition", userType: UserType.ADMIN })
  public async getPDFsRepartitionStatistiques(_req: Request, res: Response): Promise<void> {
    const pdfRepartition = await getRepository(PDFDownload)
      .createQueryBuilder("pdfDownload")
      .select("pdfDownload.date AS label")
      .addSelect("COUNT(*) AS nb")
      .groupBy("pdfDownload.date")
      .getRawMany();

    const response = reformatDateLabels(pdfRepartition);
    res.sendJSON(response);
  }

  @get({ path: "/classrooms", userType: UserType.ADMIN })
  public async getClassroomStatistiques(_req: Request, res: Response): Promise<void> {
    const classNb = await getRepository(User).count({ where: [{ type: UserType.CLASS }] });
    res.sendJSON({ classNb });
  }

  @get({ path: "/classrooms/repartition", userType: UserType.ADMIN })
  public async getClassroomRepartitionStatistiques(_req: Request, res: Response): Promise<void> {
    const classRepartition = await getRepository(User)
      .createQueryBuilder("user")
      .select("user.level AS label")
      .addSelect("COUNT(*) AS nb")
      .groupBy("user.level")
      .getRawMany();
    res.sendJSON(classRepartition);
  }

  @get({ path: "/countries", userType: UserType.ADMIN })
  public async getCountryStatistiques(_req: Request, res: Response): Promise<void> {
    const countries = await createQueryBuilder()
      .select("DISTINCT country")
      .from(School, "school")
      .getRawMany();
    const countriesNb = countries.length;

    res.sendJSON({ countriesNb });
  }

  @get({ path: "/countries/repartition", userType: UserType.ADMIN })
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
