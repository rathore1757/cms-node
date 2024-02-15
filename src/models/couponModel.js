import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const CouponModel = dbConnection.define(
  "coupons",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("fixed", "percent"),
      allowNull: false,
      defaultValue: "fixed",
    },

    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expired_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    min_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    max_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    limit: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    used: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "IN",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "coupons" }
);

export default CouponModel;
