import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

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
  console.log(token);
  try {
    const decoded = jwt.verify(token, "maclefsecrete");
    console.log(decoded);
  } catch (e) {
    logger.error(JSON.stringify(e));
    res.status(401).send("invalid access token");
    return;
  }
  next();
}
