import CartModel from "../../models/CartModel.js";
import { Op, literal } from "sequelize";
import dbConnection from "../../config/dbConfig.js";
import axios from "axios";
import CityModel from "../../models/CityModel.js";
import BlogModel from "../../models/blogModel.js";
import { ChatGPTAPI } from "chatgpt";
import OpenAI from "openai";
import cron from "node-cron";
import BlogKeyword from "../../models/blogKeywordsModel.js";
import CityArea from "../../models/CityAreasModel.js";

const openai = new OpenAI({
  apiKey: "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",
});

let task;

const startCronJob = () => {
  task = cron.schedule("* * * * *", async (req) => {
    await generateDataAndSaveCityForCronJob();
  });
};
const stopCronJob = () => {
  if (task) {
    task.stop();
  }
};
const generateDataAndSaveCityForCronJob = async () => {
  try {
    const blogKeywords = await BlogKeyword.findAll({ raw: true });

    if (!blogKeywords) {
      console.log("no blog data");
      return;
    }
    const processCityData = async (index) => {
      if (index < blogKeywords.length) {
        let title = blogKeywords[index]?.keyword;
        let slug = blogKeywords[index]?.slug;
        if (blogKeywords[index]?.is_data_generated == 0) {
          const datafromgpt = await getDataFromGpt(title);
          if (datafromgpt) {
            BlogModel.create({
              title: title,
              slug: slug,
              content: datafromgpt?.content,
              description: datafromgpt?.description,
              meta_tag: datafromgpt?.metaTags,
              meta_description: datafromgpt?.metaDescription,
              status: "active",
              is_data_generated: 1,
            })
              .then(async (responseSave) => {
                await BlogKeyword.update(
                  { is_data_generated: true },
                  { where: { id: blogKeywords[index]?.id } }
                );
                setTimeout(() => {
                  processCityData(index + 1); // Process next city after delay
                }, 60000);
                console.log("data saved");
              })
              .catch((errorSave) => {
                processCityData(index);
              });
          }
        } else {
          console.log("data exist");
          processCityData(index + 1); // Process next city after delay
        }
      } else {
        blogData.is_data_generated = 1;
        await blogData.save();
      }
    };
    // Start processing city data from index 0
    await processCityData(0);
  } catch (err) {
    console.log(err);
  }
};
// const generateDataAndSaveCityForCronJob = async () => {
//   try {
//     const cityData = await CityModel.findAll({ raw: true });
//     const blogData = await BlogModel.findOne({
//       where: { is_data_generated: 0 },
//     });
//     let i = 0;
//     while (i < cityData.length) {
//       setTimeout(() => {
//         let title = `${blogData?.dataValues?.title} in ${cityData[i]?.city}`;
//         const tempStr = `on keyword ${title} can you give me content , description, meta tags and meta description in json object in this format {
//               "content":"","description":"","metaTags":"","metaDescription":""
//             } example reference ${blogData?.dataValues}`;
//         const datafromgpt = getDataFromGpt(tempStr);
//         console.log(datafromgpt);
//         i++;
//       }, 30000);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

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
    console.error(
      "Error processing OpenAI API request:",
      error?.message,
      "asaaaaaaaaaaaaaaaaaaa"
    );
    throw error;
  }
}
// getChatGPTResponse("tell me javascript ");
// async function getDataFromGpt(message) {
//   try {
//     const apiUrl = "https://api.openai.com/v1/chat/completions";
//     // const apiUrl = "https://api.openai.com/v1/completions";
//     // const apiKey = "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"; // Replace with your actual API key
//     // const apiKey = "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"; //3.5 actual API key
//     // const apiKey = "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"; //4 Replace with your actual API key
//     const apiKey = "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";
//     // Assuming these are your parameters
//     // 0.5 ==ordinarry ,0.8 extraordinary 0.1=minimal
//     const prompt = message;
//     const creativityLevel = 0.1; // Example creativity level
//     const maxTokens = 500; // Example max tokens

//     const requestData = {
//       // model: "gpt-3.5-turbo-instruct", // Replace with your default model
//       model: "gpt-3.5-turbo", // Replace with your default model
//       // model: "gpt-4", // Replace with your default model
//       prompt: prompt,
//       temperature: creativityLevel,
//       max_tokens: maxTokens,
//     };

//     const axiosConfig = {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//     };
//     let get = await axios.post(apiUrl, requestData, axiosConfig);
//     // console.log(get?.data?.choices[0]?.text, "Getttttttttttttttttt");
//     return get?.data?.choices[0]?.text;
//   } catch (er) {
//     console.log(er?.message, "Eroororororor");
//     // return res
//     //   .status(500)
//     //   .json({ message: er?.message, statusCode: 500, success: false });
//   }
// }

async function getDataFromGpt(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: `give content description meta tags and meta description in the json format {
          "content":"","description":"","metaTags":"","metaDescription":""
        } on topic ${message}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (response?.choices[0]?.message?.content) {
      return JSON.parse(response?.choices[0]?.message?.content);
    } else {
      return null;
    }
  } catch (er) {
    console.log(er, "Eroororororor");
    return null;
    // return res
    //   .status(500)
    //   .json({ message: er?.message, statusCode: 500, success: false });
  }
}
// getDataFromGpt("blockchain developer");

class BlogServices {
  async addBlog(req, res) {
    try {
      let title = req.body.title;

      // let findCity = await CityModel.findAll({ raw: true });
      // for (let i = 0; i < findCity.length; i++) {
      // let tempStr = `on keyword ${title} can you give me content , description, meta tags and meta description in json object in this format {
      //   "content":"","description":"","metaTags":"","metaDescription":""
      // }`;
      // console.log(tempStr, "tempstrrrrrrrrr");
      let get = await getDataFromGpt(title);
      console.log(get, "getgegetet");
      let tempObject = JSON.parse(get);
      console.log(tempObject, "temppppppppppppppppppppppppp");
      let slug = `${title.trim().split(" ").join("-")}`;

      let obj = {
        title: title,
        slug: slug,
        content: tempObject?.content,
        description: tempObject?.description,
        meta_tag: tempObject?.metaTags.split(","),
        meta_description: tempObject?.metaDescription,
      };
      console.log(obj, "Gettttttttttttttt");
      let findData = await BlogModel.findOne({ where: { slug }, raw: true });
      if (findData) {
        return res.status(200).json({
          message: "Data is exist",
          statusCode: 200,
          success: true,
        });
      } else {
        await BlogModel.create(obj);
        return res.status(201).json({
          message: "add",
          statusCode: 201,
          success: true,
        });
      }
      // let time = Math.round(Math.random() * 10000);
      // await new Promise((resolve) => setTimeout(resolve, time));
      // }
      //implement logic for fetching data from chatgpt and save the response in db
    } catch (err) {
      console.log(err, "errrr");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async generateContent(req, res) {
    try {
      let title = req.body.title;
      if (!title || title == null || title == undefined) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }
      // let findCity = await CityModel.findAll({ raw: true });
      // for (let i = 0; i < findCity.length; i++) {
      // let tempStr = `on keyword ${title} can you give me data in json format like this {
      //   "content":"","description":"","metaTags":"","metaDescription":""
      // } with content , description , meta tags and meta description`;
      // console.log(tempStr, "tempstrrrrrrrrr");
      let get = await getDataFromGpt(title);
      console.log(get, "getgegetet");
      // let tempObject = JSON.parse(get);
      let tempObject = get;
      console.log(tempObject, "temppppppppppppppppppppppppp");
      let slug = `${title.trim().split(" ").join("-")}`;

      let obj = {
        title: title,
        slug: slug,
        content: tempObject?.content,
        description: tempObject?.description,
        meta_tag: tempObject?.metaTags,
        meta_description: tempObject?.metaDescription,
      };
      console.log(obj, "Gettttttttttttttt");

      return res.status(201).json({
        message: "generated data",
        data: obj,
        statusCode: 201,
        success: true,
      });
    } catch (err) {
      console.log(err, "errrr");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async saveContent(req, res) {
    try {
      let { title, slug, content, description, meta_tag, meta_description } =
        req.body;
      let obj = {
        title: title,
        slug: slug,
        content: content,
        description: description,
        meta_tag: meta_tag.split(","),
        meta_description: meta_description,
      };

      let findData = await BlogModel.findOne({ where: { slug }, raw: true });
      if (findData) {
        return res.status(200).json({
          message: "Data already exists",
          statusCode: 200,
          success: true,
        });
      } else {
        await BlogModel.create(obj);
        return res.status(201).json({
          message: "Data added",
          statusCode: 201,
          success: true,
        });
      }
    } catch (err) {
      console.log(err, "errrr");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async generateAndSaveDataForCities(req, res) {
    try {
      startCronJob();
      return res
        .status(200)
        .json({ success: true, message: "Data generated and saved" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error?.message });
    }
  }
  // async addBlog(req, res) {
  //   try {
  //     let title = req.body.title;

  //     let findCity = await CityModel.findAll({ raw: true });
  //     let arr = [];
  //     for (let i = 0; i < findCity.length; i++) {
  //       arr.push(`${title} in ${findCity[i]?.city}`);
  //     }
  //     // console.log(arr);

  //     // for (let i = 0; i < findCity.length; i++) {
  //     let tempStr = `give me content, description, meta tags, and meta description in array of object form using the titles that are inside this array ${arr}`;
  //     // console.log(tempStr, "tempstrrrrrrrrr");
  //     let get = await getDataFromGpt(tempStr);
  //     // let tempObject = JSON.parse(get);
  //     // let slug = `${title
  //     //   .trim()
  //     //   .split(" ")
  //     //   .join("-")}-in-${findCity[i]?.city}`;

  //     // let obj = {
  //     //   title: `${title} in ${findCity[i]?.city}`,
  //     //   slug: slug,
  //     //   content: tempObject?.content,
  //     //   description: tempObject?.description,
  //     //   meta_tag: [`${tempObject?.metaTags}`],
  //     //   meta_description: tempObject?.metaDescription,
  //     // };
  //     // console.log(obj, "Gettttttttttttttt");
  //     // await BlogModel.create(obj);
  //     // let time = Math.round(Math.random() * 100000);
  //     // await new Promise((resolve) => setTimeout(resolve, time));
  //     // }
  //     //implement logic for fetching data from chatgpt and save the response in db
  //     console.log(get);
  //     return res.status(200).json({
  //       message: "fetch",
  //       data: findCity,
  //       statusCode: 200,
  //       success: true,
  //     });
  //   } catch (err) {
  //     console.log(err, "errrr");
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }

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
      let find = await BlogModel.findAll({
        raw: true,
        order: [["id", "DESC"]],
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
      slug = slug?.trim()?.toLowerCase()?.replace(/\s+/g, "-");
      let findObj = await BlogModel.findOne({ where: { id }, raw: true });
      if (!findObj) {
        return res
          .status(400)
          .json({ message: "Data not found", statusCode: 400, success: false });
      } else if (findObj && findObj?.status != "active") {
        return res.status(400).json({
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
  async fetchCityData(req, res) {
    try {
      let get = await CityModel.findAll({ raw: true });
      return res
        .status(200)
        .json({ message: "fetch", data: get, statusCode: 400, success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async saveKeywords(req, res) {
    try {
      const { title } = req.body;
      if (!title || title == null || title == undefined) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }
      const cityData = await CityModel.findAll({ raw: true });
      const keywords = [];
      cityData.forEach((val) => {
        let dataObj = {};
        let keyword = `${title} in ${val?.city}`;
        dataObj.keyword = keyword;
        dataObj.slug = keyword.split(" ").join("-");
        keywords.push(dataObj);
      });
      await BlogKeyword.bulkCreate(keywords);
      return res.status(201).json({ success: true, message: "Data saved" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async getBlogBySlug(req, res) {
    try {
      let { slug } = req.params;
      if (!slug || slug == undefined || slug == null || slug.trim() == "") {
        return res
          .status(400)
          .json({ success: false, message: "Slug is required" });
      }
      const blogBySlug = await BlogModel.findOne({ where: { slug: slug } });
      if (blogBySlug) {
        return res
          .status(200)
          .json({ success: true, message: "Data fetched", data: blogBySlug });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Data not found" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async fetchActiveCities(req, res) {
    try {
      const { slug } = req.params;
      if (!slug || slug == null || slug == undefined || slug.trim() == "") {
        return res
          .status(400)
          .json({ success: false, message: "Slug is required" });
      }
      const activeDataByCities = await BlogKeyword.findAll({
        where: { is_data_generated: true },
      });
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: [],
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async fetchAreasByCity(req, res) {
    try {
      const { id } = req.params;
      let get = await CityArea.findAll(
        { where: { city_id: id } },
        { raw: true }
      );
      return res
        .status(200)
        .json({ message: "fetch", data: get, success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BlogServicesObj = new BlogServices();
export default BlogServicesObj;
