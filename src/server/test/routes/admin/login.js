
module.exports = function (server) {
	return function(done) {
		server
			.post('/user/login')
			.send({ email: 'ebital', password: 'ebital' })
			.expect(302)
			.expect('Location', '/admin')
			.end(onResponse);

		function onResponse(err) {
			if (err) return done(err);
			return done();
		}
	};
};
