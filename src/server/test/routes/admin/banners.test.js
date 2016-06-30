var app = require('../../app');
var login = require('./login');
var request = require('supertest');
var path = require('path');
var server = request.agent(app);
var data = {title: {es:'title 1'}, description: {es:'description 1'} };
var dataWithImage = {title: {es:'title 1 with image'}, description: {es:'description 1'} };
var Banner = require('../../../models/Banner');
var redirectUrl = '/es/admin';

describe('Admin banners routes', function() {
	it('login', login(server));
	describe('GET /admin/banners/add', function() {
		it('/admin/banners/add 200 OK', function(done) {
			server
				.get('/admin/banners/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /en/admin/banners/add', function() {
		it('/en/admin/banners/add 200 OK', function(done) {
			server
				.get('/en/admin/banners/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('POST /es/admin/banners/add', function() {
		it('/admin/banners/add 200 OK', function(done) {
			server
				.post('/es/admin/banners/add')
				.send(data)
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
		it('/admin/banners/add with image 200 OK', function(done) {
			server
				.post('/es/admin/banners/add')
				.field('title.es', dataWithImage.title.es)
				.attach('banner-image', path.join(__dirname, '../../images/aic-small.jpg'))
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/banners/:id/edit', function() {
		it('/admin/banners/:id/edit 200 OK', function(done) {
			Banner.findOne(function(err, banner){
				if(!banner){
					return done('No data in banners');
				}
				server
					.get(`/admin/banners/${banner._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('GET /en/admin/banners/:id/edit', function() {
		it('/en/admin/banners/:id/edit 200 OK', function(done) {
			Banner.findOne(function(err, banner){
				if(!banner){
					return done('No data in banners');
				}
				server
					.get(`/en/admin/banners/${banner._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('POST /es/admin/banners/:id/edit', function() {
		it('/es/admin/banners/:id/edit without image', function(done) {
			Banner.findOne({'title.es': data.title.es }, function(err, banner){
				if(!banner){
					return done('No data in banners');
				}
				server
					.post(`/es/admin/banners/${banner._id}/edit`)
					.send(data)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});

		it('/es/admin/banners/:id/edit with image', function(done) {
			Banner.findOne({'title.es': dataWithImage.title.es }, function(err, banner){
				if(!banner){
					return done('No data in banners');
				}
				server
					.post(`/es/admin/banners/${banner._id}/edit`)
					.field('title.es', dataWithImage.title.es)
					.attach('banner-image', path.join(__dirname, '../../images/botnia-small.jpg'))
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
	});
	describe('POST /es/admin/banners/:id/delete', function() {
		it('/es/admin/banners/:id/delete without image', function(done) {
			Banner.findOne({'title.es': data.title.es}, function(err, banner){
				if(!banner){
					return done('No data in banners');
				}
				server
					.get(`/admin/banners/${banner._id}/delete`)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
		it('/es/admin/banners/:id/delete with image', function(done) {
			Banner.findOne({'title.es': dataWithImage.title.es }, function(err, banner){
				if(!banner){
					return done('No data in banners');
				}
				server
					.get(`/admin/banners/${banner._id}/delete`)
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
