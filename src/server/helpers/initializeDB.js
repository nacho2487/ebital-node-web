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

var addProjectLocation = function(){
	Project.find(function(err, projects){
		projects.forEach(function(project){
			if(project && project.location && typeof project.location === 'string' ){
				project.locationIn.es = project.location;
				project.locationIn.en = project.location;
				project.save(function(err){
					if(err){
						throw err;
					}
				});
			}
		});


	});
};

var addProjectClientIn = function(){
	Project.find(function(err, projects){
		projects.forEach(function(project){
			if(project && project.client && typeof project.client === 'string' ){
				project.clientIn.es = project.client;
				project.clientIn.en = project.client;
				project.save(function(err){
					if(err){
						throw err;
					}
				});
			}
		});
	});
};

var addProjectDescription = function(){
	Project.find(function(err, projects){
		projects.forEach(function(project){
			if(project && project.description && !project.description.es){
				var descriptionEs = ''
				if(project.clientIn.es){
					descriptionEs += `Cliente: ${project.clientIn.es}, `
				}
				if(project.locationIn.es){
					descriptionEs += `Ubicación: ${project.locationIn.es}, `
				}
				if(project.dateStart && project.dateStart.month && project.dateStart.year){
					descriptionEs += `Fecha de inicio: ${project.dateStart.month} ${project.dateStart.year} `
				}
				if(project.dateEnd && project.dateEnd.month && project.dateEnd.year){
					descriptionEs += `Fecha de fin: ${project.dateEnd.month} ${project.dateEnd.year} `
				}
				var descriptionEn = ''
				if(project.clientIn.en){
					descriptionEn += `Client: ${project.clientIn.en}, `
				}
				if(project.locationIn.en){
					descriptionEn += `Location: ${project.locationIn.en}, `
				}
				if(project.dateStart && project.dateStart.month && project.dateStart.year){
					descriptionEn += `Start date: ${project.dateStart.month} ${project.dateStart.year} `
				}
				if(project.dateEnd && project.dateEnd.month && project.dateEnd.year){
					descriptionEn += `End date: ${project.dateEnd.month} ${project.dateEnd.year} `
				}

				project.description.es = descriptionEs;
				project.description.en = descriptionEn;
				project.save(function(err){
					if(err){
						throw err;
					}
				});
			}
		});
	});
};

addProjectDescription();
addProjectLocation();
addProjectClientIn();
addAllBannersToHome();
addAllHighlightedProjectsToHome();

addCompanyType('about-us', {es: 'Quienes Somos', en: 'About Us'}, 0);
addCompanyType('team', {es: 'Equipo Ejecutivo', en: 'Executive Team'}, 1);
addCompanyType('politics', {es: 'Politicas y certificaciones', en: 'Politics and certifications'}, 2);
addCompanyType('values', {es: 'Valores', en: 'Values'}, 3);
addCompanyType('benefits', {es: 'Beneficios', en: 'Benefits'}, 4);
