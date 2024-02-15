import { ImageFileCheckForUI } from "../../helpers/validateImageFile.js";
import UiSection from "../../models/UISectionsModel.js";

class UISectionServices {
  async get_ui_section_data(req, res) {
    let fetchData = await UiSection.findAll({});
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      statusCode: 200,
      data: fetchData,
    });
  }
  async getSectionInfoByCategory(res) {
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      statusCode: 200,
      data: [],
    });
  }
  async addUISections(body, res) {
    const uisectioninfo = await UiSection.findOne({
      where: { position: body.position },
    });
    if (uisectioninfo) {
      UiSection.update(
        {
          // module_name: body.module_name || uisectioninfo.module_name,
          slug: body.slug || uisectioninfo.slug,
          module_heading: body.module_heading || uisectioninfo.module_heading,
          title: body.title || uisectioninfo.title,
          module_description:
            body.module_description || uisectioninfo.module_description,
          image: body.image || uisectioninfo.image,
          status: body.status || uisectioninfo.status,
          remarks: body.remarks || uisectioninfo.remarks,
          position: body.position || uisectioninfo.position,
        },
        { where: { id: uisectioninfo.id } }
      );
      // .then((response) => {
      return res.status(200).json({
        success: true,
        message: "Update Successfully ",
        statusCode: 200,
      });
      // })
      // .catch((error) => {
      //   return res
      //     .status(500)
      //     .json({ success: true, message: error?.message });
      // });
    } else {
      if (body.imageData) {
        let name = body?.imageData?.filename;
        let size=body?.imageData?.size
        let get = await ImageFileCheckForUI(name, res,size);
        // console.log(get,"ggggggggggggggggggggggg")
        if (get == "invalid file") {
          return res.status(400).json({
            message: "Image must be png or jpeg or webp file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      }
      else {
        return res.status(400).json({
          message: "Image is mandatory",
          success: false,
        });
      }
      UiSection.create(body);
      // .then((response) => {
      return res.status(201).json({
        success: true,
        message: "Added Successfully ",
        statusCode: 201,
      });
      // })
      // .catch((error) => {
      //   return res
      //     .status(500)
      //     .json({ success: true, message: error?.message });
      // });
    }
    // return res
    //   .status(201)
    //   .json({ success: true, message: "Added Successfully " });
  }
}
const UISectionServicesObj = new UISectionServices();
export default UISectionServicesObj;
