import express from "express";
import { authorize } from "../../middlewares/auth.js";
import CartControllerObj from "../../controllers/user/CartController.js";
import BlogControllerObj from "../../controllers/user/BlogController.js";

const BlogRoutes = express.Router();

BlogRoutes.post("/add", BlogControllerObj.add);
BlogRoutes.get("/fetch_active", BlogControllerObj.fetch_active);

//admin
BlogRoutes.get("/fetch_all", BlogControllerObj.fetch_all);
export default BlogRoutes;
