import OrderModel from "../../models/OrderModel.js";
import axios from "axios";
import CouponModel from "../../models/couponModel.js";
import UserAddressModel from "../../models/UserAddressModel.js";

import ProductVariantModel from "../../models/ProductVariantModel.js";
import ProductMaterialModel from "../../models/ProductMaterialModel.js";
import ProductDescriptionModel from "../../models/ProductDescriptionModel.js";
import { Op } from "sequelize";
import CartModel from "../../models/CartModel.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import ProductModel from "../../models/ProductModel.js";
import filterProduct from "../../models/filterDataModel.js";
import { downloadInvoice } from "../../helpers/downloadInvoice.js";
import {
  cancelOrder,
  orderPlaceViaEmail,
  updateOrderPaymentViaEmail,
} from "../../helpers/common.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { environmentVars } from "../../config/environmentVar.js";

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import stripe from "stripe";
const stripeInstance = stripe(environmentVars?.stripe_secret_key);

class OrderServices {
  async create_order(req, res) {
    try {
      let {
        address_id,
        variant_quantity,
        coupon_id,
        sub_total,
        delivery_charges,
        payment_method,
        payment_status,
        status,
        country_code,
      } = req.body;

      let findAddressExist = await UserAddressModel.findOne({
        where: { id: address_id, user_id: req.id },
        raw: true,
      });
      if (!findAddressExist) {
        return res.status(400).json({
          message: "User address not found",
          statusCode: 400,
          sucess: false,
        });
      }
      let todayDate = new Date();
      let checkCoupon = {};
      if (coupon_id) {
        checkCoupon = await CouponModel.findOne({
          where: { id: coupon_id, country: country_code },
          raw: true,
        });
        if (!checkCoupon) {
          return res.status(400).json({
            message: "Coupon not found",
            statusCode: 400,
            success: false,
          });
        }
        let couponExpiryExpiryDate = new Date(checkCoupon?.expired_date);
        if (couponExpiryExpiryDate < todayDate) {
          return res.status(400).json({
            message: "Coupon is expired",
            statusCode: 400,
            success: false,
          });
        } else if (checkCoupon && checkCoupon?.used >= checkCoupon?.limit) {
          return res.status(400).json({
            message: "Coupon limit exceed",
            statusCode: 400,
            success: false,
          });
        }
      }
      let variant_id = [];
      for (let le of variant_quantity) {
        variant_id.push(le?.variant_id);
      }
      let findProduct = await ProductVariantModel.findAll({
        where: {
          variant_id: {
            [Op.in]: variant_id,
          },
        },
        attributes: [
          "variant_price_details",
          "variant_id",
          "product_id",
          // "variant_name",
          "code",
        ],
        raw: true,
      });
      let productArr = [];
      // console.log(variant_quantity, "variantaaaadata");
      for (let el of variant_quantity) {
        let find = findProduct?.find(
          (elem) => elem?.variant_id == el?.variant_id
        );
        // console.log(find, "findndidndiddnin");
        if (find?.product_id != el?.product_id) {
          return res.status(400).json({
            message: `This variant_id '${el?.variant_id}' is not belongs to this product_id '${el?.product_id}'`,
            statusCode: 400,
            success: false,
          });
        }
      }
      for (let el of findProduct) {
        productArr.push(el?.product_id);
      }
      let productDetails = await ProductModel.findAll({
        where: { id: productArr },
        raw: true,
        attributes: ["title", "sku", "id"],
      });
      let newArray = [...findProduct];
      findProduct = findProduct.map((product) => {
        let findPRoductId = productDetails.find(
          (ele) => ele?.id == product?.product_id
        );
        return {
          variant_id: product?.variant_id,
          product_id: product?.product_id,
          variant_name: findPRoductId?.title, ///////////
          sku: product?.code, ///////
          variant_price_details: product?.variant_price_details
            ? product?.variant_price_details
                ?.filter((details) => details.country_code == country_code)
                ?.map((filteredDetails) => ({
                  // tax: filteredDetails?.tax,
                  price: filteredDetails?.price,
                  stock: filteredDetails?.stock,
                  country: filteredDetails?.country,
                  discount: filteredDetails?.discount,
                  // tax_name: filteredDetails?.tax_name,
                  country_code: filteredDetails?.country_code,
                  currency_symbol: filteredDetails?.currency_symbol,
                }))
            : [],
        };
      });

      let findProductVariant;
      for (let le of variant_quantity) {
        findProductVariant = findProduct.find(
          (el) => el?.variant_id == le?.variant_id
        );
        // console.log(
        //   findProductVariant,
        //   "findProductVariantfindProductVariant",
        //   le
        // );
        if (
          findProductVariant?.variant_price_details[0]?.stock < le?.quantity
        ) {
          return res.status(400).json({
            message: `Insufficient product stock of "${findProductVariant?.variant_name}" product`,
            success: false,
            statusCode: 400,
          });
        }
      }

      let totalAmountDb = 0;
      for (let le of findProduct) {
        let findData = le.variant_price_details.find(
          (el) => el.country_code == country_code
        );
        let amount = Number(
          findData?.price - (findData?.price * findData?.discount) / 100
        )?.toFixed(2);
        totalAmountDb = Number(totalAmountDb) + Number(amount);
      }
      if (coupon_id) {
        // console.log(checkCoupon, "ceckckckck", sub_total);
        if (Number(sub_total) < Number(checkCoupon?.min_purchase)) {
          return res.status(400).json({
            message: `Coupon can't be apply, minimum purchase amount will be ${checkCoupon?.min_purchase}`,
            statusCode: 400,
            success: false,
          });
        } else if (Number(sub_total) > Number(checkCoupon?.max_purchase)) {
          return res.status(400).json({
            message: `Coupon can't be apply, maximum purchase amount will be ${checkCoupon?.max_purchase}`,
            statusCode: 400,
            success: false,
          });
        }
        if (checkCoupon?.type == "fixed") {
          totalAmountDb = Number(totalAmountDb) - Number(checkCoupon?.value);
        } else if (checkCoupon?.type == "percent") {
          totalAmountDb =
            Number(totalAmountDb) -
            (Number(totalAmountDb) * Number(checkCoupon?.value)) / 100;
        }
      }

      if (parseInt(totalAmountDb) != parseInt(sub_total)) {
        return res.status(400).json({
          message: "Product amount mismatched",
          statusCode: 400,
          success: false,
        });
      }

      const oneWeekLater = new Date();
      oneWeekLater.setDate(todayDate.getDate() + 7); // need to change ,will make dynamic
      let twoDayLater = new Date();
      twoDayLater.setDate(todayDate?.getDate() + 2); // need to change ,will make dynamic
      let fourDayLater = new Date();
      fourDayLater.setDate(todayDate?.getDate() + 4); // need to change ,will make dynamic
      let obj = {
        order_id: Date.now() + Math.round(Math.random() * 10000000000),
        user_id: req.id,
        address_id,
        variant_quantity,
        coupon_id,
        sub_total,
        delivery_charges,
        payment_method,
        payment_status,
        status,
        order_date: Date.now(),
        delivery_date: oneWeekLater,
        country_code,
        shipping_date: twoDayLater,
        out_for_delivery_date: fourDayLater,
      };
      await OrderModel.create(obj);
      await CartModel.destroy({
        where: {
          user_id: req.id,
        },
      });

      res.status(201).json({
        message: "Order create successfully",
        statusCode: 201,
        success: true,
        order_id: obj?.order_id,
      });
      await orderPlaceViaEmail(obj, req.userData);
      if (coupon_id) {
        let usedNumber = checkCoupon?.used;
        usedNumber = usedNumber + 1;
        await CouponModel.update(
          { used: usedNumber },
          { where: { id: coupon_id } }
        );
      }
      newArray.forEach((el) => {
        let le = variant_quantity.find(
          (item) => item?.variant_id == el?.variant_id
        );
        if (le) {
          el.variant_price_details = el.variant_price_details.map((eleme) => {
            if (eleme.country_code == req.body.country_code) {
              eleme.stock -= le.quantity;
              eleme.stock = Math.max(0, eleme.stock);
            }
            // console.log(eleme, "eleleleleleelelelelelelellel");
            return eleme;
          });
        }
      });
      for (let el of newArray) {
        let variant_price_details = el?.variant_price_details;
        // console.log(
        //   variant_price_details,
        //   "variant_price_detailsvariant_price_details"
        // );
        await ProductVariantModel.update(
          { variant_price_details },
          { where: { variant_id: el?.variant_id } }
        );
      }
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async update_order(req, res) {
    //check payment is successfully
    try {
      let {
        order_id,
        card_details,
        card_data,
        txn_id,
        delivery_instruction,
        payment_status,
      } = req.body;
      let obj = {
        card_details,
        card_data,
        txn_id,
        delivery_instruction,
        payment_status,
      };
      let findOrder = await OrderModel.findOne({
        where: { order_id: order_id },
        raw: true,
        attributes: ["order_id", "user_id", "payment_status", "id"],
      });
      if (!findOrder) {
        return res.status(400).json({
          message: "Order not found",
          success: false,
          statusCode: 400,
        });
      }
      if (findOrder && findOrder?.payment_status == "complete") {
        return res.status(400).json({
          message: "Payment already made for this order",
          statusCode: 400,
          success: false,
        });
      } else {
        await OrderModel.update(obj, { where: { order_id } });
        if (payment_status == "complete") {
          await CartModel.destroy({
            where: {
              user_id: req.id,
            },
          });
        }
      }
      res.status(200).json({
        message: "Payment status update successfully",
        statusCode: 200,
        sucess: true,
        // findProduct,
      });
      findOrder.payment_status = payment_status;
      await updateOrderPaymentViaEmail(findOrder, req.userData);
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getAll(req, res) {
    try {
      // console.log(req.id ,"req.id req.id req.id req.id req.id req.id req.id req.id ")
      let getAll = await OrderModel.findAll({
        where: { user_id: req.id },
        raw: true,
      });
      let obj = {};
      const result = [...getAll];
      getAll = getAll.filter((el) => {
        if (el?.payment_method == "Cash on Delivery") {
          return el;
        } else if (
          el?.payment_method != "Cash on Delivery" &&
          el?.payment_status == "complete"
        ) {
          return el;
        }
      });
      // getAll?.forEach((order) => {
      //   order.variant_quantity.forEach((variant) => {
      //     const newOrder = { ...order, variant_quantity: [variant] };
      //     result.push(newOrder);
      //   });
      // });
      result?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      for (let el of result) {
        let getStatus = el?.status;
        if (obj[getStatus]) {
          obj[getStatus].push(el);
        } else {
          obj[getStatus] = [el];
        }
      }

      if (getAll) {
        return res.status(200).json({
          message: "Fetch data",
          // getAll,
          obj,
          allData: result,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_track_order_data(req, res) {
    try {
      const getAll = await OrderModel.findOne({
        where: { user_id: req.id, order_id: req.query.order_id },
        raw: true,
      });
      if (getAll) {
        return res.status(200).json({
          message: "Fetch order data",
          data: getAll,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Order id not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async request_return_by_user(req, res) {
    try {
      let { order_id } = req.query;
      let fetchOrderData = await OrderModel.findOne({
        where: { order_id, user_id: req.id },
        raw: true,
        attributes: ["status"],
      });
      if (!fetchOrderData) {
        return res.status(400).json({
          message: "Order not found",
          statusCode: 400,
          success: false,
        });
      } else if (fetchOrderData && fetchOrderData?.status == "delivered") {
        await OrderModel.update(
          { status: "return-request" },
          { where: { order_id } }
        );
        return res.status(200).json({
          message: "Order request submit successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Order request cannot be made",
          statusCode: 400,
          success: true,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, statusCode: 500, message: err?.message });
    }
  }

  async downloadInvoice(req, res) {
    try {
      let fetchORderData = await OrderModel.findOne({
        where: { order_id: req.query.order_id, user_id: req.id },
        raw: true,
      });
      if (!fetchORderData) {
        return res.status(400).json({
          message: "Order not found",
          statusCode: 400,
          success: false,
        });
      }
      let productIdArr = [];
      let variantIdArr = [];
      let couponObj = {};
      if (fetchORderData?.coupon_id) {
        couponObj = await CouponModel.findOne({
          where: { id: fetchORderData?.coupon_id },
          raw: true,
        });
      }
      for (let el of fetchORderData?.variant_quantity) {
        productIdArr.push(el?.product_id);
        variantIdArr.push(el?.variant_id);
      }
      let filterProductDAta = await filterProduct.findOne();
      // console.log(filterProductDAta, "filterProductDAta");
      let genderArr = filterProductDAta?.gender;
      let shapeArr = filterProductDAta?.shape;
      let colorArr = filterProductDAta?.color;
      let materialArr = filterProductDAta?.material;
      let sizeArr = filterProductDAta?.size;
      let weight_group_arr = filterProductDAta?.weight_group;
      let priceArr = filterProductDAta?.price_range;
      let categoryArr = filterProductDAta?.categories;
      const productData = await ProductModel.findAll({
        where: {
          id: {
            [Op.in]: productIdArr,
          },
        },
        attributes: [
          "id",
          "title",
          "cat_id",
          "thumbnail_img",
          "material_id",
          "shape_id",
        ],
        raw: true,
      });
      let variantData = await ProductVariantModel.findAll({
        where: {
          variant_id: {
            [Op.in]: variantIdArr,
          },
        },
        attributes: [
          "code",
          "variant_price_details",
          "thumbnail_url",
          "color_id",
          "variant_id",
          "product_id",
        ],
        raw: true,
      });
      for (let el of variantData) {
        el.variant_price_details = el.variant_price_details?.filter(
          (variant) => variant?.country_code == fetchORderData?.country_code
        );
        el.color_name = colorArr?.find(
          (ele) => ele?.id === el?.color_id
        )?.value;
        // el.material_name = materialArr?.find(
        //   (ele) => ele?.id == el?.material_id
        // )?.value;
        // el.size_name = sizeArr?.find((ele) => ele?.id == el?.size_id)?.value;
      }

      for (let le of productData) {
        le.cat_name = categoryArr?.find((el) => el?.id == le?.cat_id)?.value;
        le.material_name = materialArr?.find(
          (el) => el?.id == le?.material_id
        )?.value;
        le.shape_name = shapeArr?.find((el) => el?.id == le?.shape_id)?.value;
      }
      for (let el of fetchORderData?.variant_quantity) {
        el.findProductObj = productData?.find(
          (lem) => lem?.id == el?.product_id
        );
        el.variantObj = variantData?.find(
          (lem) => lem?.variant_id == el.variant_id
        );
      }
      let fetuserObj = await UserAddressModel.findOne({
        where: {
          id: fetchORderData?.address_id,
          user_id: fetchORderData?.user_id,
        },
        raw: true,
      });
      fetchORderData.userAddressObj = fetuserObj;
      fetchORderData.couponObj = couponObj;
      delete fetchORderData.coupon_id;
      // console.log(fetchORderData, "ffffffffffffff");
      // return
      const data = await downloadInvoice(fetchORderData);
      res.setHeader("Content-Type", "text/html");
      return res.status(200).json({ success: true, data: data });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }

    // function generateInvoice() {
    //   return {
    //     invoiceNumber: "INV123",
    //     date: "2022-01-01",
    //     items: [
    //       { description: "Item 1", quantity: 2, price: 10 },
    //       { description: "Item 2", quantity: 1, price: 20 },
    //     ],
    //     total: 40,
    //   };
    // }

    // const invoiceData = generateInvoice();
    // const filePath = `${__dirname}/temp_invoice.json`;
    // // const filePath = path.join(__dirname, "temp_invoice.json");
    // try {
    //   fs.writeFileSync(filePath, JSON.stringify(invoiceData));
    //   res.download(filePath, "invoice.json", (err) => {
    //     if (err) {
    //       console.error("Error downloading invoice:", err);
    //       res.status(500).send("Internal Server Error");
    //     }

    //     // Delete the temporary file after download
    //     fs.unlinkSync(filePath);
    //   });
    // } catch (err) {
    //   return res.status(500).json({ success: false, message: err?.message });
    // }
    // return res.status(200).json({ success: true, message: "Download" });
  }

  async cancel_order_by_user(req, res) {
    try {
      let { order_id } = req.body;
      let findOrderExist = await OrderModel.findOne({
        where: { user_id: req.id, order_id },
        raw: true,
        attributes: [
          "status",
          "order_id",
          "order_date",
          "variant_quantity",
          "country_code",
        ],
      });
      if (!findOrderExist) {
        return res.status(400).json({
          message: "Order not found",
          success: false,
          statusCode: 400,
        });
      } else if (findOrderExist && findOrderExist?.status == "new") {
        await OrderModel.update(
          { status: "cancelled" },
          { where: { order_id } }
        );
        res.status(200).json({
          message: "Order cancelled successfully",
          success: true,
          statusCode: 200,
        });
        let variant_id = [];
        let variant_quantity = findOrderExist?.variant_quantity;
        for (let le of variant_quantity) {
          variant_id.push(le?.variant_id);
        }
        let findProduct = await ProductVariantModel.findAll({
          where: {
            variant_id: {
              [Op.in]: variant_id,
            },
          },
          attributes: [
            "variant_price_details",
            "variant_id",
            "product_id",
            "code",
          ],
          raw: true,
        });
        let newArray = [...findProduct];
        // console.log(newArray, "newArrayaaaaaaaaaaa", variant_quantity);
        newArray.forEach((el) => {
          let le = variant_quantity.find(
            (item) => item?.variant_id == el?.variant_id
          );
          if (le) {
            el.variant_price_details = el.variant_price_details.map((eleme) => {
              if (eleme.country_code == findOrderExist?.country_code) {
                eleme.stock += le?.quantity;
                eleme.stock = Math.max(0, eleme?.stock);
              }
              // console.log(eleme, "eleleleleleelelelelelelellel");
              return eleme;
            });
          }
        });
        // console.log(
        //   newArray,
        //   "newArraynewArraynewArray",
        //   JSON.stringify(newArray)
        // );
        for (let el of newArray) {
          let variant_price_details = el?.variant_price_details;
          await ProductVariantModel.update(
            { variant_price_details },
            { where: { variant_id: el?.variant_id } }
          );
        }

        findOrderExist.cancelledItems = findOrderExist?.variant_quantity?.map(
          (el) => el?.variant_name
        );
        await cancelOrder(req.userData, findOrderExist);
      } else if (findOrderExist && findOrderExist?.status == "cancelled") {
        return res.status(400).json({
          message: "Order already 'cancel'",
          success: false,
          statusCode: 400,
        });
      } else {
        return res.status(400).json({
          message: "Order cannot be cancel",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      // console.log(err, "EEEEEEEEEEEEEEEEEEEEEEE");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async create_payment_intent_data(req, res) {
    try {
      const { amount, currency } = req.body;
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount,
        currency,
      });
      // console.log(paymentIntent, "payment intent ");
      return res.status(200).json({
        message: "Payment status",
        statusCode: 200,
        success: true,
        data: paymentIntent,
      });
    } catch (err) {
      console.log("payment intent", err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const OrderServicesObj = new OrderServices();
export default OrderServicesObj;
