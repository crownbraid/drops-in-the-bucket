$(function() {
	loadRoomDetails("room1");
	/* animateUp(); */
});

function animateUp() {
	$('#water').animate({'border-bottom-width': '11.35em'}, 10000);
	$('#water-top').animate({'height': '4.4em'}, 10000);
	$('#water-top-image').animate({'width': '81.5%'}, 10000);
}

function loadRoomDetails(room) {
	var room = rooms[room];
	$("#rules").text("Rules: " + room.rule);
	var time = parseFloat(Math.round(room.time * 100) / 100).toFixed(2);
	$("#time-limit").text("Length: " + time);
}

var rooms = {
	room1: {
			name: "My First Room",
			rule: "be very careful",
			time: 11.00,
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