
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
    var startMenuItem = new gui.MenuItem({ label: "Start" });
    startMenuItem.click = startPomodoro;

    var stopMenuItem = new gui.MenuItem({ label: "Stop" });
    stopMenuItem.click = stopPomodoro;

    var closeMenuItem = new gui.MenuItem({ label: "Close" });
    closeMenuItem.click = function() {
        win.close();
    };

    // Adding menu items to menu
    // ToDo make it impossible to Start when running and stop when stopped - quick fix implemented
    menu.append(startMenuItem);
    menu.append(stopMenuItem);
    menu.append(new gui.MenuItem({ type: 'separator' }));
    menu.append(closeMenuItem);

    // Get the minimize event
    win.on('minimize', function() {

        // Hide window
        this.hide();

        // Show tray
        tray = new gui.Tray({ title: 'Pomodoro Lite', icon: 'resources/abstract24px.png' });

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
