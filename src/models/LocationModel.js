import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const Location = dbConnection.define(
  "Location",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    office_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pincode: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    taluk: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    district_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "locations", // Make sure this matches your table name exactly
    timestamps: true, // Sequelize will automatically manage createdAt and updatedAt columns
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Location;
