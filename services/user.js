var express = require('express');
var UserService = {}

UserService.sanitize = function sanitize(user) {
	var sanitizedUser = {
		first_name: user.name.givenName, 
		last_name: user.name.familyName, 
		email: user.emails[0].value,
		oauthId: user.id, 
		signupStyle: user.signupStyle
	}
	
	if (user.signupStyle === "facebook") {
		sanitizedUser.picture = "http://graph.facebook.com/"+user.id+"/picture?width=200&height=200"; 
	} else {
		sanitizedUser.picture = user.photos[0].value.replace("sz=50", "sz=200"); 
	}

	return sanitizedUser; 
}



module.exports = UserService;
