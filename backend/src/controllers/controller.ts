import { RequestHandler, Router } from "express";
import multer from "multer";
import { handleErrors } from "../middlewares/handleErrors";
import { saveImages } from "../middlewares/saveImages";
import { authenticate } from "../middlewares/authenticate";

/**
 * GET decorator.
 *
 * @param path: path for the get function
 */
export function get({ path, userOnly }: { path?: string; userOnly?: boolean } = { path: "", userOnly: false }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    if (userOnly) {
      target.router.get(path || "", authenticate, handleErrors(method));
    } else {
      target.router.get(path || "", handleErrors(method));
    }
    return propertyDesciptor;
  };
}

/**
 * POST decorator
 *
 * @param path: path for the post function
 */
export function post({ path, userOnly }: { path?: string; userOnly?: boolean } = { path: "", userOnly: false }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    if (userOnly) {
      target.router.post(path || "", authenticate, handleErrors(method));
    } else {
      target.router.post(path || "", handleErrors(method));
    }
    return propertyDesciptor;
  };
}

/**
 * PUT decorator
 *
 * @param path: path for the put function
 */
export function put({ path, userOnly }: { path?: string; userOnly?: boolean } = { path: "", userOnly: false }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    if (userOnly) {
      target.router.put(path || "", authenticate, handleErrors(method));
    } else {
      target.router.put(path || "", handleErrors(method));
    }
    return propertyDesciptor;
  };
}

/**
 * DELETE decorator
 *
 * @param path: path for the put function
 */
export function del({ path, userOnly }: { path?: string; userOnly?: boolean } = { path: "", userOnly: false }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    if (userOnly) {
      target.router.delete(path || "", authenticate, handleErrors(method));
    } else {
      target.router.delete(path || "", handleErrors(method));
    }
    return propertyDesciptor;
  };
}

/**
 * ONE-IMAGE decorator
 *
 * @param path: path for the put function
 * @param name: name of the file from the request
 * @param tableName
 */
export function oneImage({ path, name, tableName }: { path: string; name?: string; tableName: string } = { path: "", tableName: "other" }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    target.router.post(path, upload.single(name || "image"), handleErrors(saveImages(tableName)), handleErrors(method));
    return propertyDesciptor;
  };
}

export abstract class Controller {
  public router: Router;
  public path: string;

  protected constructor(path: string) {
    this.path = path;
  }
}
