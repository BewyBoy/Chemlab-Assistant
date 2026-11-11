// ============================================================
//  LỜI THOẠI NPC — Trợ Lý Hóa Học Nhí
//  Gom mọi câu khách hàng và giáo sư Hoffmann nói trong game. File này được index.html
//  nạp đầu tiên. Cứ sửa thoải mái các câu bên dưới rồi F5 game là thấy ngay.
//
//  Mục lục:
//    1. KHÁCH HÀNG — đặt hàng, chờ, khen, chê, bỏ đi
//    2. GIÁO SƯ HOFFMANN — chào ở menu, nhắc an toàn, giải thích cốc không phản ứng, minigame
//    3. GIÁO SƯ GIỚI THIỆU NGÀY — lời dặn trên tờ giấy trước mỗi ca (ngày 1 → 31)
//  (Bài giảng bảng đen đầu mỗi ngày nằm riêng ở js/bai-giang.js.)
//
//  Các chỗ điền tự động trong câu (mỗi mục ghi rõ mình dùng những chỗ nào):
//    {A}    = cách khách tự xưng (bà, chú, em, mình, thầy...)
//    {q}    = số lượng đặt (vd: 0,2 mol)
//    {name} = tên chất (vd: muối ăn)
//    {f}    = công thức (vd: NaCl)
//  Chữ trong <b>...</b> sẽ in đậm.
//  Lưu ý: câu nằm trong nháy đơn thì đừng dùng nháy đơn bên trong (cần thì viết \').
// ============================================================

// ======================= 1. KHÁCH HÀNG =======================

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

/* ---- bấm vào bóng thoại: khách nói chuyện thêm. Mỗi lần bấm là câu kế tiếp, xen giữa các câu này,
   một câu đặt hàng nói kiểu khác và một mẩu chuyện về chất đang đặt (CHAT_FACT, {fact} lấy từ CHEM_FACTS).
   Chỉ số = thứ tự trong CUSTOMERS. Câu không nhắc tới hàng thì góc bóng thoại tự ghi chất cần làm. ---- */
const CHAT_LINES = {
 0: ['Bánh mì của bà sáng nào cũng hết sạch từ sớm đó con!',
     'Lò nướng nhà bà nóng lắm, đứng cả ngày mồ hôi nhễ nhại.',
     'Con học hoá giỏi thế, mai qua tiệm bà cho ổ bánh nóng!'],
 1: ['Năm nay lúa nhà chú trúng mùa, cũng nhờ bón phân đúng cách đấy!',
     'Ruộng chua thì chú rải vôi, vôi là bazơ nên khử bớt chua. Cháu học tới chưa?',
     'Trời nắng thế này mà vẫn phải ra đồng, mệt ghê.'],
 2: ['Mai em kiểm tra hoá, anh chị chỉ em mẹo cân bằng phương trình với!',
     'Em thích nhất lúc quỳ tím đổi màu, cứ như ảo thuật ấy!',
     'Lớn lên em muốn làm nhà hoá học giống giáo sư Hoffmann!'],
 3: ['Xi măng anh trộn hằng ngày cũng làm từ đá vôi nung đấy!',
     'Công trình bên kia sắp xong rồi, anh tranh thủ ghé mua đồ.',
     'Làm thợ xây phải khoẻ, mà cũng phải biết tí hoá học nữa.'],
 4: ['Ở trạm xá, cô sát trùng dụng cụ cẩn thận lắm, sạch là trên hết.',
     'Rửa tay sạch trước và sau khi làm thí nghiệm nhé, thói quen tốt đấy!',
     'Hôm nay trạm xá đông bệnh nhân, cô phải về sớm.'],
 5: ['Ao cá nhà ông mà thiếu oxi là cá nổi đầu ngay.',
     'Ông rắc vôi quanh ao cho sạch, nước trong veo.',
     'Câu được con cá trắm to, mai ông mang qua cho cháu!'],
 6: ['Mình đang làm thí nghiệm để nộp cô giáo đấy!',
     'Bạn biết không, 1 mol có tới 6,022 × 10²³ hạt, nhiều hơn số hạt cát trên cả bãi biển!',
     'Ước gì mình cũng được làm trợ lý ở tiệm này như bạn!'],
 7: ['Bạc để lâu bị xỉn đen, chị phải đánh bóng suốt.',
     'Vàng gần như không phản ứng với gì nên đeo bao năm vẫn sáng đấy em.',
     'Khách hôm nay chọn nhẫn lâu quá, chị chạy vội qua đây.'],
 8: ['Thầy hay mua hoá chất ở tiệm này về làm thí nghiệm cho lớp.',
     'Nhớ nhé: cân bằng phương trình chỉ đổi hệ số, không bao giờ đổi chỉ số!',
     'Thấy em pha chế khéo thế, thầy yên tâm rồi.'],
 9: ['Quán chè của cô có món chè đậu xanh ngon nhất xóm đó!',
     'Trời nóng thế này, chè bán chạy lắm con ơi.',
     'Nấu chè cũng như pha hoá chất: phải đong cho đúng!']
};
const CHAT_FACT = 'Nói nhỏ nè: {fact}';

/* ---- khách nhận hàng đúng: chọn ngẫu nhiên một câu. Dùng {A} ---- */
const PRAISE = [
 'Cảm ơn nhé, đúng thứ {A} cần!',
 'Tuyệt vời! Đúng chuẩn luôn!',
 'Giỏi quá! Cảm ơn nha!',
 'Chuẩn không cần chỉnh!'
];

/* ---- khách nhận hàng sai: chọn ngẫu nhiên một câu, {r} = lý do lấy từ REASON_LINES bên dưới. Dùng {A}, {r} ---- */
const COMPLAIN = [
 'Ơ, không phải rồi! {r}',
 'Sai rồi bạn ơi… {r}',
 '{A} không đặt cái này mà! {r}',
 'Hừm, kiểm tra lại đi: {r}'
];

/* ---- lý do giao sai (khách nói, ghép vào {r} ở trên; game tự thêm dấu ! cuối câu).
   Đừng đổi tên khoá bên trái — game dùng nó để đếm lỗi vào báo cáo cho thầy cô. ---- */
const REASON_LINES = {
 'chua-khuay':   'trong cốc còn chất chưa tan kìa, khuấy đều đã chứ',
 'trong':        'vật đựng đang trống trơn mà',
 'vat-dung-khi': 'khí thì phải giao bằng bình thu khí chứ',
 'vat-dung-ran': 'chất rắn phải lọc ra đĩa rồi mới giao chứ',
 'khong-co':     'không thấy {name} đâu cả',                 // {name} = tên hàng khách đặt
 'lan-chat':     'hàng bị lẫn {list}',                       // {list} = các chất bị lẫn vào
 'nhieu-qua':    'cần đúng {q} cơ, chỗ này nhiều quá',
 'it-qua':       'cần đúng {q} cơ, chỗ này ít quá',
 'thieu-nuoc':   'phải pha với nước chứ, khô khốc thế này'
};

/* ---- khách chờ hết giờ nên bỏ đi. {ten} = tên khách (vd: Bà Tư) ---- */
const LEAVE_LINE = 'Tiếc quá, {ten} chờ lâu quá nên đi mất rồi…';


// =================== 2. GIÁO SƯ HOFFMANN ===================

/* ---- bong bóng thoại ở màn hình chính ---- */
const PROF_GREETING = 'Chào trợ lý nhỏ! Hôm nay tiệm mình có nhiều đơn lắm đó, vào ca thôi!';

/* ---- nhắc an toàn khi trò phạm lỗi. {f} = công thức khí độc.
   nhacThoi nối sau câu nhắc ở ngày đầu (chưa trừ sao), truSao nối sau từ ngày 2. ---- */
const PROF_SAFETY = {
 'kinh':      'Khoan! Chưa đeo <b>kính bảo hộ và găng tay</b> mà đã lấy hoá chất — bắn vào mắt là nguy lắm. Ta đeo hộ trò rồi.',
 'tu-hut':    'Khí {f} độc lắm! Làm với khí độc phải bật <b>tủ hút</b> trước. Ta bật hộ rồi đấy.',
 'axit-nuoc': 'Ngược rồi! Pha loãng axit sunfuric phải rót từ từ <b>AXIT vào NƯỚC</b>, không rót nước vào axit — nước sôi bùng lên làm axit bắn tung toé.',
 nhacThoi:    '(Hôm nay ta chỉ nhắc thôi.)',
 truSao:      'Lỗi an toàn — ca này mất sao thứ ba.'
};

/* ---- cốc không phản ứng: giáo sư giải thích lý do. Đừng đổi tên khoá bên trái.
   {fuel} = chất đem đốt, {gas} = khí trong lọ, {m} = kim loại, {acid} = axit,
   {sm} = kim loại trong muối, {salt} = muối, {list} = danh sách chất trong cốc ---- */
const PROF_NO_RX = {
 'dot-sai-cho': 'Phản ứng CHÁY không làm trong cốc: thả <b>{fuel}</b> vào <b>muôi đốt</b>, hơ qua đèn cồn cho bén lửa, rồi đưa vào lọ khí đã nạp <b>{gas}</b>.',
 'khong-muoi':  '{fuel} chỉ cháy khi được đốt nóng trong khí {gas} — hôm nay không có muôi đốt.',
 'thieu-nhiet': 'Đủ chất rồi, nhưng phản ứng này cần <b>nhiệt</b> — kéo <b>Đun nóng</b> vào cốc.',
 'sau-hidro':   '<b>{m}</b> đứng sau <b>H</b> trong dãy hoạt động (K Na Mg Al Zn Fe <b>H</b> Cu Ag) nên không đẩy được hiđro ra khỏi axit {acid}.',
 'yeu-hon':     '<b>{m}</b> yếu hơn <b>{sm}</b> trong dãy hoạt động nên không đẩy được {sm} ra khỏi {salt}.',
 'kl-nuoc':     '<b>{list}</b> không tác dụng với nước ở nhiệt độ thường — chỉ kim loại rất mạnh như K, Na mới làm được.',
 'khong-tan':   '<b>{list}</b> không tan và không phản ứng với nước.',
 'trao-doi':    'Hai muối chỉ trao đổi với nhau khi sinh ra chất <b>kết tủa</b> (hoặc khí) — {list} trộn vào vẫn tan hết.',
 'can-dac':     'Phản ứng này cần <b>{acid} ĐẶC</b> — axit trong cốc đang loãng. Ở ca tự do có lọ {acid} đặc trên kệ.',
 'thieu-xt':    'Đủ chất, đủ nhiệt rồi nhưng phản ứng này cần <b>chất xúc tác {cat}</b> — thêm một ít {cat} vào cốc (xúc tác không bị tiêu hao).',
 'thu-dong':    '<b>{m}</b> bị <b>thụ động</b> trong {acid} đặc nguội: một lớp oxit mỏng bọc ngoài nên không phản ứng. Phải <b>đun nóng</b> mới được.'
};

/* ---- nhắc trong ca ở bàn thí nghiệm (hiện ở góc dưới màn hình) ---- */
const PROF_LAB = {
 khiBayMat:  'Khí sinh ra bay mất rồi! Muốn giữ khí thì kéo <b>Thu khí</b> lên miệng cốc <b>trước khi</b> rót chất tạo khí.',
 thaKhay:    'Muốn giao hàng thì thả cốc (bình khí, đĩa lọc) vào đúng <b>khay</b> trước mặt khách nhé.',
 thaLoi:     'Lần giao sai đầu tiên trong ca ta <b>chưa tính lỗi</b> — khách đã nói sai chỗ nào, sửa lại rồi giao nhé. Từ lần sau, giao sai là mất sao thứ ba.',
 hoanTac:    'Đã rút lại lần rót vừa rồi.',
 khongHoanTac: 'Chất vừa rót đã phản ứng rồi, không rút lại được — đổ cốc ra <b>bồn rửa</b> nếu muốn làm lại.',
 hetGio:     'Hết giờ! Tiệm đóng cửa'
};

/* ---- minigame Chuỗi phản ứng (ngày 31) và Cân bằng phương trình ---- */
const PROF_MG = {
 chuoiBatDau:    'Chuỗi {i}/{n}: đi từ <b>{start}</b> tới <b>{target}</b> — kéo bình hoá chất vào ô trên mỗi mũi tên.',
 chuoiSai:       'Chưa đúng — ô đỏ là chỗ sai. <b>−1 điểm</b>. Thử lại nào!',
 chuoiHetDiem:   'Sai rồi, <b>−1 điểm</b>. Chuỗi này hết điểm — xem ta làm mẫu nhé!',
 chuoiDung:      'Đúng rồi! Cả chuỗi đã nối liền.',
 chuoiDungNgay:  'Chuẩn không cần chỉnh — đúng ngay lần đầu!',
 chuoiDapAn:     'Đáp án đây — nhìn kĩ từng mắt xích nhé!',
 canBangRutGon:  'Vừa khít, nhưng mọi hệ số còn chia hết cho {g} — rút gọn nhé!',
 canBangChua:    'Chưa cân bằng — {lech}',                                          // {lech} = thừa / thiếu bao nhiêu nguyên tử (game tự vẽ)
 canBangHetDiem: 'Chưa cân bằng — {lech}. Hết điểm câu này — xem ta làm mẫu nhé!',
 canBangLamMau:  'Ta làm mẫu đây — đếm lại số phân tử mỗi chất nhé!',
 canBangDatLai:  'Ta đặt lại số phân tử cho đúng nhé…'
};


// ============== 3. GIÁO SƯ GIỚI THIỆU NGÀY ==============
/* Lời giáo sư trên tờ giấy giới thiệu trước mỗi ca. Số bên trái = ngày (1 → 31).
   'N-kho' = lời dặn khi bật Chế độ khó của ngày N.
   '24-cu' = bản gốc ngày 24 (minigame xếp dãy hoạt động, đang tạm cất).
   Đừng xoá ngày nào — thiếu là ô giới thiệu ngày đó trống. */
const DAY_STORY = {
 1:
   'Chào mừng trò đến với tiệm hoá chất của ta! Ta là giáo sư Hoffmann. Hôm nay trò học pha DUNG DỊCH: cho chất tan vào cốc rồi thêm nước. Chất nào ÍT TAN sẽ lắng dưới đáy — lấy ĐŨA THUỶ TINH bên cạnh cốc, kéo vào rồi khuấy tròn cho tan hết nhé!',
 2:
   'MOL là "tá" của nhà hoá học: 1 mol = 6,022×10²³ hạt! Mỗi lần trò nghiêng lọ là thêm đúng 0,1 mol. Khách hỏi 0,3 mol thì nghiêng 3 lần. Ta tặng trò cái THÌA KHUẤY — bấm để đảo đều cốc. Hôm nay có mấy vị khách "cuồng số" ghé đấy…',
 3:
   'NGUYÊN TỬ là hạt nhỏ nhất của nguyên tố (Fe, Cu…). Nhiều nguyên tử gắn lại thành PHÂN TỬ. Phân tử của một nguyên tố là ĐƠN CHẤT (O₂, N₂…), của nhiều nguyên tố là HỢP CHẤT (H₂O, CO₂…). Phân loại các thẻ này nào!',
 '3-kho':
   'CHẾ ĐỘ KHÓ: TẠO ION! Hôm nay mỗi câu chỉ có MỘT nguyên tử, vẽ đủ các LỚP ELECTRON: hạt nhân ở giữa, mỗi vòng là một lớp, mỗi chấm là một electron. Electron lớp trong bị hạt nhân giữ rất chặt; chỉ ELECTRON LỚP NGOÀI CÙNG (vòng ngoài, chấm to có quầng vàng, xếp từng cặp như sơ đồ Lewis) mới nhường hay nhận được. Nguyên tử nào cũng muốn có lớp ngoài cùng bền như KHÍ HIẾM — đủ 8 electron (riêng lớp thứ nhất chỉ cần 2, như He). Nguyên tử KIM LOẠI có 1, 2, 3 electron lớp ngoài thì NHƯỜNG hết đi: bấm vào chấm (hoặc kéo chấm ra xa) là electron bật ra ngoài — mất electron, nguyên tử thành ION DƯƠNG. Nguyên tử PHI KIM có 5, 6, 7 electron lớp ngoài thì NHẬN thêm cho đủ 8: quanh nguyên tử luôn có vài ELECTRON TỰ DO trôi lơ lửng — bấm vào chúng, hoặc kéo thả vào nguyên tử — nhận electron, nguyên tử thành ION ÂM. Đề không nói nhường hay nhận, cũng không nói bao nhiêu — trò tự xét rồi bấm KIỂM TRA. 10 câu trong 150 giây!',
 4:
   'HOÁ TRỊ là số "cánh tay" một nguyên tử dùng để nắm tay nguyên tử khác. Công thức đúng khi MỌI bàn tay đều có bạn nắm, không tay nào thừa: Na 1 tay, O 2 tay → 2 Na nắm 1 O thành Na₂O. Có nguyên tố nhiều hoá trị (N từ I tới V!) — đề ghi đủ và tô đậm hoá trị dùng trong câu. GỐC AXIT (=SO₄, −NO₃…) và nhóm −OH cũng có hoá trị, coi như một nguyên tố: mấy câu đầu ta ráp sẵn gốc cho, từ câu 4 trò tự ráp từ từng nguyên tử. Kéo bóng vào khu vực tạo chất rồi bấm KIỂM TRA. Cả màn chỉ có 90 giây — làm nhanh nhé! Xong sớm thì giây còn lại để trò tự do tạo chất lấy điểm.',
 '4-kho':
   'CHẾ ĐỘ KHÓ: SƠ ĐỒ LEWIS! Hôm nay mỗi nguyên tử hiện đủ các ELECTRON LỚP NGOÀI CÙNG, mỗi chấm là một electron. Nguyên tử nào cũng muốn có 8 electron lớp ngoài như khí hiếm (riêng H chỉ cần 2, giống He). Hai PHI KIM thì GÓP CHUNG: kéo từ một chấm đứng một mình (có quầng vàng) sang chấm có quầng vàng của nguyên tử kia — hai chấm nối thành một gạch, đó là một cặp electron dùng chung, gọi là LIÊN KẾT CỘNG HOÁ TRỊ. Nối thêm giữa hai nguyên tử đó là liên kết đôi, liên kết ba. KIM LOẠI thì NHƯỜNG: kéo chấm electron của kim loại thả vào phi kim — kim loại thành ion dương, phi kim thành ion âm, hai ion trái dấu hút nhau: LIÊN KẾT ION (chấm đỏ là electron vừa được nhường). Đề chỉ ghi tên chất, trò tự tính cần bao nhiêu nguyên tử. Bấm gạch nối để tách, bấm chấm đỏ để trả lại. 8 câu trong 240 giây!',
 5:
   'Hôm qua trò lập được công thức, hôm nay ta ghép chúng thành PHƯƠNG TRÌNH HOÁ HỌC. Trong phản ứng, nguyên tử KHÔNG tự sinh ra cũng không mất đi — liên kết cũ đứt, các nguyên tử đổi bạn nắm tay thành chất mới. Vì thế số nguyên tử mỗi nguyên tố TRƯỚC và SAU phản ứng phải bằng nhau. Số đứng trước công thức là HỆ SỐ = số phân tử của chất đó. Kéo đúng số phân tử mỗi chất vào KHAY PHẢN ỨNG — chất tham gia bên trái mũi tên, sản phẩm bên phải — rồi bấm PHẢN ỨNG, ta sẽ đếm từng nguyên tử và kết luận. Nhớ: chỉ thêm bớt phân tử, không sửa công thức, và chọn bộ hệ số NHỎ NHẤT. Mỗi câu 2 điểm, chưa cân bằng thì mất 1 điểm. Từ mai, trên tường tiệm có tờ GIẤY CÂN BẰNG — bấm vào để tự cân bằng phương trình của ca đó nhé!',
 6:
   'OXI duy trì sự cháy — kim loại hay phi kim cháy trong oxi đều tạo OXIT. Kim loại: 2Mg + O₂ —t°→ 2MgO sáng chói; sắt cháy tóe hoa lửa ra oxit sắt từ, 3Fe + 2O₂ → Fe₃O₄. Phi kim: than cháy thành khí CO₂ nằm ngay trong lọ — đậy nắp muôi lại là giao được cả lọ; lưu huỳnh cháy lửa XANH LAM ra SO₂ hắc mũi; photpho tạo khói trắng P₂O₅ rơi ra đĩa. Đốt thì không bỏ vào cốc đâu nhé — ba bước với MUÔI ĐỐT: nạp O₂ vào LỌ KHÍ → chất rắn lên muôi, hơ ĐÈN CỒN cho bén lửa → đưa nhanh vào lọ. Hệ số hôm qua trò cân bằng chính là tỉ lệ đong oxi: thiếu thì lửa tắt giữa chừng, dư thì oxi lẫn vào hàng!',
 7:
   'Hết chương đầu rồi! Bài kiểm tra nhỏ: pha dung dịch đúng số mol, rồi đốt vài thứ trong oxi. Bình tĩnh làm từng đơn, ta đứng sau quầy cổ vũ trò đây.',
 8:
   'Chương mới, nhân vật mới: KHÍ HIĐRO — nhẹ nhất vũ trụ! Dẫn H₂ qua CuO nung nóng, nó "cướp" oxi tạo Cu đỏ rực: CuO + H₂ —t°→ Cu + H₂O. Đó gọi là PHẢN ỨNG KHỬ. Cho oxit + H₂ vào cốc, BẬT ĐÈN, rồi lọc lấy kim loại.',
 9:
   'Hôm qua dùng H₂, hôm nay tự làm ra nó! Kim loại + axit → muối + H₂↑: Zn + 2HCl → ZnCl₂ + H₂. Khí sẽ bay mất nếu không hứng — bật BÌNH THU KHÍ lên TRƯỚC khi bỏ kim loại vào nhé.',
 10:
   'Sự OXI HOÁ là chiếm lấy oxi; sự KHỬ là nhường oxi đi. CHẤT KHỬ là chất chiếm oxi của chất khác (nó bị oxi hoá). Nhìn từng phương trình và chỉ ra chất khử nhé!',
 11:
   'NƯỚC là hợp chất của hiđro và oxi. Nó hiền mà không hiền: thả NATRI vào là chạy vòng vòng sủi bọt — 2Na + 2H₂O → 2NaOH + H₂↑! Vôi sống gặp nước cũng nóng rực: CaO + H₂O → Ca(OH)₂. (Còn muốn TÁCH nước ngược lại thành H₂ và O₂? Chờ đến ngày 29 nhé — bí mật!)',
 12:
   'AXIT có H đứng đầu, làm quỳ tím hoá ĐỎ. BAZƠ có nhóm OH, làm quỳ hoá XANH. Chất trung tính thì… vẫn TÍM. Hai lọ cùng đỏ thì sao? Gọi thêm trợ thủ: BaCl₂ cho kết tủa trắng với gốc =SO₄, AgNO₃ cho kết tủa trắng với gốc −Cl, Na₂CO₃ sủi bọt khi gặp axit. Ba lọ này bong hết nhãn rồi — nhỏ thử từng mẫu, ghi lại hiện tượng, rồi dán nhãn giúp ta!',
 13:
   'Vài oxit phản ứng luôn với nước: CaO (vôi sống) + H₂O → Ca(OH)₂ là BAZƠ, còn P₂O₅ + 3H₂O → 2H₃PO₄ là AXIT. Quy luật: oxit kim loại + nước → bazơ, oxit phi kim + nước → axit. Thử quỳ để kiểm tra sản phẩm nhé!',
 14:
   'Kiểm tra tay nghề chương 2: điều chế H₂, dùng H₂ khử oxit, và cho oxit gặp nước. Nhiều bước một tí nhưng trò làm được — trò đã là thợ phụ cứng tay rồi!',
 15:
   'AXIT = hiđro + GỐC AXIT: −Cl (clorua), =SO₄ (sunfat), −NO₃ (nitrat). Axit tác dụng kim loại → muối + H₂↑, tác dụng oxit bazơ → muối + nước. Tên muối đi theo gốc axit — nhìn đơn hàng là biết cần axit nào! Và nhớ QUY TẮC VÀNG khi pha axit: rót AXIT vào NƯỚC, đừng bao giờ rót nước vào axit.',
 16:
   'BAZƠ tan (kiềm) làm quỳ hoá xanh; bazơ KHÔNG TAN thì sắc màu rực rỡ: Cu(OH)₂ XANH LAM, Fe(OH)₃ NÂU ĐỎ. Và đun Cu(OH)₂ trên đèn cồn thì nó phân huỷ thành CuO đen! Hoá học là một hộp màu vẽ đấy trò ạ.',
 17:
   'Bốn họ nhà hoá chất: OXIT (nguyên tố + oxi), AXIT (H + gốc axit), BAZƠ (kim loại + OH), MUỐI (kim loại + gốc axit). Phân loại chuẩn thì học gì cũng nhanh — kéo từng thẻ vào đúng giỏ nhé!',
 18:
   'Hai "đại ca" nhà axit! H₂SO₄ HAI nấc: một phân tử "ăn" được HAI phân tử NaOH — muốn Na₂SO₄ phải trộn 1:2. HNO₃ tạo muối nitrat. Mẹo nhận biết gốc sunfat: nhỏ BaCl₂ vào là kết tủa trắng BaSO₄ ngay!',
 19:
   'AXIT + BAZƠ → MUỐI + NƯỚC — phản ứng TRUNG HOÀ! HCl gặp NaOH cho ra muối ăn NaCl. Muối mang tên "họ bố mẹ": kim loại của bazơ + gốc của axit. Trộn đúng tỉ lệ nhé!',
 20:
   'Hai dung dịch trong suốt đổ vào nhau — BỤP! — trắng xoá như tuyết: AgNO₃ + NaCl → AgCl↓ + NaNO₃. Đó là phản ứng TRAO ĐỔI: hai muối "đổi bạn nhảy" cho nhau. Lọc kết tủa xong, phần nước lọc còn lại cũng bán được — không bỏ phí thứ gì!',
 21:
   'Hôm nay khách đông và khó tính lắm — toàn đơn lắt léo về axit, bazơ, muối! Bình tĩnh, đọc kỹ đơn, nhớ tỉ lệ. Ta đứng sau quầy cổ vũ trò đây.',
 22:
   'NHÔM nhẹ, bền, làm từ nồi niêu đến máy bay! Hoá trị III nên phương trình hơi "xoắn": 2Al + 6HCl → 2AlCl₃ + 3H₂. Nhôm cũng cháy trong khí clo: 2Al + 3Cl₂ —t°→ 2AlCl₃ — nạp Cl₂ vào lọ khí rồi đốt nhôm trên muôi. Hai con đường, một sản phẩm! (Lọ khí cũng là bình thu khí: dùng xong nhớ xả sạch trước khi hứng H₂.)',
 23:
   'SẮT có tính "hai mặt": gặp axit HCl chỉ chịu hoá trị II (FeCl₂), nhưng cháy trong lọ khí clo thì lên hẳn hoá trị III (FeCl₃, khói nâu đỏ)! Đốt trong lọ oxi lại ra Fe₃O₄. Cùng một kim loại, ba bộ mặt — đó là sắt.',
 24:
   'Hôm nay ta treo lên tường tấm BẢNG TUẦN HOÀN — bản đồ của mọi nguyên tố! Mỗi Ô ghi SỐ HIỆU NGUYÊN TỬ Z (= số proton = số electron), KÍ HIỆU và NGUYÊN TỬ KHỐI. Mỗi HÀNG là một CHU KÌ: số thứ tự chu kì = số LỚP electron. Mỗi CỘT là một NHÓM: nguyên tố nhóm A có số electron LỚP NGOÀI CÙNG = số thứ tự nhóm. Màu ô cho biết kim loại, phi kim hay khí hiếm. Còn KÍCH THƯỚC nguyên tử? Cùng chu kì, đi sang PHẢI nhỏ dần; cùng nhóm, đi XUỐNG to dần. Bấm vào ô nào thì KÍNH LÚP soi ô đó, có cả tên nguyên tố. 12 câu hỏi liền tay — đọc bảng mà trả lời nhé!',
 '24-kho':
   'CHẾ ĐỘ KHÓ! Hôm nay không có kính lúp — mọi thứ ghi sẵn trên ô, xem ô nhôm phóng to để biết chỗ nào ghi gì (màn hình nhỏ thì bấm vào ô để xem to hơn). Số tím cạnh kí hiệu là ĐỘ ÂM ĐIỆN χ — sức hút electron của nguyên tử: cùng chu kì, đi sang PHẢI thì tăng; cùng nhóm, đi XUỐNG thì giảm (khí hiếm không xét). Dòng dưới cùng là CẤU HÌNH ELECTRON, như oxi 1s² 2s² 2p⁴: số đứng đầu là LỚP, chữ là phân lớp, số mũ là số electron. Từ chu kì 3 có cách viết gọn: [Ne] là phần giống khí hiếm Ne, nên natri 1s² 2s² 2p⁶ 3s¹ viết là [Ne] 3s¹. Kim loại dễ NHƯỜNG hết electron lớp ngoài, phi kim dễ NHẬN thêm cho đủ 8 — thành ION có các lớp giống một khí hiếm. Hạt nhân có proton và NEUTRON: nguyên tử khối ≈ số proton + số neutron. Còn HIỆU độ âm điện Δχ của hai nguyên tử cho biết loại liên kết: từ 1,7 trở lên là liên kết ION, từ 0,4 đến dưới 1,7 là CỘNG HOÁ TRỊ CÓ CỰC, dưới 0,4 là CỘNG HOÁ TRỊ KHÔNG CỰC. Soi kĩ rồi hẵng trả lời!',
 '24-cu':
   'Thợ rèn của làng cần may áo giáp — nhưng kim loại nào bền, kim loại nào "yếu bóng vía"? "Khi Nào May Áo Záp Sắt Đồng Bạc" — dãy hoạt động đấy! Kim loại đứng TRƯỚC mạnh hơn, đẩy được kim loại đứng SAU ra khỏi muối. Xếp từ MẠNH NHẤT đến YẾU NHẤT.',
 25:
   'Gặp gỡ họ HALOGEN — nghĩa là "sinh ra muối"! Đại diện: khí clo Cl₂ vàng lục, độc, phản ứng mãnh liệt: natri đốt trên muôi rồi đưa vào lọ clo là 2Na + Cl₂ → 2NaCl (muối ăn từ khí độc, kỳ diệu chưa!). Còn H₂ + Cl₂ là hai khí: trộn trong cốc rồi châm lửa → 2HCl. Cẩn thận khi thao tác nhé!',
 26:
   'NITƠ chiếm 78% không khí mà lười phản ứng số một — trơ như đá! Nhưng ép nó với H₂ ở nhiệt độ cao: N₂ + 3H₂ ⇌ 2NH₃ — amoniac, nguyên liệu phân đạm nuôi cả thế giới. NH₃ gặp HCl là "khói trắng" NH₄Cl bay mù mịt!',
 27:
   'CACBON đa tài: than đốt trong lọ oxi cho CO₂, than nóng còn KHỬ được oxit kim loại — 2CuO + C —t°→ 2Cu + CO₂ (bí quyết lò luyện kim từ nghìn năm!). Còn đá vôi CaCO₃ nung già lửa thành vôi sống, gặp axit thì sủi bọt "đá sôi".',
 28:
   'Ngày tốt nghiệp khoá chính! Cả thị trấn đến chúc mừng trò. Mọi kệ hoá chất đều mở, mọi dụng cụ sẵn sàng. Hãy cho ta thấy tất cả những gì trò đã học — và nhận danh hiệu NHÀ HOÁ HỌC NHÍ! (Nghe đồn sau lễ hội còn ba ngày bí mật trong phòng thí nghiệm nâng cao…)',
 29:
   'Chào mừng đến phòng thí nghiệm nâng cao! Đây là NGUỒN ĐIỆN PHÂN — kéo hai điện cực vào cốc. Nước bị dòng điện tách đôi: 2H₂O —đp→ 2H₂↑ (cực âm, hứng được) + O₂↑ (cực dương, thoát ra). Còn điện phân CuCl₂ thì đồng bám cực âm, khí clo sủi ở cực dương! Nguồn điện có bảng định lượng ở mép bàn: chọn chất, vặn số mol rồi bấm — nó tách đúng chừng ấy thôi, nên trò cân được chính xác từng đơn.',
 30:
   'KMnO₄ — thuốc tím — là chất oxi hoá siêu siêu mạnh! Khuấy tan tinh thể tím (ít tan lắm đấy, dùng đũa!), rồi ĐUN GIÀ LỬA: 2KMnO₄ —t°→ K₂MnO₄ + MnO₂ + O₂↑. Trò vừa tự điều chế OXI! Hứng đầy lọ O₂ đó rồi đốt đồng trên muôi đốt mà xem.',
 31:
   'Thử thách cuối cùng! Trên bảng chỉ có chất ĐẦU và chất ĐÍCH — mấy chất ở giữa ta giấu đi rồi. Kéo bình hoá chất trong khay vào ô trên từng mũi tên. Điền đủ thì ta chấm: đúng cả chuỗi thì hiện ra hết các chất, sai thì mất điểm đấy! Toàn bộ 31 ngày dồn vào đây. Sẵn sàng chưa, NHÀ HOÁ HỌC NHÍ?'
};
