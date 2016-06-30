var app = require('../../app');
var login = require('./login');
var request = require('supertest');
var path = require('path');
var server = request.agent(app);
var data = {title: {es:'title 1', en:'title english'}, description: {es:'description 1'} };
var dataWithImage = {title: {es:'title 1 with image', en:'title english with image'}, description: {es:'description 1'} };
var Project = require('../../../models/Project');
var redirectUrl = '/es/admin/projects';

describe('Admin projects routes', function() {
	it('login', login(server));
	describe('GET /admin/projects', function() {
		it('/admin/projects 200 OK', function(done) {
			server
				.get('/es/admin/projects')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/projects/add', function() {
		it('/admin/projects/add 200 OK', function(done) {
			server
				.get('/admin/projects/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /en/admin/projects/add', function() {
		it('/en/admin/projects/add 200 OK', function(done) {
			server
				.get('/en/admin/projects/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('POST /es/admin/projects/add', function() {
		it('/admin/projects/add 200 OK', function(done) {
			server
				.post('/es/admin/projects/add')
				.send(data)
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
		it('/admin/projects/add with image 200 OK', function(done) {
			server
				.post('/es/admin/projects/add')
				.field('title.es', dataWithImage.title.es)
				.field('title.en', dataWithImage.title.en)
				.attach('project-principal-image', path.join(__dirname, '../../images/aic-small.jpg'))
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/projects/:id/edit', function() {
		it('/admin/projects/:id/edit 200 OK', function(done) {
			Project.findOne(function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.get(`/admin/projects/${project._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('GET /en/admin/projects/:id/edit', function() {
		it('/en/admin/projects/:id/edit 200 OK', function(done) {
			Project.findOne(function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.get(`/en/admin/projects/${project._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('POST /es/admin/projects/:id/edit', function() {
		it('/es/admin/projects/:id/edit without image', function(done) {
			Project.findOne({'title.es': data.title.es }, function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.post(`/es/admin/projects/${project._id}/edit`)
					.send(data)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});

		it('/es/admin/projects/:id/edit without image and without english title', function(done) {
			data.title.en = '';
			Project.findOne({'title.es': data.title.es }, function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.post(`/es/admin/projects/${project._id}/edit`)
					.send(data)
					.expect(302)
					.expect('Location', `/es/admin/projects/${project._id}/edit`)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});

		it('/es/admin/projects/:id/edit with image', function(done) {
			Project.findOne({'title.es': dataWithImage.title.es }, function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.post(`/es/admin/projects/${project._id}/edit`)
					.field('title.es', dataWithImage.title.es)
					.field('title.en', dataWithImage.title.en)
					.attach('project-principal-image', path.join(__dirname, '../../images/botnia-small.jpg'))
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
		it('/es/admin/projects/:id/edit with multiple images', function(done) {
			Project.findOne({'title.es': dataWithImage.title.es }, function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.post(`/es/admin/projects/${project._id}/edit`)
					.field('title.es', dataWithImage.title.es)
					.field('title.en', dataWithImage.title.en)
					.attach('project-images', path.join(__dirname, '../../images/botnia-small.jpg'))
					.attach('project-images', path.join(__dirname, '../../images/aic-small.jpg'))
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
	});
	describe('POST /es/admin/projects/:id/delete', function() {
		it('/es/admin/projects/:id/delete without image', function(done) {
			Project.findOne({'title.es': data.title.es}, function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.get(`/admin/projects/${project._id}/delete`)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
		it('/es/admin/projects/:id/delete with image', function(done) {
			Project.findOne({'title.es': dataWithImage.title.es }, function(err, project){
				if(!project){
					return done('No data in project');
				}
				server
					.get(`/admin/projects/${project._id}/delete`)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
	});
});
