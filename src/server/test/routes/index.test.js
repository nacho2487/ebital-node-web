var request = require('supertest');
var app = require('../app.js');
var Service = require('../../models/Service');
var Project = require('../../models/Project');
var News = require('../../models/News');

describe('Index routes', function() {
	before(function(done){
		var project = new Project();
		var service = new Service();
		var news = new News();
		project.title = {es: 'title', en: 'title'};
		project.publish = true;
		service.title = {es: 'title', en: 'title'};
		news.title = {es: 'title', en: 'title'};
		news.publish = true;
		project.save(function(){
			service.save(function(){
				news.save(function(){
					done();
				});
			});
		});
	});
	after(function(done){
		Project.remove(function(){
			Service.remove(function(){
				News.remove(function(){
					done();
				});
			});
		});
	});
	describe('GET /empresa/quienes-somos', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/empresa/quienes-somos')
				.expect(200, done);
		});
	});
	describe('GET /en/company/about-us', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/company/about-us')
				.expect(200, done);
		});
	});
	describe('GET /empresa/politicas-y-certificaciones', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/empresa/politicas-y-certificaciones')
				.expect(200, done);
		});
	});
	describe('GET /en/company/politics-and-certifications', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/company/politics-and-certifications')
				.expect(200, done);
		});
	});
	describe('GET /empresa/equipo-ejecutivo', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/es/empresa/equipo-ejecutivo')
				.expect(200, done);
		});
	});
	describe('GET /en/company/executive-team', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/company/executive-team')
				.expect(200, done);
		});
	});
	describe('GET /empresa/beneficios', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/es/empresa/beneficios')
				.expect(200, done);
		});
	});
	describe('GET /en/company/benefits', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/company/benefits')
				.expect(200, done);
		});
	});
	describe('GET /empresa/valores', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/empresa/valores')
				.expect(200, done);
		});
	});
	describe('GET /en/company/values', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/company/values')
				.expect(200, done);
		});
	});
	describe('GET /obras', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/obras')
				.expect(200, done);
		});
	});
	describe('GET /obras/:service', function() {
		it('should return 200 OK', function(done) {
			Service
			.findOne()
			.exec(function(err, service){
				if (err) return done(err);
				if (!service) return done('services not found');
				request(app)
				.get(`/obras/${service.url.es}`)
				.expect(200)
				.end(function(err){
					if (err) return done(err);
					done();
				});
			});
		});
	});
	describe('GET /en/projects/:service', function() {
		it('should return 200 OK', function(done) {
			Service
			.findOne()
			.exec(function(err, service){
				if (err) return done(err);
				if (!service) return done('services not found');
				request(app)
				.get(`/en/projects/${service.url.en}`)
				.expect(200)
				.end(function(err){
					if (err) return done(err);
					done();
				});
			});
		});
	});
	describe('GET /en/projects', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/projects')
				.expect(200, done);
		});
	});
	describe('GET /obra/:url', function() {
		it('should return 200 OK', function(done) {
			Project
			.findOne({publish: true})
			.exec(function(err, project){
				if (err) return done(err);
				if (!project) return done('projects not found');
				request(app)
					.get(`/obra/${project.url.es}`)
					.expect(200)
					.end(function(err){
						if (err) return done(err);
						done();
					});
			});
		});
	});
	describe('GET /en/project/:url', function() {
		it('should return 200 OK', function(done) {
			Project
			.findOne({publish: true})
			.exec(function(err, project){
				if (err) return done(err);
				if (!project) return done('projects not found');
				request(app)
					.get(`/en/project/${project.url.en}`)
					.expect(200)
					.end(function(err){
						if (err) return done(err);
						done();
					});
			});
		});
	});
	describe('GET /noticias', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/noticias')
				.expect(200, done);
		});
	});
	describe('GET /en/news', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/news')
				.expect(200, done);
		});
	});
	describe('GET /noticia/:url', function() {
		it('should return 200 OK', function(done) {
			News
			.findOne({publish: true})
			.exec(function(err, news){
				if (err) return done(err);
				if (!news) return done('News not found');
				request(app)
					.get(`/noticia/${news.url.es}`)
					.expect(200)
					.end(function(err){
						if (err) return done(err);
						done();
					});
			});
		});
	});
	describe('GET /en/news/:url', function() {
		it('should return 200 OK', function(done) {
			News
			.findOne({publish: true})
			.exec(function(err, news){
				if (err) return done(err);
				if (!news) return done('News not found');
				request(app)
					.get(`/en/news/${news.url.en}`)
					.expect(200)
					.end(function(err){
						if (err) return done(err);
						done();
					});
			});
		});
	});
	describe('GET /clientes', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/clientes')
				.expect(200, done);
		});
	});
	describe('GET /en/clients', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/clients')
				.expect(200, done);
		});
	});
	describe('GET /contacto', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/contacto')
				.expect(200, done);
		});
	});
	describe('GET /en/contact-us', function() {
		it('should return 200 OK', function(done) {
			request(app)
				.get('/en/contact-us')
				.expect(200, done);
		});
	});

});
