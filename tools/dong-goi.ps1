# Đóng gói bản chơi để tải lên itch.io.
#   Chạy:  powershell -ExecutionPolicy Bypass -File tools\dong-goi.ps1
#
# itch.io đòi index.html nằm ở GỐC file zip, không được nằm trong thư mục con.
# Vì vậy script gom file vào dist\game\ rồi nén NỘI DUNG của thư mục đó.
#
# Chỉ đóng gói đúng những file game cần (danh sách $canShip). Mọi thứ khác trong repo (bản mẫu phối cảnh,
# trang xem thử nhân vật, ghi chú, thư mục assets/, tools/, docs/) là đồ làm việc, không ship.

$ErrorActionPreference = 'Stop'
$goc = Split-Path $PSScriptRoot -Parent   # script nằm ở tools\, gốc game là thư mục cha
$dist = Join-Path $goc 'dist'
$stage = Join-Path $dist 'game'
$zip = Join-Path $dist 'chemlab-assistant-itch.zip'

$canShip = @(
  'index.html',          # khung trang: nạp style.css và các file .js theo đúng thứ tự
  'style.css',           # toàn bộ giao diện
  'js\loi-thoai.js',        # thoại khách
  'js\nhan-vat.js',         # đa dạng hoá dàn khách
  'js\phan-ung.js',         # bảng phản ứng — thiếu là cốc không phản ứng gì
  'js\du-lieu.js',          # hoá chất, 31 ngày, thành tựu
  'js\do-hoa.js',           # kho SVG + nhân vật
  'js\giao-dien.js',        # âm thanh, menu, lịch, cài đặt, báo cáo
  'js\phong-thi-nghiem.js', # bàn thí nghiệm, phản ứng, khách hàng
  'js\che-do.js',           # minigame, pha nồng độ, chế độ khó, thẻ phản ứng
  'js\khoi-dong.js',        # tự kiểm tra + vào game (nạp cuối)
  'favicon.ico',
  'favicon.png'
)

# dựng lại thư mục tạm cho sạch, tránh sót file cũ từ lần đóng gói trước
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory -Force $stage | Out-Null

foreach ($f in $canShip) {
  $p = Join-Path $goc $f
  if (-not (Test-Path $p)) { throw "Thiếu file: $f" }
  $dich = $stage; if ($f.Contains('')) { $dich = Join-Path $stage (Split-Path $f -Parent) }   # giữ cấu trúc js\ trong zip, index.html vẫn ở gốc
  New-Item -ItemType Directory -Force $dich | Out-Null
  Copy-Item $p $dich
}

# Tự ghi zip để đường dẫn dùng dấu / (Compress-Archive của PowerShell 5.1 ghi dấu \ — itch.io/Linux không hiểu thư mục js/)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$za = [IO.Compression.ZipFile]::Open($zip, 'Create')
Get-ChildItem $stage -Recurse -File | ForEach-Object {
  $ten = $_.FullName.Substring($stage.Length + 1).Replace([string][char]92, '/')
  [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($za, $_.FullName, $ten, 'Optimal') | Out-Null
}
$za.Dispose()

# kiểm lại: index.html phải ở gốc zip, nếu không itch.io sẽ không chạy được
$z = [IO.Compression.ZipFile]::OpenRead($zip)
$ten = $z.Entries | ForEach-Object { $_.FullName }
$z.Dispose()

if ($ten -notcontains 'index.html') { throw "index.html KHÔNG ở gốc zip — itch.io sẽ báo lỗi." }

"Đã đóng gói: $zip"
"{0:N0} KB" -f ((Get-Item $zip).Length / 1KB)
"Nội dung:"
$ten | ForEach-Object { "  $_" }
