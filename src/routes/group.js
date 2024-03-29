const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const groupController = require("../controllers/group");

router.get("/permissions", extractJWT, groupController.getAllPermissions);
router.get(
  "/permissions/:userId",
  extractJWT,
  groupController.getPermissionsByUserId
);
router.get("/", extractJWT, groupController.getAllGroups);
router.get("/rol", extractJWT, groupController.getAllRols);
router.get("/:groupId", extractJWT, groupController.getGroupById);
router.put("/", extractJWT, groupController.updateGroup);
//router.put("/permissions", extractJWT, groupController.updateGroupPermissions);
router.post("/", extractJWT, groupController.createGroup);

module.exports = router;
