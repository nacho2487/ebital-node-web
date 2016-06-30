var mongoose = require('mongoose');
var langModel = require('./../helpers/langModel');
var preSaveDate = require('./../helpers/preSaveDate');
var preSaveUrl = require('./../helpers/preSaveUrl');
var imageModel = require('./../helpers/imageModel');

var companySchema = new mongoose.Schema({
	type: String,
	title:  langModel,
	url:  langModel,
	text: langModel,
	image: imageModel,
	position: { type: Number, default: 0 },
	publish: { type: Boolean, default: true },
	created_at: Date,
	updated_at: Date
});


companySchema.pre('save', preSaveUrl);
companySchema.pre('save', preSaveDate);

module.exports = mongoose.model('Page', companySchema);
