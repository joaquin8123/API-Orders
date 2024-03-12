const bcrypt = require("bcrypt");

const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");

const User = require("../models/user");
const Client = require("../models/client");
const signJWT = require("../helpers/signJWT");
const NAMESPACE = "Auth Controller";
const SALT_ROUNDS = 10;

const register = async (req, res) => {
  logging.info(NAMESPACE, `Register Method`);

  try {
    const {
      username,
      password,
      type,
      name,
      address,
      phone,
      date,
      rolId,
      groupId,
      cityId,
      active = true,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userExists = await User.getUser({ username, type });

    if (userExists.length > 0) {
      return sendResponse(res, "USER_EXISTS", 401, {
        data: "User already exists",
      });
    }

    if (type === "user") {
      const user = new User({
        username,
        password: hashedPassword,
        rolId,
        groupId,
        active,
      });

      const registeredUser = await user.register();
      return sendResponse(res, "REGISTER_USER_SUCCESS", 201, {
        data: registeredUser,
      });
    }

    const client = new Client({
      username,
      password: hashedPassword,
      name,
      address,
      phone,
      cityId,
      rolId,
      date,
    });
    const registeredClient = await client.register();
    return sendResponse(res, "REGISTER_CLIENT_SUCCESS", 201, {
      data: registeredClient,
    });
  } catch (error) {
    console.error("Error in register:", error);
    return sendResponse(res, "REGISTER_ERROR", 500, { data: error });
  }
};

const login = async (req, res) => {
  logging.info(NAMESPACE, "Login Method");

  try {
    let { username, password, type = "user" } = req.body;
    const user = await User.getUser({ username, type });

    if (!user.length) {
      return sendResponse(res, "UNEXISTENT_USER", 401);
    }

    if (!user[0].active) {
      return sendResponse(res, "UNACTIVE_USER", 401);
    }

    const result = await bcrypt.compare(password, user[0].password);
    if (result) {
      const token = signJWT(user);

      if (token) {
        return sendResponse(res, "LOGIN_SUCCESS", 200, {
          data: { token, clientId: user[0].id },
        });
      } else {
        return sendResponse(res, "SIGN_TOKEN_ERROR", 401);
      }
    } else {
      return sendResponse(res, "INCORRECT_PASSWORD", 401);
    }
  } catch (error) {
    return sendResponse(res, "LOGIN_ERROR", 401, { data: error });
  }
};

const resetPassword = async (req, res) => {
  logging.info(NAMESPACE, "ResetPassword Method");

  try {
    let {
      username,
      password,
      newPassword,
      type = "user",
      isReset = false,
    } = req.body;

    const user = await User.getUser({ username, type });

    if (!user.length) {
      return sendResponse(res, "UNEXISTENT_USER", 401);
    }

    if (isReset) {
      await User.updateUser({ userId: user[0].id, password: null });
      return sendResponse(res, "RESET_PASSWORD_SUCCESS", 200, {});
    }

    const result = await bcrypt.compare(password, user[0].password);

    if (result) {
      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await User.updateUser({ userId: user[0].id, password: passwordHash });
      return sendResponse(res, "NEW_PASSWORD_SUCCESS", 200, {});
    } else {
      return sendResponse(res, "RESET_INCORRECT_PASSWORD", 401, {});
    }
  } catch (error) {
    return sendResponse(res, "RESET_ERROR", 401, { data: error });
  }
};

module.exports = { register, login, resetPassword };
