import { RequestHandler, Router } from "express";
import multer from "multer";
import { handleErrors } from "../middlewares/handleErrors";
import { saveImages } from "../middlewares/saveImages";
import { authenticate } from "../middlewares/authenticate";
import { UserType } from "../entities/user";

type decoratorParams = {
  path?: string;
  userType?: UserType;
};

const defaultParams: decoratorParams = {
  path: "",
  userType: undefined,
};

/**
 * GET decorator.
 *
 * @param path: path for the get function
 * @param userType: Authentication type for this request
 */
export function get({ path, userType }: decoratorParams = defaultParams) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.get(path || "", authenticate(userType), handleErrors(method));
    return propertyDesciptor;
  };
}

/**
 * POST decorator
 *
 * @param path: path for the post function
 * @param userType: Authentication type for this request
 */
export function post({ path, userType }: decoratorParams = defaultParams) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.post(path || "", authenticate(userType), handleErrors(method));
    return propertyDesciptor;
  };
}

/**
 * PUT decorator
 *
 * @param path: path for the put function
 * @param userType: Authentication type for this request
 */
export function put({ path, userType }: decoratorParams = defaultParams) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.put(path || "", authenticate(userType), handleErrors(method));
    return propertyDesciptor;
  };
}

/**
 * DELETE decorator
 *
 * @param path: path for the put function
 * @param userType: Authentication type for this request
 */
export function del({ path, userType }: decoratorParams = defaultParams) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.delete(path || "", authenticate(userType), handleErrors(method));
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
