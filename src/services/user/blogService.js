import CartModel from "../../models/CartModel.js";
import { Op, literal } from "sequelize";
import dbConnection from "../../config/dbConfig.js";
import axios from "axios";
import CityModel from "../../models/CityModel.js";
import BlogModel from "../../models/blogModel.js";

async function getChatGPTResponse(message) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a user" },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHATGPT}`,
        },
      }
    );
    console.log(response, "rrrreeeddcccccccf");
    const choices = response.data.choices;
    const reply = choices[0].message.content;
    return reply;
  } catch (error) {
    console.error("Error processing OpenAI API request:", error);
    throw error;
  }
}

class BlogServices {
  async addBlog(req, res) {
    try {
      let title = req.body.title;

      let slug = title
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\s+/g, "-");

      let findCity = await CityModel.findAll({ raw: true });

      //implement logic for fetching data from chatgpt and save the response in db

      return res.status(200).json({
        message: "fetch",
        data: findCity,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //active
  async fetchBlog(req, res) {
    try {
      let find = await BlogModel.findAll({
        where: { status: "active" },
        raw: true,
      });
      return res.status(200).json({
        message: "fetch",
        data: find,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async fetchBYSlug(req, res) {
    try {
      let get = await BlogModel.findOne({
        where: { slug: req.query.slug },
        raw: true,
      });
      return res.status(400).json({
        message: "fetched data",
        statusCode: 200,
        success: true,
        data: get,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //admin
  async fetchAllBlog(req, res) {
    try {
      let find = await BlogModel.findAll({ raw: true });
      return res.status(200).json({
        message: "fetch",
        data: find,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async changeStatus(req, res) {
    try {
      let { id, status } = req.body;
      let findData = await BlogModel.findOne({ where: { id: id }, raw: true });
      if (!findData) {
        return res
          .status(400)
          .json({ message: "data not found", statusCode: 400, success: false });
      }
      console.log(findData, "findaatatat");

      await BlogModel.update({ status: status }, { where: { id } });
      return res.status(200).json({
        message: "Data status change successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async editData(req, res) {
    try {
      let {
        id,
        slug,
        title,
        content,
        description,
        meta_tag,
        meta_description,
      } = req.body;
      slug = slug
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\s+/g, "-");
      let findObj = await BlogModel.findOne({ where: { id }, raw: true });
      if (!findObj) {
        return res
          .status(400)
          .json({ message: "Data not found", statusCode: 400, success: false });
      } else if (findObj && findObj?.status != "active") {
        return res
          .status(400)
          .json({
            message: "Data is not active",
            statusCode: 400,
            success: false,
          });
      }
      // console.log(req.body, "req.bodyyyyyyyyyyyyyyy");
      let obj = {
        slug: slug || findObj?.slug,
        title: title || findObj?.title,
        content: content || findObj?.content,
        description: description || findObj?.description,
        meta_tag: meta_tag || findObj?.meta_tag,
        meta_description: meta_description || findObj?.meta_description,
      };
      // console.log(obj, "objectttttttttttttttttttttt");
      await BlogModel.update(obj, { where: { id } });
      return res.status(400).json({
        message: "Data update successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async destroyData(req, res) {
    try {
      let id = req.query.id;
      let findObj = await BlogModel.findOne({ where: { id }, raw: true });
      if (!findObj) {
        return res.status(400).json({
          message: "Data not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
      await BlogModel.destroy({ where: { id } });
      return res.status(200).json({
        message: "Data deleted successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BlogServicesObj = new BlogServices();
export default BlogServicesObj;
