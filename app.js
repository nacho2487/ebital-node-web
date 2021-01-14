require ('newrelic');
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var passportConf = require('./src/server/helpers/passport');
var i18n = require('i18n');
var UglifyJS = require("uglify-js");
var fs = require("fs");
var enforce = require('express-sslify');


var result = UglifyJS.minify(['./src/client/js/lib/jquery.min.js', './src/client/js/lib/bootstrap.min.js', './src/client/js/lib/lightbox.min.js', './src/client/js/main.js']);

fs.writeFileSync('./src/client/js/main.min.js', result.code);

dotenv.load({ path: '.env' });
var app = express();
i18n.configure({
	locales:['es', 'en'],
	directory: path.join(__dirname, './src/server/config/locales'),
	defaultLocale: 'es',
	queryParameter: 'lang'
});

var routes = require('./src/server/routes/index')(i18n);
var admin = require('./src/server/routes/admin/index')();
var user = require('./src/server/routes/user');


mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
	console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
	process.exit(1);
});

require('./src/server/helpers/initializeDB');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './src/server/views'));
app.set('view engine', 'pug');
app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(compress());
app.use(sass({
	src: path.join(__dirname, './src/client'),
	dest: path.join(__dirname, './src/client'),
	debug: app.get('env') === 'development',
	sourceMap: true,
	outputStyle: 'compressed'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET,
	store: new MongoStore({
		url: process.env.MONGODB || process.env.MONGOLAB_URI,
		autoReconnect: true
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});
app.use(i18n.init);
app.use(express.static(path.join(__dirname, './src/client'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, './uploads'), { maxAge: 31557600000 }));

function setLocale(req, res, next) {
	i18n.setLocale(req, req.params.lang);
	next();
}

app.use('/:lang(es|en)?/admin', passportConf.isAuthenticated, setLocale, admin);
app.use(lusca.csrf());
app.use('/:lang(es|en)?', setLocale, routes);
app.use('/user', user);
if(app.get('env') === 'production') {

	app.use(function(req, res) {
		res.status(404);
		res.render('errors/404.pug', {title: '404: Not Found'});
	});

	app.use(function (error, req, res) {
		res.status(500);
		res.render('errors/500.pug', {title: '500: Error Interno', error: error});
	});
}
if (app.get('env') === 'development') {
	app.use(errorHandler());
}

app.listen(app.get('port'), function() {
	console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
