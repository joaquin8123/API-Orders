const express = require('express')
const router = express.Router();
const extractJWT = require('../middlewares/extractJWT')
const orderController = require('../controllers/orders')


router.get('/all', orderController.getOrders);
router.get('/:orderId', orderController.getOderById);

// router.post('/', extractJWT, orderController.createOrder);
//router.post('/update', extractJWT, orderController.updateOrder);

module.exports = router;
