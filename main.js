const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true, // Tillader os at bruge fs og ipc i index.html
            contextIsolation: false
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Lyt efter 'save-data' fra din index.html
ipcMain.on('save-data', (event, data) => {
    const filePath = path.join(app.getPath('userData'), 'database.txt');
    fs.writeFileSync(filePath, data, 'utf-8');
    console.log("Gemt til:", filePath);
});

// Håndter anmodning om at indlæse data
ipcMain.handle('load-data', () => {
    const filePath = path.join(app.getPath('userData'), 'database.txt');
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return ""; 
});
