import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import OrderControllerObj from "../../controllers/user/OrderController.js";

const OrderRoutes = express.Router();

OrderRoutes.post("/create_order", authorize, OrderControllerObj.createOrder);
OrderRoutes.put("/update_status", authorize, OrderControllerObj.updateOrder);
OrderRoutes.post(
  "/create_payment_intent",
  authorize,
  OrderControllerObj.create_payment_intent
);

// For User
OrderRoutes.get("/get_order", authorize, OrderControllerObj.get_order);
OrderRoutes.get(
  "/get_track_order",
  authorize,
  OrderControllerObj.get_track_order
);

OrderRoutes.put(
  "/request_return",
  authorize,
  OrderControllerObj.request_return
);

OrderRoutes.put("/cancel_order", authorize, OrderControllerObj.cancel_order);

OrderRoutes.get(
  "/download_invoice",
  authorize,
  OrderControllerObj.downloadInvoice
);



export default OrderRoutes;
