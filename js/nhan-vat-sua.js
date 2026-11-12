/* =====================================================================
   SỬA HÌNH GỐC NHÂN VẬT — vá lên HD_CHARS (do-hoa.js) lúc khởi động, không sửa file hình gốc.
   Nạp SAU js/do-hoa.js, TRƯỚC js/nhan-vat-skin.js. nhan-vat-skin.js gọi suaHinhGoc(svg, i) cho từng hình
   (i = chỉ số HD_CHARS: 0 giáo sư, 1..10 khách) ngay sau khi đã thay mắt chấm, trước khi ghép trang phục và đạo cụ.
   ===================================================================== */
'use strict';

function suaHinhGoc(svg, i){
  return svg;
}
