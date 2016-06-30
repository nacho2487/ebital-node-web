var express = require('express');
var router = express.Router();
var News = require('../../models/News');
var controller = require('../../controllers/admin/news')(News);
var upload = require('./../../helpers/multer');
var uploadFields = upload.fields([{ name: 'news-principal-image', maxCount: 1 }, { name: 'news-images' }]);

var routes = function() {
	router.get('/', controller.list);
	
	router.route('/add')
		.get(controller.add)
		.post(uploadFields, controller.save);


	router.route('/:id/edit')
		.get(controller.edit)
		.post(uploadFields, controller.update);

	router.get('/:id/delete', controller.remove);

	router.post('/:id/position/:position/update', controller.updatePosition);

	router.post('/:id/image/:fileName/delete', controller.removeImageFromList);

	return router;
};
module.exports = routes;


