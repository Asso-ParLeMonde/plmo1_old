import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/user";
import { Controller, del, get, post, put } from "./controller";
import { School } from "../entities/school";
import { isPasswordValid } from "../utils/utils";

import * as argon2 from "argon2";

export class UserController extends Controller {
  constructor() {
    super("users");
  }

  @get({ userOnly: true })
  public async getUsers(_: Request, res: Response): Promise<void> {
    const users: User[] = await getRepository(User).find();
    res.sendJSON(users.map(u => u.userWithoutPassword()));
  }

  @get({ path: "/:id", userOnly: true })
  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const user: User | undefined = await getRepository(User).findOne(id);
    if (user === undefined) {
      next(); // will send 404 error
      return;
    }
    res.sendJSON(user.userWithoutPassword());
  }

  @post()
  public async addUser(req: Request, res: Response): Promise<void> {
    const password = req.body.password;
    if (!isPasswordValid(password)) {
      throw new Error("Invalid password");
    }
    const user: User = new User(); // create a new user
    user.managerFirstName = req.body.managerFirstName;
    user.managerLastName = req.body.managerLastName;
    user.mail = req.body.mail;
    user.type = req.body.type;
    user.level = req.body.level;
    user.pseudo = req.body.pseudo;
    user.languageCode = req.body.languageCode;
    if (req.body.schoolId && req.body.schoolId > 0) {
      user.school = new School();
      user.school.id = req.body.schoolId;
    }
    user.passwordHash = await argon2.hash(req.body.password);
    await getRepository(User).save(user); // save new user
    res.sendJSON(user.userWithoutPassword()); // send new user
  }

  @put({ path: "/:id", userOnly: true })
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
    if (req.body.pseudo) user.pseudo = req.body.pseudo;
    if (req.body.languageCode) user.languageCode = req.body.languageCode;
    if (req.body.schoolId && req.body.schoolId > 0) {
      user.school = new School();
      user.school.id = req.body.schoolId;
    }
    await getRepository(User).save(user);
    res.sendJSON(user.userWithoutPassword()); // send updated user
  }

  @del({ path: "/:id" })
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(User).delete(id);
    res.status(204).send();
  }
}
