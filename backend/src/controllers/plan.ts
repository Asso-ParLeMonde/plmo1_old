import { Controller, tempImage, oneImage, get, post, put, del } from "./controller";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Plan } from "../entities/plan";
import { UserType } from "../entities/user";
import { Question } from "../entities/question";
import { AppError, ErrorCode } from "../middlewares/handleErrors";
import { Image } from "../entities/image";
import { deleteImage } from "../fileUpload";

export class PlanController extends Controller {
  constructor() {
    super("plans");
  }

  @tempImage({ path: "/temp-image", tableName: "plan", ratio: { width: null, height: 500 } })
  public async uploadTempImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.image === undefined) {
      next();
      return;
    }
    res.sendJSON(req.image);
  }

  @oneImage({ path: "/:id/image", userType: UserType.CLASS, tableName: "plan", ratio: { width: null, height: 500 } })
  public async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.user === undefined || req.image === undefined) {
      next();
      return;
    }

    const id = parseInt(req.params.id || "", 10) || 0;
    const plan: Plan | undefined = await getRepository(Plan).findOne(id, { relations: ["image"] });
    if (plan === undefined) {
      next();
      return;
    }

    // remove previous image
    if (plan.image) {
      await deleteImage(plan.image);
      await getRepository(Image).delete(plan.image.id);
    }

    plan.image = req.image;
    await getRepository(Plan).save(plan);

    plan.url = plan.image.path;
    res.sendJSON(plan);
  }

  @get({ userType: UserType.CLASS })
  public async getUserPlans(req: Request, res: Response): Promise<void> {
    if (req.user === undefined) {
      res.sendJSON([]);
      return;
    }

    const plans: Plan[] = await getRepository(Plan).find({ where: { user: { id: req.user.id } }, relations: ["image"] });
    res.sendJSON(plans);
  }

  @get({ path: "/:id", userType: UserType.CLASS })
  public async getUserPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.user === undefined) {
      next();
      return;
    }

    const id = parseInt(req.params.id || "", 10) || 0;
    const plan: Plan | undefined = await getRepository(Plan).findOne(id, { relations: ["image"] });
    if (plan === undefined) {
      next();
      return;
    }

    res.sendJSON(plan);
  }

  @post({ userType: UserType.CLASS })
  public async addPlan(req: Request, res: Response): Promise<void> {
    const plan = new Plan();
    plan.description = req.body.description || "";
    plan.index = req.body.index || 0;
    plan.question = new Question();
    plan.question.id = req.body.questionId || 0;

    if (plan.question.id === 0) {
      throw new AppError("questionId not provided...", ErrorCode.INVALID_DATA);
    }

    await getRepository(Plan).save(plan);
    res.sendJSON(plan);
  }

  @put({ path: "/:id", userType: UserType.CLASS })
  public async editPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = parseInt(req.params.id || "", 10) || 0;
    const plan: Plan | undefined = await getRepository(Plan).findOne(id);
    if (plan === undefined) {
      next();
      return;
    }

    plan.description = req.body.description || plan.description;
    plan.index = req.body.index !== undefined ? req.body.index : plan.index;

    await getRepository(Plan).save(plan);
    res.sendJSON(plan);
  }

  @del({ path: "/:id", userType: UserType.CLASS })
  public async deletePlan(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id || "", 10) || 0;
    const plan: Plan | undefined = await getRepository(Plan).findOne(id, { relations: ["image"] });
    if (plan !== undefined && plan.image) {
      await deleteImage(plan.image);
      await getRepository(Image).delete(plan.image.id);
    }

    await getRepository(Plan).delete(id);
    res.status(204).send();
  }
}
