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
  const { username, password, type, name, address, phone } = req.body;
  bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
    if (error) sendResponse(res, "HASH_ERROR", 500, { data: error });
    const userExists = await User.getUser({ username, type });

    if (userExists.length > 0) {
      return sendResponse(res, "USER_EXISTS", 401, { data: error });
    }

    if (type === "user") {
      const user = new User(username, hash);
      return user
        .register()
        .then((user) =>
          sendResponse(res, "REGISTER_USER_SUCCESS", 201, { data: user })
        )
        .catch((error) =>
          sendResponse(res, "REGISTER_USER_ERROR", 500, { data: error })
        );
    }
    const client = new Client(username, hash, name, address, phone);
    return client
      .register()
      .then((client) =>
        sendResponse(res, "REGISTER_CLIENT_SUCCESS", 201, { data: client })
      )
      .catch((error) =>
        sendResponse(res, "REGISTER_CLIENT_ERROR", 500, { data: error })
      );
  });
};

const login = async (req, res) => {
  logging.info(NAMESPACE, "Login Method");
  let { username, password, type = "user" } = req.body;
  const user = await User.getUser({ username, type });
  if (!user.length) {
    return sendResponse(res, "UNEXISTENT_USER", 401);
  }
  bcrypt.compare(password, user[0].password, (error, result) => {
    if (error) return sendResponse(res, "LOGIN_ERROR", 401, { data: error });
    if (result) {
      const token = signJWT(user);
      if (token) {
        return sendResponse(res, "LOGIN_SUCCESS", 200, {
          data: { token, clientId: user[0].id },
        });
      } else {
        return sendResponse(res, "SIGN_TOKEN_ERROR ", 401);
      }
    } else return sendResponse(res, "INCORRECT_PASSWORD", 401, { data: error });
  });
};



module.exports = { register, login };
