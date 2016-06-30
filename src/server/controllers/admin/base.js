var _ = require('lodash');
var cloudImagesManager = require('./../../helpers/cloudinaryManager');
var localImagesManager = require('./../../helpers/localImagesManager');

var baseController = function(Model, url, modelKey) {
	
	var get = function(){
		return new Promise(function(resolve, reject) {
			Model		
			.find()
			.sort('position')
            .populate('service')
			.exec(function(err, items) {
				if (err) {
					reject(err);
				}
				resolve(items);
			});
		});
	};

	var getById = function(req, res) {
		return new Promise(function(resolve, reject) {
			Model
			.findById(req.params.id)
			.exec(function(err, item) {
				if (err) {
					reject(err);
				} else if (item) {
					resolve(item);
				} else {
					res.status(404).send('Not found');
				}
			});
		});
	};

	var put = function(req, res) {
		return new Promise(function(resolve, reject) {
			_.merge(req.item, req.body);
			req.item.save(function(err){
				if (err) {
					reject(err);
				}
				if (req.validationErrors()) {
					req.flash('errors', req.validationErrors());
					return res.redirect(`/${req.getLocale()}/${url}/${req.item._id}/edit`);
				}
				req.flash('success', {
					msg: req.__n('UpdatedMessage %%s', 'UpdatedMessage %%s', 1, req.__n(modelKey, 1))
				});
				resolve(req);
			});
		});
	};

	var post = function(req, res) {
		return new Promise(function(resolve, reject) {
			var model = new Model(req.body);
			model.save(function(err) {
				if (err) {
					reject(err);
				}
				if (req.validationErrors()) {
					req.flash('errors', req.validationErrors());
					return res.redirect(`/${req.getLocale()}/${url}/${model._id}/edit`);
				}
				req.flash('success', {
					msg: req.__n('AddedMessage %%s', 'AddedMessage %%s', 1, req.__n(modelKey, 1))
				});
				resolve(model);
			});
		});
	};

	var remove = function(req) {
		return new Promise(function(resolve, reject) {
			Model.remove({ _id: req.params.id }, function(err, model) {
				if (err) {
					reject(err);
				}
				req.flash('info', { msg: req.__n('DeletedMessage %%s', 'DeletedMessage %%s', 1, req.__n(modelKey, 1)) });
				resolve(model);
			});
		});
	};

	var updatePosition = function(id, position) {
		return new Promise(function(resolve, reject) {	
			Model.update({_id: id}, {position: position}).exec(function(err, data){
				if(err) {
					reject(err);
				}
				resolve(data);				
			});
		});
	};

	var updateAllPositions = function() {
		return new Promise(function(resolve, reject) {
			Model
			.where('position').gte(0)
			.exec(function(err, data){
				if(err) {
					reject(err);
				}
				_.forEach(data, function(item){
					Model.update({_id: item._id }, {position: (item.position + 1)}).exec();
				});
				resolve(data);
			});
		});
	};

	var addSingleImage = function(file){
		return new Promise(function(resolve, reject) {
			cloudImagesManager.add(file.path)
				.then(function(image){
					localImagesManager.remove(file.path);
					resolve({filename: image.public_id, fileext: image.format, url: image.url});
				}, function(err){
					reject(err);
				});
		});
	};

	var removeSingleImage = function(filename) {
		return new Promise(function(resolve, reject) {
			cloudImagesManager.remove(filename).then(function(result){
				resolve(result);
			}, function(err){
				reject(err);
			});
		});
	};

	var addMultipleImages = function(images){
		return new Promise(function(resolve, reject) {
			var imagesToAdd = [];
			_.map(images, function(file){
				cloudImagesManager.add(file.path).then(function(image){
					localImagesManager.remove(file.path);
					imagesToAdd.push({filename: image.public_id, fileext: image.format, url: image.url});
					if(imagesToAdd.length === images.length){
						resolve(imagesToAdd);
					}
				}, function(err){
					reject(err);
				});
			});
		});
	};


	var removeMultipleImages = function(images) {
		return new Promise(function(resolve, reject) {
			cloudImagesManager.removeAll(images).then(function(){
				resolve();
			}, function(err){
				reject(err);
			});
		});
	};


	return {
		get,
		getById,
		post,
		put,
		remove,
		updatePosition,
		updateAllPositions,
		addSingleImage,
		removeSingleImage,
		addMultipleImages,
		removeMultipleImages
	};
};

module.exports = baseController;