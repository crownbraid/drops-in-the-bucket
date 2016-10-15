$(function() {
	$('#login-submit').on('click', function() {
		div_hide('login'); 
		div_show('user-manager'); 
		load_userInfo("real_Cool_Alan");
	});
});

/* var uuid = require('node-uuid');
var roomID = uuid.v4(); */


function div_show(div) {
	document.getElementById(div).style.display = "block";
	if (div = 'reg') {
		$('#reg-userName').val($('#userName').val());
		$('#reg-userPassword').val($('#password').val());
	}
}
function div_hide(div){
	document.getElementById(div).style.display = "none";
}
function load_userInfo(username) {
	show_userName(username);
	show_user_rooms(username);
}
function show_userName(username) {
	$("#user-greeting").text("Hello " + username + ", how are you?")
}
function show_user_rooms(username) {
	$.ajax({url: "http://localhost:8080/user/" + username}).done(function(data) { 
		userInfo = data; 
		userInfo.rooms.forEach(function(room) {
			var roomLink = "<a onclick='openRoom()' target='_blank'>";
			var roomInfo = "<tr><td class='room-info room-info-name'>" + roomLink + room.name + ":</a></td>";
			roomInfo += "<td class='room-info'> " + room.rule + " | status: " + room.status + "</td></tr>"
			$(roomInfo).appendTo("#rooms-table");
		});
	});
}



// ||||||||||||||||||||||||||||||||||||||||||||||||||||

var roomInfo, userInfo, recordingLength, users, finishedUsers;

function loadRoomDetails(roomID) {
	$.ajax({url: "http://localhost:8080/room/" + roomID}).done(function(data) {
		roomInfo = data; 
		$("#rules").text("Rules: " + roomInfo.rule);
		recordingLength = roomInfo.time;
		var time = convertMilliseconds(recordingLength);
		$("#room-time").text(time);
		users = 4;
		finishedUsers = roomInfo.finished.length;
		setTimeout(animatePostedAudio, 3000);
		initiateRecordingClient();
	});
}

function animatePostedAudio() {
	var functions = roomInfo.finished.map(function(submission, i) {
		return function() {
			$('#submitted-by').css({opacity: 0}).text('submitted by: ' + submission)
				.animate({opacity: 1}, 1600);
			animateWater(1000);
			timeOuts.push(setTimeout(functions[i + 1], 1600));
		};		
	});
	functions[0]();
}


// ||||||||||||||||||||||||||||||||||||||||||||||||||||

var buttonState = 'record', timeOuts = [];

function initiateRecordingClient() {
	var client = new BinaryClient('ws://localhost:9002');

  	client.on('open', function() {
	    if (!navigator.getUserMedia) {
	    	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	    	navigator.mozGetUserMedia || navigator.msGetUserMedia;
		}
	    if (navigator.getUserMedia) {
	    	navigator.getUserMedia({audio:true}, success, function(e) {
	        	alert('Error capturing audio.');
	    	});
		} else {
			alert('getUserMedia not supported in this browser.');
		}

	    var recording = false;
	    var recordingInterfaceDisplayed = false;

	    $('#main-button').on('click', function() {
			switch(buttonState) {
			    case "record":
			        prepareRecorder(); break;
			    case "stop":
			        cancelRecording(); break;
			    case "play":
			        playRecording(); break;
			    case "pause":
			    	pauseRecording(); break;
			    default:
			        console.log("buttonState Error");
			}
	    });
	    $('#goHome').on('click', function() {
			if (confirm("Are you sure you want to exit?")) {
				closeRoom();
				client.disconnect();
			}
	    });

	    function prepareRecorder() {
			recording = true;
			if (recordingInterfaceDisplayed) {
				startRecording();
			} else {
				animateInterfaceInversion('showRecorder', startRecording);
			}
	    }

		function startRecording() {
			timeOuts.push(setTimeout(function () {
				buttonState = 'stop';
				changeButton();
				window.Stream = client.createStream();
				timeOuts.push(setTimeout(function() {endRecording()}, recordingLength));
				animateRecordingProgress();
			}, 1000));
		}

		function cancelRecording() {
			recording = false;
			timeOuts.forEach(function(timeOut) {clearTimeout(timeOut);});
			cancelRecordingDisplay();
			buttonState = 'record';
		}

	    function endRecording() {
	    	recording = false;
			displayPlaybackInterface() 
			window.Stream.end();
	    }

	    //audio player
	    function displayPlaybackInterface() {
	    	animatePlaybackInterfaceDisplay();
	    	buttonState = 'play';
	    	changeButton();
	    	toggleApprovalButtons();
			addPlaystateEventHandlers();
	    }

	    var audio = $("#audioplayer .audio"), seekbar = $('#audioplayer .seekbar');
	    var audioState = audio[0];
	    var bar = document.getElementById("myBar"); 

	    function addPlaystateEventHandlers() {
	        seekbar.attr('min', audioState.startTime);
	        seekbar.attr('max', audioState.duration);
	        seekbar.on('change', function() {audioState.currentTime = seekbar.val();});
	        audioState.addEventListener('timeupdate', updateUI);
	        audio.on('ended', pauseRecording);
		}

	    function playRecording() {
			$('#recorded-time').hide();
			audio.trigger('play');
			buttonState = 'pause';
			changeButton();
	    }
	    function pauseRecording() {
			audio.trigger('pause');
			buttonState = 'play';
			changeButton();
	    }
		function updateUI() {
			seekbar.val(audioState.currentTime);
			$('#time-display').text(audioState.currentTime.toString().toHHMMSS());
			bar.style.width = (audioState.currentTime / audioState.duration * 100) * 0.96 + '%'; 
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
}








// animations

function animateWater(timelength, reset, hardReset) {
	var waterInc, waterTopInc, waterTopImageInc;
	var percentFinished = finishedUsers/users;
	if (hardReset) {percentFinished = 0;}
	if (reset) {
		waterInc = 0.6 + 11.35 * percentFinished + 'em';
		waterTopInc = 5.35 - 0.95 * percentFinished + 'em';
		waterTopImageInc = 73.5 + 8 * percentFinished + '%';
	} else {
		waterInc = '+=' + 11.35/users + 'em';
		waterTopInc = '-=' + 0.95/users + 'em';
		waterTopImageInc =  '+=' + 8/users  + '%';
	}
	$('#water').animate({'border-bottom-width': waterInc}, timelength, 'swing');
	$('#water-top').animate({'height': waterTopInc}, timelength, 'swing');
	$('#water-top-image').animate({'width': waterTopImageInc}, timelength, 'swing');
}

function animateInterfaceInversion(direction, callback) {
	var elementOff, elementOn;
	if (direction == 'showRecorder') {
		elementOff = $('#room-info');
		elementOn = $('#audioplayer');
		$('#recordingProgress').css('width', '0%');
		$('#recorded-time').slideDown('slow');
	} else if (direction == 'showRoomDetails') {
		elementOff = $('#audioplayer');
		elementOn = $('#room-info');
	}
	elementOff
		.css('opacity', 1)
		.slideUp('slow')
		.animate(
			{ opacity: 0 },
			{ queue: false, duration: 'slow', complete: callback()}
		);
	elementOn
		.css('opacity', 0)
		.slideDown('slow')
		.animate(
			{ opacity: 1 },
			{ queue: false, duration: 'slow'}
		);
	recordingInterfaceDisplayed = true;
}

function animatePlaybackInterfaceDisplay() {
	changeButton();
	timeOuts.push(setTimeout(function () { $("#seconds, #minutes, #hours").hide();}, 1000));
	$('#myBarSlide').animate({'width': '1em'}, 800);
}

function cancelRecordingDisplay() {
	$('*').stop(true, false);
	animateWater(500, true);
	$('#recorded-time').slideUp('slow');
	$('#recordingProgress').animate({'width': '0%'}, 250, function() {
		animateInterfaceInversion('showRoomDetails', function() {setTimeout(changeButton, 700);});
	});
}

function animateRecordingProgress() {
	changeButton();
	$('#recordingProgress').animate({'width': '100%'}, recordingLength);
	animateWater(recordingLength);
	animateTimer();
} 







function changeButton() {
	$('#main-button').css('background-image', 'url("../images/' + buttonState + '.png")');
}

function toggleApprovalButtons() {
	$("#approve-button, #reject-button").toggle();
}

function approve() {
	if (confirm('are you sure?')) {
		$('*').stop(true, false);
		animateInterfaceInversion('showRoomDetails', function() {
			setTimeout(function() {
					buttonState = 'none';
					changeButton();
					toggleApprovalButtons();
				}, 700 
			);
		});
		$('#rules').text('Your recording has been submitted.');
	}
}

function reject() {
	if (confirm('are you sure?')) {
		$('*').stop(true, false);
		animateInterfaceInversion('showRoomDetails', function() {
			setTimeout(function() {
					buttonState = 'record';
					changeButton();
					toggleApprovalButtons();
				}, 700 
			);
		});
	}
}

// Time Formatting

function animateTimer() {
	var sec = 0;
	function pad (val) { 
		return val > 9 ? val : "0" + val; 
	}
	var timer = setInterval(function() {
		$("#seconds").html(pad(++sec%60));
		$("#minutes").html(pad(parseInt(sec/60,10)));
		$("#hours").html(pad(parseInt(sec / 3600, 10)));
	}, 1000);
	timeOuts.push(timer);
	timeOuts.push(setTimeout(function () {
			clearInterval(timer);
		}, 10000));
}

function convertMilliseconds(t) {
  return parseInt(t / 1000 / 60) + ":" + (t / 1000 % 60)
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}










//temporary bucket displays

function temporaryBucketAnimation() {
	/* $('#bucket-interface').show().animate({'height': '29.6em'}, 500, function() {
		$('#bucket-interface').animate({'opacity': '1'}, 500);
	}); */
}

function closeRoom() {
	endAllDisplayChanges();
	$('#bucket-interface').animate({'height': '0em'}, 400);
	animateWater(0, true, true);
	$('#submitted-by').css('opacity', 0);
	$('#buttons > *').delay(170).animate({'margin-top': '1em'}, 125, 'swing', function() {
		$('#buttons > *').css('z-index', '-1');
		$('#buttons').animate({'margin-top': '-3em'}, 75, 'swing', function() {
			$('#buttons').hide();
		});
	});
	$('#user-interaction').delay(200).animate({'height': '-0'}, 150, 'swing', function() {
		$('#user-interaction > *, #audioplayer').hide();
		$('#bucket-interface').hide();
		$('#about').slideDown('150', function() {
			$('#account-manager').slideDown('150');
		});
	});
}

function openRoom() {	
	endAllDisplayChanges();
	loadRoomDetails('badboy');
	$('#account-manager, #about').slideUp('150');
	$('#bucket-interface').show().animate({'height': '29.6em'}, 400, function() {
		$('#user-interaction').delay(200).animate({'height': '6.5em'}, 200);
		$('#room-info, #time-limit').delay(200).slideDown(200, function() {
			$('#buttons').show();
			$('#buttons').animate({'margin-top': '1em'}, 75, 'swing', function() {
				$('#buttons > *').css('z-index', '1');
				$('#buttons').animate({'margin-top': '-3em'}, 125, 'swing');
			});
		});
	});
}

function endAllDisplayChanges() {
	$('*').stop()
	timeOuts.forEach(function(timeOut) {clearTimeout(timeOut);});	
}