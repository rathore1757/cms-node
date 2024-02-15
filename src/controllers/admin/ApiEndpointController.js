import {
  ApiEndpointSchema,
  ChangeStatusSchema,
} from "../../helpers/validateApiEndpoint.js";
import ApiEndpointServicesObj from "../../services/admin/ApiEndpointServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class ApiEndpointController {
  async add(req, res) {
    try {
      if (!req.body.id) {
        let { error } = ApiEndpointSchema.validate(req?.body, options);
        if (error) {
          return res.status(400).json({
            message: error.details[0]?.message,
            success: false,
            statusCode: 400,
          });
        }
      }
      ApiEndpointServicesObj?.addData(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async get(req, res) {
    try {
      ApiEndpointServicesObj?.getData(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async get_data(req, res) {
    try {
      if (!req.query.type) {
        return res
          .status(400)
          .json({
            message: "Api type is required",
            statusCode: 400,
            success: false,
          });
      } else if (req.query.type != "backend" && req.query.type != "frontend") {
        return res
          .status(400)
          .json({
            message: "Api type must be 'backend or frontend'",
            statusCode: 400,
            success: false,
          });
      }
      ApiEndpointServicesObj?.getByQuery(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async change_status(req, res) {
    try {
      let { error } = ChangeStatusSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      ApiEndpointServicesObj?.changeStatus(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  // async delete_by_id(req, res) {
  //   try {
  //     if (!req.query.id) {
  //       return res.status(400).json({
  //         message: "Id is mandatory",
  //         statusCode: 400,
  //         success: false,
  //       });
  //     }
  //     BestSellerServicesObj.delete_Data(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }

  // //==============================================================
  // //for user
  // async fetch_data(req, res) {
  //   try {
  //     BestSellerObj.getData;
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }
}

const ApiEndpointControllerObj = new ApiEndpointController();
export default ApiEndpointControllerObj;
