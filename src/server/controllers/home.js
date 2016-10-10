
var homeController = function(Home, Project) {
	var construction = function (req, res, next){
		res.render('construction', {
			title: req.__('HomeTitle'),
			url: {
				es: '/',
				en: '/en'
			}
		});
	};

	var workWithUs = function (req, res, next){
		res.render('workwithus', {
			title: req.__('WorkWithUs'),
			url: {
				es: req.__l('url.workwithus')[1],
				en: `/en/${req.__l('url.workwithus')[0]}`
			}
		});
	};

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
						title: req.__('HomeTitle'),
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
		index:index,
		construction:construction,
		workWithUs:workWithUs
	};
};

module.exports = homeController;
