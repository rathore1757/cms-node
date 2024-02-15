import WishListServicesObj from "../../services/user/WishlistsServices.js";

class WishListController {
  async addToWishlist(req, res) {
    try {
      WishListServicesObj.AddToWishlist(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getShorlistedData(req, res) {
    try {
      WishListServicesObj.getShorlistedData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const WishListControllerObj = new WishListController();
export default WishListControllerObj;
