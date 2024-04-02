const { v4: uuid } = require('uuid');
const { sign } = require('jsonwebtoken');
const {
  tokens: { expirationTimeAccessToken, expirationTimeRefreshToken, secret },
} = require('config');

export const generateTokens = ({ hostUrl, user }) => {
  const username = user.username;
  try {
    const accessToken = createGenericToken({
      hostUrl,
      tokenType: 'access',
      expirationTime: expirationTimeAccessToken,
      username,
      otherPayloadParams: {
        company: user.company,
      },
    });
    const refreshToken = createGenericToken({
      hostUrl,
      tokenType: 'refresh',
      expirationTime: expirationTimeRefreshToken,
      username,
    });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(`There was an error generating the tokens: ${err.message}`);
  }
};

const createGenericToken = ({
  hostUrl,
  username,
  tokenType,
  expirationTime,
  otherPayloadParams = {},
}) =>
  sign(
    {
      token_use: tokenType,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expirationTime * 60,
      ...otherPayloadParams,
    },
    secret,
    {
      issuer: hostUrl,
      jwtid: uuid(),
      subject: username,
    },
  );
