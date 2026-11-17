/* =====================================================================
   BẢN ỨNG DỤNG — mở game trong cửa sổ riêng (Electron), không cần trình duyệt.
     Chạy thử:  cd desktop && npm install && npm start          (nạp thẳng ../index.html, sửa game là thấy ngay)
     Đóng gói:  powershell -ExecutionPolicy Bypass -File tools\dong-goi-app.ps1
   Bản đóng gói mang sẵn game trong thư mục game/ cạnh file này (dong-goi.js chép từ dist\game, đúng danh sách file
   của bản itch.io). Game không biết mình đang chạy trong ứng dụng: không sửa gì trong js/ cho bản này.
   ===================================================================== */
'use strict';
const {app, BrowserWindow, Menu, shell} = require('electron');
const path = require('path'), fs = require('fs');

const packed = path.join(__dirname, 'game', 'index.html');
const page = fs.existsSync(packed) ? packed : path.join(__dirname, '..', 'index.html');
const outside = url => /^https?:/.test(url);

// mở lần hai thì chỉ gọi cửa sổ cũ lên: hai cửa sổ cùng ghi một bản lưu (localStorage) sẽ đè tiến trình của nhau
if(!app.requestSingleInstanceLock()) app.quit();
else {
  let win = null;
  app.on('second-instance', () => { if(win){ if(win.isMinimized()) win.restore(); win.focus(); } });
  Menu.setApplicationMenu(null);   // không có thanh File / Edit / View: trông như trò chơi, không như trình duyệt

  app.whenReady().then(() => {
    win = new BrowserWindow({
      width: 1280, height: 720, useContentSize: true, minWidth: 800, minHeight: 450,
      backgroundColor: '#4a4238',   // cùng màu nền trang (style.css) — lúc mở không loé trắng
      title: 'Trợ Lý Hóa Học Nhí', icon: path.join(__dirname, 'icon.ico'), show: false,
      webPreferences: {autoplayPolicy: 'no-user-gesture-required'}
    });
    win.once('ready-to-show', () => win.show());
    // không bao giờ rời khỏi game: liên kết ra ngoài (nếu sau này có) mở bằng trình duyệt mặc định
    win.webContents.setWindowOpenHandler(({url}) => { if(outside(url)) shell.openExternal(url); return {action: 'deny'}; });
    win.webContents.on('will-navigate', (e, url) => {
      if(url.split('#')[0] === win.webContents.getURL().split('#')[0]) return;
      e.preventDefault();
      if(outside(url)) shell.openExternal(url);
    });
    // F11: bật / tắt toàn màn hình (Cài đặt trong game cũng có nút Toàn màn hình)
    win.webContents.on('before-input-event', (e, input) => {
      if(input.type === 'keyDown' && input.key === 'F11'){ win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    });
    win.loadFile(page);
  });
  app.on('window-all-closed', () => app.quit());
}
