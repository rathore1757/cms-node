import express from "express";
import { authorize } from "../../middlewares/auth.js";
import CartControllerObj from "../../controllers/user/CartController.js";
import BlogControllerObj from "../../controllers/user/BlogController.js";

const BlogRoutes = express.Router();

BlogRoutes.post("/add", BlogControllerObj.add);

export default BlogRoutes;
