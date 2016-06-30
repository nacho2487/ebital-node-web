var mongoose = require('mongoose');
var langModel = require('./../helpers/langModel');
var preSaveDate = require('./../helpers/preSaveDate');
var preSaveUrl = require('./../helpers/preSaveUrl');

var serviceSchema = new mongoose.Schema({
	title: langModel,
	url: langModel,  
	color: String,
	created_at: Date,
	updated_at: Date,
	Projects : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
	position: { type: Number, default: 0 }
});

serviceSchema.pre('save', preSaveUrl);
serviceSchema.pre('save', preSaveDate);

module.exports = mongoose.model('Service', serviceSchema);
