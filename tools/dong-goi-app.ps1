# Đóng gói BẢN ỨNG DỤNG Windows: game chạy trong cửa sổ riêng, không cần trình duyệt (Electron — xem desktop\main.js).
#   Chạy:  powershell -ExecutionPolicy Bypass -File tools\dong-goi-app.ps1
#
# Các bước:
#   1. tools\dong-goi.ps1 gom file game vào dist\game (đúng danh sách file của bản itch.io), làm luôn zip itch.io
#   2. cài Electron vào desktop\node_modules nếu chưa có (lần đầu tải chừng 110 MB)
#   3. desktop\dong-goi.js ghép game + Electron thành dist\Tro-Ly-Hoa-Hoc-Nhi-win32-x64\TroLyHoaHocNhi.exe
#   4. nén cả thư mục đó thành dist\tro-ly-hoa-hoc-nhi-windows.zip để gửi đi / tải lên itch.io (bản Windows)
# Người chơi: giải nén, mở TroLyHoaHocNhi.exe — không cần cài đặt, không cần quyền quản trị.
# Lưu ý: tools\dong-goi.ps1 xoá sạch dist\ mỗi lần chạy, nên chạy riêng nó (chỉ làm bản itch.io) là mất bản ứng dụng cũ.

$ErrorActionPreference = 'Stop'
$goc = Split-Path $PSScriptRoot -Parent
$desk = Join-Path $goc 'desktop'
$dist = Join-Path $goc 'dist'
$ten = 'Tro-Ly-Hoa-Hoc-Nhi-win32-x64'
$app = Join-Path $dist $ten
$zip = Join-Path $dist 'tro-ly-hoa-hoc-nhi-windows.zip'

& (Join-Path $PSScriptRoot 'dong-goi.ps1') | Out-Null    # bước 1

Push-Location $desk
try {
  if (-not (Test-Path 'node_modules\@electron\packager')) {   # bước 2
    npm install --no-audit --no-fund
    if ($LASTEXITCODE) { throw 'npm install lỗi' }
  }
  node dong-goi.js                                           # bước 3
  if ($LASTEXITCODE) { throw 'Đóng gói Electron lỗi' }
} finally { Pop-Location }

if (-not (Test-Path (Join-Path $app 'TroLyHoaHocNhi.exe'))) { throw "Không thấy TroLyHoaHocNhi.exe trong $app" }

# bước 4 — tự ghi zip (như dong-goi.ps1) để đường dẫn dùng dấu /; giữ thư mục ngoài cùng trong zip để giải nén ra
# đúng một thư mục gọn gàng, không vương cả trăm file ra Desktop
Add-Type -AssemblyName System.IO.Compression.FileSystem
$za = [IO.Compression.ZipFile]::Open($zip, 'Create')
Get-ChildItem $app -Recurse -File | ForEach-Object {
  $trong = $ten + '/' + $_.FullName.Substring($app.Length + 1).Replace([string][char]92, '/')
  [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($za, $_.FullName, $trong, 'Optimal') | Out-Null
}
$za.Dispose()

"Ứng dụng: $app\TroLyHoaHocNhi.exe"
"Zip gửi đi: $zip ({0:N0} MB)" -f ((Get-Item $zip).Length / 1MB)
