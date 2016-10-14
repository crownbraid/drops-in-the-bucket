(function(window) {
  var client = new BinaryClient('ws://localhost:9002');
  var buttonState = 'record';

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

    var genericLength = 10000;

    window.startRecording = function() {
      recording = true;
      $('#recordingProgress').css('width', '0%');
      $('#room-info').css('opacity', 1)
          .slideUp('slow')
          .animate(
              { opacity: 0 },
              { queue: false, duration: 'slow', 
              complete: recordingCountdown()
              }
          );
      $('#audioplayer').css('opacity', 0)
          .slideDown('slow')
          .animate(
              { opacity: 1 },
              { queue: false, duration: 'slow'}
          );
    }
    function animateUp(users, timelength) {
      var waterInc = 11.35/users + 'em';
      var waterTopInc = 0.95/users + 'em';
      var waterTopImageInc = 8/users  + '%';
      $('#water').animate({'border-bottom-width': '+=' + waterInc}, timelength, 'swing');
      $('#water-top').animate({'height': '-=' + waterTopInc}, timelength, 'swing');
      $('#water-top-image').animate({'width': '+=' + waterTopImageInc}, timelength, 'swing');
    }


    function recordingCountdown() {
      setTimeout(function () {
        buttonState = 'recording';
        $('#main-button').css('background-image', 'url("../images/stop.png")');
        window.Stream = client.createStream();
        animateUp(4, genericLength);
        setTimeout(function() {stopRecording()}, genericLength);
        $('#recordingProgress').animate({'width': '100%'}, genericLength);
        var sec = 0;
        function pad (val) { 
          return val > 9 ? val : "0" + val; 
        }
        var timer = setInterval(function() {
          $("#seconds").html(pad(++sec%60));
          $("#minutes").html(pad(parseInt(sec/60,10)));
          $("#hours").html(pad(parseInt(sec / 3600, 10)));
        }, 1000);
        setTimeout(function () {
            clearInterval(timer);
          }, 10000);
      }, 1000);
    } 

    window.stopRecording = function() {
      buttonState = 'play';
      setTimeout(function () {
        $("#seconds, #minutes, #hours").hide();
      }, 1000);
      $('#main-button').css('background-image', 'url("../images/play.png")');
      $('#myBarSlide').animate({'width': '1em'}, 800);
      recording = false;
      window.Stream.end();
    }

    $('#main-button').on('click', function() {
      console.log('clicked');
      if (buttonState == 'record') {
        startRecording();
      } else if (buttonState == 'recording') {
        stopRecording();
      } else if (buttonState == 'play') {
        console.log('play recording');
        buttonState = 'pause';
      } else if (buttonState == 'pause') {
        buttonState = 'play';
      }

      //change to case switch
    });


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