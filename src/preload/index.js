const os = require("os");
const platform = os.platform();
const release = os.release();
const fs = require("fs");
const path = require("path");

const { contextBridge } = require("electron");
// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("platform").append(platform);
//   document.getElementById("release").append(release);
// });

// window.fromPreload = "fromPreload";

const saveFileContent = (data) => {
  let { filePath, content } = data;
  if (!fs.existsSync(filePath)) {
    // 默认是桌面的路径
    const desktopPath = os.homedir() + "/Desktop";
    filePath = path.join(desktopPath, "new-file.txt");
  }
  //将文件写到指定的文件夹下
  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.log("写入文件失败");
    } else {
      console.log("写入文件成功");
    }
  });
};

contextBridge.exposeInMainWorld("electronAPI", {
  saveFileContent,
});
