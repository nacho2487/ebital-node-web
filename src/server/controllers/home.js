
var homeController = function(Home, Project) {
	var index = function(req, res, next) {
		Home
			.findOne()
			.populate({path: 'projects',  options: { sort: { 'position': 1 } } })
			.populate({path: 'images',  options: { sort: { 'position': 1 } } })
			.exec(function(err, home){
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
					res.render('home', {
						title: req.__('Home'),
						banners: home.images,
						description: home.description[req.getLocale()],
						projects: projects,
						url: {
							es: '/',
							en: '/en'
						},
						link: req.__('Home')
					});
				});
			});
	};

	return {
		index
	};
};

module.exports = homeController;
