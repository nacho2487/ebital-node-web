var co = require('co');

var clientsController = function(Client, CompanyLogo) {

	var index = co.wrap(function* (req, res, next) {
		try{
			var clients = yield Client.find({publish: true}).sort('position');
			var logos = yield CompanyLogo.find({publish: true}).sort('position');
			res.render('clients', {
				title: req.__n('Client', 2),
				descriptionMeta: req.__('CompanyDescriptionKey'),
				url: {
					es: req.__l('url.clients')[1],
					en: `/en${req.__l('url.clients')[0]}`
				},
				link: req.__n('Client', 2),
				clients: clients,
				logos: logos
			});
		} catch(err){
			next(err);
		}
	});

	return {
		index
	};
};

module.exports = clientsController;
