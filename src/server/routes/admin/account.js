var express = require('express');
var routes = function() {
	var router = express.Router();

	var adminUserController = require('../../controllers/user');

	router.get('/', adminUserController.getAccount);
	router.post('/password', adminUserController.postUpdatePassword);
	return router;
};
module.exports = routes;
