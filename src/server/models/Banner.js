var mongoose = require('mongoose');
var langModel = require('./../helpers/langModel');
var preSaveDate = require('./../helpers/preSaveDate');
var imageModel = require('./../helpers/imageModel');

var bannerSchema = new mongoose.Schema({
	title: langModel,
	description: langModel,
	publish:{ type: Boolean, default: true } ,
	image: imageModel,
	created_at: Date,
	updated_at: Date,
	position: { type: Number, default: 0 } 
});

bannerSchema.pre('save', preSaveDate);

module.exports = mongoose.model('Banner', bannerSchema);
