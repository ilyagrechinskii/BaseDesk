const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'BaseDesk',
    webPreferences: {
      contextIsolation: true,       // Сохранено: изолированный контекст
      nodeIntegration: false,       // Сохранено: отключена интеграция Node.js в рендерере
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Загрузка HTML-интерфейса из src/frontend/
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

// Гарантирует корректное завершение процесса приложения при закрытии всех окон
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});