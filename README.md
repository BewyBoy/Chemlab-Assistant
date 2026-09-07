<h1 align="center">ChemLab Assistant</h1>
<p align="center"><i>Trợ lý phòng thí nghiệm của giáo sư Hoffmann</i></p>
<p align="center"><b><a href="https://bewyboy.github.io/Chemlab-Assistant/">▶ Chơi ngay trên trình duyệt</a></b></p>

---

Một game về các phương trình hóa học.

Bạn, học trò của giáo sư Hoffmann, đã được thầy giao cho một công việc quan trọng: trợ lý chuẩn bị dung dịch. Mỗi ngày, những người quen trong xóm sẽ cần mua một chất gì đó, và việc của bạn là tạo ra nó.

Đeo găng tay và kính mắt vào, giờ là lúc pha chế rồi!

**ChemLab Assistant** là game pha chế bám sát chương trình Khoa học tự nhiên lớp 8–9. Bạn không đọc lý thuyết rồi làm bài tập; bạn nhớ bật bình hứng *trước* khi phản ứng chạy, vì lần trước khí đã bay mất.

### Có gì bên trong

**31 ngày** đi từ mol tới điện phân · **67 hoá chất** · **167 phản ứng** cân bằng chuẩn · **7 dụng cụ** mở dần theo bài · **6 minigame** · **16 thành tựu** · ca tự do chơi mãi sau khi tốt nghiệp

### Chơi thế nào

Đọc đơn hàng → kéo lọ hoá chất vào cốc (mỗi lần = 0,1 mol) → đun, khuấy, lọc hoặc hứng khí → kéo cốc cho khách. Sai thì đổ vào bồn rửa, làm lại. Mỗi ngày chấm tối đa 3 sao; 1 sao là mở khoá ngày kế tiếp.

### Chạy trên máy

HTML/CSS/JS thuần — không framework, không bước build, không phụ thuộc.

```bash
npx --yes http-server -p 8642 -c-1 .
```

`index.html` là toàn bộ game. `phan-ung.js` là bảng phản ứng — sửa hoá học ở đó. `hoa-chat.md` là sổ tay tra cứu 67 chất.

### Trạng thái

Chơi trọn vẹn từ đầu tới cuối, nhưng **chỉ trên desktop** (kéo–thả bằng chuột, khung cố định 1280×720). Đang làm tiếp: hỗ trợ cảm ứng, tách `index.html`, và playtest với học sinh thật để cân lại độ khó.
