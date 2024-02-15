import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const CityModel = dbConnection.define(
  "city",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    iso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Lat: {
      type: DataTypes.INTEGER,
    },
    Long: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false, tableName: "city" }
);

export default CityModel;
