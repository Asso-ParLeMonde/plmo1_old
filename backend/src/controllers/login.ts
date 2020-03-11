import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entities/user";
import { Controller, post } from "./controller";

import * as argon2 from "argon2";

export class LoginController extends Controller {
  constructor() {
    super("login");
  }
  @post()
  public async login(req: Request, res: Response): Promise<void> {
    const password = req.body.password;
    const username = req.body.username;
    const users = await getRepository(User).find({
      where: [{ mail: username }, { pseudo: username }],
    });
    if (users.length === 0) {
      throw new Error("Invalid username");
    }
    const user = users[0];
    try {
      if (!(await argon2.verify(user.passwordHash, password))) {
        throw new Error("Invalid password");
      }
    } catch (e) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ userId: user.id }, "maclefsecrete", { expiresIn: "1h" });
    res.sendJSON({ user: user.userWithoutPassword(), token: token }); // send new user
  }
}
