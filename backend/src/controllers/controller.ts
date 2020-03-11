import { RequestHandler, Router } from "express";
import multer from "multer";
import { handleErrors } from "../middlewares/handleErrors";
import { saveImages } from "../middlewares/saveImages";
import { saveTemporaryImage } from "../middlewares/saveTemporaryImage";

/**
 * GET decorator.
 *
 * @param path: path for the get function
 */
export function get({ path }: { path: string } = { path: "" }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.get(path, handleErrors(method));
    return propertyDesciptor;
  };
}

/**
 * POST decorator
 *
 * @param path: path for the post function
 */
export function post({ path }: { path: string } = { path: "" }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.post(path, handleErrors(method));
    return propertyDesciptor;
  };
}

/**
 * PUT decorator
 *
 * @param path: path for the put function
 */
export function put({ path }: { path: string } = { path: "" }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.put(path, handleErrors(method));
    return propertyDesciptor;
  };
}

/**
 * DELETE decorator
 *
 * @param path: path for the put function
 */
export function del({ path }: { path: string } = { path: "" }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    target.router.delete(path, handleErrors(method));
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

/**
 * TEMPORARY-IMAGE decorator
 *
 * @param path: path for the put function
 * @param name: name of the file from the request
 * @param tableName
 */
export function tempImage({ path, name, tableName }: { path: string; name?: string; tableName: string } = { path: "", tableName: "other" }) {
  return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method: RequestHandler = propertyDesciptor.value;
    if (target.router === undefined) {
      target.router = Router({ mergeParams: true });
    }
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    target.router.post(path, upload.single(name || "image"), handleErrors(saveTemporaryImage(tableName)), handleErrors(method));
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
