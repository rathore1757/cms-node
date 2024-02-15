import {
  ImageFileCheck,
  ImageFileCheckForUI,
} from "../../helpers/validateImageFile.js";
import { uiSectionSchema } from "../../helpers/validateUiSections.js";
import UISectionServicesObj from "../../services/admin/UISectionServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class AdminUISectionController {
  async getLandingPageData(req, res) {
    UISectionServicesObj.getLandingPageData(res);
  }

  async get_ui_section(req, res) {
    UISectionServicesObj.get_ui_section_data(req, res);
  }
  
  // async getSectionInfoByCategory(req, res) {
  //   UISectionServicesObj.getSectionInfoByCategory(res);
  // }
  async addUISections(req, res) {
    const {
      // module_name,
      slug,
      module_heading,
      title,
      position,
      module_description,
      status,
      remarks,
    } = req.body;
    let bodyObj = {
      // module_name: module_name,
      slug: slug,
      module_heading: module_heading,
      title: title,
      position,
      module_description: module_description,
      status: status,
      image: req?.file?.filename,
      remarks: remarks,
    };
    let { error } = uiSectionSchema.validate(bodyObj, options);
    // console.log(req,"EEEEEEEEEEEEEEEEEEE")
    if (req.file && req?.file?.filename) {
      bodyObj.imageData = req.file;
      let name = req.file?.filename;
      let size = req.file?.size;

      let get = await ImageFileCheckForUI(name, res, size);
      // console.log(get,"ggggggggggggggggggggggg")
      if (get == "invalid file") {
        return res.status(400).json({
          message:
            "Image must be png or jpeg file and size must be less than 500 kb",
          statusCode: 400,
          success: false,
        });
      }
    }
    // else {
    //   return res.status(400).json({
    //     message: "Image is mandatory",
    //     success: false,
    //   });
    // }
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0]?.message, success: false });
    }
    UISectionServicesObj.addUISections(bodyObj, res);
  }
}
const AdminUISectionControllerObj = new AdminUISectionController();
export default AdminUISectionControllerObj;
