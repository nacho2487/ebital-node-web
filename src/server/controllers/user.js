var passport = require('passport');
var User = require('../models/User');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
	if (req.user) {
		return res.redirect('/admin');
	}
	res.render('admin/account/login', {
		title: 'Login'
	});
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
	req.assert('password', 'Contraseña requerida').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/user/login');
	}

	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash('errors', { msg: info.message });
			return res.redirect('/user/login');
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			res.redirect('/admin');
		});
	})(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
	res.render('admin/account/signup', {
		title: 'Create Account'
	});
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/admin/signup');
	}

	var user = new User({
		email: req.body.email,
		password: req.body.password
	});

	User.findOne({ email: req.body.email }, function(err, existingUser) {
		if (existingUser) {
			req.flash('errors', { msg: 'Account with that email address already exists.' });
			return res.redirect('/admin/signup');
		}
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				res.redirect('/admin');
			});
		});
	});
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
	res.render('admin/account/profile', {
		title: 'Account Management'
	});
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
	req.assert('password', 'Password must be at least 4 characters long').len(4);
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/admin/account');
	}

	User.findById(req.user.id, function(err, user) {
		if (err) {
			return next(err);
		}
		user.password = req.body.password;
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			req.flash('success', { msg: 'Password has been changed.' });
			res.redirect('/admin/account');
		});
	});
};

exports.createFirstUser = function(req, res, next){
	var user = new User({
		email: process.env.ADMIN_USER,
		password: process.env.ADMIN_PASSWORD
	});

	user.save(function(err) {
		if (err) {
			return next(err);
		}
		console.log('user created');
	});
};
