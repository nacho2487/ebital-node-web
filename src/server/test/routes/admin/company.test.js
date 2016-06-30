var app = require('../../app');
var login = require('./login');
var request = require('supertest');
var path = require('path');
var server = request.agent(app);
var data = {type: 'about-us', text: {es:'description 1'} };
var dataWithImage = {type: 'about-us', text: {es:'description 1'} };

describe('Admin company routes', function() {
	it('login', login(server));

	describe('GET /admin/company/:type/:position', function() {
		it('/admin/company/:type/:position 200 OK', function(done) {
			server
				.get('/admin/company/about-us/0')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});

		});
	});
	describe('GET /en/admin/company/:type/:position', function() {
		it('/en/admin/company/:type/:position 200 OK', function(done) {
			server
				.get('/en/admin/company/about-us/0')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('POST /admin/company/:type/:position', function() {
		it('/admin/company/:type/:position without image', function(done) {
			server
			.post('/admin/company/about-us/0')
			.send(data)
			.expect(302)
			.expect('Location', '/es/admin/company/about-us/0')
			.end(function (err) {
				if (err) return done(err);
				return done();
			});
		});

		it('/es/admin/company/about-us/0 with image', function(done) {
			server
			.post('/es/admin/company/about-us/0')
			.field('text.es', dataWithImage.text.es)
			.attach('company-image', path.join(__dirname, '../../images/botnia-small.jpg'))
			.expect(302)
			.expect('Location', '/es/admin/company/about-us/0')
			.end(function (err) {
				if (err) return done(err);
				return done();
			});
		});
	});
});
