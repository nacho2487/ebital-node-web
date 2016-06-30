var mongoose = require('mongoose');
var langModel = require('./../helpers/langModel');
var preSaveDate = require('./../helpers/preSaveDate');
var imageModel = require('./../helpers/imageModel');

var clientSchema = new mongoose.Schema({
	name: langModel,
	company: langModel,
	comment: langModel,
	image: imageModel,
	created_at: Date,
	updated_at: Date,
	publish: { type: Boolean, default: true },
	position: { type: Number, default: 0 }
});

clientSchema.pre('save', preSaveDate);


module.exports = mongoose.model('Client', clientSchema);
