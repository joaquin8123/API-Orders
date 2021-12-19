const logging = require('../config/logging')
const sendResponse = require('../helpers/handleResponse')
//models
const Order = require('../models/order')
const NAMESPACE = 'User Controller';

const getOrders = (req, res) => {
    logging.info(NAMESPACE, 'GetOrders Method');
    Order.find()
        // .select('-password')
        .exec()
        .then((orders) => sendResponse(res, 'GET_ORDERS', 200, { data: { orders, count: orders.length } }))
        .catch((error) => sendResponse(res, 'GET_ORDERS_ERROR', 500));
};

const createOrder = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'CreateOrder Method');
        const  { description, productos, total, user } = req.body;
        const order = new Order({
            description,
            productos,
            total,
            user
        })
        return order
            .save()
            .then((order) => sendResponse(res, 'ORDER_SUCCESS', 201, { data: order }))
            .catch((error) => sendResponse(res, 'ORDER_ERROR', 500, { data: error }));
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'ORDER_ERROR', 500, { data: { error } });
    }
};


const getOderById = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'GetOrderById Method');
        const orderId  = req.params.orderId
        const order = await Order.findOne({ orderId });
        if (!order) return sendResponse(res, 'GET_ORDER_UNEXIST', 400);
        return sendResponse(res, 'GET_ORDER_SUCCESS', 200, { data: { user: order } });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'GET_ORDER_ERROR', 500, { data: { error } });
    }
};

module.exports = { getOrders, createOrder, getOderById };