<h1 align="center">Trợ Lý Hóa Học Nhí</h1>
<p align="center"><i>Trợ lý phòng thí nghiệm của giáo sư Hoffmann</i></p>
<p align="center"><b><a href="https://bewyboy.github.io/Chemlab-Assistant/">▶ Chơi ngay trên trình duyệt</a></b></p>

---

Một game về các phương trình hóa học.

Bạn, học trò của giáo sư Hoffmann, đã được thầy giao cho một công việc quan trọng: trợ lý chuẩn bị dung dịch. Mỗi ngày, những người quen trong xóm sẽ cần mua một chất gì đó, và việc của bạn là tạo ra nó.

Đeo găng tay và kính mắt vào, giờ là lúc pha chế rồi!

**Trợ Lý Hóa Học Nhí** là game pha chế bám sát chương trình Khoa học tự nhiên lớp 8–9. Bạn không đọc lý thuyết rồi làm bài tập; bạn nhớ bật bình hứng *trước* khi phản ứng chạy, vì lần trước khí đã bay mất.

### Có gì bên trong

**31 ngày** đi từ mol tới điện phân · **67 hoá chất** · **167 phản ứng** cân bằng chuẩn, mỗi phản ứng có **thẻ hoạt hình** nguyên tử tách rồi ghép · **8 dụng cụ** mở dần theo bài · **6 minigame** · **19 thành tựu** · **chế độ khó** tự tính gam / ml / lít · ca tự do chơi mãi sau khi tốt nghiệp

### Chơi thế nào

Đọc đơn hàng → kéo lọ hoá chất vào cốc (mỗi lần = 0,1 mol) → đun, khuấy, lọc hoặc hứng khí → kéo cốc cho khách. Phản ứng cháy làm như thật: nạp O₂ / Cl₂ vào lọ khí, cho chất rắn lên muôi đốt, hơ qua đèn cồn rồi đưa vào lọ. Sai thì đổ vào bồn rửa, làm lại — cốc không phản ứng thì giáo sư nói lý do. Mỗi ngày chấm tối đa 3 sao; 1 sao là mở khoá ngày kế tiếp.

**Chế độ khó** (bật ở màn hình ngày hoặc Cài đặt): phiếu hàng ghi khối lượng / thể tích khí, mỗi lần lấy hoá chất phải tự cân, đong; sai số cho phép 5%, giao sai thì mở dần gợi ý. Thêm **Thử thách pha nồng độ** (Cₘ, C%) ở menu chính.

### Chạy trên máy

HTML/CSS/JS thuần — không framework, không bước build, không phụ thuộc.

```bash
npx --yes http-server -p 8642 -c-1 .
```

`index.html` là toàn bộ game. `phan-ung.js` là bảng phản ứng — sửa hoá học ở đó. `hoa-chat.md` là sổ tay tra cứu 67 chất.

### Trạng thái

Chơi trọn vẹn từ đầu tới cuối, nhưng **chỉ trên desktop** (kéo–thả bằng chuột, khung cố định 1280×720). Đang làm tiếp: hỗ trợ cảm ứng, tách `index.html`, và playtest với học sinh thật để cân lại độ khó.
