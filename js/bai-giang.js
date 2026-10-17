/* =====================================================================
   BÀI GIẢNG — giáo sư Hoffmann giảng lý thuyết ở màn kiểu visual novel.
   Màn này hiện LẦN ĐẦU trò mở mỗi ngày, trước màn giới thiệu ngày.
   Sửa chữ ở đây là đủ, không cần đụng file khác.

   Cách sửa:
     • Mỗi ngày là một mảng [ ... ] các câu thoại, đúng thứ tự từ ngày 1 đến ngày 31.
       Bấm chuột / phím cách là sang câu kế. Nên giữ mỗi câu dưới khoảng 200 chữ cái.
     • *chữ*            → tô đậm, gạch dạ quang (dùng cho từ khoá).
     • Mở đầu bằng :)   → giáo sư cười;  mở đầu bằng :(  → giáo sư nghiêm (nhắc an toàn);
       không có gì      → mặt bình thường.
     • Thêm  || ...  ở cuối câu → phần sau || được viết lên BẢNG ĐEN và giữ ở đó tới khi
       một câu sau ghi cái khác. Muốn xuống dòng trên bảng thì ngăn bằng dấu chấm phẩy  ;
     • Muốn có dấu nháy đơn ' bên trong câu thì viết \'.
     • Đừng thêm hay xoá ngày: game có đúng 31 ngày (thêm / bớt câu trong một ngày thì thoải mái).
   ===================================================================== */
'use strict';

const BAI_GIANG = [
  // 1 · Ngày đầu tiên ở tiệm
  [
    ':) Chào trò! Trước khi mở tiệm, ta giảng nhanh một chút. Đừng lo, ta nói ngắn thôi.',
    'Hôm nay ta pha *dung dịch*. Dung dịch là hỗn hợp *đồng nhất* của *chất tan* và *dung môi*. || dung dịch = chất tan + dung môi',
    'Nước là dung môi quen thuộc nhất. Muối ăn, đường là chất tan: tan hết rồi thì trò không còn thấy hạt nào nữa.',
    'Mỗi chất tan được nhiều hay ít khác nhau, gọi là *độ tan*. Chất tan chậm mà không khuấy thì sẽ lắng dưới đáy cốc.',
    '*Khuấy*, *đun nóng* hay *nghiền nhỏ* chất rắn đều giúp nó tan nhanh hơn, vì các hạt chất tan được tiếp xúc với nước nhiều hơn. || khuấy ; đun nóng ; nghiền nhỏ',
    ':) Thế thôi! Giờ xem khách đặt gì nào.',
  ],
  // 2 · Khái niệm mol
  [
    'Nguyên tử, phân tử bé tới mức không ai đếm nổi từng hạt. Nên nhà hoá học đếm theo *mol*.',
    '1 mol là lượng chất chứa *6,022 × 10²³* hạt. Con số khổng lồ này gọi là *số Avogadro*. || 1 mol = 6,022 × 10²³ hạt',
    'Giống như "1 tá" là 12 cái: 1 mol đường có 6,022 × 10²³ phân tử đường, 1 mol nước cũng có ngần ấy phân tử nước.',
    'Khối lượng của 1 mol chất là *khối lượng mol* M, tính bằng gam/mol. Ví dụ M của NaCl = 23 + 35,5 = 58,5 g/mol. || M(NaCl) = 58,5 g/mol',
    'Muốn đổi khối lượng ra số mol thì chia cho M: 5,85 g muối ăn chính là 0,1 mol. || n = m : M',
    ':) Ở tiệm ta, mỗi lần nghiêng lọ là đúng 0,1 mol, trò chỉ cần đếm thôi!',
  ],
  // 3 · Nguyên tử hay phân tử?
  [
    '*Nguyên tử* là hạt vô cùng nhỏ, trung hoà về điện. Nó gồm *hạt nhân* mang điện dương và *vỏ electron* mang điện âm.',
    'Hạt nhân chứa *proton* (mang điện dương) và *neutron* (không mang điện). Số proton bằng số electron nên nguyên tử trung hoà. || số p = số e',
    'Các nguyên tử có cùng số proton thuộc cùng một *nguyên tố hoá học*, có kí hiệu riêng: Fe là sắt, Cu là đồng, O là oxi.',
    'Các nguyên tử liên kết với nhau thành *phân tử*, hạt đại diện cho chất. Phân tử oxi gồm 2 nguyên tử O, viết là O₂.',
    '*Đơn chất* tạo nên từ một nguyên tố (O₂, N₂, Fe…). *Hợp chất* tạo nên từ hai nguyên tố trở lên (H₂O, CO₂…). || đơn chất: O₂, N₂, Fe ; hợp chất: H₂O, CO₂',
    'Với kim loại như sắt, đồng, các nguyên tử xếp sát nhau, nên ta coi mỗi *nguyên tử* là hạt đại diện của chất.',
  ],
  // 4 · Hoá trị
  [
    '*Hoá trị* là con số biểu thị khả năng liên kết của nguyên tử nguyên tố này với nguyên tử nguyên tố khác.',
    'Người ta lấy H làm mốc: H có hoá trị I. Còn O luôn có hoá trị II. Hoá trị viết bằng số La Mã: I, II, III… || H: I ; O: II',
    ':) *Quy tắc hoá trị*: trong hợp chất AₓBᵧ, hoá trị của A nhân chỉ số x bằng hoá trị của B nhân chỉ số y. || a · x = b · y',
    'Ví dụ nhôm hoá trị III với oxi hoá trị II: III · x = II · y, chọn x = 2, y = 3, ta được Al₂O₃. || III · 2 = II · 3 → Al₂O₃',
    '*Nhóm nguyên tử* cũng có hoá trị và được coi như một nguyên tố: −OH (I), −NO₃ (I), =SO₄ (II), =CO₃ (II), ≡PO₄ (III).',
    'Vài nguyên tố có nhiều hoá trị: Fe là II hoặc III, S là II, IV hoặc VI, N từ I tới V. Đọc kĩ đề xem câu dùng hoá trị nào nhé!',
  ],
  // 5 · Cân bằng phương trình hoá học
  [
    '*Phản ứng hoá học* là quá trình biến đổi chất này thành chất khác. Chất ban đầu là *chất tham gia*, chất mới sinh ra là *sản phẩm*.',
    'Trong phản ứng chỉ có *liên kết* giữa các nguyên tử thay đổi. Số nguyên tử của mỗi nguyên tố vẫn giữ nguyên.',
    'Vì thế tổng khối lượng các chất tham gia bằng tổng khối lượng các sản phẩm: *định luật bảo toàn khối lượng*. || m(tham gia) = m(sản phẩm)',
    '*Phương trình hoá học* gồm công thức các chất và *hệ số* đứng trước. Hiđro cháy trong oxi: || 2H₂ + O₂ → 2H₂O',
    ':( Cân bằng là thêm *hệ số* cho số nguyên tử hai vế bằng nhau. Tuyệt đối *không sửa chỉ số* trong công thức: H₂O mãi là H₂O!',
    ':) Mẹo: cân nguyên tố xuất hiện ít lần trước, để H và O sau cùng. Và luôn chọn bộ hệ số *nhỏ nhất*.',
  ],
  // 6 · Oxi gặp kim loại và phi kim
  [
    '*Oxi* là chất khí không màu, không mùi, ít tan trong nước, nặng hơn không khí một chút. Nó chiếm khoảng 21% thể tích không khí.',
    'Oxi *duy trì sự cháy*: que đóm còn tàn đỏ đưa vào lọ oxi sẽ bùng cháy sáng.',
    'Kim loại cháy trong oxi tạo oxit. Magie cháy sáng chói: || 2Mg + O₂ —t°→ 2MgO',
    'Sắt cháy toé sáng như pháo hoa, tạo *oxit sắt từ*: || 3Fe + 2O₂ —t°→ Fe₃O₄',
    'Phi kim cháy trong oxi cũng tạo oxit: than ra khí CO₂, lưu huỳnh cháy lửa xanh lam ra SO₂, photpho tạo khói trắng P₂O₅. || C + O₂ —t°→ CO₂ ; S + O₂ —t°→ SO₂ ; 4P + 5O₂ —t°→ 2P₂O₅',
    '*Oxit* là hợp chất của hai nguyên tố, trong đó có một nguyên tố là oxi. Nhớ kĩ định nghĩa này nhé, các chương sau dùng hoài!',
  ],
  // 7 · Luyện tập chương 1
  [
    ':) Hết chương 1 rồi! Ta ôn thật nhanh trước bài kiểm tra.',
    'Dung dịch gồm chất tan và dung môi. Khuấy hay đun nóng giúp chất tan nhanh hơn.',
    '1 mol chứa 6,022 × 10²³ hạt. Đổi khối lượng ra số mol thì chia cho khối lượng mol. || n = m : M',
    'Phản ứng chỉ đổi liên kết, không đổi số nguyên tử, nên phương trình phải được cân bằng.',
    'Kim loại hay phi kim cháy trong oxi đều tạo oxit. || 2Mg + O₂ → 2MgO ; C + O₂ → CO₂',
    ':) Thế là đủ hành trang rồi. Cố lên!',
  ],
  // 8 · Hiđro — chất khử cừ khôi
  [
    '*Hiđro* là chất khí nhẹ nhất trong mọi chất khí: không màu, không mùi, rất ít tan trong nước.',
    'Hiđro cháy trong oxi cho nước và toả rất nhiều nhiệt. || 2H₂ + O₂ —t°→ 2H₂O',
    ':( Hỗn hợp hiđro và oxi gặp lửa sẽ *nổ* mạnh. Vì vậy phải thử độ tinh khiết của hiđro trước khi đốt.',
    'Khi nung nóng, hiđro lấy oxi của một số oxit kim loại để giải phóng kim loại. Bột CuO màu đen hoá thành đồng màu đỏ. || CuO + H₂ —t°→ Cu + H₂O',
    'Sắt(III) oxit cũng bị hiđro lấy mất oxi như vậy. Ta nói hiđro có *tính khử*. || Fe₂O₃ + 3H₂ —t°→ 2Fe + 3H₂O',
  ],
  // 9 · Điều chế hiđro
  [
    'Trong phòng thí nghiệm, ta điều chế hiđro bằng cách cho *kim loại* tác dụng với *axit* như HCl hoặc H₂SO₄ loãng.',
    'Sản phẩm là *muối* và khí hiđro. || kim loại + axit → muối + H₂↑ ; Zn + 2HCl → ZnCl₂ + H₂↑',
    'Chỉ kim loại đứng trước H trong *dãy hoạt động hoá học* mới đẩy được hiđro ra khỏi axit: Mg, Al, Zn, Fe thì được, Cu thì không. || Mg Al Zn Fe … H … Cu Ag',
    'Sắt tác dụng với axit HCl chỉ cho muối sắt(II). || Fe + 2HCl → FeCl₂ + H₂↑',
    'Hiđro rất ít tan trong nước nên thu được bằng cách *đẩy nước*. Nó nhẹ hơn không khí nên cũng thu được bằng bình *úp ngược*.',
    ':) Khí mà không hứng là bay mất, nên nhớ chuẩn bị bình thu trước nhé!',
  ],
  // 10 · Ai là chất khử?
  [
    'Hôm nay ta học hai khái niệm luôn đi liền nhau: *sự oxi hoá* và *sự khử*.',
    '*Sự oxi hoá* là sự tác dụng của một chất với oxi: chất đó nhận thêm oxi. *Sự khử* là sự tách oxi ra khỏi hợp chất.',
    'Trong phản ứng này, H₂ chiếm oxi nên H₂ bị oxi hoá; CuO mất oxi nên CuO bị khử. || CuO + H₂ → Cu + H₂O',
    '*Chất khử* là chất chiếm oxi của chất khác, ở đây là H₂. *Chất oxi hoá* là chất nhường oxi, ở đây là CuO. || chất khử: H₂ ; chất oxi hoá: CuO',
    'Sự oxi hoá và sự khử luôn xảy ra *cùng lúc* trong một phản ứng, gọi là *phản ứng oxi hoá – khử*.',
    ':) Mẹo nhớ: chất khử đi "khử" oxi khỏi chất khác. Nó là kẻ cướp oxi!',
  ],
  // 11 · Nước — hợp chất kỳ diệu
  [
    '*Nước* là hợp chất tạo bởi hiđro và oxi. Chúng hoá hợp với nhau theo tỉ lệ thể tích khí 2 : 1. || H₂O ; V(H₂) : V(O₂) = 2 : 1',
    'Nước là chất lỏng không màu, sôi ở 100 °C và hoà tan được rất nhiều chất. Nó là dung môi quan trọng nhất.',
    'Nước tác dụng với kim loại mạnh như natri, kali ngay ở nhiệt độ thường, tạo bazơ và khí hiđro. || 2Na + 2H₂O → 2NaOH + H₂↑',
    ':( Natri phản ứng rất mãnh liệt, chỉ được dùng mẩu nhỏ bằng hạt đỗ thôi!',
    'Nước còn tác dụng với một số oxit bazơ như vôi sống, tạo bazơ và toả nhiều nhiệt. || CaO + H₂O → Ca(OH)₂',
    'Dung dịch bazơ làm *quỳ tím hoá xanh*. Mai ta học kĩ hơn về quỳ tím.',
  ],
  // 12 · Axit hay bazơ? — Thám tử quỳ tím
  [
    '*Axit* là hợp chất có một hay nhiều nguyên tử H liên kết với *gốc axit*. Ví dụ: HCl, H₂SO₄, HNO₃.',
    '*Bazơ* là hợp chất có nguyên tử kim loại liên kết với một hay nhiều nhóm *hiđroxit* (−OH). Ví dụ: NaOH, Ca(OH)₂.',
    '*Quỳ tím* là chất chỉ thị màu: axit làm quỳ hoá *đỏ*, dung dịch bazơ làm quỳ hoá *xanh*, chất trung tính giữ nguyên màu tím. || axit → đỏ ; bazơ → xanh ; trung tính → tím',
    'Phân biệt hai axit thì dùng thuốc thử tạo kết tủa: BaCl₂ cho kết tủa trắng với gốc =SO₄, AgNO₃ cho kết tủa trắng với gốc −Cl. || BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl ; AgNO₃ + HCl → AgCl↓ + HNO₃',
    'Na₂CO₃ gặp axit thì sủi bọt khí CO₂. || Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
    ':) Nhớ ghi lại hiện tượng của từng mẫu. Thám tử giỏi là thám tử ghi chép cẩn thận!',
  ],
  // 13 · Oxit gặp nước
  [
    'Oxit chia làm hai loại chính: *oxit bazơ* và *oxit axit*.',
    '*Oxit bazơ* thường là oxit của kim loại và ứng với một bazơ: CaO ứng với Ca(OH)₂, Na₂O ứng với NaOH.',
    'Vài oxit bazơ như Na₂O, K₂O, CaO, BaO tác dụng với nước tạo dung dịch bazơ. || Na₂O + H₂O → 2NaOH',
    '*Oxit axit* thường là oxit của phi kim và ứng với một axit: SO₃ ứng với H₂SO₄, P₂O₅ ứng với H₃PO₄.',
    'Nhiều oxit axit tác dụng với nước tạo axit. || P₂O₅ + 3H₂O → 2H₃PO₄',
    ':) Muốn biết sản phẩm là axit hay bazơ? Nhúng quỳ tím vào là rõ ngay!',
  ],
  // 14 · Luyện tập chương 2
  [
    ':) Ôn chương 2 nào: hiđro, nước, axit và bazơ.',
    'Điều chế hiđro: kim loại đứng trước H tác dụng với axit, cho muối và khí H₂. || Zn + 2HCl → ZnCl₂ + H₂↑',
    'Hiđro khử được oxit kim loại khi nung nóng: CuO đen hoá thành Cu đỏ. || CuO + H₂ —t°→ Cu + H₂O',
    'Oxit bazơ gặp nước ra bazơ, oxit axit gặp nước ra axit. || CaO + H₂O → Ca(OH)₂',
    'Oxit bazơ còn tan trong axit, cho muối và nước. CuO tan trong HCl cho dung dịch màu xanh. || CuO + 2HCl → CuCl₂ + H₂O',
    'Quỳ tím: axit hoá đỏ, bazơ hoá xanh. Thử quỳ để kiểm tra sản phẩm là một thói quen tốt.',
  ],
  // 15 · Tính chất của axit
  [
    'Phân tử axit nào cũng có H và gốc axit, nên các axit có những *tính chất hoá học chung*.',
    'Thứ nhất, axit làm quỳ tím hoá đỏ.',
    'Thứ hai, axit tác dụng với kim loại đứng trước H, cho muối và khí hiđro. || Fe + H₂SO₄ → FeSO₄ + H₂↑',
    'Thứ ba, axit tác dụng với oxit bazơ, cho muối và nước. || CuO + H₂SO₄ → CuSO₄ + H₂O',
    'Thứ tư, axit tác dụng với bazơ, cho muối và nước. Đó là phản ứng trung hoà, ta học kĩ ở ngày 19.',
    ':( Quy tắc vàng khi pha loãng axit sunfuric: rót *từ từ axit vào nước*, không bao giờ làm ngược lại, kẻo nước sôi bùng làm axit bắn ra ngoài!',
  ],
  // 16 · Tính chất của bazơ
  [
    'Bazơ chia làm hai loại: *bazơ tan*, còn gọi là *kiềm* (NaOH, KOH, Ca(OH)₂, Ba(OH)₂), và *bazơ không tan* (Cu(OH)₂, Fe(OH)₃…).',
    'Dung dịch kiềm làm quỳ tím hoá xanh, và làm *phenolphtalein* không màu hoá *hồng*.',
    'Dung dịch kiềm tác dụng với dung dịch muối có thể tạo bazơ không tan. Cu(OH)₂ kết tủa màu xanh lam: || CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
    'Còn Fe(OH)₃ kết tủa màu *nâu đỏ*. || FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',
    'Bazơ không tan bị nhiệt *phân huỷ* thành oxit và nước. || Cu(OH)₂ —t°→ CuO + H₂O',
    ':) Ngoài ra, bazơ tác dụng với axit, và kiềm tác dụng với oxit axit, đều cho muối và nước.',
  ],
  // 17 · Phân loại chất
  [
    'Hôm nay ta xếp các hợp chất vô cơ vào bốn "họ": *oxit, axit, bazơ, muối*.',
    '*Oxit*: hai nguyên tố, trong đó có oxi. Ví dụ CaO, CO₂, Fe₂O₃. || oxit = nguyên tố + O',
    '*Axit*: H liên kết với gốc axit, như HCl, H₂SO₄. *Bazơ*: kim loại liên kết với nhóm OH, như NaOH, Cu(OH)₂. || axit = H + gốc axit ; bazơ = kim loại + OH',
    '*Muối*: kim loại liên kết với gốc axit. Ví dụ NaCl, CuSO₄, Na₂CO₃. || muối = kim loại + gốc axit',
    ':( Cẩn thận với chữ H! NaHCO₃ có H nhưng bắt đầu bằng kim loại Na, nên nó vẫn là *muối*, gọi là muối axit.',
    ':) Nhìn đầu và đuôi công thức là đoán được họ ngay!',
  ],
  // 18 · Axit mạnh: H₂SO₄ & HNO₃
  [
    'H₂SO₄ và HNO₃ là hai *axit mạnh*, dùng rất nhiều trong công nghiệp: làm phân bón, chất tẩy rửa, phẩm nhuộm…',
    'H₂SO₄ có *hai* nguyên tử H, nên một phân tử trung hoà được hai phân tử NaOH. || H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    'HNO₃ chỉ có một nguyên tử H, nên trộn tỉ lệ 1 : 1. || HNO₃ + NaOH → NaNO₃ + H₂O',
    ':( H₂SO₄ đặc rất *háo nước*: nó hút nước mạnh tới mức làm đường hoá thành than. Dính vào da là bỏng nặng!',
    'Nhận biết gốc sunfat: nhỏ dung dịch BaCl₂ vào, thấy kết tủa trắng BaSO₄ không tan trong axit. || BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl',
  ],
  // 19 · Muối (1) — con của axit và bazơ
  [
    'Khi axit gặp bazơ, H của axit kết hợp với OH của bazơ thành nước. Đó là *phản ứng trung hoà*. || axit + bazơ → muối + nước',
    'Phần còn lại, kim loại của bazơ ghép với gốc axit, chính là *muối*. || HCl + NaOH → NaCl + H₂O',
    'Tên muối = tên kim loại + tên gốc axit: NaCl là natri clorua, K₂SO₄ là kali sunfat, NaNO₃ là natri nitrat.',
    'Trộn đúng tỉ lệ thì dung dịch thu được trung tính, quỳ tím không đổi màu. Dư axit thì quỳ hoá đỏ, dư bazơ thì quỳ hoá xanh.',
    ':) Muối ăn trong bếp nhà trò cũng có thể làm ra từ một axit và một bazơ đấy!',
  ],
  // 20 · Muối (2) — trao đổi và kết tủa
  [
    '*Phản ứng trao đổi* là phản ứng trong đó hai hợp chất trao đổi với nhau thành phần cấu tạo, tạo ra hai hợp chất mới. || AB + CD → AD + CB',
    'Hai dung dịch muối có thể trao đổi với nhau: AgNO₃ gặp NaCl tạo kết tủa trắng AgCl. || AgNO₃ + NaCl → AgCl↓ + NaNO₃',
    ':( Nhớ điều kiện: phản ứng trao đổi trong dung dịch chỉ xảy ra khi sản phẩm có *chất kết tủa*, *chất khí* hoặc *nước*.',
    'Một ví dụ nữa, cũng kết tủa trắng: || BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
    'Muốn biết chất nào kết tủa thì tra *bảng tính tan*: AgCl, BaSO₄, CaCO₃… là những chất không tan.',
    ':) Lọc lấy kết tủa xong, nước lọc vẫn còn muối tan bên trong. Đừng bỏ phí!',
  ],
  // 21 · Luyện tập chương 3
  [
    ':) Ôn chương 3: axit, bazơ và muối.',
    'Axit tác dụng với kim loại cho muối và H₂; tác dụng với oxit bazơ cho muối và nước.',
    'Axit tác dụng với bazơ cho muối và nước. Nhớ H₂SO₄ cần gấp đôi NaOH! || H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    'Kiềm tác dụng với muối có thể tạo bazơ không tan: Cu(OH)₂ xanh lam. || CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
    'Muối tác dụng với muối khi tạo được kết tủa: AgCl, BaSO₄ đều màu trắng.',
    ':) Đọc kĩ đơn, viết phương trình trong đầu, rồi mới rót nhé!',
  ],
  // 22 · Nhôm — kim loại quốc dân
  [
    '*Nhôm* là kim loại nhẹ, màu trắng bạc, dẫn điện và dẫn nhiệt tốt. Người ta dùng nó làm dây điện, nồi niêu, thân máy bay.',
    'Nhôm có hoá trị III nên phương trình hay có hệ số "lẻ". Nhôm tác dụng với axit: || 2Al + 6HCl → 2AlCl₃ + 3H₂↑',
    'Nhôm cháy trong khí clo cũng tạo ra nhôm clorua. || 2Al + 3Cl₂ —t°→ 2AlCl₃',
    'Để ngoài không khí, nhôm được phủ một lớp *nhôm oxit* Al₂O₃ mỏng mà bền, bảo vệ nhôm không bị ăn mòn tiếp. || 4Al + 3O₂ → 2Al₂O₃',
    ':) Nhôm còn tan được trong dung dịch kiềm, một tính chất đặc biệt mà sắt không có.',
  ],
  // 23 · Sắt — hoá trị II và III
  [
    '*Sắt* là kim loại màu trắng xám, có *tính nhiễm từ*: bị nam châm hút.',
    'Sắt có hai hoá trị là *II* và *III*. Chất phản ứng với nó quyết định sắt lên hoá trị nào. || Fe(II) ; Fe(III)',
    'Với axit HCl hay H₂SO₄ loãng, sắt chỉ lên hoá trị II. || Fe + 2HCl → FeCl₂ + H₂↑',
    'Với khí clo, một chất oxi hoá mạnh, sắt lên hẳn hoá trị III. || 2Fe + 3Cl₂ —t°→ 2FeCl₃',
    'Cháy trong oxi, sắt cho oxit sắt từ Fe₃O₄, trong đó có cả sắt(II) lẫn sắt(III).',
    'Sắt hoạt động mạnh hơn đồng nên đẩy được đồng ra khỏi dung dịch muối. || Fe + CuSO₄ → FeSO₄ + Cu',
  ],
  // 24 · Bảng tuần hoàn — bản đồ nguyên tố
  [
    '*Bảng tuần hoàn* xếp các nguyên tố theo chiều tăng dần *điện tích hạt nhân*, tức số hiệu nguyên tử Z.',
    'Mỗi ô cho biết số hiệu nguyên tử, kí hiệu, tên và nguyên tử khối. Số hiệu nguyên tử bằng số proton và bằng số electron. || Z = số p = số e',
    '*Chu kì* là hàng ngang: các nguyên tố cùng chu kì có cùng *số lớp electron*. Số thứ tự chu kì bằng số lớp. || chu kì = số lớp e',
    '*Nhóm* là cột dọc: nguyên tố nhóm A có số electron lớp ngoài cùng bằng số thứ tự nhóm, nên tính chất giống nhau. || nhóm A = số e lớp ngoài cùng',
    'Trong một chu kì, đi từ trái sang phải: tính kim loại giảm, tính phi kim tăng, nguyên tử nhỏ dần.',
    'Trong một nhóm A, đi từ trên xuống dưới: tính kim loại tăng, nguyên tử to dần.',
  ],
  // 25 · Halogen — khí clo vàng lục
  [
    '*Halogen* là nhóm VIIA gồm F, Cl, Br, I. Tên này có nghĩa là "sinh ra muối".',
    '*Clo* là chất khí màu vàng lục, mùi hắc và *rất độc*. || Cl₂',
    ':( Làm việc với clo thì phải bật *tủ hút* và tránh hít phải khí!',
    'Clo tác dụng với hầu hết kim loại, tạo muối clorua. || 2Na + Cl₂ —t°→ 2NaCl ; Cu + Cl₂ —t°→ CuCl₂',
    'Clo tác dụng với hiđro khi đốt nóng hoặc có ánh sáng, tạo khí hiđro clorua. Khí này tan vào nước thành axit clohiđric. || H₂ + Cl₂ —t°→ 2HCl',
    ':) Clo còn tan một phần trong nước, tạo nước clo có tính tẩy màu. Người ta dùng nó để khử trùng nước máy.',
  ],
  // 26 · Nitơ — khí trơ mà quý
  [
    '*Nitơ* chiếm khoảng 78% thể tích không khí. Nó là khí không màu, không mùi và không duy trì sự cháy.',
    'Hai nguyên tử N trong phân tử N₂ liên kết với nhau rất bền, nên ở nhiệt độ thường nitơ gần như trơ.',
    'Ở nhiệt độ cao, áp suất cao và có chất xúc tác, nitơ kết hợp với hiđro tạo *amoniac*. || N₂ + 3H₂ ⇌ 2NH₃',
    'Mũi tên hai chiều ⇌ nghĩa là phản ứng *thuận nghịch*: xảy ra theo cả hai chiều cùng lúc.',
    'Amoniac là khí mùi khai, tan rất nhiều trong nước. Dung dịch của nó có tính bazơ yếu, làm quỳ tím hoá xanh.',
    ':) NH₃ gặp khí HCl tạo khói trắng amoni clorua, một loại phân đạm. || NH₃ + HCl → NH₄Cl',
  ],
  // 27 · Cacbon — từ than đến đá vôi
  [
    '*Cacbon* có nhiều dạng: kim cương cứng nhất, than chì mềm làm ruột bút chì, than gỗ xốp hút được chất màu, chất khí.',
    'Cacbon cháy trong oxi tạo khí CO₂ và toả nhiều nhiệt, vì thế than được dùng làm nhiên liệu. || C + O₂ —t°→ CO₂',
    'Ở nhiệt độ cao, cacbon *khử* được oxit của nhiều kim loại. Đó là bí quyết luyện kim từ nghìn năm trước. || 2CuO + C —t°→ 2Cu + CO₂↑',
    'Đá vôi CaCO₃ bị nung nóng thì phân huỷ thành vôi sống và khí CO₂. || CaCO₃ —t°→ CaO + CO₂↑',
    'Muối cacbonat gặp axit thì giải phóng khí CO₂: nhỏ axit lên đá vôi là thấy sủi bọt. || CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
    ':) Muốn nhận biết CO₂ thì sục vào nước vôi trong, thấy vẩn đục là đúng nó. || CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O',
  ],
  // 28 · Luyện tập lớn — Lễ hội hoá học
  [
    ':) Hôm nay là ngày lớn! Ta ôn thật nhanh cả chặng đường nhé.',
    'Chương 1: dung dịch, mol, hoá trị, cân bằng phương trình và oxi.',
    'Chương 2: hiđro khử oxit, điều chế hiđro, nước, quỳ tím.',
    'Chương 3: axit, bazơ, muối; phản ứng trung hoà và phản ứng trao đổi tạo kết tủa.',
    'Chương 4: nhôm, sắt, bảng tuần hoàn, clo, nitơ và cacbon.',
    'Mỗi đơn hôm nay đều quen cả. Hỏi xem chất cần làm thuộc họ nào, rồi chọn phản ứng đưa nó tới đó. Ví dụ làm Na₂CO₃: || CO₂ + 2NaOH → Na₂CO₃ + H₂O',
  ],
  // 29 · Điện phân — tách chất bằng điện
  [
    '*Điện phân* là dùng dòng điện một chiều để gây ra phản ứng hoá học không tự xảy ra.',
    'Dòng điện đi vào dung dịch qua hai điện cực: *cực âm* và *cực dương*. || cực âm (−) ; cực dương (+)',
    'Điện phân nước (có pha thêm chút chất để nước dẫn điện): khí H₂ thoát ra ở cực âm, khí O₂ ở cực dương. || 2H₂O —đp→ 2H₂↑ + O₂↑',
    'Thể tích H₂ thu được gấp đôi O₂, đúng bằng tỉ lệ hệ số 2 : 1 trong phương trình!',
    'Điện phân dung dịch CuCl₂ thì đồng bám vào cực âm, khí clo thoát ra ở cực dương. || CuCl₂ —đp→ Cu + Cl₂↑',
    ':) Công nghiệp dùng điện phân để sản xuất nhôm, natri, clo, xút và để mạ kim loại.',
  ],
  // 30 · Thuốc tím — nhà máy oxi tí hon
  [
    '*Thuốc tím* KMnO₄ là chất rắn màu tím đen, tan trong nước cho dung dịch màu tím, thường dùng để sát trùng.',
    'Khi đun nóng, KMnO₄ bị *phân huỷ* và giải phóng khí oxi. Đây là cách điều chế oxi trong phòng thí nghiệm. || 2KMnO₄ —t°→ K₂MnO₄ + MnO₂ + O₂↑',
    '*Phản ứng phân huỷ*: một chất sinh ra hai hay nhiều chất mới. Ngược lại, *phản ứng hoá hợp* tạo một chất mới từ hai hay nhiều chất. || phân huỷ: A → B + C ; hoá hợp: A + B → C',
    'Oxi nặng hơn không khí nên thu bằng bình đặt *ngửa*. Oxi ít tan trong nước nên cũng thu được bằng cách đẩy nước.',
    ':) Thử lọ đầy oxi chưa: đưa que đóm còn tàn đỏ vào miệng lọ, que bùng cháy là đầy. Rồi đốt đồng trong đó: || 2Cu + O₂ —t°→ 2CuO',
  ],
  // 31 · Chuỗi phản ứng — Nối mắt xích
  [
    ':) Ngày cuối rồi! *Chuỗi phản ứng* là các phản ứng nối tiếp nhau: sản phẩm của bước trước là chất tham gia của bước sau.',
    'Ví dụ một chuỗi quen thuộc của đồng: || Cu → CuO → CuCl₂ → Cu(OH)₂ → CuO',
    'Từng bước một: đốt đồng trong oxi, hoà oxit vào axit, thêm kiềm cho kết tủa, rồi nung kết tủa. || kim loại → oxit → muối → bazơ → oxit',
    'Cách giải: nhìn chất ở hai đầu mỗi mũi tên, tự hỏi "chất này thuộc họ nào, phản ứng nào đưa nó sang họ kia?".',
    'Chiều ngược lại, từ oxit kim loại về kim loại thì cần chất khử như H₂ hay C. || CuO + H₂ —t°→ Cu + H₂O',
    ':) Trò đã đi hết 31 ngày rồi. Ta tin trò làm được!',
  ],
];
