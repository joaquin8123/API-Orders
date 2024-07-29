const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const purchaseOrderController = require("../controllers/purchaseOrder");

router.post("/add", extractJWT, purchaseOrderController.createPurchaseOrder);
router.get("/num", extractJWT, purchaseOrderController.getLastNumeration);
router.get(
  "/:supplierId",
  extractJWT,
  purchaseOrderController.getOrdersBySupplier
);
router.get(
  "/id/:purchaseOrderId",
  extractJWT,
  purchaseOrderController.getPurchaseOrderById
);
router.get("/", extractJWT, purchaseOrderController.getPurchaseOrders);
router.get(
  "/:status",
  extractJWT,
  purchaseOrderController.getAllPurchaseOrdersByStatus
);

router.put("/", extractJWT, purchaseOrderController.updatePurchaseOrder);

module.exports = router;
