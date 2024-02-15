import axios from "axios";
import UserEducationInfoModel from "../../models/UserEducationInfo.js";
import { removefIle } from "../../helpers/validateImageFile.js";

class EducationInfoService {
  async addData(req, res) {
    try {
      let { full_name, university_name, university_id } = req.body;
      req.body.user_id = req.id;
      if (req.body.id) {
        let get = await UserEducationInfoModel.findOne({
          where: { id: req.body.id, status: "active" },
          raw: true,
        });
        if (!get) {
          return res.status(400).json({
            message: "User education Data not found",
            statusCode: 400,
            success: false,
          });
        }
        let obj = {
          full_name: full_name || get?.full_name,
          university_name: university_name || get?.university_name,
          id_card_img: req.file?.filename || get?.id_card_img,
          university_id: university_id || get?.university_id,
        };
        await UserEducationInfoModel.update(obj, { where: { id: get?.id } });
        return res.status(201).json({
          message: "User education data update successfully",
          statusCode: 201,
          sucess: true,
        });
      } else {
        let obj = {
          full_name: full_name,
          university_id: university_id,
          university_name: university_name,
          user_id: req.id,
        };
        let existCheck = await UserEducationInfoModel.findOne(
          { where: obj },
          { raw: true }
        );
        if (existCheck && existCheck.id) {
          let data = "educationInfo";
          removefIle(req.file?.filename, data);
          return res.status(400).json({
            message: "Data already exist",
            statusCode: 400,
            success: false,
          });
        }
        (obj.id_card_img = req.file?.filename),
          await UserEducationInfoModel.create(obj);
        return res.status(201).json({
          message: "User education data add successfully",
          statusCode: 201,
          sucess: true,
        });
      }
    } catch (Err) {
      return res
        .status(500)
        .json({ message: Err?.message, statusCode: 500, success: false });
    }
  }
  async getData(req, res) {
    try {
      let get = await UserEducationInfoModel.findAll({
        where: { user_id: req.id, status: "active" },
        raw: true,
      });
      return res.status(200).json({
        message: "Fetch data",
        data: get,
        statusCode: 200,
        success: true,
      });
    } catch (Err) {
      return rs
        .status(500)
        .json({ message: Err?.message, statusCode: 500, success: false });
    }
  }
  async changeStatus(req, res) {
    try {
      let findObj = await UserEducationInfoModel.findOne({
        where: { id: req.body.id,status:'active' },
        raw: true,
      });
      // if()
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

let EducationServiceObj = new EducationInfoService();

export default EducationServiceObj;
