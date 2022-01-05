const logging = require('../config/logging')
const sendResponse = require('../helpers/handleResponse')
//models
const Shop = require('../models/shop')
const NAMESPACE = 'Shop Controller';

const getShops = (req, res) => {
    logging.info(NAMESPACE, 'GetShops Method');
    Shop.find()
        .exec()
        .then((shops) => sendResponse(res, 'GET_SHOPS', 200, { data: { shops, count: shops.length } }))
        .catch((error) => sendResponse(res, 'GET_SHOPS_ERROR', 500));
};

const getShopById = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'GetShopById Method');
        const shopId  = req.params.shopId
        const shop = await Shop.findOne({ shopId });
        if (!shop) return sendResponse(res, 'GET_SHOP_UNEXIST', 400);
        return sendResponse(res, 'GET_SHOP_SUCCESS', 200, { data: { user: shop } });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'GET_SHOP_ERROR', 500, { data: { error } });
    }
};

const updateShop = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'UpdateShop Method');
        const body = req.body;
        const shopId = req.params.shopId
        const shop = await Shop.findOneAndUpdate({ shopId }, body, { new: true });
        if (!shop) return sendResponse(res, 'UPDATE_SHOP_ERROR', 400);
        return sendResponse(res, 'UPDATE_SHOP_SUCCESS', 200, { data: { shop } });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'UPDATE_SHOP_ERROR', 500, { data: { error } });
    }
};


const createShop = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'CreateShop Method');
        const  { name, category } = req.body;
        const shop = new Shop({
            name,
            category
        })
        return shop
            .save()
            .then((shop) => sendResponse(res, 'SHOP_SUCCESS', 201, { data: shop }))
            .catch((error) => sendResponse(res, 'SHOP_ERROR', 500, { data: error }));
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'SHOP_ERROR', 500, { data: { error } });
    }
};

module.exports = { getShops, updateShop, createShop , getShopById};