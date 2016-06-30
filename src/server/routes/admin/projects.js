var express = require('express');
var router = express.Router();
var Project = require('../../models/Project');
var Service = require('../../models/Service');
var Home = require('../../models/Home');
var controller = require('../../controllers/admin/projects')(Project, Service, Home);
var upload = require('./../../helpers/multer');
var uploadFields = upload.fields([{ name: 'project-principal-image', maxCount: 1 }, { name: 'project-images' }]);

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

	router.route('/:id/highlight/:highlight/update')
		.post(controller.updateHighlight)
		.get(controller.updateHighlightGet);

	return router;
};

module.exports = routes;


