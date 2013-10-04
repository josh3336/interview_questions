
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var userCtrl = require('./controllers/users.js')
var http = require('http');
var path = require('path');
var passport = require('passport')
var util = require('util')

var app = express();
require('./config/passport.js')(app)

console.log('passports',passport);
console.log('routes',routes)
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'app')));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/users', user.list);
app.get('/getuser', userCtrl.get)

app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
  // The request will be redirected to Facebook for authentication, so this
  // function will not be called.
});


	// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
passport.authenticate('facebook', { failureRedirect: '/wtf' }),
function(req, res) {
  console.log('auth resp=======================',req)
  res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
