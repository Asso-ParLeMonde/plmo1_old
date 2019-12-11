import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express, { Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { Connection } from 'typeorm';
import { routes } from './routes/routes';
import { connectToDatabase } from './utils/database';
import { logger } from './utils/logger';
import { normalizePort, onError } from './utils/server';

config(); // Get environment variables

async function main() {
    const connection: Connection | null = await connectToDatabase();
    if (connection === null) {
        throw new Error('Could not connect to database...');
    }
    logger.info(`Database connection established: ${connection.isConnected}`);

    const app = express();

    /* --- Middlewares --- */
    app.use(helmet());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.json());

    /* --- Home --- */
    app.get('/', (_, res: Response) => {
        res.status(200).send('Hello World PLMO1 !');
    });

    /* --- Controllers --- */
    app.use(routes);

    /* --- Public images --- */
    app.use('/images', express.static(path.join(__dirname, 'images')));

    /* --- 404 Errors --- */
    app.use((_, res: Response) => {
        res.status(404).send('Error 404 - Not found.');
    });

    /* --- Start server --- */
    const port = normalizePort('5000');
    const server = app.listen(port);
    server.on('error', onError);
    server.on('listening', () => {
        logger.info(`App listening on port ${port}!`);
    });
}

main().catch((err: Error) => {
    logger.error(err.message);
});
