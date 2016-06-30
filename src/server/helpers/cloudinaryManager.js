var cloudinary = require('cloudinary');
var _ = require('lodash');

module.exports.add = function(path) {
	return new Promise(function(resolve, reject) {
		cloudinary.v2.uploader.upload(path, { format: 'jpg' },  function(err, image) {
			if(err){
				reject(err);
			}
			resolve(image);
		});
	});
};

module.exports.remove = function(imageId) {
	return new Promise(function(resolve, reject) {
		cloudinary.v2.uploader.destroy(imageId,  function(err, result) {
			if(err){
				reject(err);
			}
			resolve(result);
		});
	});
};

module.exports.removeAll = function(images) {
	return new Promise(function(resolve, reject) {
		var countRemove = 0;
		_.forEach(images, function(image){
			cloudinary.v2.uploader.destroy(image.filename,  function(err, result) {
				if(err){
					reject(err);
				}
				countRemove++;
				if(countRemove === images.length){
					resolve(result);
				}
			});
		});
	});
};
