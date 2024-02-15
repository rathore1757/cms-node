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
  async fetch_by_slug(req, res) {
    try {
      BlogServicesObj.fetchBYSlug(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async change_status(req, res) {
    try {
      if (req.body.status != "active" && req.body.status != "inactive") {
        return res
          .status(400)
          .json({
            message: "Status must be active or inactive",
            statusCode: 400,
            success: false,
          });
      }
      BlogServicesObj.changeStatus(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async editData(req, res) {
    try {
      BlogServicesObj.editData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async destroyData(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "Id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      BlogServicesObj.destroyData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BlogControllerObj = new BlogController();
export default BlogControllerObj;
