var co = require('co');

var companyController = function(Company) {
	var baseController = require('./base')(Company, 'admin/company', 'Company');

	var edit = co.wrap(function* (req, res, next){
		Company
		.findOne({type: req.params.type})
		.exec(function(err, company){
			if(err) return next(err);
			if(!company){
				company = new Company();
			}
			company.position = req.params.position;
			company.type = req.params.type;
			res.render('admin/company', {
				title: req.__('Company'),
				company: company,
				header: getCompanyHeader(req.params.type, req.__)
			});
		});
	});

	var save = co.wrap(function* (req, res, next){
		try {
			if(req.file) {
				req.body.image = yield baseController.addSingleImage(req.file);
			}
			if(req.body.companyid){
				req.params.id = req.body.companyid;
				req.item = yield baseController.getById(req, res);
				if(req.file && req.item.image.filename){
					yield baseController.removeSingleImage(req.item.image.filename);
				}
				yield baseController.put(req, res, next);
			} else {
				yield baseController.post(req, res, next);
			}
			res.redirect(`/${req.getLocale()}/admin/company/${req.params.type}/${req.params.position}`);

		} catch(err){
			return next(err);
		}
	});

	function getCompanyHeader(type, __) {
		var header = '';
		switch(type){
		case 'about-us':
			header = __('AboutUs');
			break;
		case 'team':
			header = __('ExecutiveTeam');
			break;
		case 'politics':
			header = __('PoliticsAndCertificatios');
			break;
		case 'benefits':
			header = __('Benefits');
			break;
		case 'values':
			header = __('Values');
			break;
		}
		return header;
	}


	return {
		edit: edit,
		save: save
	};
};

module.exports = companyController;
