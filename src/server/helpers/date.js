exports.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
exports.years = function(){
	var currentYear = new Date().getFullYear() + 15,
		years = [],
		startYear = 1980;
	while ( startYear <= currentYear ) {
		years.push(currentYear--);
	}
	return years;
};