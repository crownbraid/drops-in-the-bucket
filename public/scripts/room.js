$(function() {
	loadRoomDetails('badboy');
	$('#bucket-interface').show().animate({'height': '29.6em'}, 2000, function() {
		$('#bucket-interface').animate({'opacity': '1'}, 2000);
	});
});
var roomInfo;

function loadRoomDetails(roomID) {
	$.ajax({url: "http://localhost:8080/room/" + roomID}).done(function(data) {
		roomInfo = data; 
		$("#rules").text("Rules: " + roomInfo.rule);
		var time = parseFloat(Math.round(roomInfo.time * 100) / 100).toFixed(2);
		$("#time-limit").append("<p>" + time + "</p>");
	});
}

function hideBucket() {
	$('#bucket-interface').animate({'height': '0em'}, 400, function() {
		$('#bucket-interface').hide();
	});
}

function animateUp() {
	$('#water').animate({'border-bottom-width': '11.35em'}, 10000);
	$('#water-top').animate({'height': '4.4em'}, 10000);
	$('#water-top-image').animate({'width': '81.5%'}, 10000);
}