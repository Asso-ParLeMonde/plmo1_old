import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/user";
import { Controller, del, get, post, put } from "./controller";
import { School } from "../entities/school";

import * as argon2 from "argon2";

export class UserController extends Controller {
  constructor() {
    super("users");
  }

  @get()
  public async getUsers(_: Request, res: Response): Promise<void> {
    const users: User[] = await getRepository(User).find();
    res.sendJSON(users);
  }

  @get({ path: "/:id" })
  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const user: User | undefined = await getRepository(User).findOne(id);
    if (user === undefined) {
      next(); // will send 404 error
      return;
    }
    res.sendJSON(user);
  }

  @post()
  public async addUser(req: Request, res: Response): Promise<void> {
    const user: User = new User(); // create a new user
    user.managerFirstName = req.body.managerFirstName;
    user.managerLastName = req.body.managerLastName;
    user.mail = req.body.mail;
    user.type = req.body.type;
    user.level = req.body.level;
    user.name = req.body.name;
    user.languageCode = req.body.languageCode;
    if (req.body.schoolId && req.body.schoolId > 0) {
      user.school = new School();
      user.school.id = req.body.schoolId;
    }
    user.passwordHash = await argon2.hash(req.body.password);
    await getRepository(User).save(user); // save new user
    res.sendJSON(user); // send new user
  }

  @put({ path: "/:id" })
  public async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const user: User | undefined = await getRepository(User).findOne(id);
    if (user === undefined) {
      next();
      return;
    }
    if (req.body.managerFirstName) user.managerFirstName = req.body.managerFirstName;
    if (req.body.managerLastName) user.managerLastName = req.body.managerLastName;
    if (req.body.mail) user.mail = req.body.mail;
    if (req.body.type) user.type = req.body.type;
    if (req.body.level) user.level = req.body.level;
    if (req.body.name) user.name = req.body.name;
    if (req.body.languageCode) user.languageCode = req.body.languageCode;
    if (req.body.schoolId && req.body.schoolId > 0) {
      user.school = new School();
      user.school.id = req.body.schoolId;
    }
    await getRepository(User).save(user);
    res.sendJSON(user); // send updated user
  }

  @del({ path: "/:id" })
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(User).delete(id);
    res.status(204).send();
  }
}