import CouponServicesObj from "../../services/user/CouponServices.js";

class CouponController {
  async getAvailableCoupons(req, res) {
    let { category, product, variant, price, country } = req.query;
    if (!category) {
      category = 0;
    }
    if (!product) {
      product = 0;
    }
    if (!country) {
      country = "IN";
    }
    if (!variant) {
      variant = 0;
    }
    let obj = {
      category,
      product,
      variant,
      price,
      country,
    };
    CouponServicesObj.getAvailableCoupons(obj, res);
  }
}
const CouponControllerObj = new CouponController();
export default CouponControllerObj;
