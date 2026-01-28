const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let tray;
let isQuitting = false;

const trayIconDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADJViUEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyElEQVQ4je2SsQ2DMBBF3xIgiUEEiJABEiBABEiJABIkABIkABIkgFHbx0bUpJaZ3ezu9mdm2eh7J7+vR2C2G+EEJ6c4C+E0zTNVFVd1/V9TzjnHNc13UcxzAMg2maXBdFURRF0zTNTCOEEIKqqkqlUq/XC4ZhGCGE8zw/1zRN03VdF0VRvF4v8zhjjDHG/0ql0u91u91u22az2e32+12u91u9/v9H0VRlEql0un0+n0ej8fj8Xg8Ho/H43G4XC6Xy+Xy+Xw+n8/n8/n8/h+12+0P0Cw/8i03VlRcAAAAASUVORK5CYII=';

const createTray = () => {
  if (tray) {
    return;
  }
  const icon = nativeImage.createFromDataURL(trayIconDataUrl);
  tray = new Tray(icon);
  tray.setToolTip('GlimmarNote');
  const toggleWindow = () => {
    if (!mainWindow) {
      createWindow();
      return;
    }
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  };
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示/隐藏', click: toggleWindow },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on('click', toggleWindow);
};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    minWidth: 200,
    minHeight: 200,
    frame: false, // Frameless for custom UI
    transparent: true, // Transparent background
    alwaysOnTop: false,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false, // For simplicity as per the guide, usually strictly true is better
    },
  });

  // Determine if we are in development mode
  // const isDev = process.env.NODE_ENV === 'development';
  // Use app.isPackaged (false in dev, true in prod) or check if we are running from a binary
  // However, when running with 'electron .', isPackaged is false.
  
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  createTray();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {});

// Example IPC handler if needed
ipcMain.handle('ping', () => 'pong');
ipcMain.handle('set-always-on-top', (event, flag) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(!!flag);
  }
});
