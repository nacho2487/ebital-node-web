var co = require('co');

var newsController = function(News) {

	var index = co.wrap(function* (req, res, next) {
		try{
			var news = yield News.find({publish: true}).sort('position');

			res.render('news', {
				title: req.__n('News', 2),
				url: {
					es: req.__l('url.news')[1],
					en: `/en/${req.__l('url.news')[0]}`
				},
				link: req.__n('News', 2),
				news: news
			});
		} catch(err){
			next(err);
		}
	});

	var details = co.wrap(function* (req, res, next) {
		try{
			var urlLocale= 'url.' + req.getLocale();
			var queryNews = {};
			queryNews[urlLocale] = req.params.newsUrl;
			var news = yield News.findOne(queryNews);
			if(!news){
				return next();
			}
			res.render('newsDetail', {
				title: req.__n('News', 2),
				url: {
					es: req.__l('url.newsDetail')[1].replace(':newsUrl', news.url.es),
					en: `/en/${req.__l('url.newsDetail')[0].replace(':newsUrl', news.url.en)}`
				},
				link: req.__n('News', 2),
				news: news
			});
		} catch(err){
			next(err);
		}
	});

	return {
		index,
		details
	};
};

module.exports = newsController;
