const { app, BrowserWindow } = require('electron');

if(app)
{
    function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
        }
    });

    // Always load from dev server for now
    mainWindow.loadURL('http://localhost:3000');
    }

    app.whenReady().then(createWindow);

    app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    });
}