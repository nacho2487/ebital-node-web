var co = require('co');
var REDIRECT_URL = 'admin';

var bannerController = function(Banner, Home) {
	var baseController = require('./base')(Banner, REDIRECT_URL, 'Image');
	var homeController = require('./home')(Home);

	var list = co.wrap(function* (req, res, next){
		try {
			var banners = yield baseController.get();
			res.render('admin/banner', {
				title: res.__('Home'),
				banners: banners
			});
		} catch(err){
			return next(err);
		}
	});

	var edit = co.wrap(function* (req, res, next){
		try {
			var banner  = yield baseController.getById(req, res);
			res.render('admin/banner/edit', {
				title: res.__('Home'),
				banner: banner
			});
		} catch(err){
			return next(err);
		}
	});

	var add = function(req, res, next) {
		try {
			var banner = new Banner();
			res.render('admin/banner/edit', {
				title: res.__('Home'),
				banner: banner
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
			var banner = yield baseController.post(req, res);
			yield homeController.addBanner(banner);
			res.redirect(`/${req.getLocale()}/${REDIRECT_URL}`);
		} catch(err){
			return next(err);
		}
	});

	var update = co.wrap(function* (req, res, next){
		try {
			req.item  = yield baseController.getById(req, res);
			if(req.file) {
				if(req.item.image.filename){
					yield baseController.removeSingleImage(req.item.image.filename);
				}
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
				yield baseController.removeSingleImage(req.item.image.filename);
			}
			var banner = yield baseController.remove(req, res);
			yield homeController.removeBanner(banner);
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
		list,
		add,
		edit,
		save,
		update,
		remove,
		updatePosition
	};
};

module.exports = bannerController;
