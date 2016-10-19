var passport = require('passport');
var Room = require('../../models/room');
var Account = require('../../models/account');
var router = require('express').Router();

router.post('/', function(req, res) {
    Room.create({
        name: req.body.name,
        rules: req.body.rules,
        timelimit: req.body.timelimit,
        invited: req.body.invited,
        public: req.body.public,
        joined: [],
        finished: []
    }, function(err, room) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        Account.findById(req.user._id, function(err, account) {
            if (err) throw err;
            var rooms = account.rooms
            rooms.push(room._id);
            account.rooms = rooms;
            account.save(function(err) {
                if (err) throw err;
                console.log('Account successfully updated!');
                var resObj = {
                    room: room,
                    rooms: rooms
                }
                res.status(201).json(resObj);
            });
        });
    });
});

router.get('/:roomID', function(req, res) {
    Room.findById(req.params.roomID, function(err, room) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(room);
    });
});

router.put('/:roomID', function(req, res) {
    Room.findByIdAndUpdate(req.params.roomID, function(err, room) {
      if (!room)
        return next(new Error('Could not load Document'));
      else {
        var newprops = req.newproperties;  

        for (prop in newprops) {
            room[prop] = newprops[prop];
        }

        room.save(function(err) {
          if (err)
            console.log('error')
          else
            console.log('success')
        });
      }
    });
});

router.delete('/', function(req, res) {
    Room.findByIdAndRemove(req.params.room_id, function(err) {
        if (err)
            console.log('error');
        else
            console.log('success');
    });
});

module.exports = router;