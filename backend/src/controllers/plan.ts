import { Controller, tempImage } from "./controller";
import { NextFunction, Request, Response } from "express";

export class PlanController extends Controller {
  constructor() {
    super("plans");
  }

  @tempImage({ path: "/image", tableName: "plan" })
  public async uploadTempImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.image === undefined) {
      next();
      return;
    }
    res.sendJSON(req.image);
  }
}
