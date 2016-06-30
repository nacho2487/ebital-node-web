var mongoose = require('mongoose');
var preSaveDate = require('./../helpers/preSaveDate');
var imageModel = require('./../helpers/imageModel');

var companyLogoSchema = new mongoose.Schema({
	title: String,
	link: String,
	image: imageModel,
	created_at: Date,
	updated_at: Date,
	publish: { type: Boolean, default: true },
	position: { type: Number, default: 0 }
});

companyLogoSchema.pre('save', preSaveDate);

module.exports = mongoose.model('CompanyLogo', companyLogoSchema);
