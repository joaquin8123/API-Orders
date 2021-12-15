const logging = require('../config/logging')
const sendResponse = require('../helpers/handleResponse')
//models
const User = require('../models/user')
const NAMESPACE = 'User Controller';

const getUsers = (req, res) => {
    logging.info(NAMESPACE, 'GetUsers Method');
    User.find()
        .select('-password')
        .exec()
        .then((users) => sendResponse(res, 'GET_USERS', 200, { data: { users, count: users.length } }))
        .catch((error) => sendResponse(res, 'GET_USERS_ERROR', 500));
};

const updateUser = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'UpdateUser Method');
        const body = req.body;
        const { email } = res.locals.jwt;
        const user = await User.findOneAndUpdate({ email }, body, { new: true });
        if (!user) return sendResponse(res, 'UPDATE_USER_ERROR', 400);
        return sendResponse(res, 'UPDATE_USER_SUCCESS', 200, { data: { user } });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'UPDATE_USER_ERROR', 500, { data: { error } });
    }
};


const getUserByEmail = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'GetUserByEmail Method');
        const { email } = res.locals.jwt;
        const user = await User.findOne({ email });
        const loggedInUser = {
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            role: user?.role,
            image: user?.image
        };
        if (!user) return sendResponse(res, 'GET_USER_ERROR', 400);
        return sendResponse(res, 'GET_USER_SUCCESS', 200, { data: { user: loggedInUser } });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'GET_USER_ERROR', 500, { data: { error } });
    }
};

module.exports = { getUsers, updateUser, getUserByEmail };