var co = require('co');
var _ = require('lodash');
var projectState = require('./../../helpers/projectState');
var date = require('./../../helpers/date');
var homeController = require('./home');
var REDIRECT_URL = 'admin/projects';

var projectController = function(Project, Service) {
	var baseController = require('./base')(Project, REDIRECT_URL, 'Project');
	var baseServiceController = require('./base')(Service, REDIRECT_URL, 'Service');

	var list = co.wrap(function* (req, res, next){
		try {
			var projects  = yield baseController.get();
			res.render('admin/project', {
				title: res.__n('Project', 2),
				projects: projects,
				getProjectState: projectState
			});
		} catch(err){
			return next(err);
		}
	});

	var edit =  co.wrap(function* (req, res, next){
		try {
			var project  = yield baseController.getById(req, res);
			var services  = yield baseServiceController.get();
			var projectWithService = yield Project.populate(project, {path: 'service'});
			res.render('admin/project/edit', {
				title: res.__n('Project', 2),
				project: projectWithService,
				services: services,
				months: date.months,
				years: date.years()
			});
		} catch(err){
			return next(err);
		}
	});

	var add = co.wrap(function* (req, res, next){
		try {
			var project = new Project();
			project.service = new Service();
			var services  = yield baseServiceController.get();
			res.render('admin/project/edit', {
				title: res.__n('Project', 2),
				project: project,
				services: services,
				months: date.months,
				years: date.years()
			});
		} catch(err){
			return next(err);
		}
	});


	var save = co.wrap(function* (req, res, next){
		try {
			if(req.files){
				var principalImage = req.files['project-principal-image'];
				var images = req.files['project-images'];
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
			if(req.files){
				var principalImage = req.files['project-principal-image'];
				var images = req.files['project-images'];
				if(principalImage && principalImage.length) {
					req.item.homeImage = yield baseController.addSingleImage(principalImage[0]);
				}
				if(images && images.length) {
					var imagesToAdd = yield baseController.addMultipleImages(images);
					req.item.images = _.concat(req.item.images, imagesToAdd);
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

	function removeSingleImageFromImages(projectId, filename){
		return new Promise(function(resolve, reject) {
			Project.findByIdAndUpdate(projectId, { $pull: { images: { filename: filename } } })
				.exec(function (err, news) {
					if (err) reject(err);
					resolve(news);
				});
		});
	}

	var updateHighlight = co.wrap(function* (req, res, next) {
		try {
			var project = yield highlightProject(req.params.id, req.params.highlight);
			var highlightedProjects = yield Project.find({highlight: true}).exec();
			yield homeController.addAllProjects(highlightedProjects);
			res.status(201).send(project);
		} catch(err){
			return next(err);
		}
	});

	var updateHighlightGet = co.wrap(function* (req, res, next) {
		try {
			yield highlightProject(req.params.id, req.params.highlight);
			var highlightedProjects = yield Project.find({highlight: true}).exec();
			yield homeController.addProjects(highlightedProjects);
			res.redirect(`/${req.getLocale()}/admin`);
		} catch(err){
			return next(err);
		}
	});

	function highlightProject(projectId, highlight) {
		return new Promise(function(resolve, reject) {
			Project.update({_id: projectId}, {highlighted: highlight === 'true'})
			.exec(function(err, project){
				if(err){
					reject(err);
				}
				resolve(project);
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
		list:list,
		add:add,
		edit:edit,
		save:save,
		update:update,
		remove:remove,
		removeImageFromList:removeImageFromList,
		updatePosition:updatePosition,
		updateHighlight:updateHighlight,
		updateHighlightGet:updateHighlightGet
	};
};

module.exports = projectController;
