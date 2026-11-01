const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'BaseDesk',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Загружаем HTML-страница из src/frontend/
  mainWindow.loadFile(path.join(__dirname, '../src/frontend/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Корректное закрытие приложения для всех ОС
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});