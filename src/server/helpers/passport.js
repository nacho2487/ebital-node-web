var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/User');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});



/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
	email = email.toLowerCase();
	User.findOne({ email: email }, function(err, user) {
		if (!user) {
			return done(null, false, { message: 'Usuario ' + email + ' no encontrado'});
		}
		user.comparePassword(password, function(err, isMatch) {
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Usuario o contraseña incorrecta' });
			}
		});
	});
}));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/user/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function(req, res, next) {
	var provider = req.path.split('/').slice(-1)[0];

	if (_.find(req.user.tokens, { kind: provider })) {
		next();
	} else {
		res.redirect('/auth/' + provider);
	}
};
