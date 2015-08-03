$(document).ready(function() {
    var time = 5;
    var last_time_span = $(".logout_time");
    var lastTime = function() {
        time--;
        if (time >= 0) {
            last_time_span.text(time);
            setTimeout(lastTime, 1000);
        } else {
            window.location.href = "/";
        }
    };
    lastTime();
});