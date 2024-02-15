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
}

const BlogControllerObj = new BlogController();
export default BlogControllerObj;
