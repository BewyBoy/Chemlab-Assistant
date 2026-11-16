/* =====================================================================
   ĐI THỰC TẾ — các ngày "đi thực tế" trên lịch (DAYS[i].trip) là minigame kiểu visual novel: giáo sư dẫn trò đi xem
   hoá học ngoài đời, dọc đường hỏi bài. Trả lời đúng bao nhiêu câu thì chấm sao bấy nhiêu như minigame (showResult).
     • 'giadung' — ngày 13: về nhà Bà Tư, chất đã học trong bếp, trong vườn (THUC_TE_NHA).
     • 'nhamay'  — ngày 27: khu công nghiệp — lò vôi, lò cao luyện gang, điện phân nhôm; kỹ sư Minh dẫn (THAM_QUAN).
   Nạp sau giao-dien.js (dùng parseLesson, vnRun, vnWrite, vnBoardAt) và trước khoi-dong.js.

   Sửa lời ở THUC_TE_NHA / THAM_QUAN — cùng cách viết như bài giảng (js/bai-giang.js):
     • *chữ* tô đậm; mở đầu bằng :) cười, :( nghiêm; ' || ...' ghi lên bảng, ; để xuống dòng trên bảng.
     • Mở đầu bằng @người (TQ_NGUOI: minh, ba) → người đó nói (có thể kèm :) ngay sau, vd. '@minh :) Chào em!');
       không có → giáo sư nói.
     • Câu hỏi: {hoi:'…', chon:['đáp án đúng', 'sai', 'sai'], khen:'lời khi đúng', giai:'lời khi sai'} — đáp án đúng
       luôn viết ĐẦU TIÊN, game tự xáo thứ tự. Trò phải chọn mới đi tiếp; sai thì nghe giải thích rồi vẫn đi tiếp.
     • nen: tên cảnh nền trong TQ_NEN (cuối file) — gate, kiln, blast, alu, home, nha, bep, vuon.
     • hinhcat: bảng hình cắt chuyển động phủ giữa màn (TQ_CAT) — hiện có 'blast' (lò cao). Trong cảnh có hình cắt, mở
       đầu câu bằng #vùng (TQ_VUNG: nap, chay, co, khu, gang, voi, xi) để khoanh vùng đó, vd. '#khu :) CO giành oxi…'.
   ===================================================================== */
'use strict';

/* ---- ĐI THỰC TẾ 1: hoá học trong nhà (ngày 13) — chỉ dùng chất đã học ở ngày 1–12 ---- */
const THUC_TE_NHA = [
  {nen:'nha', ten:'Nhà Bà Tư', loi:[
    ':) Hôm nay tiệm nghỉ một bữa! Ta với trò về nhà *Bà Tư* chơi — bà mời mãi rồi.',
    '@ba :) Vào đây, vào đây! Bà nghe nói hai thầy trò pha hoá chất suốt ngày. Thế trong nhà bà có hoá chất không?',
    ':) Nhiều lắm bà ạ! Muối, đường, vôi, giấm, cả không khí ta thở — đâu đâu cũng là *chất*. Hôm nay trò sẽ nhận ra những chất ta pha cả tuần nay.',
  ]},
  {nen:'bep', ten:'Gian bếp', loi:[
    '@ba Đây là cái bếp của bà. Hũ này là *muối ăn*, hũ kia là *đường*.',
    'Muối ăn là *NaCl*. Muối giữ cá, giữ thịt lâu hỏng; nước muối loãng súc miệng thì sát khuẩn nhẹ. || muối ăn = NaCl',
    'Đường saccarozơ tan trong nước thành *dung dịch* nước đường — giống hệt ngày đầu tiên trò làm ở tiệm. || đường = C₁₂H₂₂O₁₁',
    {hoi:'Bà pha nước đường nấu chè. Cách nào làm đường *tan nhanh nhất*?',
     chon:['Đun nóng và khuấy đều', 'Để yên thật lâu', 'Cho thêm thật nhiều đường'],
     khen:':) Chuẩn! Nóng lên và khuấy thì hạt đường tiếp xúc với nước nhiều hơn, tan nhanh hơn hẳn.',
     giai:'Chưa đúng. Đun nóng và khuấy đều mới giúp đường tan nhanh: hạt đường được tiếp xúc với nước nhiều hơn.'},
    '@ba Còn cái bếp gas này, ngọn lửa xanh lét nhé!',
    'Khí gas *cháy* là kết hợp với *oxi* trong không khí. Lửa xanh là cháy đủ oxi; lửa vàng, có khói đen là đang *thiếu oxi*.',
    ':( Vì cháy cần oxi, nên muốn dập lửa thì *cắt nguồn oxi* đi.',
    {hoi:'Chảo dầu đang bốc cháy. Việc nên làm *trước tiên* là gì?',
     chon:['Đậy kín vung để cắt nguồn oxi', 'Dội ngay một gáo nước', 'Quạt thật mạnh cho tắt'],
     khen:':) Đúng rồi! Đậy vung là lửa hết oxi, tắt ngay. Tắt bếp luôn nhé.',
     giai:'Không được đâu! Dội nước vào dầu đang cháy làm dầu bắn tung toé; quạt thì thêm oxi. Đậy kín vung để cắt oxi.'},
    '@ba Cái dao sắt bà để ướt qua đêm, sáng ra lốm đốm gỉ nâu.',
    'Sắt gặp *oxi* và *hơi nước* thì bị gỉ — gỉ là *oxit sắt*. Rửa xong lau khô, thỉnh thoảng bôi chút dầu là dao bền. || sắt + oxi + nước → gỉ sắt',
  ]},
  {nen:'nha', ten:'Góc giặt giũ', loi:[
    '@ba Chai nước tẩy bồn cầu này bà phải đeo găng mới dám dùng.',
    ':( Bà làm đúng đấy! Nhiều loại nước tẩy bồn cầu có *axit clohiđric* HCl — tẩy cặn rất sạch nhưng *ăn da*, *ăn mòn kim loại*. || HCl ; axit làm quỳ tím hoá đỏ',
    {hoi:'Vì sao không nên để nước tẩy bồn cầu (có HCl) dính lên vòi nước bằng sắt?',
     chon:['Axit ăn mòn sắt, sinh khí hiđro', 'Vì vòi sẽ sạch quá', 'Vì HCl làm sắt nặng thêm'],
     khen:':) Giỏi! Giống ở tiệm: Fe + 2HCl → FeCl₂ + H₂↑ — vòi sắt bị ăn mòn dần.',
     giai:'Chưa đúng. Sắt đứng trước H nên axit HCl ăn mòn sắt, sinh khí hiđro: Fe + 2HCl → FeCl₂ + H₂↑.'},
    '@ba Còn gói muối *Epsom* này bà hoà nước ấm ngâm chân cho đỡ mỏi.',
    'Muối Epsom là *magie sunfat* MgSO₄ — đúng cái lọ trò khuấy cho tan ở ngày đầu đấy. || muối Epsom = MgSO₄',
  ]},
  {nen:'vuon', ten:'Vườn sau nhà', loi:[
    '@ba Ra vườn nào! Đất vườn bà chua, rau còi cọc, nên bà rắc *vôi bột*.',
    'Đất chua là đất có *axit*. Vôi là *bazơ*: bazơ gặp axit thì *trung hoà* bớt, đất đỡ chua, cây khoẻ hơn. || đất chua (axit) + vôi (bazơ) → bớt chua',
    {hoi:'Đất vườn chua, bà rắc vôi. Vôi giúp được gì?',
     chon:['Vôi là bazơ, trung hoà bớt axit trong đất', 'Vôi là axit, làm đất chua thêm', 'Vôi chỉ làm đất trắng cho đẹp'],
     khen:':) Chính xác! Bazơ trung hoà axit — đây là phản ứng trò sẽ còn gặp nhiều ở chương sau.',
     giai:'Chưa đúng. Vôi là bazơ; nó trung hoà bớt axit làm đất chua.'},
    ':( Nhớ nhé: vôi *sống* CaO gặp nước *toả rất nhiều nhiệt*, có thể gây bỏng. Tôi vôi phải đeo găng, đứng xa. || CaO + H₂O → Ca(OH)₂',
    '@ba Quả chanh này chua quá, ăn là nhăn mặt!',
    'Vị chua là dấu hiệu của *axit*. Nhỏ nước chanh lên giấy quỳ là thấy ngay.',
    {hoi:'Nhỏ nước chanh lên giấy quỳ tím, giấy chuyển sang màu gì?',
     chon:['Đỏ', 'Xanh', 'Vẫn tím'],
     khen:':) Đúng! Nước chanh có axit nên quỳ hoá đỏ. Nước xà phòng là bazơ thì quỳ hoá xanh.',
     giai:'Chưa đúng. Nước chanh có axit nên quỳ tím hoá ĐỎ (bazơ mới làm quỳ hoá xanh).'},
    '@ba Hồi bà còn trẻ, hội chợ hay bán bóng bay bơm khí, buông tay là bay vút lên trời.',
    'Bóng bay lên vì bơm khí *hiđro* — nhẹ nhất trong các khí. Nhưng hiđro trộn với không khí gặp lửa thì *nổ*, nên bây giờ người ta bơm khí *heli* an toàn hơn.',
    {hoi:'Vì sao bóng bay bơm khí hiđro *nguy hiểm* khi ở gần lửa?',
     chon:['Hiđro cháy được, trộn với không khí gặp lửa dễ nổ', 'Hiđro quá nặng làm bóng rơi', 'Hiđro làm bóng đổi màu'],
     khen:':) Chuẩn! Như ở tiệm: 2H₂ + O₂ —t°→ 2H₂O, mà trộn sẵn với oxi thì cháy bùng thành tiếng nổ.',
     giai:'Không phải đâu. Hiđro cháy được; trộn với oxi trong không khí rồi gặp lửa là nổ.'},
  ]},
  {nen:'nha', ten:'Chiều về', loi:[
    ':) Trò thấy chưa: muối, đường, gas, gỉ sắt, axit, vôi, hiđro… đều là chuyện hằng ngày trong nhà.',
    'Biết hoá học là biết *dùng cho đúng* và *giữ an toàn*: đậy vung khi chảo cháy, đeo găng khi dùng axit, cẩn thận với vôi sống.',
    '@ba :) Hai thầy trò mang ít bánh mì về ăn nhé! Bữa nào lại ghé bà.',
    ':) Cảm ơn bà! Về tiệm thôi, mai còn khách đang chờ.',
  ]},
];

/* ---- ĐI THỰC TẾ 2: khu công nghiệp (ngày 27) ---- */
const THAM_QUAN = [
  {nen:'gate', ten:'Cổng khu công nghiệp', loi:[
    ':) Tới nơi rồi! Chào mừng trò tới *khu công nghiệp*. Những phản ứng ta làm trong cốc, ở đây người ta làm với *hàng nghìn tấn* mỗi ngày.',
    'Hôm nay ta ghé ba xưởng, mỗi xưởng làm ra một chất: *vôi sống*, *gang thép* và *nhôm*. || Lò vôi → CaO ; Lò cao → Fe ; Điện phân → Al',
    ':( Luật ở đây còn nghiêm hơn phòng thí nghiệm: đội *mũ bảo hộ*, đi trong vạch vàng, tuyệt đối không chạm vào thứ gì đang nóng.',
    '@minh :) Chào giáo sư, chào em! Anh là Minh, *kỹ sư* ở đây. Hôm nay anh dẫn đoàn mình đi nhé.',
    '@minh Kim loại hiếm khi nằm sẵn trong đất. Chúng ở trong *quặng*, dưới dạng oxit hay muối. Việc của bọn anh là *tách chúng ra khỏi hợp chất*.',
  ]},
  {nen:'kiln', ten:'Xưởng 1 · Lò nung vôi', loi:[
    '@minh Đây là *lò vôi đứng*. Băng chuyền đổ đá vôi vào miệng lò, than cháy ở giữa nung lò lên khoảng *900 °C*.',
    'Ở nhiệt độ ấy, đá vôi bị *nhiệt phân*: một chất tách thành hai chất mới. || CaCO₃ —t°→ CaO + CO₂',
    '@minh Vôi sống CaO lấy ra ở đáy lò. Khí CO₂ bay theo ống khói, nên lò hiện đại phải *thu hồi* bớt CO₂ cho đỡ hại môi trường.',
    ':( Vôi sống gặp nước *toả rất nhiều nhiệt*, nóng tới mức nước sôi lên sùng sục. Đó là phản ứng *tôi vôi*. || CaO + H₂O → Ca(OH)₂',
    'Vôi tôi Ca(OH)₂ dùng để xây nhà, khử chua đất trồng, xử lý nước thải. Một cái lò mà nuôi cả công trường đấy!',
    {hoi:'Vôi sống CaO gặp nước thì sao?',
     chon:['Toả rất nhiều nhiệt, thành vôi tôi Ca(OH)₂', 'Lạnh buốt đi', 'Không có gì xảy ra'],
     khen:':) Đúng! Tôi vôi toả nhiệt mạnh tới mức nước sôi lên, nên phải cẩn thận kẻo bỏng.',
     giai:'Chưa đúng. CaO gặp nước toả rất nhiều nhiệt, thành vôi tôi Ca(OH)₂.'},
    {hoi:'Trong lò vôi, chất nào được lấy ra ở *đáy lò*?',
     chon:['CaO — vôi sống', 'CaCO₃ — đá vôi', 'CO₂ — khí cacbonic'],
     khen:':) Đúng! Nung xong, CaO rắn ở lại đáy lò, còn CO₂ là khí nên bay lên ống khói.',
     giai:'Chưa đúng. CaCO₃ là thứ đổ vào. Nung xong còn lại CaO rắn ở đáy, CO₂ là khí nên bay lên ống khói.'},
  ]},
  {nen:'blast', ten:'Xưởng 2 · Lò cao luyện gang', loi:[
    '@minh Còn đây là *lò cao*, cao ngang toà nhà mười tầng! Xe goòng chạy lên đỉnh, đổ vào *quặng sắt*, *than cốc* và *đá vôi*. || quặng sắt Fe₂O₃ ; than cốc C ; đá vôi CaCO₃',
    '@minh Mấy tháp tròn bên trái là *tháp gió nóng*: chúng nung không khí thật nóng rồi thổi vào chân lò.',
  ]},
  // hinhcat: bảng hình cắt chuyển động phủ giữa màn (TQ_CAT); #vùng ở đầu câu khoanh đỏ vùng đó và làm sáng chú thích của nó
  {nen:'blast', hinhcat:'blast', ten:'Xưởng 2 · Nhìn vào trong lò cao', loi:[
    '#nap @minh Đây là *hình cắt* của lò. Quặng, than cốc, đá vôi đổ từ đỉnh và *rơi dần xuống*; khí nóng thì *bốc ngược lên*. Hai dòng gặp nhau là phản ứng xảy ra.',
    '#chay @minh Dưới đáy, các ống thổi *gió nóng* vào. Than cốc cháy dữ dội, chỗ này nóng tới gần *2000 °C*.',
    '#co Khí CO₂ bốc lên, gặp lớp than nóng đỏ phía trên thì bị biến thành khí *cacbon oxit* CO.',
    '#khu :) Nhân vật chính đây: CO giành lấy oxi của quặng, sắt được giải phóng. CO là *chất khử*! Trò xem, khí CO bay lên gặp quặng đang rơi xuống kìa.',
    '#gang @minh Sắt nóng chảy hoà tan một ít cacbon, *nhỏ giọt* xuống đáy lò thành *gang*, chứa khoảng *2–5% cacbon*.',
    '#voi Còn đá vôi? Trong lò nóng, nó bị nhiệt phân thành vôi sống CaO và khí CO₂, giống hệt ở lò vôi ban nãy.',
    '#xi Rồi CaO kết hợp với cát lẫn trong quặng thành *xỉ*. Xỉ nhẹ nên *nổi trên gang*, người ta tháo riêng ra.',
  ]},
  {nen:'blast', ten:'Xưởng 2 · Lò cao luyện gang', loi:[
    '@minh Muốn có *thép* thì thổi oxi vào gang lỏng, đốt bớt cacbon cho còn *dưới 2%*. Thép dẻo và bền, làm khung nhà, đường ray, cầu.',
    {hoi:'Trong lò cao, chất nào *trực tiếp lấy oxi* của quặng Fe₂O₃ để tạo ra sắt?',
     chon:['Khí CO', 'Khí O₂', 'Đá vôi CaCO₃'],
     khen:':) Chuẩn! CO lấy oxi của Fe₂O₃ rồi biến thành CO₂.',
     giai:'Chưa phải. O₂ dùng để đốt than, đá vôi dùng để tạo xỉ. Chất lấy oxi của quặng là khí CO.'},
  ]},
  {nen:'alu', ten:'Xưởng 3 · Nhà máy điện phân nhôm', loi:[
    '@minh Nhôm *hoạt động mạnh* hơn sắt nhiều, CO hay than không lấy nổi oxi của nhôm oxit. Ở đây bọn anh phải dùng *dòng điện*.',
    '@minh Nguyên liệu là quặng *bôxit*, làm sạch thành nhôm oxit Al₂O₃, trắng như bột mì. || bôxit → Al₂O₃',
    'Al₂O₃ phải hơn *2000 °C* mới nóng chảy, tốn năng lượng quá! Người ta trộn thêm *criolit* để nó nóng chảy ở chưa tới *1000 °C*.',
    'Rồi cho dòng điện rất mạnh chạy qua chất nóng chảy. Đó là *điện phân nóng chảy*. || 2Al₂O₃ —đpnc, criolit→ 4Al + 3O₂',
    '@minh Nhôm lỏng tụ ở *cực âm* dưới đáy bể. Oxi sinh ra ở *cực dương* bằng than, đốt cháy dần cực này nên cứ ít tuần lại phải thay. || cực dương: C + O₂ —t°→ CO₂',
    ':) Vì tốn điện như thế nên *tái chế lon nhôm* tiết kiệm được tới khoảng *95%* năng lượng. Uống xong nhớ bỏ lon đúng thùng nhé!',
    {hoi:'Vì sao *tái chế* lon nhôm lại tiết kiệm đến thế?',
     chon:['Không phải điện phân lại Al₂O₃ — khâu tốn điện nhất', 'Vì lon nhôm tự biến thành nhôm mới', 'Vì nhôm tái chế nhẹ hơn'],
     khen:':) Chuẩn! Lon nhôm đã là kim loại rồi, chỉ cần nấu chảy, khỏi phải tách oxi ra bằng dòng điện.',
     giai:'Chưa đúng. Lon nhôm đã là kim loại, chỉ cần nấu chảy lại — không phải điện phân Al₂O₃, khâu tốn điện nhất.'},
    {hoi:'Vì sao người ta *không* luyện nhôm bằng khí CO như luyện sắt?',
     chon:['Nhôm hoạt động mạnh, CO không lấy được oxi của Al₂O₃', 'Vì nhôm quá nhẹ, bay mất theo khí', 'Vì khí CO đắt hơn điện'],
     khen:':) Giỏi lắm! Kim loại càng mạnh thì càng giữ chặt oxi, phải dùng điện mới tách ra được.',
     giai:'Không phải đâu. Nhôm hoạt động mạnh nên giữ oxi rất chặt; CO không khử nổi Al₂O₃, phải dùng dòng điện.'},
  ]},
  {nen:'home', ten:'Trên đường về', loi:[
    ':) Một ngày dài nhỉ! Trò để ý không: cả ba xưởng đều làm phản ứng hoá học, chỉ là *khổng lồ* hơn cốc của ta.',
    'Ba cách làm ra chất: *nhiệt phân* đá vôi, *khử* oxit sắt bằng CO, *điện phân* nhôm oxit nóng chảy. || nhiệt phân → CaO ; khử bằng CO → Fe ; điện phân → Al',
    'Kim loại càng *hoạt động mạnh* thì càng khó tách khỏi hợp chất, nên phải dùng cách "mạnh tay" hơn.',
    '@minh :) Cảm ơn em đã đến! Sau này làm kỹ sư hoá học thì về đây làm với anh nhé.',
    ':) Về tiệm thôi, mai còn bao nhiêu khách đang chờ đấy!',
  ]},
];

/* ---- người nói: giáo sư (mặc định), kỹ sư Minh (HD_CHARS[4] — Anh Minh), Bà Tư (khách 0, bộ đồ cổ điển) ---- */
const TQ_NGUOI = {prof:{ten:'Giáo sư Hoffmann', ben:'R', svg:() => profSVG('neutral')},
                  minh:{ten:'Kỹ sư Minh', ben:'L', svg:() => HD_CHARS[4]},
                  ba:{ten:'Bà Tư', ben:'L', svg:() => custSVG(0, 'neutral', 0)}};
/* ---- các chuyến đi: kịch bản + nhạc nền (SFX.music). Ngày trên lịch trỏ tới chuyến bằng DAYS[i].trip ---- */
const TRIPS = {
  giadung: {loi:THUC_TE_NHA, nhac:1},
  nhamay:  {loi:THAM_QUAN, nhac:2}
};
// một dòng kịch bản → {e, t, b} như bài giảng, thêm ai (người nói), s (số cảnh), q (câu hỏi đã xáo: {opts, ans, khen, giai})
function tqLine(x, s){
  if(typeof x !== 'string'){
    const opts = x.chon.map((t, k) => ({t, ok:!k})).sort(() => Math.random() - .5);
    return Object.assign(parseLesson(x.hoi), {ai:'prof', s, q:{opts, khen:parseLesson(x.khen), giai:parseLesson(x.giai)}});
  }
  // tiền tố ở đầu câu, thứ tự nào cũng được: @người (người nói), #vùng (vùng sáng lên trên hình cắt)
  let ai = 'prof', z = '', m;
  while((m = x.match(/^([@#])(\w+)\s*/))){ if(m[1] === '@') ai = m[2]; else z = m[2]; x = x.slice(m[0].length); }
  return Object.assign(parseLesson(x), {ai, z, s});
}

// ngày đi thực tế (playDay → startTrip): không có bài giảng trước, không có màn "Bắt đầu"
function startTrip(i){ showTrip(DAYS[i].trip, i); }

/* ---- màn tham quan: nền đổi theo cảnh (mờ dần sang cảnh mới), bảng thông tin góc trái chỉ hiện khi có ghi bảng,
   người nói đổi giữa giáo sư và kỹ sư; câu hỏi hiện các lựa chọn giữa màn, chọn xong mới đi tiếp được ---- */
function showTrip(key, dayI){
  const trip = TRIPS[key] || TRIPS.nhamay, SC = trip.loi;
  SFX.music(trip.nhac);
  const lines = SC.flatMap((sc, s) => sc.loi.map(x => tqLine(x, s)));
  const who = [...new Set(lines.map(L => L.ai))].filter(k => TQ_NGUOI[k]);   // chỉ dựng người có nói trong chuyến này
  const nQ = lines.filter(L => L.q).length;
  let correct = 0;
  G.innerHTML = `<div class="scene vnscene tqscene">
    <div class="tqbg"></div>
    <div class="tqcut"></div>
    <div class="vnboard empty"><div class="vnbtitle"></div><div class="vnbody"></div></div>
    <div class="vnbox"><div class="vnname"><span></span></div><p class="vntext"></p><div class="tqopts"></div></div>
    ${who.map(k => `<div class="vnprof tqchar tq${TQ_NGUOI[k].ben} off" data-ai="${k}"><div class="tqfig">${TQ_NGUOI[k].svg()}</div></div>`).join('')}
    <button class="btn vnskip">Về bản đồ ${ico('next')}</button></div>`;
  const root = G.querySelector('.tqscene'), bg = root.querySelector('.tqbg'), boardEl = root.querySelector('.vnboard'),
        title = root.querySelector('.vnbtitle'), body = root.querySelector('.vnbody'), name = root.querySelector('.vnname span'),
        optsEl = root.querySelector('.tqopts'), box = root.querySelector('.vnbox'), cut = root.querySelector('.tqcut');
  let scene = -1, nen = '', board = '';
  const answered = {};
  let fadeT = 0;   // hẹn làm mờ đáp án sau khi chọn — sang câu khác thì huỷ, kẻo mờ luôn đáp án câu hỏi sau
  const setScene = s => {
    if(s === scene) return;
    scene = s;
    const sc = SC[s];
    title.textContent = sc.ten;
    if(sc.nen !== nen){   // cùng nền (vd. bước vào xem hình cắt lò cao) thì giữ nguyên, không mờ dần lại
      nen = sc.nen;
      const layer = document.createElement('div');
      layer.innerHTML = TQ_NEN[nen]();
      bg.appendChild(layer);
      [...bg.children].slice(0, -1).forEach(old => setTimeout(() => old.remove(), 700));   // cảnh cũ nằm dưới cho tới khi cảnh mới hiện hẳn
    }
    cut.innerHTML = sc.hinhcat ? TQ_CAT[sc.hinhcat]() : '';
    cut.classList.toggle('show', !!sc.hinhcat);
    if(s) SFX.page();
  };
  // người nói bước ra (lần đầu nói thì mới xuất hiện, trượt vào từ phía mình đứng) và to lên; người kia lùi lại, mờ đi
  const setFace = (k, e) => {
    name.textContent = TQ_NGUOI[k].ten;
    root.querySelectorAll('.tqchar').forEach(c => {
      const me = c.dataset.ai === k;
      if(me) c.classList.remove('off');
      c.classList.toggle('speaking', me);
    });
    const who = root.querySelector('.tqchar[data-ai="' + k + '"]');
    who.querySelector('svg').dataset.exp = e;
    who.classList.remove('talk'); void who.offsetWidth; who.classList.add('talk');
  };
  const vn = vnRun(root, lines, {
    say: (k, L) => {
      setScene(L.s);
      setFace(L.ai, L.e);
      cut.classList.toggle('focus', !!L.z);
      cut.querySelectorAll('.cz, .czr').forEach(el => el.classList.toggle('on', !!L.z && el.dataset.z === L.z));
      // ghi bảng chỉ giữ trong một cảnh: sang xưởng mới thì bảng trống tới khi có câu ghi bảng mới
      const b = vnBoardAt(lines, k), keep = b && lines.findIndex((x, j) => j <= k && x.b === b && x.s === L.s) >= 0;
      const nb = keep ? b : '';
      if(nb !== board){ board = nb; boardEl.classList.toggle('empty', !nb); if(nb) vnWrite(body, nb); }
      clearTimeout(fadeT); optsEl.innerHTML = ''; optsEl.classList.remove('fade'); box.classList.remove('ask', 'opts');
      if(L.q && !answered[k]) setTimeout(() => ask(k, L), 200);
    },
    gate: k => !lines[k] || !lines[k].q || answered[k],   // k vượt câu cuối (nhấn Space lúc đang lật trang về lịch): cho qua
    end: () => {
      save.trips = (save.trips || 0) + 1; persist();
      // ngày đi thực tế: chấm sao theo số câu đúng, như minigame (mở ngày kế, ghi kỷ lục, thẻ kết quả)
      if(dayI != null) showResult(dayI, {total:nQ, correct, label:'Câu trả lời đúng'});
      else go(showMap);
    }
  });
  // câu hỏi: các lựa chọn xếp ở góc dưới bên phải của thẻ thoại, câu hỏi dồn sang trái; chọn xong tô đúng / sai, nhân vật nói lời khen hoặc giải thích
  const ask = (k, L) => {
    if(!root.isConnected) return;
    optsEl.innerHTML = L.q.opts.map((o, j) => `<button class="btn tqopt" data-j="${j}">${o.t}</button>`).join('');
    box.classList.add('ask', 'opts');   // ask: đang chờ chọn, ẩn dấu ▼ "bấm để tiếp"; opts: chừa góc phải cho đáp án
    optsEl.querySelectorAll('.tqopt').forEach(btn => btn.onclick = () => {
      if(answered[k]) return;
      answered[k] = true; box.classList.remove('ask');
      const o = L.q.opts[+btn.dataset.j], R = o.ok ? L.q.khen : L.q.giai;
      optsEl.querySelectorAll('.tqopt').forEach(x => {
        const ok = L.q.opts[+x.dataset.j].ok;
        x.classList.add(ok ? 'right' : x === btn ? 'wrong' : 'off');
        x.disabled = true;
      });
      if(o.ok) correct++;
      o.ok ? SFX.bell() : SFX.err();
      setFace(L.ai, R.e);
      vn.type(R.t);
      fadeT = setTimeout(() => { if(root.isConnected) optsEl.classList.add('fade'); }, 1600);
    });
    optsEl.classList.remove('fade');
  };
}

/* =====================  TRANH NỀN  =====================
   Mỗi cảnh là một SVG 1280×720 phủ kín màn (preserveAspectRatio slice — màn rộng / cao hơn thì cắt bớt mép), nét mực
   như phần còn lại của game. Thẻ thoại che dải dưới (y > 500), nhân vật đứng bên phải (x > 720), bảng thông tin ở góc
   trên trái — nên phần đáng xem dồn vào giữa và nửa trái, dưới y 500. Khói (tqsmoke) bay lên, lửa / gang lỏng (tqglow)
   chập chờn bằng CSS trong style.css. */
const TQ_INK = '#3b3025';
const tqS = (w = 3) => `stroke="${TQ_INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const tqSvg = inner => `<svg viewBox="0 0 1280 720" overflow="visible" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const tqSky = (id, top, bot) => `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="720"><stop offset="0" stop-color="${top}"/>`
  + `<stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-700" y="-500" width="2680" height="1720" fill="url(#${id})"/>`;
// cụm khói: mỗi búi là ba vòng tròn, bay lệch lên và nở ra; d = độ trễ (giây) để các búi nối đuôi nhau
const tqSmoke = (x, y, n = 3, col = '#e9e4da') => Array.from({length:n}, (_, k) =>
  `<g class="tqsmoke" style="animation-delay:${-k*6/n}s"><circle cx="${x}" cy="${y}" r="16" fill="${col}" ${tqS(2)}/>`
  + `<circle cx="${x+14}" cy="${y-8}" r="12" fill="${col}" ${tqS(2)}/><circle cx="${x-12}" cy="${y-6}" r="10" fill="${col}" ${tqS(2)}/></g>`).join('');
// bảng tên cắm cọc: chữ trên tấm gỗ nhỏ
const tqSign = (x, y, t, w = t.length*11 + 24) => `<g><path d="M${x},${y+30} L${x},${y+70}" ${tqS(4)}/>`
  + `<rect x="${x - w/2}" y="${y}" width="${w}" height="32" rx="4" fill="#fffdf5" ${tqS(2.5)}/>`
  + `<text x="${x}" y="${y+22}" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="18" fill="${TQ_INK}">${t}</text></g>`;
// dãy nhà xưởng mái răng cưa ở hậu cảnh: [x, rộng, cao]
const tqSheds = (list, base, fill, win) => list.map(([x, w, h]) => {
  const teeth = Math.max(2, Math.round(w/60)), tw = w/teeth;
  let roof = `M${x},${base-h}`;
  for(let k = 0; k < teeth; k++) roof += ` L${x + k*tw},${base-h-22} L${x + (k+1)*tw},${base-h}`;
  const wins = Array.from({length:Math.floor((w-20)/34)}, (_, k) => `<rect x="${x+16+k*34}" y="${base-h+18}" width="20" height="14" fill="${win}" ${tqS(1.5)}/>`).join('');
  return `<path d="${roof} L${x+w},${base} L${x},${base} Z" fill="${fill}" ${tqS(2.5)}/>${wins}`;
}).join('');
const tqChimney = (x, top, base, w = 26) => `<rect x="${x}" y="${top}" width="${w}" height="${base-top}" fill="#e6dcc6" ${tqS(2.5)}/>`
  + `<rect x="${x}" y="${top}" width="${w}" height="14" fill="#d9634f" ${tqS(2.5)}/><rect x="${x}" y="${top+30}" width="${w}" height="10" fill="#d9634f" ${tqS(2)}/>`;
// xe buýt đưa đón (nhìn ngang, mũi xe bên phải)
const tqBus = (x, y, moving) => `<g>${moving ? `<path d="M${x-60},${y+30} L${x-14},${y+30} M${x-80},${y+52} L${x-20},${y+52} M${x-50},${y+74} L${x-14},${y+74}" ${tqS(3)} opacity=".5"/>` : ''}
  <rect x="${x}" y="${y}" width="300" height="96" rx="18" fill="#e8b84b" ${tqS(3)}/>
  <rect x="${x}" y="${y+62}" width="300" height="12" fill="#d9634f" opacity=".85"/>
  ${[0,1,2,3].map(k => `<rect x="${x+18+k*58}" y="${y+14}" width="46" height="36" rx="5" fill="#cfe3e6" ${tqS(2)}/>`).join('')}
  <rect x="${x+254}" y="${y+14}" width="34" height="58" rx="5" fill="#cfe3e6" ${tqS(2)}/>
  <circle cx="${x+66}" cy="${y+96}" r="20" fill="#4a4238" ${tqS(3)}/><circle cx="${x+66}" cy="${y+96}" r="7" fill="#b9ab92"/>
  <circle cx="${x+236}" cy="${y+96}" r="20" fill="#4a4238" ${tqS(3)}/><circle cx="${x+236}" cy="${y+96}" r="7" fill="#b9ab92"/></g>`;

const TQ_NEN = {
  // cổng khu công nghiệp buổi sáng (sunset: cùng khung cảnh lúc hoàng hôn, xe đang chạy về)
  gate: (sunset) => tqSvg(
    (sunset ? tqSky('tqsk-h', '#f2a868', '#f6dcae') : tqSky('tqsk-g', '#bfe0e4', '#f3ead6'))
    + `<circle cx="1060" cy="${sunset ? 360 : 120}" r="48" fill="${sunset ? '#f39a5a' : '#f6d27a'}" ${tqS(2.5)}/>`
    + `<path d="M-700,400 L0,380 Q170,320 340,360 T690,345 T1020,355 T1280,330 L1980,350 L1980,470 L-700,470 Z" fill="${sunset ? '#c99a78' : '#c9d3b0'}" ${tqS(2)} opacity=".9"/>`
    + tqChimney(560, 190, 440) + tqSmoke(573, 172) + tqChimney(250, 230, 440, 22) + tqSmoke(261, 214, 2)
    + tqSheds([[40, 230, 70], [300, 200, 95], [520, 180, 60], [720, 260, 85], [1000, 280, 70]], 460, sunset ? '#d9c2a2' : '#e6dcc6', sunset ? '#f6d27a' : '#7fc4c9')
    + `<rect x="-710" y="460" width="2700" height="800" fill="${sunset ? '#b8a07e' : '#cdb894'}" ${tqS(2.5)}/>`
    + `<path d="M-710,488 L1990,488 L1990,560 L-710,560 Z" fill="#8c8478" ${tqS(2.5)}/>`
    + `<path d="M-700,524 L1980,524" stroke="#f3ead6" stroke-width="4" stroke-dasharray="44 30"/>`
    // cổng: hai trụ, biển tên vắt ngang
    + `<rect x="90" y="300" width="34" height="190" fill="#e6dcc6" ${tqS(3)}/><rect x="470" y="300" width="34" height="190" fill="#e6dcc6" ${tqS(3)}/>`
    + `<rect x="66" y="262" width="462" height="58" rx="6" fill="#2f6f73" ${tqS(3)}/>`
    + `<text x="297" y="301" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="30" fill="#fffdf5">KHU CÔNG NGHIỆP HOÁ CHẤT</text>`
    + (sunset
      ? tqBus(470, 400, true) + `<path d="M700,488 L700,330 Q700,316 714,316 L740,316" fill="none" ${tqS(3)}/><circle cx="742" cy="320" r="9" fill="#f6d27a" class="tqglow" ${tqS(2)}/>`
      : tqBus(540, 396) + `<path d="M490,420 L380,330" stroke="#d9634f" stroke-width="8" stroke-dasharray="22 14"/><circle cx="490" cy="420" r="7" fill="#e6dcc6" ${tqS(2)}/>`)),
  home: () => TQ_NEN.gate(true),
  // nhà Bà Tư buổi sáng: nhà mái ngói một tầng, hiên, chậu cây, cổng tre, phơi đồ bên hông
  nha: () => tqSvg(tqSky('tqsk-n', '#cfe6ea', '#f3ead6')
    + `<circle cx="1090" cy="110" r="44" fill="#f6d27a" ${tqS(2.5)}/>`
    + `<path d="M-700,430 Q200,400 600,420 T1980,410 L1980,470 L-700,470 Z" fill="#c9d3b0" ${tqS(2)}/>`
    + `<rect x="-710" y="462" width="2700" height="800" fill="#d9c7a4" ${tqS(2.5)}/>`
    // thân nhà, mái ngói đỏ, cửa gỗ, cửa sổ chấn song, bậc hiên
    + `<rect x="330" y="330" width="400" height="135" fill="#f3e6c8" ${tqS(3)}/>`
    + `<path d="M290,340 L530,262 L770,340 Z" fill="#c9634f" ${tqS(3)}/>`
    + Array.from({length:4}, (_, k) => `<path d="M${336 + k*50},${326 - k*16} L${724 - k*50},${326 - k*16}" ${tqS(1.6)} opacity=".35"/>`).join('')
    + `<rect x="492" y="368" width="76" height="97" rx="4" fill="#a97c4b" ${tqS(3)}/><circle cx="554" cy="420" r="5" fill="#f6d27a" ${tqS(1.5)}/>`
    + [[368, 366], [620, 366]].map(([x, y]) => `<rect x="${x}" y="${y}" width="76" height="58" fill="#bfe0e4" ${tqS(2.5)}/>`
        + [1, 2, 3].map(k => `<path d="M${x + k*19},${y} L${x + k*19},${y + 58}" ${tqS(2)}/>`).join('')).join('')
    + `<rect x="310" y="462" width="440" height="14" fill="#c9b48a" ${tqS(2.5)}/>`
    // chậu cây hai bên hiên
    + [[318, 462], [742, 462]].map(([x, y]) => `<path d="M${x - 22},${y} L${x - 16},${y - 40} L${x + 16},${y - 40} L${x + 22},${y} Z" fill="#c9845a" ${tqS(2.5)}/>`
        + `<path d="M${x},${y - 40} Q${x - 30},${y - 90} ${x - 6},${y - 110} M${x},${y - 40} Q${x + 26},${y - 84} ${x + 8},${y - 116} M${x},${y - 40} Q${x - 4},${y - 96} ${x},${y - 126}" fill="none" stroke="#6f9a5a" stroke-width="7" stroke-linecap="round"/>`).join('')
    // dây phơi đồ bên trái
    + `<path d="M40,300 L40,470 M250,290 L250,470" ${tqS(4)}/><path d="M40,312 Q145,336 250,302" fill="none" ${tqS(2)}/>`
    + `<path d="M80,320 l30,0 l4,46 l-38,0 Z" fill="#7fc4c9" ${tqS(2)}/><path d="M150,326 l34,-2 l2,38 l-38,2 Z" fill="#f2a868" ${tqS(2)}/>`
    + tqSign(810, 392, 'Nhà Bà Tư')),
  // gian bếp: tường gạch men, kệ hũ muối / đường, bếp gas lửa xanh, nồi, thớt, cửa sổ
  bep: () => tqSvg(`<rect x="-700" y="-500" width="2680" height="1720" fill="#efe3c6"/>`
    + Array.from({length:7}, (_, k) => `<path d="M-700,${150 + k*44} L1980,${150 + k*44}" stroke="#d9c7a4" stroke-width="2"/>`).join('')
    + `<rect x="80" y="70" width="200" height="140" fill="#bfe0e4" ${tqS(3)}/><path d="M180,70 L180,210 M80,140 L280,140" ${tqS(2.5)}/>`
    // mặt bếp
    + `<rect x="-710" y="380" width="2700" height="40" fill="#c9b48a" ${tqS(3)}/><rect x="-710" y="418" width="2700" height="800" fill="#b8956a" ${tqS(3)}/>`
    + [0, 1, 2, 3].map(k => `<rect x="${40 + k*170}" y="440" width="150" height="120" rx="6" fill="#a97c4b" ${tqS(2.5)}/><circle cx="${100 + k*170}" cy="500" r="5" fill="#f6d27a" ${tqS(1.5)}/>`).join('')
    // các hũ có nhãn đứng trên mặt bếp (phải bếp gas)
    + [['Muối', 650, '#fffdf5'], ['Đường', 730, '#fff6de'], ['Dầu', 810, '#f6d27a']].map(([t, x, c]) =>
        `<rect x="${x}" y="318" width="64" height="64" rx="10" fill="${c}" ${tqS(2.5)}/><rect x="${x - 4}" y="308" width="72" height="14" rx="4" fill="#c9845a" ${tqS(2)}/>`
        + `<text x="${x + 32}" y="360" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="16" fill="${TQ_INK}">${t}</text>`).join('')
    // bếp gas hai họng, lửa xanh, nồi chè
    + `<rect x="380" y="350" width="240" height="32" rx="8" fill="#4a4238" ${tqS(3)}/>`
    + [440, 560].map(x => `<path d="M${x - 24},350 Q${x - 18},330 ${x - 10},342 Q${x - 4},322 ${x},342 Q${x + 6},322 ${x + 12},342 Q${x + 18},330 ${x + 24},350 Z" fill="#6f9ec9" class="tqglow" ${tqS(2)}/>`).join('')
    + `<path d="M400,300 L480,300 L476,346 L404,346 Z" fill="#c9cdd2" ${tqS(3)}/><path d="M394,300 L486,300" ${tqS(4)}/>`
    + tqSmoke(440, 270, 3, '#f7f4ec')
    // con dao lốm đốm gỉ trên thớt, đặt dưới cửa sổ
    + `<rect x="40" y="356" width="120" height="26" rx="6" fill="#e9c79a" ${tqS(2.5)}/>`
    + `<path d="M52,352 L130,346 L134,356 L56,362 Z" fill="#c9cdd2" ${tqS(2)}/><circle cx="90" cy="352" r="3" fill="#a9653a"/><circle cx="108" cy="350" r="2.5" fill="#a9653a"/>`),
  // vườn sau nhà: hàng rào tre, luống rau, bao vôi bột, cây chanh, chùm bóng bay xa xa
  vuon: () => tqSvg(tqSky('tqsk-v', '#cfe6ea', '#eef3dc')
    + `<path d="M-700,360 Q300,330 700,350 T1980,340 L1980,470 L-700,470 Z" fill="#b9cf9a" ${tqS(2)}/>`
    + `<rect x="-710" y="440" width="2700" height="800" fill="#a98a62" ${tqS(2.5)}/>`
    + Array.from({length:22}, (_, k) => `<rect x="${-20 + k*40}" y="300" width="16" height="${80 + (k%3)*6}" rx="4" fill="#d9c27a" ${tqS(2)}/>`).join('')
    + `<path d="M-30,326 L900,326 M-30,356 L900,356" ${tqS(3)}/>`
    // luống rau
    + [[60, 470], [300, 480]].map(([x, y]) => `<path d="M${x},${y} Q${x + 110},${y - 30} ${x + 220},${y}" fill="#8a6238" ${tqS(2.5)}/>`
        + Array.from({length:6}, (_, k) => `<path d="M${x + 22 + k*34},${y - 10} q-10,-26 0,-34 q10,8 0,34 M${x + 22 + k*34},${y - 10} q14,-20 22,-18" fill="#7aa95c" ${tqS(2)}/>`).join('')).join('')
    // bao vôi bột, vôi rắc trắng trên luống
    + `<path d="M560,470 L548,392 Q600,376 652,392 L640,470 Z" fill="#f7f4ec" ${tqS(3)}/><text x="600" y="440" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="20" fill="${TQ_INK}">Vôi bột</text>`
    + Array.from({length:14}, (_, k) => `<circle cx="${320 + k*15}" cy="${468 - (k%3)*4}" r="3" fill="#fffdf5"/>`).join('')
    // cây chanh
    + `<path d="M120,330 L130,230" ${tqS(8)}/><circle cx="125" cy="200" r="70" fill="#7aa95c" ${tqS(3)}/>`
    + [[100, 190], [150, 172], [140, 228], [92, 236]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="9" fill="#d9e05a" ${tqS(2)}/>`).join('')
    // bóng bay xa xa
    + [[980, 70, '#d9634f'], [1016, 52, '#7fc4c9'], [1048, 78, '#f6d27a']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="22" fill="${c}" ${tqS(2)}/><path d="M${x},${y + 22} q-6,40 ${10 - (x % 20)},90" fill="none" ${tqS(1.5)}/>`).join('')),

  // lò vôi đứng: băng chuyền đá vôi lên miệng lò, lửa ở đáy, đống vôi sống trắng bên cạnh
  kiln: () => tqSvg(tqSky('tqsk-k', '#e2d6bc', '#f3ead6')
    + `<path d="M0,420 L80,330 L140,330 L140,300 L230,300 L230,420 Z M820,420 L820,320 L900,280 L980,320 L980,420 Z" fill="#d8ccb4"/>`
    + `<rect x="-710" y="462" width="2700" height="800" fill="#cdb894" ${tqS(2.5)}/>`
    // thân lò gạch, các hàng gạch, sàn và phễu trên đỉnh
    + `<path d="M520,470 L552,172 L688,172 L720,470 Z" fill="#c9845a" ${tqS(3)}/>`
    + Array.from({length:9}, (_, k) => { const y = 200 + k*30, d = (y - 172)*32/298; return `<path d="M${556 - d + 30},${y} L${684 + d - 30},${y}" ${tqS(1.6)} opacity=".35"/>`; }).join('')
    + `<rect x="532" y="150" width="176" height="24" fill="#8a6238" ${tqS(3)}/><path d="M592,150 L572,112 L668,112 L648,150" fill="#a97c4b" ${tqS(3)}/>`
    // vùng nung giữa thân lò (ô lửa), cửa tháo vôi ở đáy
    + `<rect x="590" y="296" width="60" height="52" rx="8" fill="#f39a3a" class="tqglow" ${tqS(3)}/><path d="M604,338 Q610,312 620,326 Q628,302 638,338" fill="#f6d27a" class="tqglow"/>`
    + `<path d="M592,446 L592,420 Q620,404 648,420 L648,446 Z" fill="#4a4238" ${tqS(3)}/>`
    + tqSmoke(620, 96, 4)
    // băng chuyền từ đống đá lên miệng lò, đá vôi nằm trên băng
    + `<path d="M170,450 L572,120 L590,138 L190,468 Z" fill="#6e5232" ${tqS(3)}/>`
    + [0.18, 0.36, 0.54, 0.72].map(t => `<circle cx="${180 + t*400}" cy="${459 - t*330}" r="10" fill="#b8b2a6" ${tqS(2)} transform="translate(0,-14)"/>`).join('')
    + `<path d="M190,468 L190,500 M380,312 L380,500 M560,140 L560,170" ${tqS(4)}/>`
    + [[110,452,26],[150,444,30],[196,456,22],[132,420,22],[175,418,20],[226,462,18]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.7}" fill="#b8b2a6" ${tqS(2.5)}/>`).join('')
    + `<path d="M538,480 Q566,432 620,428 Q674,432 702,480 Z" fill="#f7f4ec" ${tqS(3)}/>`
    + tqSign(140, 330, 'Đá vôi CaCO₃') + tqSign(470, 360, 'Vôi sống CaO')),

  // lò cao: ba tháp gió nóng bên trái, thân lò giữa, đường ray xe goòng lên đỉnh, gang lỏng chảy ra thùng
  blast: () => tqSvg(tqSky('tqsk-b', '#e3cfae', '#f0e4cc')
    + `<rect x="-710" y="462" width="2700" height="800" fill="#b9ab92" ${tqS(2.5)}/>`
    + [30, 98, 166].map(x => `<path d="M${x},462 L${x},236 Q${x+31},190 ${x+62},236 L${x+62},462 Z" fill="#c4bdb0" ${tqS(3)}/>`
      + `<path d="M${x},300 L${x+62},300 M${x},380 L${x+62},380" ${tqS(1.6)} opacity=".4"/>`).join('')
    + `<path d="M30,262 L540,262" stroke="${TQ_INK}" stroke-width="16" stroke-linecap="round"/><path d="M30,262 L540,262" stroke="#a29a8e" stroke-width="10" stroke-linecap="round"/>`
    // thân lò, chóp, ống dẫn khí
    + `<path d="M520,462 L540,300 L566,184 L654,184 L680,300 L700,462 Z" fill="#8f8a82" ${tqS(3)}/>`
    + `<path d="M540,300 L680,300 M552,236 L668,236" ${tqS(2)} opacity=".45"/>`
    + `<path d="M572,184 L586,124 L634,124 L648,184" fill="#a29a8e" ${tqS(3)}/>`
    + `<path d="M610,124 L610,70 Q610,52 628,52 L700,52" fill="none" stroke="${TQ_INK}" stroke-width="18" stroke-linecap="round"/><path d="M610,124 L610,70 Q610,52 628,52 L700,52" fill="none" stroke="#a29a8e" stroke-width="12" stroke-linecap="round"/>`
    + tqSmoke(700, 48, 3, '#d9d2c4')
    // đường ray xe goòng
    + `<path d="M300,462 L578,130 M326,462 L596,140" ${tqS(3)}/>` + [0.15, 0.35, 0.55, 0.75].map(t => `<path d="M${300 + t*278},${462 - t*332} L${326 + t*270},${462 - t*322}" ${tqS(2)}/>`).join('')
    + `<rect x="0" y="0" width="44" height="30" rx="4" fill="#6e5232" ${tqS(2.5)} transform="translate(468,268) rotate(-50)"/>`
    // lỗ ra gang, máng gang lỏng, thùng chứa trên xe
    + `<rect x="566" y="420" width="46" height="34" rx="6" fill="#f39a3a" class="tqglow" ${tqS(2.5)}/>`
    + `<path d="M566,452 Q480,452 420,440" fill="none" stroke="${TQ_INK}" stroke-width="16" stroke-linecap="round"/><path d="M566,452 Q480,452 420,440" fill="none" stroke="#f39a3a" stroke-width="10" stroke-linecap="round" class="tqglow"/>`
    + `<path d="M330,410 L420,410 L408,470 L342,470 Z" fill="#6e5232" ${tqS(3)}/><ellipse cx="375" cy="410" rx="45" ry="9" fill="#f6b04a" class="tqglow" ${tqS(2.5)}/>`
    + [[400,388],[430,376],[380,370],[452,396],[414,360]].map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#f6d27a" class="tqspark" style="animation-delay:${k*.3}s"/>`).join('')
    + tqSign(130, 150, 'Gió nóng') + tqSign(292, 340, 'Gang lỏng')),

  // nhà máy điện phân nhôm: xưởng dài, cầu trục trên cao, hàng bể điện phân với cực than treo, khe đỏ rực
  alu: () => tqSvg(tqSky('tqsk-a', '#e9dfc9', '#ddd0b4')
    + `<path d="M-710,96 L1990,96" ${tqS(4)}/>` + Array.from({length:28}, (_, k) => `<path d="M${k*96 - 672},96 L${k*96 - 624},20 L${k*96 - 576},96" fill="none" ${tqS(2)} opacity=".5"/>`).join('')
    + [80, 300, 520, 740, 960, 1180].map(x => `<rect x="${x-60}" y="118" width="120" height="150" rx="4" fill="#cfe3e6" ${tqS(2.5)}/><path d="M${x},118 L${x},268 M${x-60},193 L${x+60},193" ${tqS(2)}/>`).join('')
    + `<path d="M-710,300 L1990,300 L1990,1220 L-710,1220 Z" fill="#b9ab92" ${tqS(2.5)}/>`
    + [-200, 100, 400, 700, 1000, 1400].map(x => `<path d="M640,300 L${x},730" ${tqS(1.5)} opacity=".25"/>`).join('')
    // cầu trục
    + `<rect x="-710" y="70" width="2700" height="16" fill="#e8b84b" ${tqS(2.5)}/><rect x="380" y="84" width="90" height="34" fill="#e8b84b" ${tqS(2.5)}/>`
    + `<path d="M425,118 L425,170" ${tqS(2.5)}/><path d="M412,170 Q425,186 438,170" fill="none" ${tqS(3)}/>`
    // ba bể, xa dần về giữa: thân bể, khe chất nóng chảy, thanh dẫn điện và các cực dương bằng than
    + [[60, 384, 360, 92], [480, 350, 220, 64], [740, 328, 140, 44]].map(([x, y, w, h]) => {
        const n = Math.round(w/60), aw = w/(n*1.6);
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#6b6f73" ${tqS(3)}/>`
          + `<rect x="${x+10}" y="${y-8}" width="${w-20}" height="14" rx="6" fill="#f39a3a" class="tqglow" ${tqS(2)}/>`
          + `<path d="M${x-6},${y - h*.9} L${x+w+6},${y - h*.9}" stroke="${TQ_INK}" stroke-width="${h*.16}" stroke-linecap="round"/><path d="M${x-6},${y - h*.9} L${x+w+6},${y - h*.9}" stroke="#d9634f" stroke-width="${h*.09}" stroke-linecap="round"/>`
          + Array.from({length:n}, (_, k) => { const ax = x + 14 + k*(w-28)/n + (w-28)/n/2 - aw/2;
              return `<path d="M${ax + aw/2},${y - h*.9} L${ax + aw/2},${y - h*.45}" ${tqS(2.5)}/><rect x="${ax}" y="${y - h*.45}" width="${aw}" height="${h*.42}" fill="#3f3a36" ${tqS(2)}/>`; }).join('');
      }).join('')
    + `<text x="240" y="465" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="22" fill="#fffdf5">− cực âm (đáy bể)</text>`
    + `<text x="240" y="292" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="22" fill="${TQ_INK}">+ cực dương (than)</text>`
    + tqSign(590, 196, 'Al₂O₃ + criolit · ~950 °C', 250)),
};

/* =====================  HÌNH CẮT CHUYỂN ĐỘNG  =====================
   Bảng 600×440 phủ giữa màn khi cảnh có hinhcat. Lò cao: quặng (đỏ nâu), than cốc (đen), đá vôi (xám) rơi dần từ đỉnh;
   khí CO bốc lên từ chỗ than cháy, gặp quặng thì thành CO₂ bay ra đỉnh; gió nóng thổi vào hai bên; giọt sắt nhỏ xuống
   đáy thành gang, xỉ nổi trên gang, gang chảy ra ngoài. Hạt chuyển động bằng CSS (tqfall / tqrise, style.css) với
   --t thời gian, --d độ trễ (âm để mở ra là đã đang chạy), --dy quãng đường. Mỗi vùng trong TQ_VUNG có một chú thích
   (.cz) và một vòng khoanh (.czr) mang data-z — câu thoại #vùng làm sáng đúng vùng đó (showTrip). */
const TQ_VUNG = ['nap', 'chay', 'co', 'khu', 'gang', 'voi', 'xi'];
const TQ_CAT = {
  blast: () => {
    const F = 'font-family="Itim, Patrick Hand, sans-serif"';
    const T = (x, y, t, sz, b, anchor) => `<text x="${x}" y="${y}" ${F} font-size="${sz}"${b ? ' font-weight="bold"' : ''}${anchor ? ' text-anchor="' + anchor + '"' : ''} fill="${TQ_INK}">${t}</text>`;
    // chú thích: hộp 172×40 ở cột trái (x 10) hoặc phải (x 418), đường dẫn tới điểm (px, py) trong lò
    const note = (z, side, y, title, eq, px, py) => {
      const x = side === 'L' ? 10 : 418, ax = side === 'L' ? x + 172 : x;
      return `<g class="cz" data-z="${z}"><path d="M${ax},${y + 20} L${px},${py}" fill="none" ${tqS(1.5)}/><circle cx="${px}" cy="${py}" r="3.5" fill="${TQ_INK}"/>`
        + `<rect x="${x}" y="${y}" width="172" height="40" rx="5" fill="#fffdf5" ${tqS(2)}/>` + T(x + 8, y + 16, title, 12, true) + T(x + 8, y + 33, eq, 12.5) + '</g>';
    };
    const ring = (z, cy, rx, ry) => `<ellipse class="czr" data-z="${z}" cx="300" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#d9634f" stroke-width="3" stroke-dasharray="8 6"/>`;
    const anim = (t, d, dy) => `style="--t:${t}s;--d:${d}s;--dy:${dy}px"`;
    // hạt nạp liệu rơi từ đỉnh (y 62) xuống chỗ lò phình (y ~300) rồi tan: [x, loại, giây, trễ]; q quặng, c than cốc, v đá vôi
    const fall = [[262,'q',9,0],[300,'c',8,-1.5],[338,'v',10,-3],[280,'q',9.5,-4.5],[322,'c',8.5,-6],[270,'v',9,-7.2],
                  [312,'q',8,-2.4],[342,'c',9,-5.3],[290,'v',10,-8.1],[330,'q',9,-.8],[256,'c',9.5,-3.7],[305,'q',8.8,-6.9]];
    const grain = (x, k) => k === 'q' ? `<circle cx="${x}" cy="62" r="7" fill="#9b4a2f" ${tqS(1.5)}/>`
      : k === 'c' ? `<path d="M${x-7},62 L${x-2},55 L${x+6},57 L${x+7},64 L${x},69 L${x-6},67 Z" fill="#3b3025"/>`
      : `<rect x="${x-5}" y="57" width="10" height="9" rx="2" fill="#d8d2c6" ${tqS(1.5)}/>`;
    // khí bốc lên: CO từ chỗ than cháy lên tới vùng khử, CO₂ từ vùng khử ra đỉnh — [x, chữ, y đầu, quãng, giây, trễ]
    const gas = [[272,'CO',318,-150,5,0],[328,'CO',318,-150,5.5,-2],[300,'CO',318,-150,6,-3.8],[286,'CO',318,-150,5.2,-1.2],
                 [282,'CO₂',196,-140,5,-.6],[318,'CO₂',196,-140,5.5,-3.2],[300,'CO₂',196,-140,4.6,-1.9]];
    const bubble = ([x, t, y, dy, s, d]) => `<g class="tqrise" ${anim(s, d, dy)}><circle cx="${x}" cy="${y}" r="12" fill="${t === 'CO' ? '#dceff1' : '#ece7dd'}" ${tqS(1.5)}/>`
      + T(x, y + 4, t, 10, true, 'middle') + '</g>';
    // giọt sắt nhỏ từ vùng nóng chảy xuống đáy: [x, trễ]
    const drip = [[250,0],[290,-.6],[330,-1.1],[270,-1.5],[350,-.3],[310,-.9]].map(([x, d]) =>
      `<path class="tqfall" ${anim(1.8, d, 70)} d="M${x},300 Q${x+4},306 ${x},310 Q${x-4},306 ${x},300 Z" fill="#e5532d"/>`).join('');
    return `<svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="tqcut-hot" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="0" y2="400">
        <stop offset="0" stop-color="#f1e4c6"/><stop offset=".55" stop-color="#f6c27a"/><stop offset="1" stop-color="#ef7d3c"/></linearGradient>
        <clipPath id="tqcut-in"><path d="M245,50 L355,50 L405,250 L380,320 L380,400 L220,400 L220,320 L195,250 Z"/></clipPath></defs>
      <rect x="2" y="2" width="596" height="436" rx="10" fill="#fffdf5" ${tqS(3)}/>
      ${T(14, 26, 'Hình cắt lò cao', 16, true)}
      <path d="M262,40 L248,16 L352,16 L338,40" fill="#a97c4b" ${tqS(2.5)}/>
      <path d="M231,40 L369,40 L419,250 L394,320 L394,410 L206,410 L206,320 L181,250 Z" fill="#c9845a" ${tqS(3)}/>
      <path d="M245,50 L355,50 L405,250 L380,320 L380,400 L220,400 L220,320 L195,250 Z" fill="url(#tqcut-hot)" ${tqS(2.5)}/>
      <g clip-path="url(#tqcut-in)">
        ${fall.map(([x, k, s, d]) => `<g class="tqfall" ${anim(s, d, 238)}>${grain(x, k)}</g>`).join('')}
        ${gas.map(bubble).join('')}
        ${drip}
        <path d="M220,362 Q260,356 300,362 T380,362 L380,380 L220,380 Z" fill="#d9a24a" ${tqS(2)}/>
        <rect x="220" y="380" width="160" height="22" fill="#e5532d" class="tqglow"/>
        ${T(300, 375, 'xỉ', 11, true, 'middle')}${T(300, 396, 'gang lỏng', 11, true, 'middle')}
      </g>
      <path d="M186,333 L222,333" stroke="${TQ_INK}" stroke-width="14" stroke-linecap="round"/><path d="M186,333 L222,333" stroke="#a29a8e" stroke-width="8" stroke-linecap="round"/>
      <path d="M414,333 L378,333" stroke="${TQ_INK}" stroke-width="14" stroke-linecap="round"/><path d="M414,333 L378,333" stroke="#a29a8e" stroke-width="8" stroke-linecap="round"/>
      <path d="M226,333 L262,333 M374,333 L338,333" class="tqflow" stroke="#d9634f" stroke-width="3" fill="none"/>
      <path d="M380,392 L410,392 Q418,392 418,402 L418,432" fill="none" stroke="${TQ_INK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M380,392 L410,392 Q418,392 418,402 L418,432" fill="none" stroke="#f39a3a" stroke-width="5" stroke-linecap="round" class="tqglow"/>
      ${ring('nap', 66, 62, 20)}${ring('khu', 196, 88, 36)}${ring('voi', 234, 92, 26)}${ring('co', 290, 98, 24)}
      ${ring('chay', 333, 92, 16)}${ring('xi', 371, 88, 12)}${ring('gang', 391, 88, 12)}
      ${note('nap', 'R', 40, 'Nạp liệu ở đỉnh', 'quặng · than cốc · đá vôi', 338, 62)}
      ${note('khu', 'R', 150, 'Vùng khử quặng', 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', 380, 196)}
      ${note('xi', 'R', 300, 'Tạo xỉ', 'CaO + SiO₂ → CaSiO₃', 376, 370)}
      ${note('voi', 'L', 150, 'Đá vôi bị nhiệt phân', 'CaCO₃ → CaO + CO₂', 220, 232)}
      ${note('co', 'L', 222, 'Tạo khí CO', 'CO₂ + C → 2CO', 214, 288)}
      ${note('chay', 'L', 296, 'Than cháy · gió nóng', 'C + O₂ → CO₂', 222, 333)}
      ${note('gang', 'L', 372, 'Gang lỏng ở đáy', 'Fe + 2–5% C', 226, 391)}
    </svg>`;
  },
};
