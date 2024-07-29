const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const supplierController = require("../controllers/suppliers");

router.get("/", extractJWT, supplierController.getSuppliers);

module.exports = router;
