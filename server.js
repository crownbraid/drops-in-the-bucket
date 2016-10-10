var express = require('express');

var app = express();

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);
/*
app.get('/api/:user', function(req, res) {
  res.json(../documents/users/:user);
});

app.get('/api/:room', function(req, res) {
  res.json(../documents/rooms/:room);
});


/*
var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

var binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log('new connection');

  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('new stream');
    stream.pipe(fileWriter);

    stream.on('end', function() {
      fileWriter.end();
      console.log('wrote to file ' + outFile);
    });
  });
});

*/

exports.app = app;