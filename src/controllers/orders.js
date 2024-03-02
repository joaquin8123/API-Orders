const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Client = require("../models/client");
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

const getAllOrders = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GetAllOrders Method");
    const status = req.params.status;
    const orders = await Order.getAllOrdersByStatus(status);
    sendResponse(res, "GET_ALL_ORDERS", 200, {
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

const getOrdersByClient = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GetOrderByClientId Method");
    const clientId = req.params.clientId;
    const orders = await Order.getOrderByClientId(clientId);
    if (!orders.length) return sendResponse(res, "GET_ORDERS_NOT_FOUND", 404);
    return sendResponse(res, "GET_ORDERS_SUCCESS", 200, {
      data: { orders },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_ORDERS_ERROR", 500, { data: { error } });
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
    const client = await Client.getClient({ clientId });
    const io = req.app.get("socketio");
    io.emit("order-updated", {
      source: "backoffice",
      order: {
        orderId: order.insertId,
        client: client.name,
        status: "PENDING",
        amount,
        date: orderInstance.date,
        deliveryTime,
      },
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
    const io = req.app.get("socketio");
    io.emit("order-updated", { source: "app", orderId, status });
    sendResponse(res, "ORDER_UPDATE_SUCCESS", 200);
  } catch (error) {
    sendResponse(res, "ORDER_ERROR", 500, { data: error });
  }
};

const monthlyAmount = async (req, res) => {
  try {
    logging.info(NAMESPACE, "monthlyAmount Method");
    const monthlyData = await Order.monthlyAmount();
    sendResponse(res, "GET_MONTHLY_AMOUNT_ORDERS", 200, {
      data: { monthlyData },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const salesByMonth = async (req, res) => {
  try {
    logging.info(NAMESPACE, "salesByMonth Method");
    const salesByMonth = await Order.salesByMonth();
    sendResponse(res, "GET_MONTHLY_SALES_ORDERS", 200, {
      data: { salesByMonth },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const salesByProduct = async (req, res) => {
  try {
    logging.info(NAMESPACE, "salesByProduct Method");
    const salesByProduct = await Order.salesByProduct();
    sendResponse(res, "GET_MONTHLY_SALES_PRODUCT_ORDERS", 200, {
      data: { salesByProduct },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  getOrders,
  getOderById,
  getOrdersByClient,
  createOrder,
  updateOrder,
  monthlyAmount,
  salesByMonth,
  salesByProduct,
  getAllOrders,
};
