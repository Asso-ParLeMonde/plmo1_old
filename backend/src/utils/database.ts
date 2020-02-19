import mysql from "mysql";
import path from "path";
import { Connection, createConnection, EntityManager } from "typeorm";
import { logger } from "./logger";
import { sleep } from "./utils";

const dbType: "mariadb" = "mariadb";

const DBConfig = {
  charset: "utf8mb4_unicode_ci",
  database: process.env.DB_DB || "PLMO",
  entities: [path.join(__dirname, "../entities/*.js")],
  extra:
    process.env.DB_TYPE && process.env.DB_TYPE === "postgres"
      ? {
          ssl: true,
        }
      : {},
  host: process.env.DB_HOST,
  logging: true,
  migrations: [path.join(__dirname, "../migration/**/*.js")],
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  subscribers: [path.join(__dirname, "../subscriber/**/*.js")],
  synchronize: true,
  timezone: "utc",
  type: (process.env.DB_TYPE || dbType) as "mariadb" | "postgres" | "mysql",
  username: process.env.DB_USER,
};

function query(q: string, connection: mysql.Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.query(q, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function createSchema(): Promise<void> {
  try {
    const connection = mysql.createConnection({
      charset: "utf8mb4_unicode_ci",
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      timezone: "utc",
      user: process.env.DB_USER,
    });

    await query("CREATE DATABASE IF NOT EXISTS PLMO CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci';", connection);
    logger.info("Database PLMO created!");
  } catch (e) {
    logger.error(e);
  }
}

async function createTranslationSequence(connection: Connection): Promise<void> {
  await connection.transaction(async (manager: EntityManager) => {
    await manager.query(`CREATE SEQUENCE IF NOT EXISTS LABEL_SEQUENCE START WITH 1 INCREMENT BY 1`);
    await manager.query(`CREATE SEQUENCE IF NOT EXISTS SCENARIO_SEQUENCE START WITH 1 INCREMENT BY 1`);
  });
}

export async function connectToDatabase(tries: number = 10): Promise<Connection | null> {
  if (tries === 0) {
    return null;
  }
  let connection: Connection | null = null;
  try {
    connection = await createConnection(DBConfig);
  } catch (e) {
    if ((e.message || "").split(":")[0] === "ER_BAD_DB_ERROR") {
      await createSchema();
    } else {
      logger.info(e);
      logger.info("Could not connect to database. Retry in 10 seconds...");
      await sleep(10000);
    }
    connection = await connectToDatabase(tries - 1);
  }
  if (connection !== null) {
    await createTranslationSequence(connection);
  }
  return connection;
}
