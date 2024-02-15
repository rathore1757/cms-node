import {
  cartSchema,
  cartSchemaUpdate,
} from "../../helpers/validateCartSchema.js";
import BlogServicesObj from "../../services/user/blogService.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class BlogController {
  async add(req, res) {
    BlogServicesObj.addBlog(req, res);
  }

  async fetch_all(req, res) {
    try {
      BlogServicesObj.fetchAllBlog(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async fetch_active(req, res) {
    try {
      BlogServicesObj.fetchBlog(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BlogControllerObj = new BlogController();
export default BlogControllerObj;
