/* var uuid = require('node-uuid');
var roomID = uuid.v4(); */


// VIEWS
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
function load_userInfo(user) {
	show_userName(user);
	show_user_rooms(user);
}
function show_userName(user) {
	$("#user-greeting").text("Hello " + user.userName + ", how are you?")
}
function show_user_rooms(user) {
	user.rooms.forEach(function(room) {
		var roomLink = "<a href='" + room.url + "' target='_blank'>";
		var roomInfo = "<tr><td class='room-info room-info-name'>" + roomLink + room.name + ":</a></td>";
		roomInfo += "<td class='room-info'> " + room.rule + " | status: " + room.status + "</td></tr>"
		$(roomInfo).appendTo("#rooms-table");
	});
}





//junk data
var alan = {
	userName: "real_Cool_Alan",
	rooms: [
		{
			name: "My First Room",
			rule: "be very careful",
			status: "unfinished",
			url: "/room.html",
			users: [

			]
		},
		{
			name: "My Second Room",
			rule: "don't be very careful",
			status: "finished",
			url: "/room.html"
		},
		{
			name: "My Third Room",
			rule: "don't be dumb",
			status: "unfinished",
			url: "/room.html"
		},
		{
			name: "Best Room Ever",
			rule: "be absolutely perfect",
			status: "finished",
			url: "/room.html"
		},
		{
			name: "Dumbest Room ",
			rule: "you're alright",
			status: "finished",
			url: "/room.html"
		},
		{
			name: "YESSSSsss",
			rule: "give up already",
			status: "unfinished",
			url: "/room.html"
		}
	]
}