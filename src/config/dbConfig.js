// // const Sequelize = require("sequelize");
// const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv");
// dotenv.config();
import { Sequelize } from "sequelize";
import { environmentVars } from "./environmentVar.js";
// console.log(environmentVars)
const dbConnection = new Sequelize(
  environmentVars.dbName,
  environmentVars.dbUser,
  environmentVars.dbPass,
  {
    host: environmentVars.host,
    port: environmentVars.dbPort,
    dialect: "mysql",
    dialectOptions: {
      socketPath: environmentVars.socketPath,
    },
    pool: {
      max: 15,
      min: 0,
      maxIdleTime: 1000,
      acquire: 30000000,
      idle: 100000000,
    },
    logging: false,
  }

);

export default dbConnection;
