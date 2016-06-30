var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
// router.get('/forgot', adminUserController.getForgot);
// router.post('/forgot', adminUserController.postForgot);
// router.get('/reset/:token', adminUserController.getReset);
// router.post('/reset/:token', adminUserController.postReset);

module.exports = router;



