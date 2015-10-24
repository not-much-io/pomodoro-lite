
(function() {

    // Load native UI library
    var gui = require('nw.gui');

    // Reference to window
    var win = gui.Window.get();

    // Declare tray
    var tray;

    // Get the minimize event
    win.on('minimize', function() {

        // Hide window
        this.hide();

        // Show tray
        tray = new gui.Tray({ title: 'Tray', icon: 'resources/abstract24px.png' });

        // Show window and remove tray when clicked
        tray.on('click', function() {
            win.show();
            this.remove();
            tray = null;
        });

    });
})();
