import { app, BrowserWindow, dialog, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import Store from 'electron-store';

const store = new Store({
  schema : {
    tabs: {
      type: 'array',
    },
    window: {
      type: 'object',
      properties: {
        "size": {
          type: 'object',
          properties: {
            "height": { type: 'number' },
            "width": {type: 'number'},
          }
        },
        "location": {
          type: 'object',
          properties: {
            "x": { type: 'number' },
            "y": { type: 'number' }
          }
        },
        "maximized": {type: 'boolean'}

      }
    }
  }
});

let isMaximized = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
let isDark = nativeTheme.shouldUseDarkColors;

const theme = isDark ? {
  color: '#202124', // dark
  symbolColor: '#CCCCCC', // dark
} : {
  color: '#DEE1E6', // light
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay : theme,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    },
  });

  mainWindow.setTitleBarOverlay({
    height: 42
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.removeMenu();
  });

  mainWindow.on('maximize', () => {
    isMaximized = mainWindow.isMaximized();
  });
  mainWindow.on('unmaximize', () => {
    isMaximized = mainWindow.isMaximized();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const userAgentFallback = app.userAgentFallback;
  app.userAgentFallback = userAgentFallback.replace(
    /(electron_test_2|Electron)([^\s]+\s)/g,
    ""
  );
  app.setAppUserModelId("WhatsMulti");
  createWindow();
  // createWindow
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('theme', async (event) => {
  return isDark;
});
  
ipcMain.handle('msgbox', async (event) => {
  return dialog.showMessageBox({
    type: "question",
    buttons: ["OK", "Cancel"],
    title: "Close Tab",
    message: "Are you sure you want to close the tab?",
  });
});

ipcMain.on('electron-store-get', async (event) => {
  event.returnValue = store.get("tabs");
});

ipcMain.on('electron-store-set', async (event, val) => {
  store.set("tabs", val);
});

ipcMain.on("themeShouldUseDarkColors", (event) => {
  isDark = nativeTheme.shouldUseDarkColors;
  event.returnValue = nativeTheme.shouldUseDarkColors;
});

nativeTheme.addListener("updated", () => {
  for (const browserWindow of BrowserWindow.getAllWindows()) {
    browserWindow.webContents.send("nativeThemeChanged");
    browserWindow.setTitleBarOverlay(isDark ? {
      color: '#202124', // dark
      symbolColor: '#CCCCCC', // dark
    } : {
      color: '#DEE1E6', // light
      symbolColor: "#000000", // light
    })
  }
});

// ipcMain.on('electron-store-has', async (event, key, val) => {
//   store.has(key);
// });