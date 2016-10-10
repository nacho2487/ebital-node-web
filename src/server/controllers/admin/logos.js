var co = require('co');
var REDIRECT_URL = 'admin/clients';

var companyLogoController = function(CompanyLogo) {
	var baseController = require('./base')(CompanyLogo, REDIRECT_URL, 'Logo');

	var edit = co.wrap(function* (req, res, next){
		try {
			var logo  = yield baseController.getById(req, res);
			res.render('admin/logos/edit', {
				title: res.__('Logos'),
				logo: logo
			});
		} catch(err){
			return next(err);
		}

	});

	var add = function(req, res, next) {
		try {
			var logo = new CompanyLogo();
			res.render('admin/logos/edit', {
				title: res.__('Logos'),
				logo: logo
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
			yield baseController.removeSingleImage(req.item.image);
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
		add:add,
		edit:edit,
		save:save,
		update:update,
		remove:remove,
		updatePosition:updatePosition
	};
};

module.exports = companyLogoController;
