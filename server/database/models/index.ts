import { Sequelize } from "sequelize";
import configObj from "../config/config.js";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env: string = process.env.NODE_ENV || "development";

const config:any = configObj[env];

const db:any = {};

let sequelize = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/leetcode_tracker`,
  config
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach(async (file) => {
    const filePath = path.join(__dirname, file);
    const module = await import(/* @vite-ignore */ filePath);
    //@ts-ignore
    const model = module.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
