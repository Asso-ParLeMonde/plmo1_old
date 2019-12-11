import { Express } from 'express-serve-static-core';
import { Image } from '../entities/image';

declare module 'express-serve-static-core' {
    // tslint:disable:interface-name
    interface Request {
        imageID: number | undefined;
        image: Image | undefined;
    }
    // tslint:disable:interface-name
    interface Response {
        // tslint:disable-next-line:no-any
        sendJSON: (object: any) => void;
    }
}
