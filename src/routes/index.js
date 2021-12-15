const express = require('express')
const logging = require('../config/logging')
const router = express.Router();
const NAMESPACE = 'Index Routes';

router.get('/test', (req, res, next) => {
    logging.info(NAMESPACE, `Index Route Called - API: Online - Routes Orders.`);
    return res.status(200).json({ message: '~ Welcome ~ API: Online' });
});


module.exports = router;
