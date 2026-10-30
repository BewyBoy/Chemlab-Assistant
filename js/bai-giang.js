/* =====================================================================
   BÀI GIẢNG — giáo sư Hoffmann giảng lý thuyết ở màn kiểu visual novel.
   Màn này hiện LẦN ĐẦU trò mở mỗi ngày, rồi mới vào chơi.
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
     • BAI_GIANG_KHO (cuối file): bài giảng riêng khi bật Chế độ khó, chỉ cho những ngày chế độ khó
       có kiến thức mới (tự cân đong theo gam / ml / lít, ion, sơ đồ Lewis, bảng tuần hoàn đầy đủ).
       Ngày không có ở đó thì chế độ khó dùng bài giảng thường. Cùng cách viết như trên.
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

/* Bài giảng chế độ khó: số bên trái là ngày (1 → 31). Ngày minigame chỉ ghi ở đây khi minigame đó có bài khó riêng
   (ngày 3 tạo ion, ngày 4 sơ đồ Lewis, ngày 24 bảng tuần hoàn đầy đủ) — khoi-dong.js kiểm tra. */
const BAI_GIANG_KHO = {
  // 2 · Khái niệm mol — từ đây phiếu ghi gam / lít
  2: [
    ':) Chế độ khó! Từ giờ phiếu hàng ghi *gam* (chất rắn) hay *lít* (chất khí) chứ không ghi số mol. Lọ cũng không tự rót 0,1 mol nữa: trò tự *cân*, tự *đong*.',
    'Cầu nối giữa gam và mol là *khối lượng mol* M: cộng nguyên tử khối của mọi nguyên tử trong công thức. || M(NaCl) = 23 + 35,5 = 58,5 g/mol',
    'Chỉ số cho biết có mấy nguyên tử, nên nhân trước rồi mới cộng. Đường saccarozơ: || M(C₁₂H₂₂O₁₁) = 12·12 + 22·1 + 11·16 = 342 g/mol',
    'Có ngoặc thì nhân cả nhóm trong ngoặc: Ca(OH)₂ có 1 Ca, 2 O và 2 H. || M(Ca(OH)₂) = 40 + 2·(16 + 1) = 74 g/mol',
    'Ba đại lượng m, n, M luôn đi cùng nhau: biết hai là ra cái thứ ba. || n = m : M ; m = n · M',
    'Ví dụ: 34,2 g đường là 34,2 : 342 = 0,1 mol. Còn 0,3 mol muối ăn nặng 0,3 · 58,5 = 17,55 g. || 34,2 g đường = 0,1 mol ; 0,3 mol NaCl = 17,55 g',
    ':) Hôm nay khách đặt đúng chất có sẵn trên kệ, nên chỉ cần cân đúng số gam trên phiếu. Bảng nguyên tử khối nằm ở nút *Công thức* trên thanh trên cùng. Lệch dưới 5% là khách vẫn nhận.',
  ],
  // 3 · Tạo ion
  3: [
    'Chế độ khó: hôm nay ta nhìn kĩ *vỏ electron*. Electron xếp thành từng *lớp* quanh hạt nhân: lớp thứ nhất chứa tối đa 2 electron, lớp thứ hai tối đa 8. || lớp 1: tối đa 2 e ; lớp 2: tối đa 8 e',
    'Ví dụ natri có 11 electron: lớp 1 có 2, lớp 2 có 8, lớp ngoài cùng chỉ còn 1. || Na (11 e): 2, 8, 1',
    'Electron lớp trong bị hạt nhân giữ rất chặt. Chỉ *electron lớp ngoài cùng* mới nhường đi hay nhận thêm được.',
    'Các *khí hiếm* như Ne, Ar rất bền vì lớp ngoài cùng đã đủ 8 electron (He chỉ có một lớp, đủ 2). Nguyên tử khác đều "muốn" giống chúng. || bền như khí hiếm: lớp ngoài đủ 8 e (He: 2 e)',
    '*Kim loại* có 1, 2 hoặc 3 electron lớp ngoài thì *nhường* hết. Mất electron mang điện âm, nguyên tử thành *ion dương*. || Na → Na⁺ + 1e ; Mg → Mg²⁺ + 2e',
    '*Phi kim* có 5, 6 hoặc 7 electron lớp ngoài thì *nhận* thêm cho đủ 8, thành *ion âm*. || Cl + 1e → Cl⁻ ; O + 2e → O²⁻',
    'Điện tích của ion bằng số electron đã nhường hay nhận: Al có 3 electron lớp ngoài nên thành Al³⁺; N có 5 nên nhận thêm 3, thành N³⁻. || Al³⁺ ; N³⁻',
    ':) Trên màn chơi: bấm hay kéo chấm lớp ngoài ra xa để *nhường*; bấm hay kéo electron tự do vào nguyên tử để *nhận*. Đề không nói làm gì, trò tự xét rồi bấm Kiểm tra!',
  ],
  // 4 · Sơ đồ Lewis và liên kết
  4: [
    'Chế độ khó: hôm nay ta xem các nguyên tử *liên kết* với nhau ra sao, bằng *sơ đồ Lewis*: quanh kí hiệu nguyên tố là các chấm, mỗi chấm là một electron lớp ngoài cùng. || sơ đồ Lewis: mỗi chấm = 1 e lớp ngoài',
    'Như bài tạo ion: nguyên tử nào cũng muốn có 8 electron lớp ngoài như khí hiếm, riêng H chỉ cần 2 như He.',
    'Hai *phi kim* không ai chịu nhường, nên *góp chung*: mỗi bên góp một electron thành một *cặp electron dùng chung*. Đó là *liên kết cộng hoá trị*, vẽ bằng một gạch. || H − Cl ; H − O − H',
    ':) Thì ra *hoá trị* chính là số cặp electron dùng chung! H hoá trị I nên có một gạch, O hoá trị II nên có hai gạch.',
    'Góp chung hai cặp là *liên kết đôi*, ba cặp là *liên kết ba*. N₂ có liên kết ba nên rất bền. || O = C = O ; N ≡ N',
    '*Kim loại* gặp phi kim thì *nhường hẳn* electron: kim loại thành ion dương, phi kim thành ion âm, hai ion trái dấu hút nhau. Đó là *liên kết ion*. || Na⁺ Cl⁻ ; Mg²⁺ O²⁻',
    'Số nguyên tử mỗi loại do số electron quyết định: Mg nhường 2 mà mỗi Cl chỉ nhận 1, nên cần 2 Cl. || MgCl₂ = Mg²⁺ + 2Cl⁻',
    ':) Trên màn chơi: hai phi kim thì kéo nối hai chấm đứng một mình (có quầng vàng); có kim loại thì kéo electron của kim loại thả sang phi kim. Đề chỉ ghi tên chất, trò tự tính cần mấy nguyên tử nhé!',
  ],
  // 6 · Chất khí và tính theo phương trình
  6: [
    'Chế độ khó: hôm nay có *chất khí*. Khí nhẹ tênh, khó cân, nên người ta đo khí bằng *thể tích*, tính bằng lít.',
    'Ở cùng nhiệt độ và áp suất, 1 mol khí nào cũng chiếm thể tích như nhau. Ở *điều kiện chuẩn* (đkc: 25 °C, 1 bar), thể tích đó là *24,79 lít*. || 1 mol khí (đkc) = 24,79 lít ; V = n · 24,79',
    'Vậy 0,1 mol O₂ chiếm 2,479 lít, 0,1 mol CO₂ cũng 2,479 lít, dù CO₂ nặng hơn nhiều. || 0,1 mol O₂ = 0,1 mol CO₂ = 2,479 lít',
    'Bí quyết *tính theo phương trình*: hệ số chính là tỉ lệ số mol các chất. || 2Mg + O₂ —t°→ 2MgO ; 2 mol : 1 mol : 2 mol',
    'Khách đặt 8 g MgO. M(MgO) = 40 nên đó là 0,2 mol. Theo hệ số, cần 0,2 mol Mg và 0,1 mol O₂. || 8 g MgO = 0,2 mol ; Mg: 0,2 · 24 = 4,8 g ; O₂: 0,1 · 24,79 = 2,479 lít',
    'Tóm lại ba bước: đổi lượng khách cần ra mol, nhìn hệ số suy ra mol từng chất phải lấy, rồi đổi ra gam (chất rắn) hay lít (chất khí). || ra mol → nhìn hệ số → ra gam / lít',
    ':( Lấy dư một chất thì phần dư nằm lại, lẫn vào hàng. Tính cho *vừa đủ* nhé!',
  ],
  // 9 · Dung dịch axit và nồng độ mol
  9: [
    'Chế độ khó: axit HCl trên kệ là *dung dịch*, không cân được. Trò phải đong bằng *ống đong*, tính bằng ml.',
    'Nhãn lọ ghi *nồng độ mol* Cₘ: số mol chất tan trong 1 lít dung dịch, đơn vị mol/l, viết tắt là M. || Cₘ = n : V',
    'Lọ HCl hôm nay ghi *2M*: mỗi lít dung dịch có 2 mol HCl. Muốn lấy n mol thì đong V = n : Cₘ lít. || V = n : Cₘ',
    ':( Nhớ đổi lít ra ml: 1 lít = 1000 ml. 0,2 mol HCl cần 0,2 : 2 = 0,1 lít, tức là 100 ml. || 0,2 mol HCl = 0,1 lít = 100 ml (dd 2M)',
    'Ví dụ khách đặt 2,479 lít H₂, tức 0,1 mol: cần 0,1 mol Zn và 0,2 mol HCl. || Zn + 2HCl → ZnCl₂ + H₂↑ ; Zn: 0,1 · 65 = 6,5 g ; HCl: 0,2 mol = 100 ml',
    ':) Nút *Công thức* trên thanh trên cùng có ghi nồng độ của từng lọ dung dịch hôm nay.',
  ],
  // 18 · Axit hai nấc
  18: [
    'Chế độ khó: H₂SO₄, HNO₃, NaOH, KOH trên kệ đều là dung dịch *1M*. Cùng nồng độ, nhưng lượng cần đong chưa chắc bằng nhau.',
    'Một phân tử H₂SO₄ có *hai* H nên cần *hai* NaOH. Hai lọ cùng 1M, nên thể tích NaOH cũng phải gấp đôi. || H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O ; 100 ml H₂SO₄ 1M + 200 ml NaOH 1M',
    'HNO₃ chỉ có một H nên trộn 1 : 1, cả theo mol lẫn theo thể tích. || HNO₃ + KOH → KNO₃ + H₂O ; 100 ml + 100 ml',
    'Khách đặt 14,2 g Na₂SO₄? M = 2·23 + 32 + 4·16 = 142, tức 0,1 mol. Cần 0,1 mol H₂SO₄ (100 ml) và 0,2 mol NaOH (200 ml). || M(Na₂SO₄) = 142 g/mol',
    ':) Đếm số H của axit trước khi đong là không bao giờ lệch!',
  ],
  // 19 · Trung hoà vừa đủ, chất dư
  19: [
    'Chế độ khó: HCl trên kệ là dung dịch *2M*, còn NaOH và KOH là *1M*. Nồng độ khác nhau thì cùng số mol mà thể tích khác nhau.',
    'HCl và NaOH phản ứng 1 : 1 *theo mol*. 0,1 mol HCl chỉ là 50 ml dung dịch 2M, còn 0,1 mol NaOH là 100 ml dung dịch 1M. || HCl + NaOH → NaCl + H₂O ; 50 ml HCl 2M + 100 ml NaOH 1M',
    '*Vừa đủ* là hai chất hết cùng lúc. Chất còn thừa gọi là *chất dư*. Chất hết trước quyết định có bao nhiêu sản phẩm. || chất hết trước → quyết định lượng sản phẩm',
    'Lỡ trộn 0,2 mol HCl với 0,1 mol NaOH: chỉ 0,1 mol HCl phản ứng, ra 0,1 mol NaCl, còn dư 0,1 mol HCl. Quỳ tím hoá đỏ là biết dư axit. || 0,2 HCl + 0,1 NaOH → 0,1 NaCl, dư 0,1 HCl',
    ':( Hàng lẫn chất dư thì khách trả lại. Tính trước, đong sau!',
  ],
  // 22 · Nhôm: hệ số lẻ
  22: [
    'Chế độ khó: nhôm hoá trị III nên phương trình có hệ số "lẻ". Tính theo phương trình phải thật cẩn thận.',
    'Đọc hệ số: 2 mol Al cần 6 mol HCl và cho 3 mol H₂. || 2Al + 6HCl → 2AlCl₃ + 3H₂↑ ; 2 : 6 : 2 : 3',
    'Khách đặt 7,437 lít H₂, tức 7,437 : 24,79 = 0,3 mol. Theo tỉ lệ 2 : 6 : 3, cần 0,2 mol Al và 0,6 mol HCl. || Al: 0,2 · 27 = 5,4 g ; HCl: 0,6 : 2 = 0,3 lít = 300 ml',
    'Đốt trong clo cũng vậy: 2 mol Al cần 3 mol Cl₂. Muốn 26,7 g AlCl₃ (M = 133,5, tức 0,2 mol) thì cần 0,2 mol Al và 0,3 mol Cl₂. || 2Al + 3Cl₂ —t°→ 2AlCl₃ ; Cl₂: 0,3 · 24,79 = 7,437 lít',
    ':) Mẹo: viết số mol chất khách cần lên trước, rồi nhân chia theo hệ số từng chất một.',
  ],
  // 24 · Bảng tuần hoàn đầy đủ
  24: [
    'Chế độ khó: mỗi ô bảng tuần hoàn ghi thêm *độ âm điện* χ (số tím cạnh kí hiệu) và *cấu hình electron* (dòng dưới cùng). Không có kính lúp đâu nhé.',
    'Hạt nhân gồm proton và *neutron*. Electron nhẹ không đáng kể, nên nguyên tử khối gần bằng số proton cộng số neutron. || nguyên tử khối ≈ số p + số n ; Na: 23 = 11 + 12',
    '*Cấu hình electron* cho biết electron nằm ở đâu: số đứng đầu là *lớp*, chữ cái là *phân lớp*, số mũ là số electron. || O: 1s² 2s² 2p⁴',
    'Từ chu kì 3 có cách viết gọn: phần giống hệt một khí hiếm thì ghi kí hiệu khí hiếm đó trong ngoặc vuông. || Na: 1s² 2s² 2p⁶ 3s¹ = [Ne] 3s¹',
    '*Độ âm điện* χ là sức hút electron của nguyên tử khi liên kết. Cùng chu kì, sang phải thì tăng; cùng nhóm, đi xuống thì giảm. Flo hút mạnh nhất. || chu kì: sang phải χ tăng ; nhóm: đi xuống χ giảm',
    'Hiệu độ âm điện Δχ của hai nguyên tử cho biết *loại liên kết*. || Δχ ≥ 1,7: liên kết ion ; 0,4 ≤ Δχ < 1,7: cộng hoá trị có cực ; Δχ < 0,4: cộng hoá trị không cực',
    'Ví dụ NaCl: 3,16 − 0,93 = 2,23, liên kết ion. HCl: 3,16 − 2,20 = 0,96, cộng hoá trị có cực. Cl₂: hai nguyên tử như nhau, Δχ = 0, không cực.',
    ':) Kim loại dễ nhường, phi kim dễ nhận electron để có lớp ngoài giống khí hiếm, như bài tạo ion. Soi kĩ từng ô rồi hẵng trả lời!',
  ],
  // 26 · Tỉ lệ thể tích khí
  26: [
    'Chế độ khó: hôm nay N₂, H₂, NH₃ đều là *khí*, nên trò đong phần lớn bằng lít.',
    'Cùng điều kiện, thể tích khí tỉ lệ với số mol. Vậy với chất khí, hệ số phương trình cũng là *tỉ lệ thể tích*! || N₂ + 3H₂ ⇌ 2NH₃ ; 1 lít : 3 lít : 2 lít',
    'Muốn 4,958 lít NH₃ thì lấy 2,479 lít N₂ và 7,437 lít H₂: chỉ cần nhân theo hệ số, chẳng phải đổi ra mol. || 2,479 lít N₂ + 7,437 lít H₂ → 4,958 lít NH₃',
    ':) Trong nhà máy thật, phản ứng thuận nghịch không bao giờ chạy hết. Còn ở tiệm ta, coi như chạy hết.',
    'NH₃ gặp axit HCl (dung dịch 2M) tạo muối amoni clorua, M = 53,5. Khách đặt 5,35 g là 0,1 mol: cần 2,479 lít NH₃ và 50 ml HCl. || NH₃ + HCl → NH₄Cl ; 0,1 mol NH₄Cl = 5,35 g',
  ],
};
