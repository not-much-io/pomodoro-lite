// ToDo refactor
(function() {

    // Load native UI library
    var gui = require('nw.gui');

    // Reference to window
    var win = gui.Window.get();

    // Declare tray
    var tray;

    // Make menu
    var menu = new gui.Menu();

    // Make menu items
    var startMenuItem = new gui.MenuItem({ label: "Start", icon: "resources/mdl/ic_play_arrow_24px.png"});
    startMenuItem.click = function() {
        menu.removeAt(0);
        menu.insert(stopMenuItem, 0);
        tray.menu = menu;
        startPomodoro();
    };

    var stopMenuItem = new gui.MenuItem({ label: "Stop", icon: "resources/mdl/ic_stop_24px.png"});
    stopMenuItem.click = function() {
        menu.removeAt(0);
        menu.insert(startMenuItem, 0);
        tray.menu = menu;
        stopPomodoro();
    };

    var closeMenuItem = new gui.MenuItem({ label: "Close", icon: "resources/mdl/ic_close_48px.png" });
    closeMenuItem.click = function() {
        win.close();
    };

    var fakeMenuItem = new gui.MenuItem({ label: "fake" });

    // Adding menu items to menu
    menu.append(fakeMenuItem);
    menu.append(new gui.MenuItem({ type: 'separator' }));
    menu.append(closeMenuItem);

    // Get the minimize event
    win.on('minimize', function() {

        // Hide window
        this.hide();

        // Show tray
        tray = new gui.Tray({ title: 'Pomodoro Lite', icon: 'resources/abstract24px.png' });

        if (window.pomState == window.Constants.RUNNING) {
            menu.removeAt(0);
            menu.insert(stopMenuItem, 0);
        } else if (window.pomState == window.Constants.STOPPED) {
            menu.removeAt(0);
            menu.insert(startMenuItem, 0)
        } else {
            console.log("Undefined pomState!");
        }

        // Add menu to tray
        tray.menu = menu;

        // Add tooltip
        tray.tooltip = "Pomodoro Lite";

        // Show window and remove tray when clicked
        tray.on('click', function() {
            win.show();
            this.remove();
            tray = null;
        });

    });
})();
