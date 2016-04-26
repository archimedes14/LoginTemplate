var mongoose = require('mongoose');

//USER MODEL SCHEMA AND MODEL 
var userSchema = mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	createdAt: {type: Date, default: Date.now}, 
	updatedAt: {type: Date, default: Date.now}, 
	picture: String,
	oauthId: String,
	signupStyle: String
});



userSchema.static('findOrCreate', function(profile, callback) {
	this.findOne({"email":profile.email}, function(err, user) {
		if (err)
			return callback(err);
		if (user)
			return callback(null, user)
		else {
			user = new User({
				first_name: profile.first_name,
				last_name: profile.last_name,
				email: profile.email,
				oauthId: profile.oauthId,
				picture: profile.picture,
				signupStyle: profile.signupStyle,
			});

			user.save(function(err, user) {
				if (err)
					return callback(err);
				return callback(null, user); 
			})
		}

	 
	});
});


var User = mongoose.model('User', userSchema);

module.exports = User; 
