<h1 align="center">Trợ Lý Hóa Học Nhí</h1>
<p align="center"><i>Trợ lý phòng thí nghiệm của giáo sư Hoffmann</i></p>
<p align="center"><b><a href="https://bewyboy.github.io/Chemlab-Assistant/">▶ Chơi ngay trên trình duyệt</a></b></p>

---

Một game về các phương trình hóa học.

Bạn, học trò của giáo sư Hoffmann, đã được thầy giao cho một công việc quan trọng: trợ lý chuẩn bị dung dịch. Mỗi ngày, những người quen trong xóm sẽ cần mua một chất gì đó, và việc của bạn là tạo ra nó.

Đeo găng tay và kính mắt vào, giờ là lúc pha chế rồi!

**Trợ Lý Hóa Học Nhí** là game pha chế bám sát chương trình Khoa học tự nhiên lớp 8–9. Bạn không đọc lý thuyết rồi làm bài tập; bạn nhớ bật bình hứng *trước* khi phản ứng chạy, vì lần trước khí đã bay mất.

### Có gì bên trong

**31 ngày** đi từ mol tới điện phân · **67 hoá chất** · **167 phản ứng** cân bằng chuẩn, mỗi phản ứng có **thẻ hoạt hình** nguyên tử tách rồi ghép · **8 dụng cụ** mở dần theo bài · **6 minigame** · **19 thành tựu** · **chế độ khó** tự tính gam / ml / lít · nhạc nền và tiếng động tự sinh, không cần file âm thanh · ca tự do chơi mãi sau khi tốt nghiệp

### Chơi thế nào

Đọc đơn hàng → kéo lọ hoá chất vào cốc (mỗi lần = 0,1 mol) → đun, khuấy, lọc hoặc hứng khí → kéo cốc cho khách. Phản ứng cháy làm như thật: nạp O₂ / Cl₂ vào lọ khí, cho chất rắn lên muôi đốt, hơ qua đèn cồn rồi đưa vào lọ. Sai thì đổ vào bồn rửa, làm lại — cốc không phản ứng thì giáo sư nói lý do. Mỗi ngày chấm tối đa 3 sao; 1 sao là mở khoá ngày kế tiếp.

**Chế độ khó** (bật ở màn hình ngày hoặc Cài đặt): phiếu hàng ghi khối lượng / thể tích khí, mỗi lần lấy hoá chất phải tự cân, đong; sai số cho phép 5%, giao sai thì mở dần gợi ý. Thêm **Thử thách pha nồng độ** (Cₘ, C%) ở menu chính.

**An toàn phòng thí nghiệm** là luật chơi: đeo kính & găng trước khi lấy hoá chất, bật tủ hút khi làm với khí độc (Cl₂, SO₂, NH₃), pha axit thì rót axit vào nước. Phạm lỗi thì mất sao thứ ba.

**Cho thầy cô:** menu **Báo cáo học tập** tổng hợp sao, số lượt, lỗi hay gặp theo từng ngày. Học sinh tải bảng `.csv` hoặc gửi một mã; thầy cô dán mã vào **Xem mã của học sinh** là thấy đúng bảng đó, không cần máy chủ.

### Chạy trên máy

HTML/CSS/JS thuần — không framework, không bước build, không phụ thuộc.

```bash
npx --yes http-server -p 8642 -c-1 .
```

| File | Nội dung |
|---|---|
| `index.html` | Khung trang, nạp các file dưới đây theo đúng thứ tự |
| `style.css` | Toàn bộ giao diện |
| `js/phan-ung.js` | Bảng phản ứng — sửa hoá học ở đây |
| `js/du-lieu.js` | Hoá chất, 31 ngày, thành tựu, "Bạn có biết?" |
| `js/do-hoa.js` | Kho SVG dụng cụ / lọ / biểu tượng, nhân vật |
| `js/giao-dien.js` | Âm thanh & nhạc nền, lưu tiến trình, menu, lịch, cài đặt, báo cáo, kết quả |
| `js/phong-thi-nghiem.js` | Bàn thí nghiệm, kéo–thả, phản ứng, đốt, an toàn, khách hàng |
| `js/che-do.js` | Minigame, pha nồng độ, chế độ khó, thẻ phản ứng |
| `js/khoi-dong.js` | Tự kiểm tra (mở bằng `#dev`) và vào game — nạp cuối |
| `js/loi-thoai.js`, `js/nhan-vat.js` | Thoại khách, đa dạng hoá dàn khách |

`docs/hoa-chat.md` là sổ tay tra cứu 67 chất. `tools/dong-goi.ps1` đóng gói bản tải lên itch.io. `assets/` chứa SVG nhân vật và hình vẽ tay, `tools/` chứa trang xem thử và bản mẫu phối cảnh.

### Trạng thái

Chơi trọn vẹn từ đầu tới cuối, trên máy tính lẫn điện thoại / máy tính bảng (cầm ngang; kéo bằng ngón tay, nhấn giữ lọ để xem "Bạn có biết?"). Đang làm tiếp: playtest với học sinh thật để cân lại độ khó.
