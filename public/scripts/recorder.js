(function(window) {
  var client = new BinaryClient('ws://localhost:9002');

  client.on('open', function() {

    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, success, function(e) {
        alert('Error capturing audio.');
      });
    } else alert('getUserMedia not supported in this browser.');

    var recording = false;

    var genericLength = 10000

    window.startRecording = function() {
      recording = true;
      $('#room-info').hover().css('opacity', 0)
          .slideUp('slow')
          .animate(
              { opacity: 1 },
              { queue: false, duration: 'slow', 
              complete: recordingCountdown()
              }
          );
    }

    function recordingCountdown() {
      $('#record-button').hide();
      $('#recording-timeline').show();
      $('#recording-status').html("<p>Recording has Started</p>");
      window.Stream = client.createStream();
      setTimeout(function() {stopRecording()}, genericLength);
    }

    window.stopRecording = function() {
      $('#recording-status').html("<p>Recording has finished</p>");
      console.log("recording is finished");
      recording = false;
      window.Stream.end();
    }

    function success(e) {
      audioContext = window.AudioContext || window.webkitAudioContext;
      context = new audioContext();

      // the sample rate is in context.sampleRate
      audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = function(e){
        if(!recording) return;
        // console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        window.Stream.write(convertoFloat32ToInt16(left));
      }

      audioInput.connect(recorder)
      recorder.connect(context.destination); 
    }

    function convertoFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l)

      while (l--) {
        buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
      }
      return buf.buffer
    }
  });
})(this);
