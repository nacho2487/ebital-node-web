var app = require('../../app');
var login = require('./login');
var request = require('supertest');
var path = require('path');
var server = request.agent(app);
var data = {title: 'title 1'};
var dataWithImage = {title: 'title 1 with image' };
var Logo = require('../../../models/Logo');
var redirectUrl = '/es/admin/clients';

describe('Admin logos routes', function() {
	it('login', login(server));
	describe('GET /admin/logos/add', function() {
		it('/admin/logos/add 200 OK', function(done) {
			server
				.get('/admin/logos/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /en/admin/logos/add', function() {
		it('/en/admin/logos/add 200 OK', function(done) {
			server
				.get('/en/admin/logos/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('POST /es/admin/logos/add', function() {
		it('/admin/logos/add 200 OK', function(done) {
			server
				.post('/es/admin/logos/add')
				.send(data)
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
		it('/admin/logos/add with image 200 OK', function(done) {
			server
				.post('/es/admin/logos/add')
				.field('title', dataWithImage.title)
				.attach('logo-image', path.join(__dirname, '../../images/aic-small.jpg'))
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/logos/:id/edit', function() {
		it('/admin/logos/:id/edit 200 OK', function(done) {
			Logo.findOne(function(err, logo){
				if(!logo){
					return done('No data in logos');
				}
				server
					.get(`/admin/logos/${logo._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('GET /en/admin/logos/:id/edit', function() {
		it('/en/admin/logos/:id/edit 200 OK', function(done) {
			Logo.findOne(function(err, logo){
				if(!logo){
					return done('No data in logos');
				}
				server
					.get(`/en/admin/logos/${logo._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('POST /es/admin/logos/:id/edit', function() {
		it('/es/admin/logos/:id/edit without image', function(done) {
			Logo.findOne({'title': data.title }, function(err, logo){
				if(!logo){
					return done('No data in logos');
				}
				server
					.post(`/es/admin/logos/${logo._id}/edit`)
					.send(data)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});

		it('/es/admin/logos/:id/edit with image', function(done) {
			Logo.findOne({'title': dataWithImage.title }, function(err, logo){
				if(!logo){
					return done('No data in logos');
				}
				server
					.post(`/es/admin/logos/${logo._id}/edit`)
					.field('title', dataWithImage.title)
					.attach('logo-image', path.join(__dirname, '../../images/botnia-small.jpg'))
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
	});
	describe('POST /es/admin/logos/:id/delete', function() {
		it('/es/admin/logos/:id/delete without image', function(done) {
			Logo.findOne({'title': data.title}, function(err, logo){
				if(!logo){
					return done('No data in logos');
				}
				server
					.get(`/admin/logos/${logo._id}/delete`)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
		it('/es/admin/logos/:id/delete with image', function(done) {
			Logo.findOne({'title': dataWithImage.title }, function(err, logo){
				if(!logo){
					return done('No data in logos');
				}
				server
					.get(`/admin/logos/${logo._id}/delete`)
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
