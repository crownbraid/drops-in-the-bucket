$(function() {
	animateUp();
});

function animateUp() {
	$('#water-top').animate({'border-bottom-width': '5em'}, 10000, function() {
		animateDown();
	});
}
function animateDown() {
	$('#water-top').animate({'border-bottom-width': '0em'}, 10000, function() {
		animateUp();
	});
}