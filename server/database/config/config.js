import dotenv from "dotenv";
import process from "process";
dotenv.config();

const configObj = {
  development: {
    username: process.env.DB_USER || 'root',
    password: null,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: null,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};

export default configObj;
