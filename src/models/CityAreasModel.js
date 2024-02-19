import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const CityArea = dbConnection.define(
  "CityArea",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: dbConnection.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      onUpdate: dbConnection.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "city_areas", // Specify the table name if different from model name
    // Sequelize will manage createdAt and updatedAt columns
    underscored: true, // Use snake_case for column names
  }
);
export default CityArea;
