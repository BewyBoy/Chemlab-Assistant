/* Đóng gói bản ứng dụng Windows bằng @electron/packager. Đừng gọi trực tiếp — chạy tools\dong-goi-app.ps1: script đó
   dựng dist\game trước (đúng danh sách file của bản itch.io, tools\dong-goi.ps1), rồi gọi file này, rồi nén zip.
   Ra: dist\Tro-Ly-Hoa-Hoc-Nhi-win32-x64\TroLyHoaHocNhi.exe (+ thư viện Electron đi kèm). */
'use strict';
const path = require('path'), fs = require('fs');
const goc = path.join(__dirname, '..'), stage = path.join(goc, 'dist', 'game');
if(!fs.existsSync(path.join(stage, 'index.html'))) throw new Error('Chưa có dist\\game — hãy chạy tools\\dong-goi-app.ps1');
const ver = require('./package.json').version;

import('@electron/packager').then(({packager}) => packager({
  dir: __dirname,
  out: path.join(goc, 'dist'),
  name: 'Tro-Ly-Hoa-Hoc-Nhi',          // tên thư mục ra: không dấu cho khỏi lỗi giải nén trên máy cũ
  executableName: 'TroLyHoaHocNhi',
  platform: 'win32', arch: 'x64',
  icon: path.join(__dirname, 'icon.ico'),
  asar: true, overwrite: true, prune: false,
  // chỉ cần main.js + package.json + icon.ico; game chép vào sau (afterCopy). Không có thư viện chạy nào trong node_modules
  ignore: [/^\/node_modules($|\/)/, /^\/dong-goi\.js$/, /^\/icon\.js$/, /^\/package-lock\.json$/, /^\/game($|\/)/],
  appVersion: ver, buildVersion: ver,
  win32metadata: {ProductName: 'Trợ Lý Hóa Học Nhí', FileDescription: 'Trợ Lý Hóa Học Nhí', CompanyName: 'BewyBoy'},
  afterCopy: [({buildPath}) => fs.cpSync(stage, path.join(buildPath, 'game'), {recursive: true})]
})).then(dirs => console.log('Đã đóng gói: ' + dirs.join(', ')))
  .catch(err => { console.error(err); process.exit(1); });
