var passport = require('passport');

var users = module.exports = {};

users.get = function(req, res, next) {
	var user;
	console.log("req.user",req.user)
	if(req.user){
		user = {
			"displayName" : req.user['displayName'],
			"profile" : req.user['profileUrl'],
			"id": req.user['id'],
		}
		console.log('USER',user);  
	}
	res.json(user);
};
