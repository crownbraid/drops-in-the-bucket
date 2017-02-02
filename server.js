var binaryServer = require('./server-scripts/binaryserver.js')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , session = require('cookie-session')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , Room = require('./server-scripts/models/room')
  , Account = require('./server-scripts/models/account');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, unset: 'destroy', saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


app.use(express.static(__dirname + '/public'));
app.use('/rooms/', require('./server-scripts/routes/rooms'));
app.use('/rooms/', require('connect-ensure-login').ensureLoggedIn('./'));
app.use('/accounts/', require('./server-scripts/routes/accounts'));

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});


var config = require('./config');
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};
if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};
module.exports = app;
module.exports = runServer;