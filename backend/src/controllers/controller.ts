import { RequestHandler, Router } from "express";
import multer from "multer";
import { handleErrors } from "../middlewares/handleErrors";
import { saveImage, Ratio } from "../middlewares/saveImage";
import { authenticate } from "../middlewares/authenticate";
import { saveTemporaryImage } from "../middlewares/saveTemporaryImage";
import { UserType } from "../entities/user";

type decoratorParams = {
  path?: string;
  userType?: UserType;
};

const defaultParams: decoratorParams = {
  path: "",
  userType: undefined,
};

type imageParams = {
  name?: string;
  tableName?: string;
  ratio?: Ratio;
};

const defaultImageParams: imageParams = {
  name: "image",
  tableName: "other",
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
 * @param tableName: table name for the image
 * @param userType: Authentication type for this request
 * @param ratio: ratio of the image
 */
export function oneImage(data: decoratorParams & imageParams = { ...defaultParams, ...defaultImageParams }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    target.router.post(data.path || "", authenticate(data.userType), upload.single(data.name || "image"), handleErrors(saveImage(data.tableName || "", data.ratio)), handleErrors(method));
    return propertyDesciptor;
  };
}

/**
 * TEMPORARY-IMAGE decorator
 *
 * @param path: path for the put function
 * @param name: name of the file from the request
 * @param tableName: table name for the image
 * @param userType: Authentication type for this request
 * @param userType: Authentication type for this request
 */
export function tempImage(data: decoratorParams & imageParams = { ...defaultParams, ...defaultImageParams }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    target.router.post(data.path || "", authenticate(data.userType), upload.single(data.name || "image"), handleErrors(saveTemporaryImage(data.tableName || "", data.ratio)), handleErrors(method));
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
