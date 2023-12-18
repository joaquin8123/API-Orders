const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const orderController = require("../controllers/orders");

router.get("/monthlyAmount", extractJWT, orderController.monthlyAmount);
router.get("/salesByMonth", extractJWT, orderController.salesByMonth);
router.get("/salesByProduct", extractJWT, orderController.salesByProduct);
router.get("/:offset", extractJWT, orderController.getOrders);
router.get("/", extractJWT, orderController.getOrders);
router.get("/:orderId", extractJWT, orderController.getOderById);
router.post("/", extractJWT, orderController.createOrder);
router.put("/", extractJWT, orderController.updateOrder);

module.exports = router;
