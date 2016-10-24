var mongoose = require('mongoose');
var langModel = require('./../helpers/langModel');
var preSaveDate = require('./../helpers/preSaveDate');
var preSaveUrl = require('./../helpers/preSaveUrl');
var imageModel = require('./../helpers/imageModel');

var projectSchema = new mongoose.Schema({
	title: langModel,
	description: langModel,
	client: String,
	location: String,
	locationIn: langModel,
	area: langModel,
	dateStart: {
		month: String,
		year: String
	},
	dateEnd: {
		month: String,
		year: String
	},
	text: langModel,
	url: langModel,
	state: { type: String, default: 'finished' },
	publish: { type: Boolean, default: true },
	homeImage: imageModel,
	images: [imageModel],
	service: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Service'
	},
	created_at: { type: Date, default: new Date()},
	updated_at: Date,
	position: { type: Number, default: 0 },
	highlighted: Boolean

});

projectSchema.pre('save', preSaveUrl);
projectSchema.pre('save', preSaveDate);

module.exports = mongoose.model('Project', projectSchema);
