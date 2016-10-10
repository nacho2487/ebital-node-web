var co = require('co');
var REDIRECT_URL = 'admin/clients';

var clientsController = function(Client, CompanyLogo) {
	var baseController = require('./base')(Client, REDIRECT_URL, 'Client');
	var logoBaseController = require('./base')(CompanyLogo, REDIRECT_URL, 'Logo');

	var list = co.wrap(function* (req, res, next){
		try {
			var clients = yield baseController.get();
			var logos = yield logoBaseController.get();
			res.render('admin/clients', {
				title: res.__('Home'),
				clients: clients,
				logos: logos
			});
		} catch(err){
			return next(err);
		}
	});

	var edit = co.wrap(function* (req, res, next){
		try {
			var client  = yield baseController.getById(req, res);
			res.render('admin/clients/edit', {
				title: res.__('Home'),
				client: client,
				path: req.originalUrl
			});
		} catch(err){
			return next(err);
		}

	});

	var add = function(req, res, next) {
		try {
			var client = new Client();
			res.render('admin/clients/edit', {
				title: res.__n('Client', 2),
				client: client,
				path: req.originalUrl
			});
		} catch(err){
			return next(err);
		}
	};


	var save = co.wrap(function* (req, res, next){
		try {
			if(req.file) {
				req.body.image = yield baseController.addSingleImage(req.file);
			}
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
			if(req.file) {
				req.body.image = yield baseController.addSingleImage(req.file);
			}
			yield baseController.put(req, res);
			res.redirect(`/${req.getLocale()}/${REDIRECT_URL}`);
		} catch(err){
			return next(err);
		}
	});

	var remove = co.wrap(function* (req, res, next){
		try {
			req.item  = yield baseController.getById(req, res);
			if(req.item.image.filename){
				yield baseController.removeSingleImage(req.item.image);
			}
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
		list: list,
		add: add,
		edit: edit,
		save: save,
		update: update,
		remove: remove,
		updatePosition: updatePosition
	};
};

module.exports = clientsController;
