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
        'time': 23000,
        'status': "unfinished",
        'finished': [
            'alan_yum',
            'cool_head',
            'realgreatguy'
        ]
    }
	res.json(roomInfo);
});

app.get('/user/:username', function(req, res) {
    var user = users[req.params.username];
	var userInfo = {
        'username': req.params.username,
        'rooms': user.rooms
    }
	res.json(userInfo);
});


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

var users = {
    "real_Cool_Alan": {
        rooms: [
            {
                name: "My First Room",
                rule: "be very careful",
                status: "unfinished",
                url: "/room.html",
                users: [

                ]
            },
            {
                name: "My Second Room",
                rule: "don't be very careful",
                status: "finished",
                url: "/room.html"
            },
            {
                name: "My Third Room",
                rule: "don't be dumb",
                status: "unfinished",
                url: "/room.html"
            },
            {
                name: "Best Room Ever",
                rule: "be absolutely perfect",
                status: "finished",
                url: "/room.html"
            },
            {
                name: "Dumbest Room ",
                rule: "you're alright",
                status: "finished",
                url: "/room.html"
            },
            {
                name: "YESSSSsss",
                rule: "give up already",
                status: "unfinished",
                url: "/room.html"
            }
        ]
    }
}