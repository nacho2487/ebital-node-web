var app = require('../../app');
var login = require('./login');
var request = require('supertest');
var path = require('path');
var server = request.agent(app);
var data = {name: {es:'name 1'}, description: {es:'description 1'} };
var dataWithImage = {name: {es:'name 1 with image'}, description: {es:'description 1'} };
var Client = require('../../../models/Client');
var redirectUrl = '/es/admin/clients';

describe('Admin clients routes', function() {
	it('login', login(server));
	describe('GET /admin/clients', function() {
		it('/admin/clients 200 OK', function(done) {
			server
				.get('/es/admin/clients')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/clients/add', function() {
		it('/admin/clients/add 200 OK', function(done) {
			server
				.get('/admin/clients/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /en/admin/clients/add', function() {
		it('/en/admin/clients/add 200 OK', function(done) {
			server
				.get('/en/admin/clients/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('POST /es/admin/clients/add', function() {
		it('/admin/clients/add 200 OK', function(done) {
			server
				.post('/es/admin/clients/add')
				.send(data)
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
		it('/admin/clients/add with image 200 OK', function(done) {
			server
				.post('/es/admin/clients/add')
				.field('name.es', dataWithImage.name.es)
				.attach('client-image', path.join(__dirname, '../../images/aic-small.jpg'))
				.expect(302)
				.expect('Location', redirectUrl)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/clients/:id/edit', function() {
		it('/admin/clients/:id/edit 200 OK', function(done) {
			Client.findOne(function(err, client){
				if(!client){
					return done('No data in clients');
				}
				server
					.get(`/admin/clients/${client._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('GET /en/admin/clients/:id/edit', function() {
		it('/en/admin/clients/:id/edit 200 OK', function(done) {
			Client.findOne(function(err, client){
				if(!client){
					return done('No data in clients');
				}
				server
					.get(`/en/admin/clients/${client._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('POST /es/admin/clients/:id/edit', function() {
		it('/es/admin/clients/:id/edit without image', function(done) {
			Client.findOne({'name.es': data.name.es }, function(err, client){
				if(!client){
					return done('No data in clients');
				}
				server
					.post(`/es/admin/clients/${client._id}/edit`)
					.send(data)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});

		it('/es/admin/clients/:id/edit with image', function(done) {
			Client.findOne({'name.es': dataWithImage.name.es }, function(err, client){
				if(!client){
					return done('No data in clients');
				}
				server
					.post(`/es/admin/clients/${client._id}/edit`)
					.field('name.es', dataWithImage.name.es)
					.attach('client-image', path.join(__dirname, '../../images/botnia-small.jpg'))
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
	});
	describe('POST /es/admin/clients/:id/delete', function() {
		it('/es/admin/clients/:id/delete without image', function(done) {
			Client.findOne({'name.es': data.name.es}, function(err, client){
				if(!client){
					return done('No data in clients');
				}
				server
					.get(`/admin/clients/${client._id}/delete`)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
		it('/es/admin/clients/:id/delete with image', function(done) {
			Client.findOne({'name.es': dataWithImage.name.es }, function(err, client){
				if(!client){
					return done('No data in clients');
				}
				server
					.get(`/admin/clients/${client._id}/delete`)
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
