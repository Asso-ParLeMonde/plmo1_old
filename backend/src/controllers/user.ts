import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import * as argon2 from "argon2";
import { User, UserType } from "../entities/user";
import { Controller, del, get, post, put } from "./controller";
import { School } from "../entities/school";
import { isPasswordValid } from "../utils/utils";

async function updateUser(user: User, req: Request): Promise<void> {
  if (req.body.managerFirstName) user.managerFirstName = req.body.managerFirstName;
  if (req.body.managerLastName) user.managerLastName = req.body.managerLastName;
  if (req.body.mail) user.mail = req.body.mail;
  if (req.body.level) user.level = req.body.level;
  if (req.body.pseudo) user.pseudo = req.body.pseudo;
  if (req.body.languageCode) user.languageCode = req.body.languageCode;
  if (req.body.schoolId && req.body.schoolId > 0) {
    user.school = new School();
    user.school.id = req.body.schoolId;
  }
  await getRepository(User).save(user);
}

async function getUser(req: Request): Promise<User | undefined> {
  const id: number = parseInt(req.params.id, 10) || 0;
  if (req.user === undefined || (id !== req.user.id && req.user.type < UserType.PLMO_ADMIN)) {
    return undefined;
  }
  return id === req.user.id ? req.user : await getRepository(User).findOne(id);
}

export class UserController extends Controller {
  constructor() {
    super("users");
  }

  @get({ userType: UserType.PLMO_ADMIN })
  public async getUsers(_: Request, res: Response): Promise<void> {
    const users: User[] = await getRepository(User).find();
    res.sendJSON(users.map(u => u.userWithoutPassword()));
  }

  @get({ path: "/:id", userType: UserType.CLASS })
  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user: User | undefined = await getUser(req);
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
    const user: User = new User();
    user.passwordHash = await argon2.hash(password);
    user.type = 0; // type class per default
    if (req.user !== undefined && req.user.type === UserType.PLMO_ADMIN && req.body.type !== undefined) {
      user.type = req.body.type;
    }
    await updateUser(user, req);
    res.sendJSON(user.userWithoutPassword());
  }

  @put({ path: "/:id", userType: UserType.CLASS })
  public async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user: User | undefined = await getUser(req);
    if (user === undefined) {
      next(); // will send 404 error
      return;
    }
    if (req.user !== undefined && req.user.type === UserType.PLMO_ADMIN && req.body.type !== undefined) {
      user.type = req.body.type;
    }
    await updateUser(user, req);
    res.sendJSON(user.userWithoutPassword()); // send updated user
  }

  @del({ path: "/:id", userType: UserType.PLMO_ADMIN })
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(User).delete(id);
    res.status(204).send();
  }
}
