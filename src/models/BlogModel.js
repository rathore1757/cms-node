import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const BlogModel = dbConnection.define(
  "blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    meta_tag: {
      type: DataTypes.STRING,
    },
    meta_description: {
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
  },
  { timestamps: false, tableName: "blog" }
);

export default BlogModel;
