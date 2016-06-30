var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String,
	created_at: Date,
	updated_at: Date
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
	var user = this;
	// get the current date
	var currentDate = new Date();

	// change the updated_at field to current date
	user.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!user.created_at)
		user.created_at = currentDate;

	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);
