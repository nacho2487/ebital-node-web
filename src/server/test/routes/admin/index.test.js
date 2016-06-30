var app = require('../../app');
var login = require('./login');
var request = require('supertest');
var server = request.agent(app);

describe('Admin routes', function() {
	it('login', login(server));
	describe('GET /admin', function() {
		it('/ 200 OK', function(done) {
			server
			.get('/admin')
			.expect(200)
			.end(function (err) {
				if (err) return done(err);
				return done();
			});
		});
		it('/ 302 redirect to login', function(done) {
			request(app)
				.get('/admin')
				.expect(302)
				.expect('Location', '/user/login')
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
	describe('GET /admin/signup', function() {
		it('/signup 200 OK', function(done) {
			server
				.get('/admin/signup')
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					return done();
				});
		});
	});
});
