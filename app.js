// set up
var port 			= process.env.PORT;
var envShort 		= process.env.NODE_DOMAIN_SHORT;
var sessionSecret 	= process.env.SESSION_SECRET;

var express 		= require('express');
var useragent 		= require('express-useragent');
var app 			= express();
var multer  		= require('multer');
var mongoose		= require('mongoose');
var _ 				= require('underscore');
var fs 				= require('fs');
var dbConnection 	= require('./database/databasemanager');
var passport 		= require('passport');
var ejs 			= require('ejs');
var morgan       	= require('morgan');
var cookieParser 	= require('cookie-parser');
var session      	= require('express-session');
var MongoStore  	= require('connect-mongo')(session);
var path 			= require('path');
var async 			= require('async');

var User 			= require('./database/user');


// set custom delimiter for ejs to allow underscore templates
ejs.delimiter = '$';

// pass passport for configuration
require('./config/passport')(passport);

// set static files location
app.use(express.static(__dirname + '/public'));

// trust CloudFlare
app.enable('trust proxy');

// add morgan for logging
app.use(morgan('dev'));

app.use(cookieParser()); // read cookies (needed for auth)

//On successful connect
dbConnection.on('connected', function () {

	// check subdomain cookie
	app.use(session({
	    secret: sessionSecret,
	    cookie: {
	      expires: false,
	      maxAge: 365 * 24 * 60 * 60 * 1000, // one year
	      domain: '.checkyourfollowers.' + envShort,
	    },
	    store: new MongoStore({ mongooseConnection: mongoose.connection }),
	    saveUninitialized: false,
        resave: false,
	}));

	app.set('view engine', 'ejs'); // set up ejs for templating

	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

	// serve the routes
	require('./app/routes.js')(app, passport);

	// create the servers
	app.listen(port);
	console.log('Server started...');

});
