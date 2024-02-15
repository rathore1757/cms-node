import {
  OrderSchema,
  UpdateOrderSchema,
  cancel_order_schema,
  createPaymentIntentSchema,
  request_return_schema,
} from "../../helpers/validateOrder.js";
import OrderServices from "../../services/user/OrderServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class OrderController {
  async createOrder(req, res) {
    try {
      // console.log(req.userData,"req.userData,")
      let { error } = OrderSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices.create_order(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async updateOrder(req, res) {
    try {
      let { error } = UpdateOrderSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices?.update_order(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_order(req, res) {
    try {
      OrderServices.getAll(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async cancel_order(req, res) {
    try {
      let { error } = cancel_order_schema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.cancel_order_by_user(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_track_order(req, res) {
    try {
      if (!req.query?.order_id) {
        return res.status(400).json({
          message: "Order id is mandatory",
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.get_track_order_data(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async request_return(req, res) {
    try {
      if (!req.id) {
        return res
          .status(400)
          .json({ message: "Not authorise", statusCode: 400, success: false });
      }
      let { error } = request_return_schema.validate(req?.query, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices?.request_return_by_user(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async downloadInvoice(req, res) {
    if (!req.query.order_id) {
      return res.status(400).json({
        message: "order id is mandatory",
        statusCode: 400,
        success: false,
      });
    }
    OrderServices.downloadInvoice(req, res);
  }

  async create_payment_intent(req, res) {
    try {
      
      let { error } = createPaymentIntentSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.create_payment_intent_data(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  
}

const OrderControllerObj = new OrderController();
export default OrderControllerObj;
