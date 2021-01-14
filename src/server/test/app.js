
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var passportConf = require('../helpers/passport');
var i18n = require('i18n');
dotenv.load({ path: '.env' });
var app = express();
i18n.configure({
	locales:['es', 'en'],
	directory: path.join(__dirname, './../config/locales'),
	defaultLocale: 'es',
	queryParameter: 'lang'
});
var routes = require('../routes')(i18n);
var admin = require('../routes/admin')();
var user = require('../routes/user');
var userController = require('../controllers/user');


mongoose.connect(process.env.MONGOLAB_URI_TEST);
mongoose.connection.on('error', function() {
	console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
	process.exit(1);
});
mongoose.connection.collections['users'].drop( function() {
	console.log('user collection dropped');
});

mongoose.connection.collections['banners'].drop( function() {
	console.log('banner collection dropped');
});
mongoose.connection.collections['projects'].drop( function() {
	console.log('projects collection dropped');
});
mongoose.connection.collections['pages'].drop( function() {
	console.log('comnpany collection dropped');
});

userController.createFirstUser();
require('../helpers/initializeDB');

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
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
		url: process.env.MONGOLAB_URI_TEST,
		autoReconnect: true
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});
app.use(i18n.init);
app.use(express.static(path.join(__dirname, '../../client'), { maxAge: 31557600000 }));


function setLocale(req, res, next) {
	i18n.setLocale(req, req.params.lang);
	next();
}

app.use('/:lang(es|en)?/admin', passportConf.isAuthenticated, setLocale, admin);
app.use('/:lang(es|en)?', setLocale, routes);
app.use('/user', user);


app.listen(app.get('port'), function() {
	console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
