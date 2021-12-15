const express = require('express')
const router = express.Router();
const extractJWT = require('../middlewares/extractJWT')
const userController = require('../controllers/users')


router.get('/all', extractJWT, userController.getUsers);
router.get('/user', extractJWT, userController.getUserByEmail);

router.post('/update', extractJWT, userController.updateUser);

module.exports = router;
