import express from "express";
import { authorize } from "../../middlewares/auth.js";
import WishListControllerObj from "../../controllers/user/WishlistController.js";

const WishlistRoutes = express.Router();

WishlistRoutes.post(
  "/add_to_wishlist",
  authorize,
  WishListControllerObj.addToWishlist
);
WishlistRoutes.get(
  "/get_wishlist_products",
  authorize,
  WishListControllerObj.getShorlistedData
);

export default WishlistRoutes;
