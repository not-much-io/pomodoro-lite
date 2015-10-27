
(function() {

    window.Constants = {
        STOPPED : "The pomodoro is stopped",
        RUNNING : "The pomodoro is running",
        INTERVAL_WORK: "The pomodoro is in work mode",
        INTERVAL_REST: "The pomodoro is in rest mode"
    };

    window.pomState = window.Constants.STOPPED;
    window.pomInterval = undefined;
    window.pomNextInterval = undefined;
    window.currPomTime = -1;

    window.intervalID = undefined;
    window.setInterval(syncStateAndDom, 10);

    window.pomWorkTime = 25*60;
    window.pomRestTime = 5*60;
    window.longRestTime = 45*60;
    window.intervalsUntilNextLongRest = 4;
    window.intervalSwitches = 1;

})();

function setSetting(setting, val) {
    if (setting == "workT") {
        window.pomWorkTime = val*60;
    } else if (setting == "restT") {
        window.pomRestTime = val*60;
    } else if (setting == "longRestT") {
        window.longRestTime = val*60;
    } else if (setting == "intervalsUntilLongRest") {
        window.intervalsUntilNextLongRest = val;
    } else {
        console.log("Undefined setting");
    }
}

function syncStateAndDom() {
    var workTimeLbl = document.getElementById("workTimeLbl");
    var restTimeLbl = document.getElementById("restTimeLbl");
    var longRestLbl = document.getElementById("longRestTimeLbl");
    var intervalsLbl = document.getElementById("intervalsUntilLongRestLbl");
    var display = document.getElementById("display");

    workTimeLbl.textContent = "Work Time (" + window.pomWorkTime/60 + " min)";
    restTimeLbl.textContent = "Rest Time (" + window.pomRestTime/60 + " min)";
    longRestLbl.textContent = "Long Rest Time (" + window.longRestTime/60 + " min)";
    intervalsLbl.textContent = "Intervals Until Long Rest (" + window.intervalsUntilNextLongRest + ")";

    display.textContent = pomTimeToLabel(window.currPomTime);
}


function pomTimeToLabel(pomRunTime) {

    if (pomRunTime == -1) {
        return "00:00:00";
    }

    function pad(x) {
        return x < 10 ? "0" + x : x;
    }

    var hours, minutes, seconds;
    hours = minutes = 0;
    seconds = pomRunTime;

    while (seconds >= 60) {
        seconds -= 60;
        minutes++;
    }

    while (minutes >= 60) {
        minutes -= 60;
        hours++;
    }

    return pad(hours.toString()) + ":" + pad(minutes.toString()) + ":" + pad(seconds.toString());
}


function toggleState() {
    var actionButtonIcon = document.getElementById("actionButtonIcon");

    if (window.pomState == window.Constants.STOPPED) {
        window.pomState = window.Constants.RUNNING;
        window.currPomTime = window.pomWorkTime;

        actionButtonIcon.src = "resources/mdl/ic_stop_24px.svg";

    } else if (window.pomState == window.Constants.RUNNING) {
        window.pomState = window.Constants.STOPPED;
        window.currPomTime = -1;
        window.intervalSwitches = 1;

        actionButtonIcon.src = "resources/mdl/ic_play_arrow_24px.svg";

    } else {
        console.log("Undefined pomState");
    }

}

function isOver(pomodoroRunningTime) {
    return pomodoroRunningTime <= 0;
}

function turnOffActiveLbl() {
    var activeLbl = document.getElementsByClassName("active-interval-lbl")[0];
    if (activeLbl) {
        activeLbl.className = activeLbl.className.replace(" active-interval-lbl", "");
    }
}

function updateTimer() {
    if (!isOver(window.currPomTime)) {
        window.currPomTime--;
    } else {
        window.intervalSwitches++;
        turnOffActiveLbl();
        var tmpNextInterval = window.pomNextInterval;
        var newActiveLbl;

        window.pomNextInterval = window.pomInterval;
        window.pomInterval = tmpNextInterval;

        if (window.pomInterval == window.Constants.INTERVAL_WORK) {
            window.currPomTime = window.pomWorkTime;
            // ToDo refactor to interval start function
            newActiveLbl = document.getElementById("workTimeLbl");
            notify("Work", window.pomWorkTime);
        } else if (window.pomInterval == window.Constants.INTERVAL_REST) {
            if (window.intervalSwitches / 2 == window.intervalsUntilNextLongRest) {
                window.intervalSwitches = 0;
                window.currPomTime = window.longRestTime;
                newActiveLbl = document.getElementById("longRestTimeLbl");
                notify("Long Rest", window.longRestTime);
            } else {
                window.currPomTime = window.pomRestTime;
                newActiveLbl = document.getElementById("restTimeLbl");
                notify("Rest", window.pomRestTime);
            }
        } else {
            console.log("Undefined interval");
        }
        newActiveLbl.className += " active-interval-lbl";
    }
}

function startPomodoro() {
    // ToDo this is a quick fix
    if (window.pomState != window.Constants.STOPPED) {
        return;
    }
    window.pomInterval = window.Constants.INTERVAL_WORK;
    window.pomNextInterval = window.Constants.INTERVAL_REST;

    var workLbl = document.getElementById("workTimeLbl");
    workLbl.className += " active-interval-lbl";

    toggleState();

    window.intervalID = window.setInterval(updateTimer, 1000)
}

function stopPomodoro() {
    // ToDo this is a quick fix
    if (window.pomState == window.Constants.STOPPED) {
        return;
    }
    turnOffActiveLbl();
    toggleState();
    clearInterval(window.intervalID);
}

function onActionButtonClicked() {
    var state = window.pomState;

    if (state == window.Constants.STOPPED) {
        startPomodoro();
    } else if (state == window.Constants.RUNNING) {
        stopPomodoro();
    } else {
        console.log("Undefined behaviour in onActionButtonClicked");
    }
}
