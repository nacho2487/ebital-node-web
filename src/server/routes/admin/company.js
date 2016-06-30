var express = require('express');
var router = express.Router();
var Company = require('../../models/Company');
var controller = require('../../controllers/admin/company')(Company);
var upload = require('./../../helpers/multer');
var companyUploadFile = upload.single('company-image');

var routes = function() {

	router.route('/:type/:position')
		.get(controller.edit)
		.post(companyUploadFile, controller.save);

	return router;
};

module.exports = routes;
