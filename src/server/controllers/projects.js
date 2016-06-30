var co = require('co');

var projectController = function(Project, Service) {

	var index =  co.wrap(function* (req, res, next) {
		try{
			var [services, projects] =  yield Promise.all([
				Service.find().sort('position'),
				Project.find({publish: true}).sort('position').populate('service')
			]);

			res.render('project/all', {
				title: req.__n('Project', 2),
				url: {
					es: req.__l('url.projects')[1],
					en: `/en/${req.__l('url.projects')[0]}`
				},
				services: services,
				projects: projects,
				link: req.__n('Project', 2)
			});
		} catch(err){
			next(err);
		}
	});

	var filterByService =  co.wrap(function* (req, res, next) {
		try{
			var urlLocale= 'url.' + req.getLocale();
			var queryService = {};
			queryService[urlLocale] = req.params.serviceUrl;
			var service = yield Service.findOne(queryService).sort('position');
			if(!service){
				return next();
			}
			var queryProject = {};
			queryProject['service'] = service._id;
			var state =  '';
			if(req.params.state){
				state = req.params.state;
				queryProject['state'] = state;
			}
			var [services, projects, showInProgress, showFinished] = yield Promise.all([
				Service.find({_id: { $ne: service._id }}).sort('position'),
				Project.find(queryProject).populate('service').sort('position'),
				showState(service, 'in-progress'),
				showState(service, 'finished')]);

			res.render('project/service', {
				title: service.title[req.getLocale()],
				url: {
					es: req.__l('url.projectsByService')[1].replace(':serviceUrl', service.url.es).replace(':state?', state),
					en: `/en/${req.__l('url.projectsByService')[0].replace(':serviceUrl', service.url.en).replace(':state?', state)}`
				},
				service: service,
				services: services,
				projects: projects,
				state: state,
				link: req.__n('Project', 2),
				showInProgress: showInProgress,
				showFinished: showFinished
			});
		} catch(err){
			next(err);
		}
	});

	var details =  co.wrap(function* (req, res, next) {
		try{
			var urlLocale= 'url.' + req.getLocale();
			var queryProject = {};
			queryProject[urlLocale] = req.params.projectUrl;
			var project = yield Project.findOne(queryProject).populate('service');
			if(!project){
				return next();
			}
			var [projectNextUrl, projectPrevUrl] = yield Promise.all([
				getProjectFromPosition(project.position + 1),
				getProjectFromPosition(project.position - 1)
			]);
			var showInProgress = true;
			var showFinished = true;
			var services = [];
			if(project.service){
				[showInProgress, showFinished, services] = yield Promise.all([
					showState(project.service, 'in-progress'),
					showState(project.service, 'finished'),
					Service.find({_id: { $ne: project.service._id }}).sort('position')
				]);
			}

			res.render('project/detail', {
				title: project.title[req.getLocale()],
				url: {
					es: req.__l('url.project')[1].replace(':projectUrl', project.url.es),
					en: `/en/${req.__l('url.project')[0].replace(':projectUrl', project.url.en)}`
				},
				project: project,
				projectNextUrl: projectNextUrl,
				projectPrevUrl: projectPrevUrl,
				services: services,
				link: req.__n('Project', 2),
				showInProgress: showInProgress,
				showFinished: showFinished
			});
		} catch(err){
			next(err);
		}
	});

	function showState(service, state){
		return new Promise(function(resolve, reject){
			Project
				.findOne({service: service._id, state: state})
				.exec(function(err, project){
					if(err) {
						reject(err);
					}
					resolve(project !== null);
				});
		});
	}

	function getProjectFromPosition(position){
		return new Promise(function(resolve, reject){
			Project
				.findOne({position: position})
				.select('url')
				.exec(function(err, project){
					if(err) {
						reject(err);
					}
					resolve(project && project.url);

				});
		});
	}

	return {
		index,
		filterByService,
		details
	};
};

module.exports = projectController;
