import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { User, UserType } from "../entities/user";
import { Controller, del, get, post, put } from "./controller";
import { School } from "../entities/school";
import { Invite } from "../entities/invite";
import { isPasswordValid, generateTemporaryPassword } from "../utils/utils";
import { sendMail, Email } from "../emails";

const secret: string = process.env.APP_SECRET || "";

function updateUser(user: User, req: Request): void {
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

  @get({ path: "/test-pseudo/:pseudo" })
  public async getUserByPseudo(req: Request, res: Response): Promise<void> {
    const nbUser: number = await getRepository(User).count({ where: { pseudo: req.params.pseudo || "" } });
    res.sendJSON({ available: nbUser === 0 });
  }

  @post()
  public async addUser(req: Request, res: Response): Promise<void> {
    const password = req.body.password;
    if (password && !isPasswordValid(password)) {
      throw new Error("Invalid password");
    }

    const fromAdmin = req.user !== undefined && req.user.type === UserType.PLMO_ADMIN;
    if (!fromAdmin && req.body.inviteCode === undefined) {
      throw new Error("No invite code was provided.");
    } else if (!fromAdmin) {
      const inviteCode: string = req.body.inviteCode || "";
      const isValid: boolean = (await getRepository(Invite).count({ where: { token: inviteCode } })) > 0;
      if (!isValid) {
        throw new Error("Invite code provided is invalid.");
      } else {
        await getRepository(Invite).delete({ token: inviteCode });
      }
    }

    const user: User = new User();
    updateUser(user, req);
    user.passwordHash = await argon2.hash(password || generateTemporaryPassword(12));
    user.type = 0; // type class per default

    if (fromAdmin) {
      if (req.body.type !== undefined) {
        user.type = req.body.type;
      }
      const initEmailPassword = generateTemporaryPassword(12);
      user.verificationHash = await argon2.hash(initEmailPassword);
      // Uncomment next line to block account on registration before email is not verified
      // user.accountRegistration = 3;
      await sendMail(Email.INVITATION_EMAIL, user.mail, { initCode: initEmailPassword, firstname: user.managerFirstName, lastname: user.managerLastName }, user.languageCode);
    }

    // new user and not admin
    // if (req.user === undefined && user.mail !== undefined && user.mail.length > 0) {
    //   const verifyEmailPassword = generateTemporaryPassword(12);
    //   user.verificationHash = await argon2.hash(verifyEmailPassword);
    //   // Uncomment next line to block account on registration before email is not verified
    //   // user.accountRegistration = 3;
    //   await sendMail(Email.VERIFY_EMAIL, user.mail, { verifyCode: verifyEmailPassword, firstname: user.managerFirstName, lastname: user.managerLastName }, user.languageCode);
    // }

    // save user
    await getRepository(User).save(user);

    const accessToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    res.sendJSON({ user: user.userWithoutPassword(), accessToken }); // send user
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
    updateUser(user, req);
    await getRepository(User).save(user);
    res.sendJSON(user.userWithoutPassword()); // send updated user
  }

  @del({ path: "/:id", userType: UserType.PLMO_ADMIN })
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(User).delete(id);
    res.status(204).send();
  }

  @get({ path: "/invite", userType: UserType.PLMO_ADMIN })
  public async getInviteCode(_: Request, res: Response): Promise<void> {
    const invite = new Invite();
    invite.token = generateTemporaryPassword(20);
    await getRepository(Invite).save(invite);
    res.sendJSON({ inviteCode: invite.token });
  }

  @get({ path: "/check-invite/:inviteCode" })
  public async isInviteCodeValid(req: Request, res: Response): Promise<void> {
    const inviteCode: string = req.params.inviteCode || "";
    const isValid: boolean = (await getRepository(Invite).count({ where: { token: inviteCode } })) > 0;
    res.sendJSON({ isValid });
  }
}
