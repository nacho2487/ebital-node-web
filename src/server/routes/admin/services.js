var express = require('express');
var router = express.Router();
var Service = require('../../models/Service');
var controller = require('../../controllers/admin/services')(Service);

var routes = function() {

	router.get('/', controller.list);

	router.route('/add')
		.get(controller.add)
		.post(controller.save);


	router.route('/:id/edit')
		.get(controller.edit)
		.post(controller.update);

	router.get('/:id/delete', controller.remove);

	router.post('/:id/position/:position/update', controller.updatePosition);


	return router;	
};

module.exports = routes;
