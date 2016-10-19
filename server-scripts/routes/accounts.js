var passport = require('passport');
var Account = require('../../models/account');
var Room = require('../../models/room');
var router = require('express').Router();
var async = require('async');

router.post('/register', function(req, res, next) {
  console.log('registering user');
  Account.register(new Account({username: req.body.username, email: req.body.email, rooms: []}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }
    console.log('user registered!');
    passport.authenticate('local')(req, res, function () {
        res.status(201).json(req.user);
    });
  });
});

// res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

router.post('/login', passport.authenticate('local'), function(req, res) { 
  var rooms = req.user.rooms;

  if (rooms.length > 0) {
    var roomsDetails = rooms.map(function(roomID) {
      return Room.findById(roomID).exec().then(function(roomDetails) {
        return roomDetails;
      }).catch(function(err){
        return next(err);
      });
    });
    Promise.all(roomsDetails).then(function(roomsDetails) {
      req.user.rooms = roomsDetails;
      console.log('logged in with Room Details');
      res.status(201).json(req.user);
    }).catch(function(err) {
      console.log('Error: ' + err);
    });
  } else {
    var resObj = req.user;
    console.log('logged in');
    res.status(201).json(resObj);
  }
});

router.get('/refresh', function(req, res) { 
  var rooms = req.user.rooms;

  if (rooms.length > 0) {
    var roomsDetails = rooms.map(function(roomID) {
      return Room.findById(roomID).exec().then(function(roomDetails) {
        return roomDetails;
      }).catch(function(err){
        return next(err);
      });
    });
    Promise.all(roomsDetails).then(function(roomsDetails) {
      req.user.rooms = roomsDetails;
      console.log('Refreshed Room Details');
      res.status(201).json(req.user);
    }).catch(function(err) {
      console.log('Error: ' + err);
    });
  } else {
    console.log('no rooms to refresh');
    res.status(201).req.user;
  }
});

router.get('/logout', function(req, res) {
  console.log('logged out');
  req.logout();
  res.redirect('/');
});

module.exports = router;