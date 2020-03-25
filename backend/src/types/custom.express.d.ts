// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from "express-serve-static-core";
import { Image } from "../entities/image";
import { User } from "../entities/user";

declare module "express-serve-static-core" {
  interface Request {
    imageID: number | undefined;
    image: Image | undefined;
    user: User | undefined;
  }
  interface Response {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendJSON: (object: any) => void;
  }
}
