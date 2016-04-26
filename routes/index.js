var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if (req.user) {
		res.render('home', {"user": req.user});
	} else {
		res.render('index');
	}
  
});

module.exports = router;
