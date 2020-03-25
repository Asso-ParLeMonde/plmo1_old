import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { School } from "../entities/school";
import { Controller, del, get, post, put } from "./controller";
import { UserType } from "../entities/user";

export class SchoolController extends Controller {
  constructor() {
    super("schools");
  }

  @get()
  public async getSchools(_: Request, res: Response): Promise<void> {
    const schools: School[] = await getRepository(School).find();
    res.sendJSON(schools);
  }

  @get({ path: "/:id" })
  public async getSchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const school: School | undefined = await getRepository(School).findOne(id);
    if (school === undefined) {
      next(); // will send 404 error
      return;
    }
    res.sendJSON(school);
  }

  @post()
  public async addSchool(req: Request, res: Response): Promise<void> {
    const school: School = new School(); // create a new school
    school.managerFirstName = req.body.managerFirstName;
    school.managerLastName = req.body.managerLastName;
    school.managerEmail = req.body.managerEmail;
    school.name = req.body.name;
    school.street = req.body.street;
    school.postalCode = req.body.postalCode;
    school.city = req.body.city;
    school.country = req.body.country;
    await getRepository(School).save(school); // save new school
    res.sendJSON(school); // send new school
  }

  @put({ path: "/:id", userType: UserType.CLASS })
  public async editSchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const school: School | undefined = await getRepository(School).findOne(id);
    if (school === undefined) {
      next();
      return;
    }
    if (req.body.managerFirstName) school.managerFirstName = req.body.managerFirstName;
    if (req.body.managerLastName) school.managerLastName = req.body.managerLastName;
    if (req.body.managerEmail) school.managerEmail = req.body.managerEmail;
    if (req.body.name) school.name = req.body.name;
    if (req.body.street) school.street = req.body.street;
    if (req.body.postalCode) school.postalCode = req.body.postalCode;
    if (req.body.city) school.city = req.body.city;
    if (req.body.country) school.country = req.body.country;
    await getRepository(School).save(school);
    res.sendJSON(school); // send updated school
  }

  @del({ path: "/:id", userType: UserType.CLASS })
  public async deleteSchool(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(School).delete(id);
    res.status(204).send();
  }
}
