import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { getRepository, MoreThan } from "typeorm";
import { User } from "../entities/user";
import { Controller, post } from "./controller";
import { logger } from "../utils/logger";
import { generateTemporaryPassword, isPasswordValid } from "../utils/utils";
import { AppError, ErrorCode } from "../middlewares/handleErrors";
import { sendMail, Email } from "../emails";
import { Token } from "../entities/token";
import { v4 as uuidv4 } from "uuid";

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
    const askForReshreshToken = req.body.getRefreshToken === true;
    const user = await getRepository(User).findOne({
      where: [{ mail: username }, { pseudo: username }],
    });
    if (user === undefined) {
      throw new AppError("Invalid username", ErrorCode.INVALID_USERNAME);
    }

    let isPasswordCorrect: boolean = false;
    try {
      isPasswordCorrect = await argon2.verify(user.passwordHash, password);
    } catch (e) {
      logger.error(JSON.stringify(e));
    }

    if (user.accountRegistration >= 3) {
      throw new AppError("Account blocked. Please reset password", ErrorCode.ACCOUNT_BLOCKED);
    }

    if (!isPasswordCorrect) {
      user.accountRegistration += 1;
      await getRepository(User).save(user);
      throw new AppError("Invalid password", ErrorCode.INVALID_PASSWORD);
    } else {
      user.accountRegistration = 0;
      await getRepository(User).save(user);
    }

    const accessToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

    if (askForReshreshToken) {
      const rToken = uuidv4();
      const refreshToken = new Token();
      refreshToken.token = await argon2.hash(rToken);
      refreshToken.userId = user.id;
      await getRepository(Token).save(refreshToken);
      res.sendJSON({ user: user.userWithoutPassword(), accessToken, refreshToken: `${refreshToken.id}-${rToken}` });
    } else {
      res.sendJSON({ user: user.userWithoutPassword(), accessToken });
    }
  }

  @post({ path: "/reset-password" })
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const mail = req.body.email;
    const user = await getRepository(User).findOne({
      where: { mail },
    });
    if (user === undefined) {
      throw new AppError("Invalid email", ErrorCode.INVALID_USERNAME);
    }

    const temporaryPassword = generateTemporaryPassword(12);
    user.verificationHash = await argon2.hash(temporaryPassword);
    await getRepository(User).save(user);

    // send mail with verification password
    await sendMail(Email.RESET_PASSWORD, user.mail, { resetCode: temporaryPassword });
    res.sendJSON({ success: true });
  }

  @post({ path: "/update-password" })
  public async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (secret.length === 0) {
      next();
      return;
    }
    // get user
    const mail = req.body.email;
    const user = await getRepository(User).findOne({
      where: { mail },
    });
    if (user === undefined) {
      throw new AppError("Invalid email", ErrorCode.INVALID_USERNAME);
    }

    // verify token
    const verifyToken = req.body.verifyToken || "";
    let isverifyTokenCorrect: boolean = false;
    try {
      isverifyTokenCorrect = await argon2.verify(user.verificationHash, verifyToken);
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
    if (!isverifyTokenCorrect) {
      throw new AppError("Invalid reset token", ErrorCode.INVALID_PASSWORD);
    }

    // update password
    const password = req.body.password;
    if (!isPasswordValid(password)) {
      throw new AppError("Invalid password", ErrorCode.PASSWORD_NOT_STRONG);
    }
    user.passwordHash = await argon2.hash(password);
    user.accountRegistration = 0;
    user.verificationHash = "";
    await getRepository(User).save(user);

    // login user
    const accessToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    res.sendJSON({ user: user.userWithoutPassword(), accessToken }); // send new user
  }

  @post({ path: "/verify-email" })
  public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (secret.length === 0) {
      next();
      return;
    }
    // get user
    const mail = req.body.email;
    const user = await getRepository(User).findOne({
      where: { mail },
    });
    if (user === undefined) {
      throw new AppError("Invalid email", ErrorCode.INVALID_USERNAME);
    }

    // verify token
    const verifyToken = req.body.verifyToken || "";
    let isverifyTokenCorrect: boolean = false;
    try {
      isverifyTokenCorrect = await argon2.verify(user.verificationHash, verifyToken);
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
    if (!isverifyTokenCorrect) {
      throw new AppError("Invalid reset token", ErrorCode.INVALID_PASSWORD);
    }

    // save user
    user.accountRegistration = 0;
    user.verificationHash = "";
    await getRepository(User).save(user);

    // login user
    const accessToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    res.sendJSON({ user: user.userWithoutPassword(), accessToken });
  }

  @post({ path: "/token" })
  public async getAccessToken(req: Request, res: Response): Promise<void> {
    if (req.body.refreshToken === undefined || req.body.refreshToken === null || typeof req.body.refreshToken !== "string") {
      throw new AppError("Invalid refresh token", ErrorCode.INVALID_PASSWORD);
    }

    const refreshTokenID: string = req.body.refreshToken.split("-")[0];
    const refreshTokenToken: string = req.body.refreshToken.slice(refreshTokenID.length + 1);
    const expiredDate = new Date(new Date().getTime() - 31536000000); // now minus 1year
    const refreshToken = await getRepository(Token).findOne({
      where: {
        id: parseInt(refreshTokenID, 10) || 0,
        userId: req.body.userId || 0,
        date: MoreThan(expiredDate),
      },
    });

    if (refreshToken === undefined || !(await argon2.verify(refreshToken.token, refreshTokenToken))) {
      throw new AppError("Invalid refresh token", ErrorCode.INVALID_PASSWORD);
    }

    const accessToken = jwt.sign({ userId: refreshToken.userId }, secret, { expiresIn: "1h" });
    res.sendJSON({ accessToken });
  }

  @post({ path: "/token/reject" })
  public async rejectAccessToken(req: Request, res: Response): Promise<void> {
    if (req.body.refreshToken === undefined || req.body.refreshToken === null || typeof req.body.refreshToken !== "string") {
      res.status(204).send();
      return;
    }

    const refreshTokenID: string = req.body.refreshToken.split("-")[0];
    const refreshTokenToken: string = req.body.refreshToken.slice(refreshTokenID.length + 1);
    const refreshToken = await getRepository(Token).findOne({
      where: {
        id: refreshTokenID,
        userId: req.body.userId || 0,
      },
    });

    if (refreshToken === undefined || !(await argon2.verify(refreshToken.token, refreshTokenToken))) {
      res.status(204).send();
      return;
    }

    await getRepository(Token).delete(refreshToken.id);
    res.status(204).send();
  }
}
