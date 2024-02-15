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
    console.log(
      response,
      "rrrreeeeeeeeeeeeedddddddddddssssssssssdddddddddddcccccccccccf"
    );
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
      let findCity = await CityModel.findAll({ raw: true });



      return res
        .status(200)
        .json({
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

  //admin 
  async fetchAllBlog(req, res) {
    try {
      let find = await BlogModel.findAll({ raw: true });
      return res
        .status(200)
        .json({
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

  //active
  async fetchBlog(req, res) {
    try {
      let find = await BlogModel.findAll({ where:{status:"active"}, raw: true });
      return res
        .status(200)
        .json({
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
  
}

const BlogServicesObj = new BlogServices();
export default BlogServicesObj;
