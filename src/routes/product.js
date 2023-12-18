const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const productController = require("../controllers/product");

router.get("/", extractJWT, productController.getProducts);
router.get("/:productId", extractJWT, productController.getProductById);
router.post("/", extractJWT, productController.createProduct);
router.put("/", extractJWT, productController.updateProduct);

module.exports = router;
