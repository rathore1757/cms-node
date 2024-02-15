import { addEducationInfochema, changeStatusEducationInfochema } from "../../helpers/validateEducationInfo.js";
import { ImageFileCheck } from "../../helpers/validateImageFile.js";

import EducationServiceObj from "../../services/user/EducationInfoService.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class EducationInfoController {
  async add(req, res) {
    try {
      // console.log(req.body, "EEEEE");
      // console.log(req.file, "EEEEE@@@@@@");
      if (!req.body.id) {
        let { error } = addEducationInfochema.validate(req?.body, options);
        if (error) {
          return res
            .status(400)
            .json({ message: error.details[0]?.message, success: false });
        }
      }
      if (req.file && req.file?.filename) {
        let name = req.file?.filename;
        let size = req.files?.size;
        let data = "educationInfo";
        let get = await ImageFileCheck(name, data, size);
        if (get == "invalid file") {
          return res.status(400).json({
            message:
              "Id card image must be png or jpeg or webp file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        if (!req.body.id) {
          return res
            .status(400)
            .json({ message: "Id card image is mandatory", success: false });
        }
      }
      EducationServiceObj.addData(req, res);
    } catch (err) {
      console.log(err, "Error ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async get(req, res) {
    try {
      EducationServiceObj.getData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async change_status(req, res) {
    try {
      let { error } = changeStatusEducationInfochema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      EducationServiceObj.changeStatus(req,res)
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  // async addProductVariant(req, res) {
  //   try {
  //     if (req.userData && req.userData?.role != "admin") {
  //       return res.status(400).json({
  //         message: "Not authorise to add product",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     }

  //     let { error } = addProductVariantchema.validate(req?.body, options);
  //     if (error) {
  //       return res
  //         .status(400)
  //         .json({ message: error.details[0]?.message, success: false });
  //     }
  //     if (req.files.variant_image_Arr && req.files.variant_image_Arr) {
  //       let array = req.files.variant_image_Arr;
  //       for (let el of array) {
  //         let name = el?.filename;
  //         let size = el?.size;
  //         let get = await ImageFileCheck(name, res, size);
  //         if (get == "invalid file") {
  //           return res.status(400).json({
  //             message:
  //               "Product variant image must be png or jpeg or webp file and size must be less 500 kb",
  //             statusCode: 400,
  //             success: false,
  //           });
  //         }
  //       }
  //     } else {
  //       return res.status(400).json({
  //         message: "Product variant image is mandatory",
  //         success: false,
  //       });
  //     }
  //     ProductServicesObj.addProductVariantData(req, res);
  //   } catch (err) {
  //     console.log(err, "Error  ");
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }
  // async add_product_variant_Images(req, res) {
  //   try {
  //     if (req.userData && req.userData?.role != "admin") {
  //       return res.status(400).json({
  //         message: "Not authorise to add product",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     }

  //     let { error } = addProductVariantImageschema.validate(req?.body, options);
  //     if (error) {
  //       return res
  //         .status(400)
  //         .json({ message: error.details[0]?.message, success: false });
  //     }
  //     if (req.files.variant_image_Arr && req.files.variant_image_Arr) {
  //       let array = req.files.variant_image_Arr;
  //       for (let el of array) {
  //         let name = el?.filename;
  //         let size = el?.size;
  //         let get = await ImageFileCheck(name, res, size);
  //         if (get == "invalid file") {
  //           return res.status(400).json({
  //             message:
  //               "Product variant image must be png or jpeg or webp file and size must be less than 500 kb",
  //             statusCode: 400,
  //             success: false,
  //           });
  //         }
  //         // console.log(get, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  //       }
  //     } else {
  //       return res.status(400).json({
  //         message: "Product variant image is mandatory",
  //         success: false,
  //       });
  //     }
  //     ProductServicesObj.addProductVariantImageData(req, res);
  //   } catch (err) {
  //     console.log(err, "Error  ");
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  // async fetch_all_product(req, res) {
  //   try {
  //     ProductServicesObj.fetch_all_productData(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }
  // async get_all_product_by_search(req, res) {
  //   try {
  //     ProductServicesObj.get_all_product_by_search_data(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }
  // async fetch_product_by_id(req, res) {
  //   try {
  //     if (!req.query.id) {
  //       return res
  //         .status(400)
  //         .json({ message: "Product Id not found", success: false ,statusCode:400});
  //     }
  //     ProductServicesObj.fetch_product_by_id_data(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  // async search_params_data(req, res) {
  //   try {
  //     if (!req.body.searchString) {
  //       return res.status(400).json({
  //         message: "Search data is mandatory",
  //         statusCode: 400,
  //         success: false,
  //       });
  //     }
  //     ProductServicesObj.SearchParametersData(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  // async search_params_product_data(req, res) {
  //   try {
  //     ProductServicesObj?.fetchSearchParams(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }
  // async check_is_product_purcased(req, res) {
  //   try {
  //     if (!req.query.product_id) {
  //       return res.status(400).json({
  //         message: "Product id is mandatory",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     }
  //     ProductServicesObj?.checkIsProductPurcased(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }
  // async fetch_variant_data(req, res) {
  //   try {
  //     if (!req.query.variant_id) {
  //       return res.status(400).json({
  //         message: "Variant id is mandatory",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     }
  //     ProductServicesObj?.fetchVariantDataById(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }
}

const EducationInfoControllerObj = new EducationInfoController();
export default EducationInfoControllerObj;
