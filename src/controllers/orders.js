const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Order = require("../models/order");
const Product = require("../models/product");
const NAMESPACE = "User Controller";

const getOrders = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GetOrders Method");
    const offset = req.params.offset || 0;
    const orders = await Order.getOrders(offset);
    sendResponse(res, "GET_ORDERS", 200, {
      data: { orders, count: orders.length },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
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

const createOrder = async (req, res) => {
  try {
    logging.info(NAMESPACE, "CreateOrder Method");
    const { products, clientId } = req.body;
    //validate stocks de los productos
    let isValidStock = true;
    for (const product of products) {
      const productDb = await Product.getProductById(product.productId);
      if (product.quantity > productDb[0].stock) {
        isValidStock = false;
        break;
      }
    }
    if (!isValidStock) {
      return sendResponse(res, "CREATE_ORDER_STOCK_ERROR", 409, {
        data: "Product out of stock",
      });
    }
    //calcular amount y delivery_time
    const { amount, deliveryTime } = await calculateAmountAndDeliveryTime(
      products
    );
    //crear la order
    const orderInstance = new Order({
      date: new Date(),
      clientId,
      status: "PENDING",
      products,
      amount,
      deliveryTime,
    });
    const order = await orderInstance.createOrder();
    await orderInstance.createOrderLine({
      orderId: order.insertId,
      products,
    });
    sendResponse(res, "ORDER_SUCCESS", 201, { data: order });
  } catch (error) {
    sendResponse(res, "ORDER_ERROR", 500, { data: error });
  }
};

const calculateAmountAndDeliveryTime = async (products) => {
  let amount = 0;
  let deliveryTime = 0;
  for (const item of products) {
    const product = await Product.getProductById(item.productId);
    amount += product[0].price * item.quantity;
    deliveryTime += product[0].preparationTime;
  }
  return { amount, deliveryTime };
};
const updateOrder = async (req, res) => {
  try {
    logging.info(NAMESPACE, "updateOrder Method");
    const { orderId, status } = req.body;
    await Order.updateOrderStatus({ orderId, status });
    sendResponse(res, "ORDER_UPDATE_SUCCESS", 200);
  } catch (error) {
    sendResponse(res, "ORDER_ERROR", 500, { data: error });
  }
};

module.exports = { getOrders, getOderById, createOrder, updateOrder };
