import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const BlogKeyword = dbConnection.define(
  "blog_keyword",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    keyword: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_data_generated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "blog_keywords",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default BlogKeyword;
