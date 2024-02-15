import { ImageFileCheck } from "../../helpers/validateImageFile.js";
import {
  addProductVariantchema,
  addProductchema,
  addProductVariantImageschema,
} from "../../helpers/validateProduct.js";
import ProductServicesObj from "../../services/user/ProductServices.js";
import fs from "fs";
// import axios from "axios";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

// function checkFileSignature(buffer) {
//   const fileSignatures = {
//     "89504E470D0A1A0A": "PNG",
//     FFD8FFE0: "JPEG",
//     FFD8FF: "JPG",
//     // Add more file signatures as needed
//   };
//   const hexSignature = buffer
//     .slice(0, 8)
//     .toString("hex")
//     .toUpperCase();

//   for (const signature in fileSignatures) {
//     if (hexSignature.startsWith(signature)) {
//       return fileSignatures[signature];
//     }
//   }
//   return null;
// }

// async function ImageFileCheck(name, res) {
//   const filePath = `./src/uploads/${name}`;
//   let check = fs.readFileSync(filePath);
//   const filetype = checkFileSignature(check);
//   if (filetype == "PNG" || filetype == "JPEG") {
//     return "valid file";
//   } else if (filetype == null) {
//     // res.status(400).json({
//     //   message: "Invalid file uploaded",
//     //   success: false,
//     //   statusCode: 400,
//     // });
//     await fs.unlinkSync(filePath);
//     return "invalid file";
//   }
// }

class ProductController {
  async addProduct(req, res) {
    try {

      let { error } = addProductchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      if (req.files && req.files?.product_thumbnail?.length) {
        let name = req.files?.product_thumbnail[0]?.filename;
        let size = req.files?.product_thumbnail[0]?.size;
        let get = await ImageFileCheck(name, res, size);
        // console.log(get, "GGGGFFFFFFFFFFDDDDDDDDDDDDDDDDDDD prodcut image");
        if (get == "invalid file") {
          return res.status(400).json({
            message:
              "Product image must be png or jpeg or webp file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Product image is mandatory", success: false });
      }

      if (req?.files?.variant_image_Arr && req?.files?.variant_image_Arr) {
        let array = req?.files?.variant_image_Arr;
        for (let el of array) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, res, size);
          // console.log(get, "GETTTTTTTTTTTTTTTTTTTT variant ");
          if (get == "invalid file") {
            return res.status(400).json({
              message:
                "Product variant image must be png or jpeg or webp file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
        }
      } else {
        return res.status(400).json({
          message: "Product variant image is mandatory",
          success: false,
        });
      }
      ProductServicesObj.addProductData(req, res);
    } catch (err) {
      console.log(err, "Error ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async addProductVariant(req, res) {
    try {
      if (req.userData && req.userData?.role != "admin") {
        return res.status(400).json({
          message: "Not authorise to add product",
          success: false,
          statusCode: 400,
        });
      }

      let { error } = addProductVariantchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      if (req.files.variant_image_Arr && req.files.variant_image_Arr) {
        let array = req.files.variant_image_Arr;
        for (let el of array) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, res, size);
          if (get == "invalid file") {
            return res.status(400).json({
              message:
                "Product variant image must be png or jpeg or webp file and size must be less 500 kb",
              statusCode: 400,
              success: false,
            });
          }
        }
      } else {
        return res.status(400).json({
          message: "Product variant image is mandatory",
          success: false,
        });
      }
      ProductServicesObj.addProductVariantData(req, res);
    } catch (err) {
      console.log(err, "Error  ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async add_product_variant_Images(req, res) {
    try {
      if (req.userData && req.userData?.role != "admin") {
        return res.status(400).json({
          message: "Not authorise to add product",
          success: false,
          statusCode: 400,
        });
      }

      let { error } = addProductVariantImageschema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      if (req.files.variant_image_Arr && req.files.variant_image_Arr) {
        let array = req.files.variant_image_Arr;
        for (let el of array) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, res, size);
          if (get == "invalid file") {
            return res.status(400).json({
              message:
                "Product variant image must be png or jpeg or webp file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
          // console.log(get, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        }
      } else {
        return res.status(400).json({
          message: "Product variant image is mandatory",
          success: false,
        });
      }
      ProductServicesObj.addProductVariantImageData(req, res);
    } catch (err) {
      console.log(err, "Error  ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetch_all_product(req, res) {
    try {
      ProductServicesObj.fetch_all_productData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async get_all_product_by_search(req, res) {
    try {
      ProductServicesObj.get_all_product_by_search_data(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async fetch_product_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({ message: "Product Id not found", success: false ,statusCode:400});
      }
      ProductServicesObj.fetch_product_by_id_data(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async search_params_data(req, res) {
    try {
      if (!req.body.searchString) {
        return res.status(400).json({
          message: "Search data is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      ProductServicesObj.SearchParametersData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async search_params_product_data(req, res) {
    try {
      ProductServicesObj?.fetchSearchParams(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async check_is_product_purcased(req, res) {
    try {
      if (!req.query.product_id) {
        return res.status(400).json({
          message: "Product id is mandatory",
          success: false,
          statusCode: 400,
        });
      }
      ProductServicesObj?.checkIsProductPurcased(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async fetch_variant_data(req, res) {
    try {
      if (!req.query.variant_id) {
        return res.status(400).json({
          message: "Variant id is mandatory",
          success: false,
          statusCode: 400,
        });
      }
      ProductServicesObj?.fetchVariantDataById(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const ProductControllerObj = new ProductController();
export default ProductControllerObj;
