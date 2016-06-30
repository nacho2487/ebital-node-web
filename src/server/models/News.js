var mongoose = require('mongoose');
var langModel = require('./../helpers/langModel');
var imageModel = require('./../helpers/imageModel');
var preSaveUrl = require('./../helpers/preSaveUrl');
var preSaveDate = require('./../helpers/preSaveDate');

var newsSchema = new mongoose.Schema({
	title: langModel,
	description: langModel,
	text: langModel,
	url: langModel,
	homeImage: imageModel,
	images: [imageModel],
	date: {
		month: String,
		year: String
	},
	created_at: Date,
	updated_at: Date,
	publish: { type: Boolean, default: true },
	position: { type: Number, default: 0 } 
});

newsSchema.pre('save', preSaveUrl);
newsSchema.pre('save', preSaveDate);

module.exports =  mongoose.model('News', newsSchema);
