var fs = require('fs');

module.exports.remove = function(path) {
	return new Promise(function(resolve, reject) {
		fs.unlink(path, function(err){
			if(err){
				reject(err);
			}
			resolve();
		});
	});
};
