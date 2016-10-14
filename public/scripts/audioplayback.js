$(function() {
    var audio = $("#audioplayer .audio"), seekbar = $('#audioplayer .seekbar');
    var audioState = audio[0];
    var bar = document.getElementById("myBar"); 
    addEventHandlers();

    function addEventHandlers() {
        $(".play").click(startAudio);
        $("#audioplayer .pause").click(pauseAudio);
        audio.on('ended', pauseAudio);
//      $(".volume-up").click(volumeUp);
//      $(".volume-down").click(volumeDown);
    }
/*
    function volumeUp(){
        var volume = audio.prop("volume")+0.2;
        if(volume >1){
            volume = 1;
        }
        audio.prop("volume",volume);
    }
    function volumeDown(){
        var volume = audio.prop("volume")-0.2;
        if(volume <0){
            volume = 0;
        }
        audio.prop("volume",volume);
    }
*/

    function startAudio() {
        $('#recorded-time').hide();
        $("#audioplayer .play").hide();
        audio.trigger('play');
        addSeekbarEventHandlers();
        $("#audioplayer .play").hide();
        $("#audioplayer .pause").show();
    }
    function pauseAudio() {
        audio.trigger('pause');
        $("#audioplayer .pause").hide();
        $("#audioplayer .play").show();
    }

    function addSeekbarEventHandlers() {
        setupSeekbar();
        seekbar.on('change', seekAudio);
        audioState.addEventListener('timeupdate', updateUI);
    }
    function setupSeekbar() {
      seekbar.attr('min', audioState.startTime);
      seekbar.attr('max', audioState.duration);
    }
    function seekAudio() {
        audioState.currentTime = seekbar.val();
    }
    function updateUI() {
      seekbar.val(audioState.currentTime);
      $('#time-display').text(audioState.currentTime.toString().toHHMMSS());
      bar.style.width = (audioState.currentTime / audioState.duration * 100) * 0.96 + '%'; 
    }
});

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