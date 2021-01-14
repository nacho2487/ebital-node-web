var multer = require('multer'); 
var path = require('path'); 
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../../uploads/'));
	},
	filename: function (req, file, cb) {
		var splittedPoint = file.originalname.split('.');
		var extension = splittedPoint[splittedPoint.length - 1];
		cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
	}
});
module.exports = multer({ storage: storage });