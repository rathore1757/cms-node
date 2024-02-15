import express from "express";
import UISectionControllerObj from "../../controllers/admin/AdminUIInnerSectionController.js";
import { uploaduiimage } from "../../helpers/multerForUi.js";
const AdminUIInnerSectionRoutes = express.Router();

AdminUIInnerSectionRoutes.get(
  "/get_data",
  UISectionControllerObj.getAllData
);

AdminUIInnerSectionRoutes.post(
  "/add_ui_inner_sections",
  uploaduiimage.single("ui_image"),
  UISectionControllerObj.addUIInnerSections
);
AdminUIInnerSectionRoutes.post('/add_ui_frame_config',UISectionControllerObj.updateFrameConfig)
AdminUIInnerSectionRoutes.get("/get_ui_frame_config",UISectionControllerObj.getFrameConfig)
export default AdminUIInnerSectionRoutes;
