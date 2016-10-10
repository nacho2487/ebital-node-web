var co = require('co');
var REDIRECT_URL = 'admin/services';

var servicesController = function(Service) {
	var baseController = require('./base')(Service, REDIRECT_URL, 'Service');
	var list = co.wrap(function* (req, res){
		var services  = yield baseController.get(req, res);
		res.render('admin/services', {
			title: res.__n('Service', 2),
			services: services
		});
	});

	var edit =  co.wrap(function* (req, res){
		var service  = yield baseController.getById(req, res);
		res.render('admin/services/edit', {
			title: res.__n('Service', 2),
			service: service
		});
	});

	var add = function(req, res) {
		var service = new Service();
		res.render('admin/services/edit', {
			title: res.__n('Service', 2),
			service: service
		});
	};

	var save = co.wrap(function* (req, res, next){
		try {
			yield baseController.updateAllPositions();
			yield baseController.post(req, res);
			res.redirect(`/${req.getLocale()}/${REDIRECT_URL}`);
		} catch(err){
			return next(err);
		}
	});

	var update = co.wrap(function* (req, res, next){
		try {
			req.item  = yield baseController.getById(req, res);
			yield baseController.put(req, res);
			res.redirect(`/${req.getLocale()}/${REDIRECT_URL}`);
		} catch(err){
			return next(err);
		}
	});

	var remove = co.wrap(function* (req, res, next){
		try {
			req.item  = yield baseController.getById(req, res);
			yield baseController.remove(req, res);
			res.redirect(`/${req.getLocale()}/${REDIRECT_URL}`);
		} catch(err){
			return next(err);
		}
	});

	var updatePosition = co.wrap(function* (req, res, next){
		try {
			var result  = yield baseController.updatePosition(req.params.id, req.params.position);
			res.status(201).send(result);
		} catch(err){
			return next(err);
		}
	});

	return {
		list:list,
		add:add,
		edit:edit,
		save:save,
		update:update,
		remove:remove,
		updatePosition:updatePosition
	};
};

module.exports = servicesController;
