const express = require('express')
const router = express.Router();
const extractJWT = require('../middlewares/extractJWT')
const shopController = require('../controllers/shops')


router.get('/all', extractJWT, shopController.getShops);
router.get('/:shopId', extractJWT, shopController.getShopById);
router.post('/', extractJWT, shopController.createShop);
router.put('/', extractJWT, shopController.updateShop);

module.exports = router;
