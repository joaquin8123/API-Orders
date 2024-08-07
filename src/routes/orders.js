const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const orderController = require("../controllers/orders");

router.get("/monthlyAmount", extractJWT, orderController.monthlyAmount);
router.get("/salesByMonth", extractJWT, orderController.salesByMonth);
router.get("/salesByProduct", extractJWT, orderController.salesByProduct);
router.get("/auditReport", extractJWT, orderController.auditReport);
router.get("/client/:clientId", extractJWT, orderController.getOrdersByClient);
router.get("/id/:orderId", extractJWT, orderController.getOderById);
router.get("/:offset", extractJWT, orderController.getOrders);
router.get("/", extractJWT, orderController.getOrders);
router.get("/all/:status", extractJWT, orderController.getAllOrders);
router.post("/", extractJWT, orderController.createOrder);
router.put("/", extractJWT, orderController.updateOrder);

module.exports = router;
