const { app, BrowserWindow } = require("electron");
const path = require("path");

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
    mainWindow = new BrowserWindow({
      width,
      height,
      webPreferences: {
        // 该参数的意义：preload.js 脚本和 index.html 是否共享相同的 document 和 window 对象， true为不共享， false为共享
        contextIsolation: true,
        nodeIntegration: false, // 是否node.js环境集成
        // contextIsolation: false, // 关闭上下文隔离
        preload: path.join(__dirname, "../preload/index.js"), // 在preload脚本中访问node的api
        sandbox: false,
      },
    });
    // mainWindow.loadURL("https://www.juejin.cn");
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    // 调试控制台
    mainWindow.webContents.openDevTools();
  }
}

function handleSchemeWakeup(argv) {
  const url = [].concat(argv).find((v) => v.startsWith(scheme));
  if (!url) return;
  const searchParams = new URLSearchParams(url.slice(scheme.length));
  urlParams = Object.fromEntries(searchParams.entries());
  if (app.isReady()) createWindow();
}
