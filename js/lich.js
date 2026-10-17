/* =====================================================================
   LỊCH — tên tháng và mô tả từng ngày. Sửa chữ ở đây là đủ, không cần đụng file khác.
   Mô tả của một ngày hiện ở: ô lịch, màn hình giới thiệu ngày, thanh trên cùng khi chơi
   và báo cáo học tập.

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
    'Hiđro — chất khử cừ khôi',              // 8
    'Điều chế hiđro',                        // 9
    'Ai là chất khử?',                       // 10
    'Nước — hợp chất kỳ diệu',               // 11
    'Axit hay bazơ? — Thám tử quỳ tím',      // 12
    'Oxit gặp nước',                         // 13
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
    'Cacbon — từ than đến đá vôi',           // 27
    'Luyện tập lớn — Lễ hội hoá học',        // 28
    'Điện phân — tách chất bằng điện',       // 29
    'Thuốc tím — nhà máy oxi tí hon',        // 30
    'Chuỗi phản ứng — Nối mắt xích',         // 31
  ],

  tuDo: 'Ca tự do — tháng sau'   // ô ngay sau ngày 31
};

LICH.ngay.forEach((t, i) => { if(DAYS[i]) DAYS[i].t = t; });
