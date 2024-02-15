import { uiSectionSchema } from "../../helpers/validateUiSections.js";
import UIInnerSectionServices from "../../services/user/UIInnerSectionServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class UIInnerSectionController {
  async get_data(req, res) {
    if (!req.query.category_id) {
      return res.status(400).json({
        message: "Category id not found",
        success: false,
        statusCode: 400,
      });
    } else if (!req.query.sub_category_id) {
      return res.status(400).json({
        message: "Sub category id not found",
        success: false,
        statusCode: 400,
      });
    }
    UIInnerSectionServices.getData(req, res);
  }
}
const UIInnerSectionControllerObj = new UIInnerSectionController();
export default UIInnerSectionControllerObj;
