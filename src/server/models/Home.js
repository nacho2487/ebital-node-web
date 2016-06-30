var mongoose = require('mongoose');
var langModel = require('./../helpers/langModel');

var homeSchema = new mongoose.Schema({
	images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Banner' }],
	projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
	description: langModel
});


module.exports = mongoose.model('Home', homeSchema);
