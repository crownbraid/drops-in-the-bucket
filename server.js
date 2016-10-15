var express = require('express');
var binaryServer = require('./server-scripts/binaryServer.js');
var path = require('path');

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/room/:roomid', function(req, res) {
    var roomInfo = rooms[req.params.roomid];
	res.json(roomInfo);
});

app.get('/user/:username', function(req, res) {
    var user = users[req.params.username];
    var userRooms = user.rooms.map(function(room) {return rooms[room];});
	var userInfo = {
        'username': req.params.username,
        'rooms': userRooms
    }
	res.json(userInfo);
});


// res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

app.listen(process.env.PORT || 8080);

exports.app = app;

var rooms = {
    'fdjskaskdjf': {
        'roomid': 'fdjskaskdjf',
        'roomname': "My First Room",
        'rule': "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
        'time': 23000,
        'status': "unfinished",
        'users': 7, 
        'finished': [
            'alan_yum',
            'cool_head',
            'realgreatguy'
        ]
    },
    'asdfdsasdf': {
        'roomid': 'asdfdsasdf',
        'roomname': "My second Room",
        'rule': "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
        'time': 23000,
        'status': "unfinished",
        'users': 6,
        'finished': [
            'bananahead',
            'bastard',
            'cheesyticks'
        ]
    },
    'oiwrkjndsfmkldfg': {
        'roomid': 'oiwrkjndsfmkldfg',
        'roomname': "Whatever",
        'rule': "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
        'time': 23000,
        'status': "unfinished",
        'users': 7,
        'finished': [
            'alan_yum',
            'stupidpotato',
            'realgreatguy'
        ]
    },
    'iuertknfdjiofdg': {
        'roomid': 'iuertknfdjiofdg',
        'roomname': "That's Silly",
        'rule': "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
        'time': 23000,
        'status': "unfinished",
        'users': 11,
        'finished': [
            'celebration',
            'greatdisco',
            'whaaaaaaa',
            'iuhejkndsfgfd',
            'wuysdnfdfijodfg',
            'stupidpotato',
            'realgreatguy'
        ]
    },
    'qpskdfgn': {
        'roomid': 'qpskdfgn',
        'roomname': "Dumb Little Room",
        'rule': "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
        'time': 23000,
        'status': "unfinished",
        'users': 6,
        'finished': [
            'uehr',
        ]
    },
    'ucjhidfn': {
        'roomid': 'ucjhidfn',
        'roomname': "Great Time!",
        'rule': "Hey guys, how are you doing? The rules for this project: record as quietly as possible. You can make a sound every thirty seconds or so if you want. That's it. Good luck!",
        'time': 23000,
        'status': "unfinished",
        'users': 4,
        'finished': [
            'alan_yum',
            'cool_head',
            'realgreatguy'
        ]
    },
}


var users = {
    "real_Cool_Alan": {
        'rooms': ['fdjskaskdjf', 'fdjskaskdjf', 'oiwrkjndsfmkldfg', 'iuertknfdjiofdg', 'qpskdfgn', 'ucjhidfn']
    }
}