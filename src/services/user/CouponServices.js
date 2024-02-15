import dbConnection from "../../config/dbConfig.js";

class CouponServices {
  async getAvailableCoupons(obj, res) {
    try {
      const query = `select * from coupons where (category_id=${obj.category} OR category_id=0)
       AND (product_id=${obj.product} OR product_id=0)
       AND (variant_id=${obj.variant} OR variant_id=0)
       AND (${obj.price} BETWEEN min_purchase AND max_purchase)
       AND (CURRENT_DATE BETWEEN start_date AND expired_date)
       AND country='${obj.country}'
      `;
      const coupons = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
      });

      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: coupons });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}
const CouponServicesObj = new CouponServices();
export default CouponServicesObj;
