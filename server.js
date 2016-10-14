var express = require('express');
var binaryServer = require('./server-scripts/binaryServer.js');
var path = require('path');

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/room/:roomid', function(req, res) {
    // var room = rooms[eq.params.roomid];
	var roomInfo = {
        'roomid': req.params.roomid,
        'roomname': "My First Room",
        'rule': "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
        'time': 0.10,
        'status': "unfinished",
        'users': {}
    }
	res.json(roomInfo);
});
/*
app.get('/user/:username', function(req, res) {
    var users = rooms[eq.params.roomid];
	var userInfo = {
        'username': req.params.username,
        'rooms': [
	        { 'roomid': null, 'userstatus': null}
        ]
    }
	res.json(userInfo)
});
*/


// res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

app.listen(process.env.PORT || 8080);

exports.app = app;



/*
var rooms = {
    room1: {
            name: "My First Room",
            rule: "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
            time: 0.10,
            status: "unfinished",
            url: "/room.html"
    },
    room2: {
            name: "My Second Room",
            rule: "don't be very careful",
            time: 1.00,
            status: "finished",
            url: "/room.html"
    },
    room3: {
            name: "My Third Room",
            rule: "don't be dumb",
            time: 2.00,
            status: "unfinished",
            url: "/room.html"
    },
    room4: {
            name: "Best Room Ever",
            rule: "be absolutely perfect",
            time: 15.00,
            status: "finished",
            url: "/room.html"
    },
    room5: {
            name: "Dumbest Room ",
            rule: "you're alright",
            time: 4.00,
            status: "finished",
            url: "/room.html"
    },
    room6: {
            name: "YESSSSsss",
            rule: "give up already",
            time: 3.00,
            status: "unfinished",
            url: "/room.html"
    }
}
*/