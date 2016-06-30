var Home = require('../models/Home');
var Banner = require('../models/Banner');
var Project = require('../models/Project');
var Company = require('../models/Company');

var addAllBannersToHome = function(){
	Home.findOne(function(err, home){
		if(err) {
			throw err;
		}
		if(!home){
			home = new Home();
		}
		if(home.images.length === 0) {
			Banner.find(function(err, banners){
				if(err){
					throw err;
				}
				home.images = banners.map(function(banner){
					return banner._id;
				});
				home.save(function(err){
					if(err){
						throw err;
					}
				});
			});
		}
	});
};

var addAllHighlightedProjectsToHome = function(){
	Home.findOne(function(err, home){
		if(err) {
			throw err;
		}
		if(!home){
			home = new Home();
		}
		if(home.projects.length === 0) {
			Project.find({highlighted: true}, function(err, projects){
				if(err){
					throw err;
				}
				home.projects = projects.map(function(project){
					return project._id;
				});
				home.save(function(err){
					if(err){
						throw err;
					}
				});
			});
		}
	});
};

var addCompanyType = function(type, title, position){
	Company.findOne({type: type}, function(err, company){
		if(!company){
			company = new Company();
			company.title = title;
			company.type = type;
			company.position = position;
			company.save(function(err){
				if(err){
					throw err;
				}
			});
		}

	});
};

addAllBannersToHome();
addAllHighlightedProjectsToHome();

addCompanyType('about-us', {es: 'Quienes Somos', en: 'About Us'}, 0);
addCompanyType('team', {es: 'Equipo Ejecutivo', en: 'Executive Team'}, 1);
addCompanyType('politics', {es: 'Politicas y certificaciones', en: 'Politics and certifications'}, 2);
addCompanyType('values', {es: 'Valores', en: 'Values'}, 3);
addCompanyType('benefits', {es: 'Beneficios', en: 'Benefits'}, 4);
