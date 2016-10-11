var express = require('express');
var binaryServer = require('./server-scripts/binaryServer.js');

var app = express();
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 8080);

exports.app = app;

/*
app.get('/room/:roomname', function(req, res) {
  res.sendFile('room.html');
});
*/