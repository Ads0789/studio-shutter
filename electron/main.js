// electron/main.js
const { app, BrowserWindow, shell } = require('electron');

const APP_URL = process.env.APP_URL || 'https://studio-shutter.vercel.app/'; // <- yahan apna URL daal do

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Shutter Surprise Studio - Invoice',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: true
    }
  });

  win.loadURL(APP_URL);

  // external links default browser me kholna
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
