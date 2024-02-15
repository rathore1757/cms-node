import CartModel from "../../models/CartModel.js";
import { Op, literal } from "sequelize";
import dbConnection from "../../config/dbConfig.js";
import ProductModel from "../../models/ProductModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import axios from "axios";

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

async function fetcCity(countryCode, stateCode) {
  try {
    const response = await axios.get(
      `http://api.geonames.org/searchJSON?country=${countryCode}&adminCode1=${stateCode}&maxRows=1000&username=prabhat926`
    );
    const { geonames } = response.data;

    // Extract city names
    const cities = geonames.map((city) => city.name);
    console.log(cities, "cccccccccccccccccc");
  } catch (err) {
    console.log(err, "Errrrrrrrrrrrrrrr");
    // return res.status(500).json({ message: err?.message });
  }
}
fetcCity("india", "delhi");
class BlogServices {
  async addBlog(req, res) {
    try {
      // let findCity=await
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BlogServicesObj = new BlogServices();
export default BlogServicesObj;
