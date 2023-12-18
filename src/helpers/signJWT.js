const jwt = require("jsonwebtoken");

const config = require("../config/config");
const logging = require("../config/logging");

const NAMESPACE = "Helpers";

const signJWT = (user) => {
  const timeSinceEpoch = new Date().getTime();
  const expirationTime =
    timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
  const expirationTimeInSeconds = Math.floor(expirationTime / 1000);
  const signOptions = {
    issuer: config.server.token.issuer,
    expiresIn: expirationTimeInSeconds, // 30 days validity
    algorithm: "HS256",
  };

  try {
    const token = jwt.sign(
      {
        clientId: user[0].id,
        username: user[0].username,
        role: user[0].role ? user[0].role : null,
      },
      config.server.token.secret,
      signOptions
    );
    return token;
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
  }
};
module.exports = signJWT;
