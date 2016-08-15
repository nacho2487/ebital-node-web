var express = require('express');
var Project = require('../models/Project');
var Service = require('../models/Service');
var Company = require('../models/Company');
var News = require('../models/News');
var Clients = require('../models/Client');
var Home = require('../models/Home');
var CompanyLogo = require('../models/Logo');
var homeController = require('../controllers/home')(Home, Project);
var contactController = require('../controllers/contact');
var companyController = require('../controllers/company')(Company);
var newsController = require('../controllers/news')(News);
var clientsController = require('../controllers/clients')(Clients, CompanyLogo);
var projectsController = require('../controllers/projects')(Project, Service);

var routes = function(i18n) {
	var router = express.Router();
	router.get('/', homeController.index);
	router.get(i18n.__l('url.company'), companyController.index);

	router.get(i18n.__l('url.projects'), projectsController.index);
	router.get(i18n.__l('url.projectsByService'), projectsController.filterByService);
	router.get(i18n.__l('url.project'), projectsController.details);

	router.get(i18n.__l('url.news'), newsController.index);
	router.get(i18n.__l('url.newsDetail'), newsController.details);
	router.get(i18n.__l('url.clients'), clientsController.index);
	router.get('/construccion', homeController.construction);
	router.get(i18n.__l('url.contactus'), contactController.getContact);
	router.post(i18n.__l('url.contactus'), contactController.postContact);

	return router;
};

module.exports = routes;
