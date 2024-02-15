import { Op, literal } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import filterProduct from "../../models/filterDataModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
let salt = environmentVars.salt;

class FilterProductServices {
  async getAllFilterProductData(req, res) {
    try {
      let fetchData = await filterProduct.findOne();

      const filterByStatus = (array) =>
        array.filter((item) => item.status === "active");

      fetchData.gender = filterByStatus(fetchData?.gender);
      fetchData.shape = filterByStatus(fetchData?.shape);
      fetchData.color = filterByStatus(fetchData?.color);
      fetchData.material = filterByStatus(fetchData?.material);
      fetchData.size = filterByStatus(fetchData?.size);
      fetchData.weight_group = filterByStatus(fetchData?.weight_group);
      fetchData.price_range = filterByStatus(fetchData?.price_range);

      res.status(200).json({
        message: "Fetch category data",
        data: fetchData,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.log(err, "erorororororororor");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async filterMinMaxPriceCountryWise(req, res) {
    try {
      const productVariants = await ProductVariantModel.findAll({
        where: literal(
          `JSON_CONTAINS(variant_price_details, '${JSON.stringify({
            country_code: req.query.country_code,
          })}')`
        ),
        attributes: ["variant_price_details"],
        raw: true,
      });

      let maxPrice = 0;
      let minPrice;
      for (let el of productVariants) {
        let variantData = el?.variant_price_details;
        for (let elem of variantData) {
          if (elem && parseInt(elem?.price)) {
            minPrice = parseInt(elem.price);
            // console.log(minPrice, "minPrice", elem);
            break;
          }
        }
        if (minPrice !== undefined) {
          break;
        }
      }
      for (let el of productVariants) {
        let variantData = el?.variant_price_details;
        for (let elem of variantData) {
          if (elem && parseInt(elem?.price) > parseInt(maxPrice)) {
            maxPrice = elem?.price;
          }
          if (elem && parseInt(elem?.price) < parseInt(minPrice)) {
            minPrice = elem?.price;
          }
        }
      }
      return res.status(200).json({
        success: true,
        message: "Data Fetched",
        data: { country_code: req.query.country_code, maxPrice, minPrice },
      });
    } catch (err) {
      console.log(err, "123123 filter min max rpice Errrrr");
      return res
        .status(500)
        .json({ success: false, message: err?.message, statusCode: 500 });
    }
  }
}

const CategoryServicesObj = new FilterProductServices();
export default CategoryServicesObj;
