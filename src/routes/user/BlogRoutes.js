import express from "express";
import { authorize } from "../../middlewares/auth.js";
import CartControllerObj from "../../controllers/user/CartController.js";
import BlogControllerObj from "../../controllers/user/BlogController.js";

const BlogRoutes = express.Router();

BlogRoutes.post("/add", BlogControllerObj.add);
BlogRoutes.get("/fetch_active", BlogControllerObj.fetch_active);
BlogRoutes.get("/fetch_by_slug", BlogControllerObj.fetch_by_slug);

//admin
BlogRoutes.get("/fetch_all", BlogControllerObj.fetch_all);
BlogRoutes.put("/change_status", BlogControllerObj.change_status);
BlogRoutes.put("/edit_data", BlogControllerObj.editData);
BlogRoutes.delete("/destroy", BlogControllerObj.destroyData);


export default BlogRoutes;
