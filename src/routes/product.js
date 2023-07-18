const express = require('express')
const router = express.Router();
// const extractJWT = require('../middlewares/extractJWT')
const productController = require('../controllers/product')


router.get('/all', productController.getProducts);
router.get('/:productId', productController.getProductById);

module.exports = router;
