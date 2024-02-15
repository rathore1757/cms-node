import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const UserModel = dbConnection.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
    },
    password: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    provider: {
      type: DataTypes.STRING,
    },
    provider_id: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    remember_token: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "IN",
    },
  },
  { timestamps: false, tableName: "users" }
);

export default UserModel;
