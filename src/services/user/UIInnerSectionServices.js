import UiInnerSection from "../../models/UIInnerSectionModel.js";

class UIInnerSectionServices {
  async getData(req,res) {
    let fetchData = await UiInnerSection.findAll({
      where: {
        category_id: req.query.category_id,
        sub_category_id: req.query.sub_category_id,
        status: "active",
      },
    });
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      statusCode: 200,
      data: fetchData,
    });
  }
}
const UIInnerSectionServicesObj = new UIInnerSectionServices();
export default UIInnerSectionServicesObj;
