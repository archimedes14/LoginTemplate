var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport'); 
var constants = require('./config/constants'); 


var session = require('express-session');
var compression = require('compression');
var MongoStore = require('connect-mongo')(session);


//registering controllers to variables 
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');


var app = express();

//mongodb setup 
var mongoose = require('mongoose');
mongoose.connect(constants.MONGO_DEV_REMOTE);
var db = mongoose.connection;

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: "1234567890QWERTY", 
    store: new MongoStore({
        url: constants.MONGO_DEV_REMOTE, 
        ttl: 14 * 24 * 3600,
        autoRemove: 'native',
        touchAfter: 24 * 3600
    })
})); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

//controllers 
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
