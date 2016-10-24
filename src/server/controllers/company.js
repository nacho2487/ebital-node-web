
var companyController = function(Company) {

	var index = function(req, res, next) {
		var urlLocale= 'url.' + req.getLocale();
		var query = {};
		query[urlLocale] = req.params.companyUrl;
		Company
			.findOne(query)
			.sort('position')
			.exec(function(err, company){
				if(err) return next(err);
				if(!company) return next();

				res.render(`company/${company.type}`, {
					title: req.__('Company'),
					descriptionMeta: req.__('CompanyDescriptionKey'),
					url: {
						es: req.__l('url.company')[1].replace(':companyUrl', req.__l(`url.${company.type}`)[1]),
						en: `/en${req.__l('url.company')[0].replace(':companyUrl', req.__l(`url.${company.type}`)[0])}`
					},
					link: req.__('Company'),
					company: company
				});
			});
	};

	return {
		index:index
	};
};

module.exports = companyController;
