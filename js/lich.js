/* =====================================================================
   LỊCH — tên tháng và mô tả từng ngày. Sửa chữ ở đây là đủ, không cần đụng file khác.
   Tên một ngày hiện ở: thẻ Tạm nghỉ khi đang chơi và bảng bài giảng (ô lịch dán sticker hoá học — xem `sticker`).

   Cách sửa:
     • Mỗi dòng trong `ngay` là một ngày, từ ngày 1 đến ngày 31 (số ngày ghi ở cuối dòng).
     • Chỉ sửa chữ nằm giữa hai dấu nháy ' '. Giữ nguyên dấu nháy và dấu phẩy cuối dòng.
     • Muốn có dấu nháy đơn ' bên trong mô tả thì viết \'.
     • Đừng thêm hay xoá dòng: game có đúng 31 ngày.
   Nạp NGAY SAU js/du-lieu.js (cần DAYS).
   ===================================================================== */
'use strict';

const LICH = {
  thang: 7,   // tháng in trên đầu tờ lịch → THÁNG 7

  ngay: [
    'Ngày đầu tiên ở tiệm',                  // 1
    'Khái niệm mol',                         // 2
    'Nguyên tử hay phân tử?',                // 3
    'Hoá trị — những "cánh tay" nguyên tử',  // 4
    'Cân bằng phương trình hoá học',         // 5
    'Oxi gặp kim loại và phi kim',           // 6
    'Luyện tập chương 1',                    // 7
    'Hiđro — điều chế và tính khử',          // 8
    'Oxi — điều chế và sự cháy',             // 9
    'Ai là chất khử?',                       // 10
    'Nước — hợp chất kỳ diệu',               // 11
    'Axit hay bazơ? — Thám tử quỳ tím',      // 12
    'Đi thực tế 1 — Hoá học trong nhà',      // 13
    'Luyện tập chương 2',                    // 14
    'Tính chất của axit',                    // 15
    'Tính chất của bazơ',                    // 16
    'Phân loại chất',                        // 17
    'Axit mạnh: H₂SO₄ & HNO₃',               // 18
    'Muối (1) — con của axit và bazơ',       // 19
    'Muối (2) — trao đổi và kết tủa',        // 20
    'Luyện tập chương 3',                    // 21
    'Nhôm — kim loại quốc dân',              // 22
    'Sắt — hoá trị II và III',               // 23
    'Bảng tuần hoàn — bản đồ nguyên tố',     // 24 (tạm thời; tên cũ: 'May áo giáp sắt')
    'Halogen — khí clo vàng lục',            // 25
    'Nitơ — khí trơ mà quý',                 // 26
    'Đi thực tế 2 — Khu công nghiệp',        // 27
    'Luyện tập lớn — Lễ hội hoá học',        // 28
    'Điện phân — tách chất bằng điện',       // 29
    'Thuốc tím — nhà máy oxi tí hon',        // 30
    'Chuỗi phản ứng — Nối mắt xích',         // 31
  ],

  /* Sticker dán trên ô lịch thay cho tên ngày (tên ngày hiện ở thẻ Tạm nghỉ khi đang chơi). Cùng thứ tự với `ngay`.
     Mỗi mục là khoá một sticker dụng cụ / đồ vật trong js/sticker.js (cốc khuấy, thìa, cân, muôi đốt, pipet, lọ
     axit…), hoặc một công thức hoá học — khi đó vẽ mô hình bi–que như minigame ngày 3. Chọn thứ gợi đúng bài hôm đó. */
  sticker: [
    'coc-khuay',      // 1  pha dung dịch: cốc + đũa khuấy
    'thia',           // 2  mol: mỗi lần một thìa = 0,1 mol
    'nguyentu',       // 3  nguyên tử hay phân tử
    'CH4',            // 4  hoá trị: C có bốn "tay"
    'can',            // 5  cân bằng phương trình
    'muoi-dot',       // 6  đốt chất trong oxi
    'kiemtra',        // 7  luyện tập chương 1
    'khi-h2',         // 8  hiđro: bình thu khí
    'que-dom',        // 9  oxi: đun thuốc tím, que đóm bùng cháy
    'kinh-lup',       // 10 đi tìm chất khử: CuO đen hoá đồng đỏ
    'H2O',            // 11 nước
    'giay-quy',       // 12 quỳ tím
    'nha',            // 13 đi thực tế: hoá học trong nhà
    'so-tay',         // 14 luyện tập chương 2
    'gia-ong-nghiem', // 15 tính chất của axit
    'pipet-hong',     // 16 tính chất của bazơ: nhỏ phenolphtalein hoá hồng
    'gio-phan-loai',  // 17 phân loại chất
    'lo-axit',        // 18 axit mạnh
    'NaCl',           // 19 muối: con của axit và bazơ
    'pheu-loc',       // 20 kết tủa: lọc
    'huy-chuong',     // 21 luyện tập chương 3
    'lon-nhom',       // 22 nhôm
    'dinh-sat',       // 23 sắt
    'bang-tuan-hoan', // 24 bảng tuần hoàn
    'binh-clo',       // 25 halogen: khí clo vàng lục
    'NH3',            // 26 nitơ → amoniac
    'nha-may',        // 27 đi thực tế: khu công nghiệp
    'cup',            // 28 luyện tập lớn
    'dien-phan',      // 29 điện phân
    'lo-thuoc-tim',   // 30 thuốc tím
    'xich'            // 31 chuỗi phản ứng
  ],

  tuDo: 'Ca tự do — tháng sau'      // ô ngay sau ngày 31 (ngày 1 tháng sau)
};

LICH.ngay.forEach((t, i) => { if(DAYS[i]) DAYS[i].t = t; });
