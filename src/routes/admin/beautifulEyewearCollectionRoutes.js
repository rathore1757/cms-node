import express from "express";
import beautifulEyewearCollectionControllerObj from "../../controllers/admin/beautifulEyewearCollection.js";
import { uploadOfBeautifulCollection } from "../../helpers/multer.js";
import { authorizeAdmin } from "../../middlewares/auth.js";
const BeautifulEyeWearAdminRouter = express.Router();
BeautifulEyeWearAdminRouter.post(
  "/add_beautiful_eyewear",
  authorizeAdmin,
  uploadOfBeautifulCollection.single("collection_img"),
  beautifulEyewearCollectionControllerObj.addBeautifulEyewearCollection
);
BeautifulEyeWearAdminRouter.delete(
  "/delete_beautiful_eyewear/:id",
  authorizeAdmin,
  beautifulEyewearCollectionControllerObj.deleteBeautifulEyewearCollection
);
export default BeautifulEyeWearAdminRouter;
