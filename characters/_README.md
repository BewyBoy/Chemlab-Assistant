# Nhân vật ChemLab — file SVG rời để chỉnh sửa

Mỗi nhân vật có **2 file**, dùng chung một `viewBox` nên xếp chồng là khớp tuyệt đối:

| File | Nội dung | Ghi chú |
|------|----------|---------|
| `NN-ten.svg` | **Thân** — tĩnh, chỉ biểu cảm *bình thường*, KHÔNG có mắt, KHÔNG animation, không phụ thuộc CSS | Đây là file để bạn sửa (nối lại tai/tay bị rời…). Chỗ mắt có chú thích `<!-- eyes… -->`. |
| `NN-ten-eyes.svg` | **Mắt** — tròng trắng + con ngươi + mí chớp, kèm `<style>` animation chớp mắt | Mở riêng sẽ thấy mắt mở và tự chớp. Ghép đè lên thân là xong. |

Danh sách: xem `_manifest.json`.

## Sửa thân
Mở `NN-ten.svg` bằng Inkscape / Illustrator / trình duyệt. Sửa thoải mái — kéo tai về sát đầu, nối tay vào vai, v.v. Giữ nguyên `viewBox` để mắt còn khớp.

## Ghép mắt trở lại
Lấy phần bên trong `<svg>…</svg>` của file `-eyes.svg` (bỏ dòng `<?xml…?>` và thẻ `<svg>` ngoài cùng) rồi dán vào **cuối** file thân, ngay trước `</svg>`. Vì cùng `viewBox`, mắt sẽ rơi đúng vị trí. Giữ lại thẻ `<style>` (animation chớp) hoặc bỏ nếu muốn mắt tĩnh.

> Lưu ý: 2 biểu cảm *Vui* / *Bực* đã được lược khỏi các file này cho gọn. Khi bạn chốt phần thân, mình sẽ tái tạo lại 3 biểu cảm + đưa cả bộ trở vào `index.html`.
