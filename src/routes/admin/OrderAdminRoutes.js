import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import OrderControllerObj from "../../controllers/admin/AdminOrderController.js";
const OrderAdminRoutes = express.Router();

OrderAdminRoutes.put(
  "/update_delivery_date",
  authorizeAdmin,
  OrderControllerObj.update_delivery_date
);
OrderAdminRoutes.put(
  "/update_order_status",
  authorizeAdmin,
  OrderControllerObj.update_order_status_date
);
OrderAdminRoutes.get("/get_all", authorizeAdmin, OrderControllerObj.get_all);
OrderAdminRoutes.get(
  "/get_filtered_orders",
  authorizeAdmin,
  OrderControllerObj.getFilteredOrders
);
// api for total revenue graph on admin
OrderAdminRoutes.get(
  "/get_graph_data_subtotal",
  authorizeAdmin,
  OrderControllerObj.fetchGraphDataSubtotal
);
// api for total orders graph on admin
OrderAdminRoutes.get(
  "/get_graph_data_order",
  authorizeAdmin,
  OrderControllerObj.fetchGraphDataOrders
);

export default OrderAdminRoutes;
