/* Xuất icon từ assets/favicon.svg (phân tử H₂O):
     favicon.png   128 px          — gốc game, trang web dùng
     favicon.ico   16, 32, 48 px   — gốc game, trình duyệt cũ / itch.io
     desktop/icon.ico  16 → 256 px — icon file .exe và cửa sổ ứng dụng
   Chạy: cd desktop && npm run icon      (vẽ bằng chính Chromium trong Electron nên ra y hệt trình duyệt) */
'use strict';
const {app, BrowserWindow} = require('electron');
const path = require('path'), fs = require('fs');
const goc = path.join(__dirname, '..');
const SIZES = [16, 24, 32, 48, 64, 128, 256];

// ICO đựng thẳng ảnh PNG (Windows Vista trở đi và mọi trình duyệt đều đọc được): 6 byte đầu + 16 byte mỗi ảnh + dữ liệu PNG
function ico(list){
  const head = Buffer.alloc(6 + 16*list.length);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(list.length, 4);
  let off = head.length;
  list.forEach(({n, buf}, i) => {
    const e = 6 + 16*i;
    head[e] = head[e + 1] = n >= 256 ? 0 : n;   // 0 nghĩa là 256
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(buf.length, e + 8); head.writeUInt32LE(off, e + 12);
    off += buf.length;
  });
  return Buffer.concat([head, ...list.map(x => x.buf)]);
}

app.whenReady().then(async () => {
  // SVG gốc chỉ có viewBox: ghi thêm cỡ để Chromium vẽ nét vector ở đúng từng cỡ, không phóng ảnh nhỏ lên
  const svg = fs.readFileSync(path.join(goc, 'assets', 'favicon.svg'), 'utf8').replace('<svg ', '<svg width="256" height="256" ');
  const win = new BrowserWindow({show: false});
  await win.loadURL('data:text/html,<meta charset="utf-8">');
  const b64 = await win.webContents.executeJavaScript(`(async () => {
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}';
    await img.decode();
    return ${JSON.stringify(SIZES)}.map(n => {
      const c = document.createElement('canvas'); c.width = c.height = n;
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, n, n);
      return c.toDataURL('image/png').split(',')[1];
    });
  })()`);
  const png = Object.fromEntries(SIZES.map((n, i) => [n, Buffer.from(b64[i], 'base64')]));
  fs.writeFileSync(path.join(goc, 'favicon.png'), png[128]);
  fs.writeFileSync(path.join(goc, 'favicon.ico'), ico([16, 32, 48].map(n => ({n, buf: png[n]}))));
  fs.writeFileSync(path.join(__dirname, 'icon.ico'), ico(SIZES.map(n => ({n, buf: png[n]}))));
  console.log('Đã xuất favicon.png, favicon.ico, desktop/icon.ico');
  app.quit();
});
