const express = require('express')
// const extractJWT = require('../middlewares/extractJWT')
const  authController = require('../controllers/auth')

const router = express.Router();

// router.get('/validate', extractJWT, authController.validateToken);

router.post('/register', authController.register);
router.post('/login', authController.login);
// router.post('/confirm-account', authController.confirmAccount);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);


module.exports = router ;
