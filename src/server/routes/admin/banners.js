var express = require('express');
var router = express.Router();
var Home = require('../../models/Home');
var Banner = require('../../models/Banner');
var controller = require('../../controllers/admin/banner')(Banner, Home);
var upload = require('./../../helpers/multer');
var bannerUploadFile = upload.single('banner-image');

var routes = function() {
	router.get('/', controller.list);

	router.route('/add')
		.get(controller.add)
		.post(bannerUploadFile, controller.save);


	router.route('/:id/edit')
		.get(controller.edit)
		.post(bannerUploadFile, controller.update);

	router.get('/:id/delete', controller.remove);

	router.post('/:id/position/:position/update', controller.updatePosition);

	return router;
};

module.exports = routes;
