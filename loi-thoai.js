// ============================================================
//  LỜI THOẠI KHÁCH HÀNG — ChemLab Assistant
//  File này được index.html nạp lúc khởi động (phải nằm cùng thư mục).
//  Cứ sửa thoải mái các câu bên dưới rồi F5 game là thấy ngay.
//
//  Các chỗ điền tự động trong câu:
//    {A}    = cách khách tự xưng (bà, chú, em, mình, thầy...)
//    {q}    = số lượng đặt (vd: 0,2 mol)
//    {name} = tên chất (vd: muối ăn)
//    {f}    = công thức (vd: NaCl)
//  Lưu ý: câu nằm trong nháy đơn thì đừng dùng nháy đơn bên trong (và ngược lại).
// ============================================================

/* ---- 5 câu mua bán chung, dùng khi chất không có câu ứng dụng riêng ---- */
const ORDER_TPL = [
 'Cho {A} xin {q} {name} ({f}) nhé!',
 'Bán cho {A} {q} {name} ({f}) với!',
 '{A} cần gấp {q} {name} ({f})!',
 'Nghe nói tiệm này pha {name} ({f}) chuẩn lắm, cho {A} {q} nha!',
 'Hôm nay {A} muốn mua {q} {name} ({f}).'
];

/* ---- thoại ứng dụng thực tế: chất nào có mặt ở đây thì khách sẽ nói lý do đời thường cần nó ---- */
const USE_LINES = {
 'NaCl':     ['Nhà {A} muối dưa cải, bán cho {A} {q} {name} ({f}) nhé!',
              'Cho {A} {q} {f} pha nước muối súc miệng cho sạch họng!'],
 'C12H22O11':['Cho {A} {q} {name} ({f}) về nấu chè đậu xanh nha!'],
 'NaHCO3':   ['{A} cần {q} {name} ({f}) làm bột nở nướng bánh bông lan!',
              'Bụng {A} đầy hơi quá, cho {A} {q} {f} làm thuốc muối nhé!'],
 'Na2CO3':   ['Cho {A} {q} {name} ({f}) — sô-đa giặt đồ sạch bóng dầu mỡ!'],
 'CaO':      ['Ruộng nhà {A} bị chua, cho {A} {q} {name} ({f}) về khử chua đất!'],
 'Ca(OH)2':  ['Cho {A} {q} {name} ({f}) để quét vôi tường nhà cho trắng!',
              'Ao nhà {A} bị phèn, {q} {f} khử phèn giúp {A} nha!'],
 'CaCO3':    ['{A} cần {q} {name} ({f}) — đá vôi nghiền làm phấn viết bảng đó!'],
 'O2':       ['Trạm xá cần {q} {name} ({f}) cho bệnh nhân thở gấp!',
              'Cá nhà {A} ngộp quá, {q} {f} sục khí cho ao cá nhé!'],
 'H2':       ['Cho {A} {q} {name} ({f}) bơm bóng bay hội chợ — nhẹ hơn không khí mà!'],
 'CO2':      ['{A} lấy {q} {name} ({f}) nạp bình chữa cháy nhé!',
              'Cho {A} {q} {f} làm nước ngọt có ga!'],
 'N2':       ['Cho {A} {q} {name} ({f}) bơm túi bánh snack cho giòn lâu — khí trơ mà!'],
 'Cl2':      ['Hồ bơi cần khử trùng, cho {A} {q} {name} ({f}) — cẩn thận khí độc nha!'],
 'NH3':      ['{A} cần {q} {name} ({f}) để sản xuất phân đạm cho vụ mùa!'],
 'NH4Cl':    ['Lúa nhà {A} đói đạm rồi, cho {A} {q} {name} ({f}) làm phân bón!'],
 'HCl':      ['{A} cần {q} {name} ({f}) tẩy gỉ sắt trước khi hàn!'],
 'H2SO4':    ['Bình ắc-quy xe máy nhà {A} cạn rồi, cho {A} {q} {name} ({f})!'],
 'NaOH':     ['Cho {A} {q} {name} ({f}) về nấu xà phòng nhé!',
              'Cống nhà {A} tắc quá, {q} {f} thông cống giúp {A}!'],
 'Fe':       ['{A} cần {q} {name} ({f}) rèn thêm cái cuốc mới!'],
 'Al':       ['Cho {A} {q} {name} ({f}) — nhẹ mà bền, làm nồi xoong tốt lắm!'],
 'Cu':       ['Nhà {A} sửa điện, cần {q} {name} ({f}) làm dây dẫn!'],
 'Zn':       ['{A} xin {q} {name} ({f}) mạ chống gỉ cho mái tôn!'],
 'S':        ['{A} cần {q} {name} ({f}) lưu hoá cao su làm lốp xe!'],
 'P':        ['{A} xin {q} {name} ({f}) làm diêm quẹt!'],
 'C':        ['Cho {A} {q} {name} ({f}) về nhóm lò nướng bánh!'],
 'CuSO4':    ['Vườn nhà {A} bị nấm, {q} {name} ({f}) pha thuốc trừ nấm giúp {A}!'],
 'KMnO4':    ['Cho {A} {q} {name} ({f}) pha loãng sát trùng vết thương nhé!',
              'Ao cá nhà {A} cần {q} {f} khử trùng nước!'],
 'AgNO3':    ['Tiệm {A} nhận tráng gương, ruột phích — cần {q} {name} ({f})!'],
 'BaSO4':    ['{A} cần {q} {name} ({f}) cho bệnh nhân uống để chụp X-quang dạ dày!'],
 'ZnO':      ['{A} cần {q} {name} ({f}) làm kem chống nắng với thuốc bôi da!'],
 'Fe2O3':    ['Cho {A} {q} {name} ({f}) pha sơn chống gỉ màu đỏ nâu!']
};

/* ---- 2 câu đặc biệt ngày Số mol (nhân vật nerd Avogadro) ---- */
const SPECIAL_LINES = {
 avogadroThay: 'Thầy cần ĐÚNG 0,3 mol NaCl — tức là 1,8066×10²³ hạt muối, vì 1 mol = 6,022×10²³ hạt! Thiếu một hạt là thầy biết ngay đấy nhé!',
 avogadroTro: 'Mình vừa học số Avogadro! Cho mình 0,1 mol đường — khỏi đếm, mình tin bạn: 6,022×10²² phân tử là đủ ngọt!'
};

/* ---- thoại lúc khách phải chờ ----
   Khách sẽ nói khi đồng hồ chờ của họ còn ~60% rồi ~30%. Giọng bám tính cách
   từng người (tính cách ghi ở comment để dễ sửa). Chỉ số = thứ tự trong CUSTOMERS. */
const WAIT_LINES = {
 0: [ // Bà Tư · lò bánh mì — hiền, hay lo xa, thích dặn dò
      'Từ từ thôi con, bà không vội đâu.',
      'Lò bánh bà còn đang ủ bột, bà chờ được mà.'],
 1: [ // Chú Ba · nông dân — thật thà, kiên nhẫn, hay so với chuyện đồng áng
      'Chú chờ được, ngoài ruộng còn chờ mưa cả tháng nữa kìa.',
      'Cứ làm cho kỹ, hỏng một mẻ là tiếc lắm đó con.'],
 2: [ // Bé Na · học sinh — tò mò, hỏi nhiều, thích ghi chép
      'Chị ơi, chất này để lâu có bị hỏng không ạ?',
      'Em ghi vào vở được không? Mai em có bài kiểm tra.'],
 3: [ // Anh Minh · thợ xây — vội, nói cộc, ghét chờ
      'Nhanh giùm anh cái, công trình đang đợi.',
      'Xong chưa em? Anh còn phải về trộn vữa.'],
 4: [ // Cô Lan · y tá — cẩn thận, hay nhắc an toàn
      'Cứ bình tĩnh, làm sai còn nguy hơn làm chậm.',
      'Nhớ đeo kính bảo hộ nhé, cô nhắc thật đấy.'],
 5: [ // Ông Sáu · chủ ao cá — vui tính, nhiều chuyện
      'Ông kể cho nghe, cái ao nhà ông năm nay được mùa lắm…',
      'Hồi xưa ông cũng học Hoá đấy, mà quên sạch rồi!'],
 6: [ // Bạn Tí · học sinh — nghịch, nói nhanh, thiếu kiên nhẫn
      'Lâu quá à, mình đói bụng rồi nè!',
      'Bạn pha nhanh lên, tí nữa mình còn đi đá bóng!'],
 7: [ // Chị Hoa · tiệm vàng bạc — sành sỏi, khó tính về số lượng
      'Chị cần đúng số đấy nhé, thiếu một chút là chị biết.',
      'Chị đợi, nhưng đừng để chị đợi lâu quá.'],
 8: [ // Thầy Nam · giáo viên Hoá — nghiêm mà ấm, hay hỏi ngược
      'Trò làm đi, thầy xem trò có nhớ bài không.',
      'Đừng vội. Cân bằng phương trình trước đã.'],
 9: [ // Cô Mai · quán chè — xởi lởi, nhiệt tình
      'Làm từ từ thôi con, cô không giục đâu.',
      'Xong việc ghé quán cô, cô đãi chén chè đậu xanh!']
};
