const jwt = require('jsonwebtoken')

const config = require('../config/config')
const logging = require('../config/logging')
const sendResponse = require('../helpers/handleResponse')

const NAMESPACE = 'Middleware';

const extractJWT = (req, res, next) => {
    logging.info(NAMESPACE, `ExtractJWT Method`);
    let token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decode) => {
            if (error) {
                return sendResponse(res,'VERIFY_JWT_ERROR', 401, { data: error.message });
            } else {
                res.locals.jwt = decode;
                next();
            }
        });
    } else {
        return sendResponse(res, 'UNAUTHORIZED', 401);
    }
};

module.exports = extractJWT ;
