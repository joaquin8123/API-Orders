const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const PurchaseOrder = require("../models/purchaseOrder");
const NAMESPACE = "Purchase Orders Controller";

const getPurchaseOrders = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GetPurchaseOrders Method");
    const purchaseOrders = await PurchaseOrder.getPurchaseOrders();
    return sendResponse(res, "GET_PURCHASE_ORDERS", 200, {
      data: { purchaseOrders, count: purchaseOrders.length },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllPurchaseOrdersByStatus = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getAllPurchaseOrdersByStatus Method");
    const status = req.params.status;
    const purchaseOrders = await PurchaseOrder.getAllPurchaseOrdersByStatus(
      status
    );
    return sendResponse(res, "GET_ALL_PURCHASE_ORDERS_STATUS", 200, {
      data: { purchaseOrders, count: purchaseOrders.length },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const getPurchaseOrderById = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getPurchaseOrderById Method");
    const purchaseOrderId = req.params.purchaseOrderId;
    const purchaseOrder = await PurchaseOrder.getPurchaseOrderById(
      purchaseOrderId
    );
    if (!purchaseOrder.length)
      return sendResponse(res, "GET_PURCHASE_ORDER_NOT_FOUND", 404);
    return sendResponse(res, "GET_PURCHASE_ORDER_SUCCESS", 200, {
      data: { purchaseOrder },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_PURCHASE_ORDER_ERROR", 500, {
      data: { error },
    });
  }
};

const getOrdersBySupplier = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getOrdersBySupplier Method");
    const supplierId = req.params.supplierId;
    const purchaseOrder = await PurchaseOrder.getPurchaseOrderBySupplierId(
      supplierId
    );
    if (!purchaseOrder.length)
      return sendResponse(res, "GET_PURCHASE_ORDERS_NOT_FOUND", 404);
    return sendResponse(res, "GET_PURCHASE_ORDERS_SUCCESS", 200, {
      data: { purchaseOrder },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_PURCHASE_ORDERS_ERROR", 500, {
      data: { error },
    });
  }
};

const createPurchaseOrder = async (req, res) => {
  try {
    logging.info(NAMESPACE, "CreatePurchaseOrder Method");
    const purchaseOrder = await PurchaseOrder.createPurchaseOrder(req.body);

    return sendResponse(res, "PURCHASE_ORDER_SUCCESS", 201, {
      data: purchaseOrder,
    });
  } catch (error) {
    return sendResponse(res, "PURCHASE_ORDER_ERROR", 500, { data: error });
  }
};

const updatePurchaseOrder = async (req, res) => {
  try {
    logging.info(NAMESPACE, "updatePurchaseOrder Method");
    const { purchaseOrderId, status } = req.body;
    await PurchaseOrder.updateOrder({ purchaseOrderId, status });
    return sendResponse(res, "PURCHASE_ORDER_UPDATE_SUCCESS", 200);
  } catch (error) {
    return sendResponse(res, "PURCHASE_UPDATE_ORDER_ERROR", 500, { data: error });
  }
};

const getLastNumeration = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getLastNumeration Method");
    const { lastNumeration } = await PurchaseOrder.lastNumeration();
    if (!lastNumeration.length)
      return sendResponse(res, "GET_PURCHASE_ORDER_NUMERATION_NOT_FOUND", 404);
    return sendResponse(res, "GET_PURCHASE_ORDER_NUMERATION_SUCCESS", 200, {
      data: { lastNumeration },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_PURCHASE_ORDER_NUMERATION_ERROR", 500, {
      data: { error },
    });
  }
};

module.exports = {
  getPurchaseOrders,
  getPurchaseOrderById,
  getOrdersBySupplier,
  createPurchaseOrder,
  updatePurchaseOrder,
  getAllPurchaseOrdersByStatus,
  getLastNumeration,
};
