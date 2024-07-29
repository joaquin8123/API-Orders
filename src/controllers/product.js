const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Product = require("../models/product");
const NAMESPACE = "Product Controller";

async function getProducts(req, res) {
  try {
    logging.info(NAMESPACE, "getProducts Method");
    const products = await Product.getProducts();
    return sendResponse(res, "GET_PRODUCTS_SUCCESS", 200, {
      data: { products, count: products.length },
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getProductsApp(req, res) {
  try {
    logging.info(NAMESPACE, "getProductsApp Method");
    const products = await Product.getProductsApp();
    return sendResponse(res, "GET_PRODUCTS_SUCCESS", 200, {
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
    return sendResponse(res, "GET_PRODUCT_SUCCESS", 200, {
      data: { product: product },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_PRODUCT_ERROR", 500, { data: { error } });
  }
};

const createProduct = async (req, res) => {
  try {
    logging.info(NAMESPACE, "createProduct Method");
    const {
      name,
      description,
      price,
      stock,
      image = "",
      active = true,
    } = req.body;
    //validate params

    const productExists = await Product.getProductByName(name);
    if (productExists.length > 0) {
      return sendResponse(res, "CREATE_ALREADY_EXISTS", 409, {
        data: "product already exists.",
      });
    }
    const product = new Product({
      name,
      description,
      price,
      stock,
      image,
      active,
    });

    return product
      .createProduct()
      .then((product) =>
        sendResponse(res, "CREATE_PRODUCT_SUCCESS", 201, { data: product })
      )
      .catch((error) =>
        sendResponse(res, "CREATE_PRODUCT_ERROR", 500, { data: error })
      );
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateProduct = async (req, res) => {
  try {
    logging.info(NAMESPACE, "updateProduct Method");
    const { productId, active } = req.body;
    await Product.updateProductStatus({ productId, active });
    return sendResponse(res, "PRODUCT_UPDATE_SUCCESS", 200);
  } catch (error) {
    return sendResponse(res, "PRODUCT_UPDATE_ERROR", 500, { data: error });
  }
};
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  getProductsApp,
};
