// routes.js
var env 			= process.env.NODE_ENV;

module.exports = function(app, passport) {

	// user's home page...
	app.get('/', function(req, res) {

		if(env === 'production' && !req.secure)
			res.redirect("https://" + req.get('host') + req.url);

		else if(req.user) res.render('app.ejs', {
			userName: req.user.twitter.username
		});

		else res.render('index.ejs');

	});

	// route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

	app.get('*', function(req, res) {
		res.redirect('/');
	});

};
