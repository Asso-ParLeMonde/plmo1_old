import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { getRepository } from "typeorm";
import { User } from "../entities/user";
import { Controller, post } from "./controller";
import { logger } from "../utils/logger";

const secret: string = process.env.APP_SECRET || "";

export class LoginController extends Controller {
  constructor() {
    super("login");
  }

  @post()
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (secret.length === 0) {
      next();
      return;
    }

    const password = req.body.password;
    const username = req.body.username;
    const users = await getRepository(User).find({
      where: [{ mail: username }, { pseudo: username }],
    });
    if (users.length === 0) {
      throw new Error("Invalid username");
    }
    const user = users[0];
    let isPasswordCorrect: boolean = false;
    try {
      isPasswordCorrect = await argon2.verify(user.passwordHash, password);
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    res.sendJSON({ user: user.userWithoutPassword(), token: token }); // send new user
  }
}
