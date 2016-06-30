var express = require('express');
var router = express.Router();
var Home = require('../../models/Home');
var Project = require('../../models/Project');
var homeController = require('../../controllers/admin/home')(Home, Project);
var userController = require('../../controllers/user');

var routes = function() {
	var banners = require('./banners')();
	var projects = require('./projects')();
	var services = require('./services')();
	var news = require('./news')();
	var clients = require('./clients')();
	var logos = require('./logos')();
	var account = require('./account')();
	var company = require('./company')();

	router.use('/account', account);
	router.use('/projects', projects);
	router.use('/services', services);
	router.use('/news', news);
	router.use('/clients', clients);
	router.use('/banners', banners);
	router.use('/logos', logos);
	router.use('/company', company);

	router.route('/')
		.get(homeController.index)
		.post(homeController.saveDescription);

	router.route('/signup')
		.get(userController.getSignup)
		.post(userController.postSignup);

	
	return router;
};

module.exports = routes;
