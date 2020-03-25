import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { UserType, User } from "../entities/user";

const secret: string = process.env.APP_SECRET || "";

function getHeader(req: Request, header: string): string | undefined {
  const headers: string | string[] | undefined = req.headers[header];
  if (typeof headers === "string") {
    return headers;
  } else if (headers !== undefined) {
    return headers[0] || undefined;
  }
  return undefined;
}

export function authenticate(userType: UserType | undefined): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string = getHeader(req, "x-access-token") || getHeader(req, "authorization") || "";
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    if (secret.length === 0) {
      res.status(401).send("invalid access token");
      return;
    }

    // no authentication
    if (userType === undefined && token.length === 0) {
      next();
      return;
    }

    // authenticate
    try {
      const decoded: string | { userId: number; iat: number; exp: number } = jwt.verify(token, secret) as string | { userId: number; iat: number; exp: number };
      let data: { userId: number; iat: number; exp: number };
      if (typeof decoded === "string") {
        try {
          data = JSON.parse(decoded);
        } catch (e) {
          res.status(401).send("invalid access token");
          return;
        }
      } else {
        data = decoded;
      }
      const user = await getRepository(User).findOne(data.userId);
      if (user === undefined && userType !== undefined) {
        res.status(401).send("invalid access token");
        return;
      } // class: 0 < admin: 1 < superAdmin: 2
      if (userType !== undefined && user !== undefined && user.type < userType) {
        res.status(403).send("Forbidden");
        return;
      }
      req.user = user !== undefined ? user.userWithoutPassword() : undefined;
    } catch (_e) {
      res.status(401).send("invalid access token");
      return;
    }
    next();
  };
}
