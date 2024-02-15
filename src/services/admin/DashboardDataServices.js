import BestSellerModel from "../../models/BestSellerModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import filterProduct from "../../models/filterDataModel.js";
import ProductModel from "../../models/ProductModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import dbConnection from "../../config/dbConfig.js";
import OrderModel from "../../models/OrderModel.js";
import UserModel from "../../models/UserModel.js";

class DashboardDataServices {
  async getDashboardData(req, res) {
    try {
      let from_date = req.query.from_date;
      let to_date = req.query.to_date;
      // console.log(req.query,"req.queryyyyyyyyyyyyyyyyyyyyyyyy")

      const query = `
      SELECT
        DATE_FORMAT(CURDATE(), '%Y-%m-%d') as report_date,
        (
          SELECT COUNT(*) FROM users
          WHERE status = 'active'
        ) as active_user_count,
        (
          SELECT COUNT(*) FROM users
          WHERE status = 'inactive'
        ) as inactive_user_count,
        (
          SELECT COUNT(*) FROM orders
          ${
            from_date && to_date
              ? `WHERE status = 'new' AND created_at BETWEEN '${from_date}' AND '${to_date}'`
              : `WHERE status = 'new'`
          }
        ) as new_order_count,
        (
          SELECT COUNT(*) FROM orders
          ${
            from_date && to_date
              ? `WHERE status = 'processing' AND created_at BETWEEN '${from_date}' AND '${to_date}'`
              : `WHERE status = 'processing'`
          }
        ) as processing_order_count,
        (
          SELECT COUNT(*) FROM orders
          ${
            from_date && to_date
              ? `WHERE status = 'cancelled' AND created_at BETWEEN '${from_date}' AND '${to_date}'`
              : `WHERE status = 'cancelled'`
          }
        ) as cancelled_order_count;
    `;

      let result = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });

      // for (let el of result) {
      //   if (req.query && req.query.country_code !== "") {
      //     let filterData = el?.variant_price_details.filter(
      //       (detail) => detail?.country_code === req?.query?.country_code
      //     );
      //     el.variant_price_details = filterData;
      //   }
      // }
      // result=result?.filter((el)=>el?.status=='active')
      return res.status(200).json({
        message: "fetch data",
        data: result,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      console.log(err, "errrrrororrr get dashboard data");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async get_order_variant_count_data(req, res) {
    try {
      let country_code = req.query.country_code;
      const query = `
      SELECT
        (
          SELECT COUNT(*) FROM orders
          WHERE status = 'new' ${
            country_code ? `AND country_code = '${country_code}'` : ""
          }
        ) as new_order_count,
        (
          SELECT COUNT(*) FROM orders
          WHERE status = 'cancelled' ${
            country_code ? `AND country_code = '${country_code}'` : ""
          }
        ) as cancelled_order_count
    `;
      let result = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      let data = result[0];

      const query2 = `
            SELECT pv.variant_price_details
              FROM product_variants pv
      `;

      let result2 = await dbConnection.query(query2, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      let productCount = 0;
      for (let le of result2) {
        let filterData = le?.variant_price_details;
        if (country_code) {
          filterData = le?.variant_price_details?.filter(
            (dat) => dat?.country_code == country_code
          );
        }
        let stockZero = false;
        // console.log(filterData, "filterdatatttat");
        if (filterData?.length) {
          for (let i = 0; i < filterData?.length; i++) {
            // if(filterData[i]?.status!=)
            if (
              filterData[i]?.status == "active" &&
              filterData[i]?.stock != "undefined" &&
              filterData[i]?.stock == 0
            ) {
              stockZero = true;
            }
          }
          if (stockZero) {
            // console.log(stockZero, "stockzertoo", "asdf");
            productCount = productCount + 1;
          }
        }
      }
      data.productOutOfStockCount = productCount;
      return res.status(200).json({
        message: "Fetch data",
        data: data,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "erorororor");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getUserData(req, res, filtersData) {
    try {
      let country_code = req.query.country_code;
      let fromDate = filtersData?.fromDate;
      let toDate = filtersData?.toDate;

      // console.log(fromDate, "fromdate", toDate, "todatetetet");
      let query = `
          SELECT COUNT(*) as user_count FROM users
          ${country_code ? `WHERE country = '${country_code}'` : ""}
          ${
            fromDate && toDate
              ? `AND created_at >= '${fromDate}' AND created_at <= '${toDate}'`
              : ""
          }  AND status = 'active'
      `;
      let result = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      let data = result[0];
      let userData = [];
      // if (country_code) {
      //   userData = await UserModel.findAll({
      //     where: {
      //       country: country_code,
      //       status: "active", //need as of now
      //       created_at: {
      //         [Op.between]: [fromDate, toDate],
      //       },
      //     },
      //     raw: true,
      //     attributes: ["created_at", "id", "name", "country"],
      //     // order: [["created_at", "DESC"]],
      //   });
      // } else

      if ((fromDate, toDate)) {
        userData = await UserModel.findAll({
          where: {
            country: country_code,
            status: "active", //need as of now
            created_at: {
              [Op.between]: [fromDate, toDate],
            },
          },
          raw: true,
          attributes: ["created_at", "id", "name", "country"],
          // order: [["created_at", "DESC"]],
        });
      } else {
        userData = await UserModel.findAll({
          where: {
            status: "active", //need as of now
          },
          raw: true,
          attributes: ["created_at", "id", "name", "country"],
          // order: [["created_at", "DESC"]],
        });
      }
      let tempArr = [];
      for (let el of userData) {
        let object = {};
        let date = new Date(el?.created_at);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        // if (object[formattedDate]) {
        //   object[formattedDate] = object[formattedDate] + 1;
        // } else {
        //   object[formattedDate] = 1;
        // }
        let existingDateIndex = tempArr.findIndex(
          (obj) => obj.date === formattedDate
        );
        if (existingDateIndex !== -1) {
          // If date exists, increment its value
          tempArr[existingDateIndex].value++;
        } else {
          // If date doesn't exist, add it to the array with value 1
          tempArr.push({ date: formattedDate, value: 1 });
        }
        // tempArr.push(object);
      }
      return res.status(200).json({
        message: "Fetch data",
        userData: tempArr,
        // object,
        data: data,
        // userData,
        success: true,
      });
    } catch (err) {
      console.log(err, "erorororor");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getBestSellerProductWithDetails(req, res, filterData) {
    try {
      let fromDate = filterData?.fromDate;
      let toDate = filterData?.toDate;
      let country_code = req.query.country_code;
      let fethOrderData = [];
      let status = "delivered";
      let query = `
      SELECT SUM(qty) AS total_quantity
      FROM orders, JSON_TABLE(variant_quantity, "$[*]" COLUMNS (
        qty INT PATH "$.quantity"
      )) AS jt
      WHERE status = 'delivered'AND country_code = :country_code
    `;
      let result = await dbConnection.query(query, {
        replacements: { country_code: country_code },
        type: dbConnection.QueryTypes.SELECT,
        // raw: true,
      });

      // console.log(result, "reslttttttttttt");
      if (fromDate && toDate) {
        fethOrderData = await OrderModel.findAll({
          where: {
            country_code: country_code,
            status,
            created_at: {
              [Op.between]: [fromDate, toDate],
            },
          },
          raw: true,
          attributes: [
            "variant_quantity",
            "sub_total",
            "delivery_charges",
            "payment_status",
            "status",
            "country_code",
            "created_at",
          ],
        });
      } else {
        fethOrderData = await OrderModel.findAll({
          where: {
            country_code: country_code,
            status,
          },
          raw: true,
          attributes: [
            "variant_quantity",
            "sub_total",
            "delivery_charges",
            "payment_status",
            "status",
            "country_code",
            "created_at",
          ],
        });
      }
      let productObj = {};
      let variantObj = {};
      let tempProduct = [];

      for (let el of fethOrderData) {
        for (let elem of el.variant_quantity) {
          if (productObj[elem?.product_id]) {
            productObj[elem?.product_id] = productObj[elem?.product_id] + 1;
          } else {
            productObj[elem?.product_id] = 1;
          }
          if (variantObj[elem?.variant_id]) {
            variantObj[elem?.variant_id] = variantObj[elem?.variant_id] + 1;
          } else {
            variantObj[elem?.variant_id] = 1;
          }

          const existingProductIndex = tempProduct.findIndex(
            (item) => item.product_id === elem.product_id
          );

          if (existingProductIndex !== -1) {
            // If the product already exists in tempProduct, update its quantity and orderCount
            tempProduct[existingProductIndex].quantity += elem.quantity;
            tempProduct[existingProductIndex].orderCount++;
          } else {
            // If the product doesn't exist in tempProduct, add it
            tempProduct.push({
              product_id: elem.product_id,
              quantity: elem.quantity,
              orderCount: 1,
            });
          }
        }
      }
      tempProduct = tempProduct?.sort((a, b) => b.quantity - a.quantity);

      let productIdArr = Object.keys(productObj); ///dsicouss
      let variantIdArr = Object.keys(variantObj);
      if (req.query.limit) {
        tempProduct = tempProduct.slice(0, parseInt(req.query.limit));
        productIdArr = productIdArr.slice(0, parseInt(req.query.limit));
        variantIdArr = variantIdArr.slice(0, parseInt(req.query.limit));
      }
      productIdArr = [];
      for (let el of tempProduct) {
        productIdArr.push(el?.product_id);
      }
      let productArr = await ProductModel.findAll({
        where: { id: productIdArr },
        raw: true,
      });
      let variantArr = await ProductVariantModel.findAll({
        where: { variant_id: variantIdArr },
        raw: true,
      });
      for (let el of variantArr) {
        let fetchCountrySpecific = el?.variant_price_details.filter(
          (data) => data?.country_code == country_code
        );
        el.variant_price_details = fetchCountrySpecific;
      }
      let tempArr = [];
      for (let le in productObj) {
        let findProductData = productArr.find((el) => el?.id == le);
        let obj = {};
        if (findProductData) {
          obj = {
            [le]: productObj[le],
            productObj: findProductData,
          };
        }
        let variantData = variantArr.find((el) => el?.product_id == le);
        if (variantData && obj.productObj) {
          obj.productObj.variantObj = variantData;
        }
        if (obj.productObj) {
          tempArr.push(obj);
        }
      }

      // Convert array back to object

      return res.status(200).json({
        message: "Fetched data",
        statusCode: 200,
        success: true,
        totalProductQuantityDelivered: result[0]?.total_quantity,
        productOrderWithQuantity: tempProduct,
        // productObj,
        totalProduct: productIdArr?.length,
        tempArr,
        // orderData: fethOrderData,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const DashboardDataServicesObj = new DashboardDataServices();
export default DashboardDataServicesObj;
