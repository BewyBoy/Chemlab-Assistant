/* =====================================================================
   TRANG PHỤC — skin 1 và 2 của từng nhân vật (skin 0 "Cổ điển" là hình gốc, không khai báo ở đây).
   Nạp TRƯỚC js/nhan-vat-skin.js. Xem thử: tools/xem-trang-phuc.html.

   Khoá = chỉ số HD_CHARS: 0 Giáo sư Hoffmann · 1 Bà Tư (lò bánh mì) · 2 Chú Ba (nông dân) · 3 Bé Na (học sinh lớp 8)
   · 4 Anh Minh (thợ xây) · 5 Cô Lan (y tá trạm xá) · 6 Ông Sáu (chủ ao cá) · 7 Bạn Tí (học sinh lớp 8)
   · 8 Chị Hoa (tiệm vàng bạc) · 9 Thầy Nam (giáo viên Hoá) · 10 Cô Mai (quán chè)

   Mỗi skin là một object, mọi trường đều không bắt buộc:
     ten   : tên bộ đồ (tiếng Việt, ngắn)
     grad  : {idHoặcĐuôiId: ['#màu1', '#màu2', …]} — đổi màu các điểm dừng của gradient theo thứ tự.
             Khoá đủ id ('hd1__Linear14') hoặc đuôi id ('c3cloth' → cả 'hd4_c3cloth' lẫn 'hd4e_c3cloth').
     swap  : [['màu cũ', 'màu mới'], …] — thay chuỗi màu trong cả hình (cẩn thận: da, tóc dùng chung màu thì cũng đổi).
     over  : chuỗi SVG vẽ đè lên quần áo (nằm dưới mắt). Toạ độ theo viewBox của nhân vật.
     under : chuỗi SVG vẽ sau lưng mọi thứ.
     prop  : chỉ cho khách (1..10): thay đạo cụ cổ điển (CUST_PROPS trong do-hoa.js); '' là bỏ đạo cụ; không khai báo là giữ.
   Id dùng trong over / under / prop phải bắt đầu bằng 'tp<khoá>s<skin>_' để không trùng giữa các hình.
   ===================================================================== */
'use strict';

const TRANG_PHUC = {
};
