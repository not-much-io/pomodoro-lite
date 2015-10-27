
function notify(interval, interval_time) {

    var options = {
        body: "Next interval: " + interval + " (" + interval_time/60 + " min)"
    };

    var notification = new Notification("Interval switch.", options);

    notification.onclick = function () {
        notification.close();
    };

    notification.onshow = function () {
        // play sound on show
        var audio = new Audio("resources/chime.ogg");
        audio.play();

        // ToDo seems not to work (on KDE at least)
        // auto close after 15 seconds
        setTimeout(function() {notification.close();}, 15000);
    };

}
