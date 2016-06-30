var app = require('../../app');
var login = require('./login');
var request = require('supertest');
var path = require('path');
var server = request.agent(app);
var data = {title: {es:'title 1', en:'title english'}, description: {es:'description 1'} };
var dataWithImage = {title: {es:'title 1 with image', en:'title english with image'}, description: {es:'description 1'} };
var News = require('../../../models/News');
var redirectUrl = '/es/admin/news';

describe('Admin news routes', function() {
	it('login', login(server));
	describe('GET /admin/news', function() {
		it('/admin/news 200 OK', function(done) {
			server
				.get('/es/admin/news')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/news/add', function() {
		it('/admin/news/add 200 OK', function(done) {
			server
				.get('/admin/news/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /en/admin/news/add', function() {
		it('/en/admin/news/add 200 OK', function(done) {
			server
				.get('/en/admin/news/add')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('POST /es/admin/news/add', function() {
		it('/admin/news/add 200 OK', function(done) {
			server
			.post('/es/admin/news/add')
			.send(data)
			.expect(302)
			.expect('Location', redirectUrl)
			.end(function (err) {
				if (err) return done(err);
				return done();
			});
		});
		it('/admin/news/add with image 200 OK', function(done) {
			server
			.post('/es/admin/news/add')
			.field('title.es', dataWithImage.title.es)
			.field('title.en', dataWithImage.title.en)
			.attach('news-principal-image', path.join(__dirname, '../../images/aic-small.jpg'))
			.expect(302)
			.expect('Location', redirectUrl)
			.end(function (err) {
				if (err) return done(err);
				return done();
			});
		});
	});
	describe('GET /admin/news/:id/edit', function() {
		it('/admin/news/:id/edit 200 OK', function(done) {
			News.findOne(function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.get(`/admin/news/${news._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('GET /en/admin/news/:id/edit', function() {
		it('/en/admin/news/:id/edit 200 OK', function(done) {
			News.findOne(function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.get(`/en/admin/news/${news._id}/edit`)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});

		});
	});
	describe('POST /es/admin/news/:id/edit', function() {
		it('/es/admin/news/:id/edit without image', function(done) {
			News.findOne({'title.es': data.title.es }, function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.post(`/es/admin/news/${news._id}/edit`)
					.send(data)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});

		it('/es/admin/news/:id/edit without image and without english title', function(done) {
			data.title.en = '';
			News.findOne({'title.es': data.title.es }, function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.post(`/es/admin/news/${news._id}/edit`)
					.send(data)
					.expect(302)
					.expect('Location', `/es/admin/news/${news._id}/edit`)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});

		it('/es/admin/news/:id/edit with image', function(done) {
			News.findOne({'title.es': dataWithImage.title.es }, function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.post(`/es/admin/news/${news._id}/edit`)
					.field('title.es', dataWithImage.title.es)
					.field('title.en', dataWithImage.title.en)
					.attach('news-principal-image', path.join(__dirname, '../../images/botnia-small.jpg'))
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
		it('/es/admin/news/:id/edit with multiple images', function(done) {
			News.findOne({'title.es': dataWithImage.title.es }, function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.post(`/es/admin/news/${news._id}/edit`)
					.field('title.es', dataWithImage.title.es)
					.field('title.en', dataWithImage.title.en)
					.attach('news-images', path.join(__dirname, '../../images/botnia-small.jpg'))
					.attach('news-images', path.join(__dirname, '../../images/aic-small.jpg'))
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
	});
	describe('POST /es/admin/news/:id/delete', function() {
		it('/es/admin/news/:id/delete without image', function(done) {
			News.findOne({'title.es': data.title.es}, function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.get(`/admin/news/${news._id}/delete`)
					.expect(302)
					.expect('Location', redirectUrl)
					.end(function (err) {
						if (err) return done(err);
						return done();
					});
			});
		});
		it('/es/admin/news/:id/delete with image', function(done) {
			News.findOne({'title.es': dataWithImage.title.es }, function(err, news){
				if(!news){
					return done('No data in news');
				}
				server
					.get(`/admin/news/${news._id}/delete`)
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
