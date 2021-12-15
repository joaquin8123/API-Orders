const bcrypt = require('bcrypt')

const logging = require('../config/logging');
const sendResponse = require('../helpers/handleResponse');
const signJWT = require('../helpers/signJWT');

const User = require( '../models/user');

const NAMESPACE = 'Auth Controller';
const SALT_ROUNDS = 10;

const validateToken = (req, res, next) => {
    logging.info(NAMESPACE, 'ValidateToken Method - Validate JWT');
    return sendResponse(res, 'AUTHORIZED', 200);
};

const register = async (req, res) => {
    logging.info(NAMESPACE, `Register Method`);
    let { email, password, firstName, lastName, role } = req.body;
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
        if (error) sendResponse(res, 'HASH_ERROR', 500, { data: error });
        const userExists = await User.findOne({ email });
        if (userExists) return sendResponse(res, 'USER_EXISTS', 401, { data: error });

        const user = new User({
            email,
            password: hash,
            firstName,
            lastName,
            role
        });
        //await sendMail(registerEmailTemplate(user));

        return user
            .save()
            .then((user) => sendResponse(res, 'REGISTER_SUCCESS', 201, { data: user }))
            .catch((error) => sendResponse(res, 'REGISTER_ERROR', 500, { data: error }));
    });
};

const login = async (req, res) => {
    logging.info(NAMESPACE, 'Login Method');
    let { email, password } = req.body;
    User.findOne({ email })
        .exec()
        .then((user) => {
            if (!user) return sendResponse(res, 'UNEXISTENT_USER', 401);
            if (!user.isActive) return sendResponse(res, 'INACTIVE_USER', 401);
            bcrypt.compare(password, user.password, (error, result) => {
                if (error) return sendResponse(res, 'LOGIN_ERROR', 401, { data: error });
                if (result) {
                    const token = signJWT(user)
                    if(token) return sendResponse(res, 'LOGIN_SUCCESS', 200, { data: token, user })
                    if(!token) return sendResponse(res, 'SIGN_TOKEN_ERROR ', 401, { data: err })
                } else return sendResponse(res, 'INCORRECT_PASSWORD', 401, { data: error });
            });
        })
        .catch((error) => sendResponse(res, 'SIGN_TOKEN_ERROR', 500, { data: error }));
};

const confirmAccount = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'Activate User Method');
        const { id, password } = req.body;
        const user = await User.findOne({ _id: id });
        if (!user) return sendResponse(res, 'UNEXISTENT_USER', 401);
        if (!bcrypt.compareSync(password, user.password)) return sendResponse(res, 'INCORRECT_PASSWORD', 401);
        user.isActive = true;
        user.save();
        return sendResponse(res, 'USER_ACTIVED_SUCCESS', 200);
    } catch (error) {
        return sendResponse(res, 'USER_ACTIVED_ERROR', 500, { data: error });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return sendResponse(res, 'UNEXISTENT_USER', 401);
        user.token = uuid();
        user.expires = Date.now() + 3600000;
        await user.save();
        await sendMail(resetPasswordEmailTemplate(user));

        return sendResponse(res, 'FORGOT_PASSWORD_SUCCESS', 200);
    } catch (error) {
        return sendResponse(res, 'FORGOT_PASSWORD_ERROR', 500, { data: error });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({ token });
        if (!user) return sendResponse(res, 'RESET_PASSWORD_EXPIRED', 401);
        if (user.expires && user.expires < Date.now()) return sendResponse(res, 'RESET_PASSWORD_EXPIRED', 401);

        user.password = await bcrypt.hash(password, SALT_ROUNDS);
        user.token = '';
        user.expires = 0;
        user.isActive = true;

        await user.save();

        return sendResponse(res, 'RESET_PASSWORD_SUCCESS', 200);
    } catch (error) {
        return sendResponse(res, 'RESET_PASSWORD_ERROR', 500, { data: error });
    }
};

module.exports = { validateToken, register, login, forgotPassword, resetPassword, confirmAccount };
