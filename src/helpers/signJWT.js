const jwt = require('jsonwebtoken');

const config = require('../config/config');
const logging = require('../config/logging');

const NAMESPACE = 'Helpers';

const signJWT = (user) => {
    const timeSinceEpoch = new Date().getTime();
    const expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    const expirationTimeInSeconds = Math.floor(expirationTime / 1000);
    const signOptions = {
        issuer:  config.server.token.issuer,
        expiresIn:  expirationTimeInSeconds,    // 30 days validity
        algorithm:  "HS256"    
    };
    try {
        return jwt.sign({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                image: user.image
            },
            config.server.token.secret,
            signOptions
        );
    } catch (error) {
        logging.error(NAMESPACE, error.message, error);
        //callback(error, null);
    }
};
module.exports = signJWT;