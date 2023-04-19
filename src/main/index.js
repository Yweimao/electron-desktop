const { app, BrowserWindow } = require("electron");

let mainWindow;

const protocol = "juejin";
const scheme = `${protocol}://`;
app.setAsDefaultProtocolClient(protocol);

let urlParams = {};

handleSchemeWakeup(process.argv);

// 单应用，当打开app的时候，不会打开两个窗口
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, argv) => {
    mainWindow.restore(); // 恢复窗口
    mainWindow.show(); // 从后台显示
    handleSchemeWakeup(argv);
  });
}

app.on("open-url", (event, url) => handleSchemeWakeup(url));

app.whenReady().then(() => {
  createWindow();
});

function createWindow() {
  const width = parseInt(urlParams.width) || 800;
  const height = parseInt(urlParams.height) || 600;
  if (mainWindow) {
    mainWindow.setSize(width, height);
  } else {
    mainWindow = new BrowserWindow({ width, height });
    mainWindow.loadURL("https://www.juejin.cn");
  }
}

function handleSchemeWakeup(argv) {
  const url = [].concat(argv).find((v) => v.startsWith(scheme));
  if (!url) return;
  const searchParams = new URLSearchParams(url.slice(scheme.length));
  urlParams = Object.fromEntries(searchParams.entries());
  if (app.isReady()) createWindow();
}
