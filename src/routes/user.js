const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const userController = require("../controllers/users");

router.get("/", extractJWT, userController.getAllUser);
router.get("/id/:userId", extractJWT, userController.getUserById);
router.put("/", extractJWT, userController.updateUser);

module.exports = router;
