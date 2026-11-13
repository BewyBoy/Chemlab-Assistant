<h1 align="center">Trợ Lý Hóa Học Nhí</h1>
<p align="center"><i>Trợ lý phòng thí nghiệm của giáo sư Hoffmann</i></p>
<p align="center"><b><a href="https://bewyboy.github.io/Chemlab-Assistant/">▶ Chơi ngay trên trình duyệt</a></b></p>

---

Một game về các phương trình hóa học.

Bạn, học trò của giáo sư Hoffmann, đã được thầy giao cho một công việc quan trọng: trợ lý chuẩn bị dung dịch. Mỗi ngày, những người quen trong xóm sẽ cần mua một chất gì đó, và việc của bạn là tạo ra nó.

Đeo găng tay và kính mắt vào, giờ là lúc pha chế rồi!

**Trợ Lý Hóa Học Nhí** là game pha chế bám sát chương trình Khoa học tự nhiên lớp 8–9. Bạn không đọc lý thuyết rồi làm bài tập; bạn nhớ bật bình hứng *trước* khi phản ứng chạy, vì lần trước khí đã bay mất.

### Có gì bên trong

**31 ngày** đi từ mol tới điện phân · **67 hoá chất** · **508 phản ứng** cân bằng chuẩn, mỗi phản ứng có **thẻ hoạt hình** nguyên tử tách rồi ghép · **8 dụng cụ** mở dần theo bài · **8 minigame** · **20 thành tựu** · **chế độ khó** tự tính gam / ml / lít · nhạc nền và tiếng động tự sinh, không cần file âm thanh · ca tự do sau khi tốt nghiệp (tính sao theo số đơn, có kỷ lục)

### Chơi thế nào

Đọc đơn hàng → kéo lọ hoá chất vào cốc (mỗi lần = 0,1 mol) → đun, khuấy, lọc hoặc hứng khí → kéo cốc cho khách. Dụng cụ cất ở hai bên thảm làm việc giữa bàn; kéo một thứ lên thảm là lắp vào bộ: nó to lên, kiềng hay giá sắt tự dựng nếu bộ ấy cần. Phản ứng cháy làm như thật: nạp O₂ / Cl₂ vào lọ khí, cho chất rắn lên muôi đốt (muôi tự treo lên giá giữa thảm), kéo đèn cồn vào thảm — đèn đổi chỗ với cốc, lửa hơ chén muôi — rồi đưa muôi đang cháy vào lọ. Sai thì đổ vào bồn rửa, làm lại — cốc không phản ứng thì giáo sư nói lý do. Mỗi ngày chấm tối đa 3 sao theo điểm; 1 sao là mở khoá ngày kế tiếp. Mỗi đơn / câu đúng 100 điểm, làm nhanh thêm tới 50, đúng liền thêm tới 50; 3 sao chỉ dành cho lượt không sai lần nào (thưởng hoàn hảo), nhanh mấy cũng không bù được một lỗi — riêng lần giao sai đầu tiên mỗi ca (chế độ thường) không tính: khách nói rõ sai chỗ nào để sửa. Kẹt thì bấm **Gợi ý** cho giáo sư nhắc bước kế tiếp; rót lố thì **Rút lại** lần rót vừa rồi (khi chất chưa phản ứng). Ngày 1 giáo sư tự hướng dẫn từng bước. Chơi lại một ngày đã qua thì khách đến theo thứ tự khác.

**Chế độ khó** (bật ở lịch chọn ngày hoặc Cài đặt): phiếu hàng ghi khối lượng / thể tích khí, mỗi lần lấy hoá chất phải tự cân, đong; sai số cho phép 5%, giao sai thì mở dần gợi ý. Ngày 3 khó thành bài **tạo ion**: mỗi câu một nguyên tử vẽ đủ các lớp electron (lớp ngoài cùng xếp theo sơ đồ Lewis), tự cho nguyên tử nhường electron lớp ngoài hoặc nhận các electron tự do trôi quanh cho thành ion bền như khí hiếm. Ngày 4 khó thành bài **sơ đồ Lewis**: nối hai chấm electron thành liên kết cộng hoá trị, kéo electron của kim loại sang phi kim thành liên kết ion. Thêm **Thử thách pha nồng độ** (Cₘ, C%) ở menu chính.

**An toàn phòng thí nghiệm** là luật của chế độ khó: đeo kính & găng trước khi lấy hoá chất, bật tủ hút khi làm với khí độc (Cl₂, SO₂, NH₃), pha axit thì rót axit vào nước. Phạm lỗi thì mất sao thứ ba. Chế độ thường không có luật này; rót nước vào axit thì giáo sư vẫn giảng nhưng không tính lỗi.

**Tham quan khu công nghiệp:** mua vé bằng đồng đỏ (ô ngày 2 tháng sau trên lịch, mở sau khi qua ngày 31) rồi theo giáo sư và kỹ sư Minh qua lò vôi, lò cao luyện gang, nhà máy điện phân nhôm — phần visual novel có tranh nền từng cảnh và câu hỏi nhanh ở mỗi xưởng.

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
| `js/lich.js` | Tên tháng trên tờ lịch và mô tả từng ngày — sửa chữ ở đây |
| `js/bai-giang.js` | Lời giáo sư giảng lý thuyết từng ngày (màn kiểu visual novel, hiện lần đầu mở ngày); `BAI_GIANG_KHO` là bài riêng cho chế độ khó ở những ngày có kiến thức mới — sửa chữ ở đây |
| `js/do-hoa-3d.js` | **Sinh tự động** từ Blender (`ban_lam_viec.py`): hình dụng cụ vẽ từ mô hình 3D (dáng dùng + dáng cất) và bố cục bàn — thảm làm việc, chỗ cất từng dụng cụ. Đừng sửa tay |
| `js/do-hoa.js` | Kho SVG dụng cụ / lọ / biểu tượng, nhân vật; nét cốc thủy tinh vẽ tay (`BEAKER_ART`, chuyển từ `Blender/sym-beaker3.svg`) |
| `js/diem.js` | Luật tính điểm (đúng, nhanh, chuỗi, hoàn hảo) và mốc sao — chỉnh luật chấm ở đây |
| `js/giao-dien.js` | Âm thanh & nhạc nền, lưu tiến trình, menu, lịch, cài đặt, kết quả |
| `js/phong-thi-nghiem.js` | Bàn thí nghiệm, kéo–thả, phản ứng, đốt, an toàn, khách hàng |
| `js/che-do.js` | Minigame, pha nồng độ, chế độ khó, thẻ phản ứng |
| `js/tham-quan.js` | Chuyến tham quan khu công nghiệp: kịch bản, câu hỏi, tranh nền từng cảnh — sửa lời ở đây |
| `js/khoi-dong.js` | Tự kiểm tra (mở bằng `#dev`) và vào game — nạp cuối |
| `js/loi-thoai.js`, `js/nhan-vat.js` | Thoại khách, đa dạng hoá dàn khách |

`docs/hoa-chat.md` là sổ tay tra cứu 67 chất. `tools/dong-goi.ps1` đóng gói bản tải lên itch.io. `assets/` chứa SVG nhân vật, hình vẽ tay và `man-hinh-chinh.webp` (ảnh render 3D của menu chính, 1707×1024 px game, dựng bằng Blender), `tools/` chứa trang xem thử và bản mẫu phối cảnh.

### Trạng thái

Chơi trọn vẹn từ đầu tới cuối, trên máy tính lẫn điện thoại / máy tính bảng (cầm ngang; kéo bằng ngón tay, nhấn giữ lọ để xem "Bạn có biết?"). Đang làm tiếp: playtest với học sinh thật để cân lại độ khó.
