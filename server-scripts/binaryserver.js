const fs = require('fs');
const junk = require('junk');
const wav = require('wav');

const BinaryServer = require('binaryjs').BinaryServer;

binaryServer = BinaryServer({port: 9002});

binaryServer.on('connection', function(client) {
  client.on('stream', function(stream, meta) {

    var username = "real_cool_dude";
    var time = Date.now();
    var roomname = 'room1';
    var numUsers = 4;
    var duration = 10000;

    var roomAddress = './recordings/' + roomname;
    if (!fs.existsSync(roomAddress)){
      fs.mkdirSync(roomAddress);
    }

    var outFile = roomAddress + '/' + roomname + username + time + '.wav';
    var fileWriter = new wav.FileWriter(outFile, {
      channels: 1,
      sampleRate: 48000,
      bitDepth: 16
    });

    stream.pipe(fileWriter);
    stream.on('end', writeFile());

    function writeFile() {
      return function(e) {
        fileWriter.end();
        fs.readdir(roomAddress, function(err, files) {
          if (!err) {
            var sounds = {};
            files = files.filter(junk.not);
            var num = 1;
            files.forEach(function(file) {
              sounds['sound' + num] = file;
              num++
            });
            if (files.length == numUsers) {
              orderFileMerge(roomAddress, sounds, duration);
            }
          } else {
            throw err; 
          }
        });
      }
    }

    function orderFileMerge(roomAddress, sounds, duration) {
      console.log("mergingfiles--\nRoom Address: " + roomAddress + "\nSounds: " + sounds + "\nDuration: " + duration);
      console.log(sounds);

      var PythonShell = require('python-shell');
      var pyshell = new PythonShell('./server-scripts/overdub.py');
      pyshell.on('message', function (message) {
        console.log(message);
      });

      var options = {
        args: [roomAddress, JSON.stringify(sounds), duration]
      };
      PythonShell.run('./server-scripts/overdub.py', options, function (err) {
        if (err) throw err;
        console.log('finished');
      });

      /* process.stdout.on('data', function (data){
        console.log("data has been received: " + data);
      });
      pyshell.end(function (err) {
        if (err) throw err;
        console.log('finished');
      }); */
    }
  });
});

module.exports.binaryServer = binaryServer;