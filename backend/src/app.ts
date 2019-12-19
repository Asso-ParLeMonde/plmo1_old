import { config } from 'dotenv';
config(); // Get environment variables
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response, Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { Connection } from 'typeorm';
import { removeTrailingSlash } from './middlewares/trailingSlash';
import { routes } from './routes/routes';
import { connectToDatabase } from './utils/database';
import { logger } from './utils/logger';
import { normalizePort, onError } from './utils/server';

async function main() {
    const connection: Connection | null = await connectToDatabase();
    if (connection === null) {
        throw new Error('Could not connect to database...');
    }
    logger.info(`Database connection established: ${connection.isConnected}`);

    const app = express();
    app.enable('strict routing');

    /* --- Middlewares --- */
    app.use(helmet());
    app.use(cors());
    app.use(removeTrailingSlash);
    app.use(morgan('dev'));
    app.use(bodyParser.json());

    const backRouter = Router();
    app.use(process.env.IS_HEROKU ? '/back' : '', backRouter);

    /* --- Home --- */
    backRouter.get('/', (_, res: Response) => {
        res.status(200).send('Hello World PLMO1 !');
    });

    /* --- Controllers --- */
    backRouter.use(routes);

    /* --- Public images --- */
    backRouter.use(`/images`, express.static(path.join(__dirname, 'images')));

    /* --- Public videos --- */
    backRouter.use(`/videos`, express.static(path.join(__dirname, 'videos')));

    /* --- 404 Errors --- */
    backRouter.use((_, res: Response) => {
        res.status(404).send('Error 404 - Not found.');
    });

    if (process.env.IS_HEROKU) {
        /* --- frontend --- */
        app.use(express.static(path.join(__dirname, 'public')));
        app.get('*', (_: Request, res: Response) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
        app.use((_, res: Response) => {
            res.status(404).send('Error 404 - Not found.');
        });
    }

    /* --- Start server --- */
    const port = normalizePort(process.env.PORT || '5000');
    const server = app.listen(port);
    server.on('error', onError);
    server.on('listening', () => {
        logger.info(`App listening on port ${port}!`);
    });
}

main().catch((err: Error) => {
    logger.error(err.message);
});
