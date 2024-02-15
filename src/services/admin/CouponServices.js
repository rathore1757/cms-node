import CouponModel from "../../models/couponModel.js";

class AddCoupon {
  async addCoupon(req, res) {
    try {
      let name = req?.body?.name?.trim();
      let code = req?.body?.code?.trim();
      let type = req?.body?.type?.trim();
      let value = req?.body?.value?.trim();
      let start_date = req?.body?.start_date?.trim();
      let expired_date = req?.body?.expired_date?.trim();
      let min_purchase = req?.body?.min_purchase?.trim();
      let max_purchase = req?.body?.max_purchase?.trim();
      let limit = req?.body?.limit?.trim();
      let user_id = req.id || 0;
      let category_id = req?.body?.category_id?.trim();
      let product_id = req?.body?.product_id?.trim();
      let country = req?.body?.country?.trim();
      let variant_id = req?.body?.variant_id?.trim();
      let couponExist = await CouponModel.findOne({ where: { code } });

      if (couponExist) {
        return res.status(409).json({
          message: "Coupon Already Exist",
          success: true,
          statusCode: 409,
        });
      } else {
        let obj = {
          name,
          code,
          type,
          value,
          start_date,
          expired_date,
          min_purchase,
          max_purchase,
          limit,
          user_id,
          category_id,
          product_id,
          country,
          variant_id,
        };
        await CouponModel.create(obj);
        return res.status(201).json({
          message: "Coupon created successfully",
          success: true,
          statusCode: 201,
        });
      }
    } catch (err) {
      console.log(err, "erro in couopon addd");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async updateCoupon(req, res) {
    try {
      let name = req?.body?.name?.trim();
      let code = req?.body?.code?.trim();
      let type = req?.body?.type?.trim();
      let value = req?.body?.value?.trim();
      let user_id = req.id || 0;
      let category_id = req?.body?.category_id?.trim();
      let product_id = req?.body?.product_id?.trim();
      let variant_id = req?.body?.variant_id?.trim();
      let start_date = req?.body?.start_date?.trim();
      let expired_date = req?.body?.expired_date?.trim();
      let min_purchase = req?.body?.min_purchase?.trim();
      let max_purchase = req?.body?.max_purchase?.trim();
      let country = req?.body?.country?.trim();
      let limit = req?.body?.limit?.trim();

      let couponExist = await CouponModel.findOne({ where: { code } });
      if (couponExist) {
        let obj = {
          name: name || couponExist.name,
          type: type || couponExist.type,
          value: value || couponExist.value,
          start_date: start_date || couponExist.start_date,
          expired_date: expired_date || couponExist.expired_date,
          min_purchase: min_purchase || couponExist.min_purchase,
          max_purchase: max_purchase || couponExist.max_purchase,
          limit: limit || couponExist.limit,
          user_id: user_id || couponExist.user_id,
          category_id: category_id || couponExist.category_id,
          product_id: product_id || couponExist.product_id,
          country: country || couponExist.country,
          variant_id: variant_id || couponExist.variant_id,
        };
        await CouponModel.update(obj, {
          where: { code },
        });
        return res.status(200).json({
          message: "Coupon Updated Successfully",
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Coupon not found",
          success: true,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllCoupons(req, res) {
    try {
      const getAllCoupons = await CouponModel.findAll({});

      if (getAllCoupons) {
        return res.status(200).json({
          message: "Fetch Coupons data",
          data: getAllCoupons,
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
  async getCouponById(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          message: " Coupon Id is required",
          statusCode: 400,
          success: false,
        });
      }
      const getCoupon = await CouponModel.findByPk(id);

      if (getCoupon) {
        return res.status(200).json({
          message: "Fetch Coupons data",
          data: getCoupon,
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
  async deleteCouponById(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          message: " Coupon Id is required",
          statusCode: 400,
          success: false,
        });
      }
      const getCoupon = await CouponModel.findByPk(id);

      if (getCoupon) {
        await CouponModel.destroy({
          where: {
            id,
          },
        });

        return res.status(200).json({
          success: true,
          message: "Coupon Deleted successfully",
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

  async updateStatus(req, res) {
    try {
      let { status, id } = req.body;
      let findExist = await CouponModel.findOne({ where: { id }, raw: true });
      if (!findExist) {
        return res.status(400).json({
          message: "Coupon data not found",
          statusCode: 400,
          success: false,
        });
      } else {
        await CouponModel.update({ status }, { where: { id } });
        return res
          .status(200)
          .json({
            message: "Coupon status update successfully",
            statusCode: 200,
            success: true,
          });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const AddCouponServicesObj = new AddCoupon();
export default AddCouponServicesObj;
