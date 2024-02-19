import express from "express";
import { authorize } from "../../middlewares/auth.js";
import CartControllerObj from "../../controllers/user/CartController.js";
import BlogControllerObj from "../../controllers/user/BlogController.js";

const BlogRoutes = express.Router();

BlogRoutes.post("/add", BlogControllerObj.add);
BlogRoutes.post("/generate_content", BlogControllerObj.generateContent);
BlogRoutes.post("/add_content", BlogControllerObj.saveContent);

BlogRoutes.get("/fetch_active", BlogControllerObj.fetch_active);
BlogRoutes.get("/fetch_by_slug", BlogControllerObj.fetch_by_slug);
BlogRoutes.post("/save_keywords", BlogControllerObj.saveKeywords);
BlogRoutes.post(
  "/generate_data_for_cities",
  BlogControllerObj.generateAndSaveData
);
//admin
BlogRoutes.get("/fetch_all", BlogControllerObj.fetch_all);
BlogRoutes.put("/change_status", BlogControllerObj.change_status);
BlogRoutes.put("/edit_data", BlogControllerObj.editData);
BlogRoutes.delete("/destroy", BlogControllerObj.destroyData);
BlogRoutes.get("/get_blog/:slug", BlogControllerObj.getBlogsBySlug);
//city
BlogRoutes.get("/feth_city", BlogControllerObj.fetchCity);
BlogRoutes.get(
  "/fetch_active_cities/:slug",
  BlogControllerObj.fetchActiveCities
);
BlogRoutes.get("/get_areas_by_city/:id", BlogControllerObj.fetchAreasByCity);
export default BlogRoutes;
