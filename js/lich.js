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

  /* Sticker hoá học dán trên ô lịch thay cho tên ngày (tên ngày hiện ở thẻ Tạm nghỉ khi đang chơi).
     Mỗi ngày một công thức, vẽ bằng mô hình bi–que như minigame ngày 3. Cùng thứ tự với `ngay`. */
  sticker: [
    'NaCl', 'MgSO4', 'CH4', 'NH3', 'CO2', 'SO2', 'MgO',                           // 1–7
    'H2', 'O2', 'CuO', 'H2O', 'HCl', 'Ca(OH)2', 'H3PO4',                          // 8–14
    'H2SO4', 'NaOH', 'CuSO4', 'HNO3', 'KCl', 'BaSO4', 'AgCl',                     // 15–21
    'AlCl3', 'FeCl3', 'N2', 'Cl2', 'NH4Cl', 'CaCO3', 'Na2CO3',                    // 22–28
    'CuCl2', 'KMnO4', 'Cu(OH)2'                                                   // 29–31
  ],

  tuDo: 'Ca tự do — tháng sau'      // ô ngay sau ngày 31 (ngày 1 tháng sau)
};

LICH.ngay.forEach((t, i) => { if(DAYS[i]) DAYS[i].t = t; });
