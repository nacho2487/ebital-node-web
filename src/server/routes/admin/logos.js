var express = require('express');
var router = express.Router();
var CompanyLogo = require('../../models/Logo');
var controller = require('../../controllers/admin/logos')(CompanyLogo);
var upload = require('./../../helpers/multer');
var uploadFields = upload.single('logo-image');

var routes = function() {

	router.route('/add')
		.get(controller.add)
		.post(uploadFields, controller.save);


	router.route('/:id/edit')
		.get(controller.edit)
		.post(uploadFields, controller.update);

	router.get('/:id/delete', controller.remove);

	router.post('/:id/position/:position/update', controller.updatePosition);
	return router;
};

module.exports = routes;
