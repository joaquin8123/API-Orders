const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Supplier = require("../models/supplier");
const NAMESPACE = "Supplier Controller";

const getSuppliers = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GetSuppliers Method");
    const suppliers = await Supplier.getAll();
    return sendResponse(res, "GET_SUPPLIER", 200, {
      data: { suppliers },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  getSuppliers,
};
