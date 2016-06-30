var projectState = require('./../../helpers/projectState');
var co = require('co');

var homeController = function(Home, Project) {

	var index = function(req, res, next) {
		Home
		.findOne()
		.populate({path: 'projects',  options: { sort: { 'position': 1 } } })	
		.populate({path: 'images',  options: { sort: { 'position': 1 } } })	
		.exec(function(err, home) {
			if (err) {
				return next(err);
			}
			if(!home){
				return next();
			}
			Project.populate(home.projects, {path: 'service'}, function(err, projects) {
				if(err){
					return next(err);
				}
				res.render('admin/home', {
					title: res.__('Home'),
					banners: home.images,
					projects: projects,
					getProjectState: projectState,
					description: home.description
				});
			});
		});
	};

	var saveDescription = co.wrap(function* (req, res, next){
		Home
		.findOne()
		.exec(function(err, home){
			if(err){
				next(err);
			}
			home.description = req.body.description;
			home.save(function(err){
				if(err){
					next(err);
				}
				res.redirect(`/${req.getLocale()}/admin`);
			});
		});
	});

	var addAllProjects = function(projects){
		return new Promise(function(resolve, reject) {
			Home
			.findOne(function(err, home){
				if(err){
					reject(err);
				}
				home.projects = projects.map(function(project){
					return project._id;
				});
				home.save(function(err){
					if(err){
						reject(err);
					}
					resolve(home);
				});
			});
		});
	};

	var addBanner = function(banner){
		return new Promise(function(resolve, reject) {
			Home.findOne(function(err, home){
				if(err) {
					reject(err);
				}
				home.images.push(banner._id);
				home.save(function(err){
					if(err){
						reject(err);
					}
					resolve(home);
				});
			});
		});
	};
	
	var removeBanner = function(banner){
		return new Promise(function(resolve, reject) {
			Home.findOne(function(err, home){
				if(err) {
					reject(err);
				}
				if(!home){
					resolve(new Home());
				}
				Home.findOneAndUpdate({_id: home._id}, {$pull: {images: banner._id}}, function(err, res){
					if(err){
						reject(err);
					}
					resolve(res);

				});
			});
		});
	};

	return {
		index,
		saveDescription,
		addAllProjects,
		addBanner,
		removeBanner
	};
};

module.exports = homeController;
