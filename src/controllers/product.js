const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
//models
const Product = require("../models/product"); 
const NAMESPACE = "Product Controller";

async function getProducts(req, res) {
  try {
    logging.info(NAMESPACE, "getProducts Method");
    const products = await Product.getProducts()
    sendResponse(res, "GET_PRODUCTS", 200, {
      data: { products, count: products.length },
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

const getProductById = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getProductById Method");
    const productId = req.params.productId;
    const product = await Product.getProductById(productId);
    if (!product.length) return sendResponse(res, "GET_PRODUCT_NOT_FOUND", 404);
    return sendResponse(res, "GET_ORDER_SUCCESS", 200, {
      data: { product: product },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_PRODUCT_ERROR", 500, { data: { error } });
  }
};

module.exports = { getProducts, getProductById };
