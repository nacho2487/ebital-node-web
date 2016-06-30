var co = require('co');
var date = require('./../../helpers/date');
var _ = require('lodash');
var REDIRECT_URL = 'admin/news';

var newsController = function(News) {
	var baseController = require('./base')(News, REDIRECT_URL, 'News');

	var list = co.wrap(function* (req, res, next){
		try {
			var news = yield baseController.get();
			res.render('admin/news', {
				title: res.__n('News', 2),
				news: news
			});
		} catch(err){
			return next(err);
		}
	});

	var edit = co.wrap(function* (req, res, next){
		try {
			var news  = yield baseController.getById(req, res);
			res.render('admin/news/edit', {
				title: res.__n('News', 2),
				news: news,
				path: req.originalUrl,
				months: date.months,
				years: date.years()
			});
		} catch(err){
			return next(err);
		}
	});

	var add = function(req, res, next) {
		try {
			var news = new News();
			res.render('admin/news/edit', {
				title: res.__n('News', 2),
				news: news,
				path: req.originalUrl,
				months: date.months,
				years: date.years()
			});
		} catch(err){
			return next(err);
		}
	};

	var save = co.wrap(function* (req, res, next){
		try {
			if(req.files){
				var principalImage = req.files['news-principal-image'];
				var images = req.files['news-images'];
				if(principalImage && principalImage.length) {
					req.body.homeImage = yield baseController.addSingleImage(principalImage[0]);
				}
				if(images && images.length) {
					req.body.images =  yield baseController.addMultipleImages(images);
				}
			}

			yield validateFields(req);
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
			if(req.files) {
				var principalImage = req.files['news-principal-image'];
				var images = req.files['news-images'];
				if (principalImage && principalImage.length) {
					req.item.homeImage = yield baseController.addSingleImage(principalImage[0]);
				}
				if (images && images.length) {
					req.item.images = _.concat(req.item.images, yield baseController.addMultipleImages(images));
				}
			}
			yield validateFields(req);
			yield baseController.put(req, res);
			res.redirect(`/${req.getLocale()}/${REDIRECT_URL}`);
		} catch(err){
			return next(err);
		}
	});

	var remove = co.wrap(function* (req, res, next){
		try {
			req.item  = yield baseController.getById(req, res);
			if(req.item.homeImage && req.item.homeImage.filename){
				yield baseController.removeSingleImage(req.item.homeImage.filename);
			}
			if(req.item.images && req.item.images.length){
				yield baseController.removeMultipleImages(req.item.images);
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

	var removeImageFromList = co.wrap(function* (req, res, next){
		try {
			yield baseController.removeSingleImage(req.params.fileName);
			var news = yield removeSingleImageFromImages(req.params.id, req.params.fileName);
			res.status(201).send(news);
		} catch(err){
			return next(err);
		}
	});

	function removeSingleImageFromImages(newsId, filename){
		return new Promise(function(resolve, reject) {
			News.findByIdAndUpdate(newsId, { $pull: { images: { filename: filename } } })
				.exec(function (err, news) {
					if (err) reject(err);
					resolve(news);
				});
		});
	}

	function validateFields(req) {
		return new Promise(function(resolve) {
			req.assert('title.es', req.__('TitleIsRequired %s', req.__('Spanish'))).notEmpty();
			req.assert('title.en', req.__('TitleIsRequired %s', req.__('English'))).notEmpty();
			resolve(req);
		});
	}


	return {
		list,
		add,
		edit,
		save,
		update,
		remove,
		removeImageFromList,
		updatePosition
	};
};

module.exports = newsController;
