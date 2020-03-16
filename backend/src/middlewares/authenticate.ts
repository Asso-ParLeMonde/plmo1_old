import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  let token: string = getHeader(req, "x-access-token") || getHeader(req, "authorization") || "";
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (secret.length === 0) {
    res.status(401).send("invalid access token");
    return;
  }

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
    console.log("userid: ", data.userId);
  } catch (_e) {
    res.status(401).send("invalid access token");
    return;
  }
  next();
}
