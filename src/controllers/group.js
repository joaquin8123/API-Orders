const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Group = require("../models/group");
const NAMESPACE = "Group Controller";

const getGroupById = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getGroupById Method");
    const groupId = req.params.groupId;
    const group = await Group.getGroupById(groupId);
    sendResponse(res, "GET_GROUP", 200, {
      data: { group },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const createGroup = async (req, res) => {
  try {
    logging.info(NAMESPACE, "createGroup Method");
    const { name, permissionsIds, active } = req.body;
    const groupNameExists = await Group.getGroupByName(name);
    if (groupNameExists.length > 0) {
      return sendResponse(res, "CREATE_GROUP_ALREADY_EXISTS", 409, {
        data: "group already exists.",
      });
    }
    const groupInstance = new Group(name, active);
    const group = await groupInstance.createGroup();
    await groupInstance.createGroupPermission({
      groupId: group.insertId,
      permissionsIds,
    });
    sendResponse(res, "CREATE_GRROUP_SUCCESS", 201, { data: group });
  } catch (error) {
    sendResponse(res, "CREATE_GRROUP_ERROR", 500, { data: error });
  }
};
const updateGroup = async (req, res) => {
  try {
    logging.info(NAMESPACE, "updateGroup Method");
    await Group.updateGroup(req.body);
    sendResponse(res, "UPDATE_ACTIVE_GROUP", 200, {});
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllGroups = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getAllGroups Method");
    const groups = await Group.getAllGroups();
    sendResponse(res, "GET_GROUPS", 200, {
      data: { groups },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllRols = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getAllRols Method");
    const rols = await Group.getAllRols();
    sendResponse(res, "GET_ROLS", 200, {
      data: { rols },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllPermissions = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getAllPermissions Method");
    const permissions = await Group.getAllPermissions();
    sendResponse(res, "GET_ALL_PERMISSIONS", 200, {
      data: { permissions },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const getPermissionsByUserId = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getPermissionsByUserId Method");
    const userId = req.params.userId;
    const permissions = await Group.getPermissionsByUserId(userId);
    sendResponse(res, "GET_PERMISSIONS", 200, {
      data: { permissions: permissions[0].permissions },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateGroupPermissions = async (req, res) => {
  try {
    logging.info(NAMESPACE, "updateGroupPermissions Method");
    await Group.updateGroupPermissions(req.body);
    sendResponse(res, "UPDATE_GROUP_PERMISSIONS", 200, {});
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  updateGroup,
  updateGroupPermissions,
  getAllRols,
  getAllGroups,
  getGroupById,
  createGroup,
  getAllPermissions,
  getPermissionsByUserId,
};
