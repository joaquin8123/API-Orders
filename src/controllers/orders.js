const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
//models
const Order = require("../models/order"); // Import the Order class
const NAMESPACE = "User Controller";

async function getOrders(req, res) {
  try {
    logging.info(NAMESPACE, "GetOrders Method");
    const orders = await Order.getOrders();
    sendResponse(res, "GET_ORDERS", 200, {
      data: { orders, count: orders.length },
    });
    console.log(orders);
  } catch (error) {
    console.error("Error:", error);
  }
}
const getOderById = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GetOrderById Method");
    const orderId = req.params.orderId;
    const order = await Order.getOrderById(orderId);
    if (!order.length) return sendResponse(res, "GET_ORDER_NOT_FOUND", 404);
    return sendResponse(res, "GET_ORDER_SUCCESS", 200, {
      data: { order: order },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_ORDER_ERROR", 500, { data: { error } });
  }
};

module.exports = { getOrders, getOderById };
