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
    const { name, active } = params;
    await Group.getGroupByName(name);
    sendResponse(res, "UPDATE_ACTIVE_GROUP", 200, {});
  } catch (error) {
    console.error("Error:", error);
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

module.exports = {
  updateGroup,
  getAllRols,
  getAllGroups,
  getGroupById,
  createGroup,
};
