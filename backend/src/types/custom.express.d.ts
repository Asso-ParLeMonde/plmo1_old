// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from "express-serve-static-core";
import { Image } from "../entities/image";

declare module "express-serve-static-core" {
  interface Request {
    imageID: number | undefined;
    image: Image | undefined;
  }
  interface Response {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendJSON: (object: any) => void;
  }
}
