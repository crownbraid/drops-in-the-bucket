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
      var spawn = require("child_process").spawn;
      var process = spawn('python',['./server-scripts/overdub.py', roomAddress, sounds, duration]);
      process.stdout.on('data', function (data){
        console.log("data has been received: " + data);
      });
    }
  });
});
/*
// const $ = require('jQuery');
     $.ajax({
        type:'get',
        url: 'overdub.py',
        cache:false,
        data: JSON.stringify({
          'roomAddress': roomAddress,
          'addresses': addresses
        }),
        async: true,
        success: function(data) {
          // <put your custom validation here using the response from data structure >
        },
        error: function(request, status, error) {
          // <put your custom code here to handle the call failure>
        }
      });
*/
module.exports.binaryServer = binaryServer;