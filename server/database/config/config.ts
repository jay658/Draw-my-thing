import dotenv from "dotenv";
import process from "process";
dotenv.config();

type ConfigT = {
  username: string | undefined
  password: string | undefined
  database: string | undefined
  host: string | undefined
  dialect: string
  logging?: boolean,
}

type configObjT = Record<string, ConfigT>

const configObj: configObjT = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "root",
    password: undefined,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
};

export default configObj;
