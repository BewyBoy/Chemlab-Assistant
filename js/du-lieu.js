/* =====================================================================
   DỮ LIỆU — hoá chất (CHEMS), khách, 31 ngày (DAYS), thành tựu, "Bạn có biết?",
   cùng mấy hàm định dạng dùng khắp nơi (sub, amt, eqStr). Nạp sau loi-thoai.js, nhan-vat.js, phan-ung.js.
   ===================================================================== */
'use strict';

// Dev mode TẮT mặc định (kể cả khi mở bằng file:// hay localhost) — bản đóng gói phải
// khoá ngày đúng như người chơi thật thấy. Cần mở lại thì thêm #dev vào cuối URL.
let DEBUG = location.hash === '#dev';   // khoi-dong.js bật/tắt được bằng mật khẩu benben1304 / Esc ×3

/* =====================  DATA  ===================== */
// state s: r=rắn, l=lỏng, k=khí, d=dung dịch. sol: soluble (stays in solution).
// a: acid (quỳ đỏ), b: base (quỳ xanh). c: display color.
// slb: độ tan thực tế (g/100g nước, ~20°C) cho chất rắn tan — chỉ để so với NaCl xem có cần khuấy không (xem SLOW_DISSOLVE).
const CHEMS = {
 'H2O':      {n:'Nước',                          s:'l', c:'#cfe6f2', sol:1},
 'NaCl':     {n:'Muối ăn (natri clorua)',        s:'r', c:'#f4f2ec', sol:1, slb:36},
 'C12H22O11':{n:'Đường (saccarozơ)',             s:'r', c:'#f7ead2', sol:1, slb:204},
 'HCl':      {n:'Axit clohiđric',                s:'d', c:'#e9f2d8', sol:1, a:1},
 'H2SO4':    {n:'Axit sunfuric',                 s:'d', c:'#f0ecd2', sol:1, a:1},
 'HNO3':     {n:'Axit nitric',                   s:'d', c:'#f0ecd2', sol:1, a:1},
 'H3PO4':    {n:'Axit photphoric',               s:'d', c:'#f0ecd2', sol:1, a:1},
 'NaOH':     {n:'Natri hiđroxit (xút)',          s:'d', c:'#ddeef4', sol:1, b:1},
 'KOH':      {n:'Kali hiđroxit',                 s:'d', c:'#ddeef4', sol:1, b:1},
 'Ca(OH)2':  {n:'Canxi hiđroxit (nước vôi trong)',s:'d',c:'#e6f0ea', sol:1, b:1},
 'Na':       {n:'Natri (kim loại)',              s:'r', c:'#d8d8cc'},
 'K':        {n:'Kali (kim loại)',               s:'r', c:'#d8d8cc'},
 'Mg':       {n:'Magie',                         s:'r', c:'#ccd2d8'},
 'Al':       {n:'Nhôm',                          s:'r', c:'#ccd2d8'},
 'Zn':       {n:'Kẽm',                           s:'r', c:'#aab1b8'},
 'Fe':       {n:'Sắt',                           s:'r', c:'#8a8d90'},
 'Cu':       {n:'Đồng',                          s:'r', c:'#c96f33'},
 'Ag':       {n:'Bạc',                           s:'r', c:'#d5d9de'},
 'S':        {n:'Lưu huỳnh',                     s:'r', c:'#e8d44d'},
 'P':        {n:'Photpho đỏ',                    s:'r', c:'#c0574a'},
 'C':        {n:'Cacbon (than)',                 s:'r', c:'#3a3a3a'},
 'O2':       {n:'Khí oxi',                       s:'k', c:'#dbeefc'},
 'H2':       {n:'Khí hiđro',                     s:'k', c:'#eef6fb'},
 'CO2':      {n:'Khí cacbonic',                  s:'k', c:'#e3e8ec'},
 'SO2':      {n:'Khí sunfurơ',                   s:'k', c:'#eae4d0'},
 'KCl':      {n:'Kali clorua',                   s:'r', c:'#f4f2ec', sol:1, slb:34},
 'CaCl2':    {n:'Canxi clorua',                  s:'r', c:'#f4f2ec', sol:1, slb:74},
 'MgCl2':    {n:'Magie clorua',                  s:'r', c:'#f4f2ec', sol:1, slb:54},
 'AlCl3':    {n:'Nhôm clorua',                   s:'r', c:'#f4f2ec', sol:1, slb:46},
 'ZnCl2':    {n:'Kẽm clorua',                    s:'r', c:'#f4f2ec', sol:1, slb:432},
 'FeCl2':    {n:'Sắt(II) clorua',                s:'r', c:'#bcd6b4', sol:1, slb:64},
 'FeCl3':    {n:'Sắt(III) clorua',               s:'r', c:'#d19a4f', sol:1, slb:92},
 'CuCl2':    {n:'Đồng(II) clorua',               s:'r', c:'#7fc4c9', sol:1, slb:76},
 'BaCl2':    {n:'Bari clorua',                   s:'r', c:'#f4f2ec', sol:1, slb:35.7},
 'Na2SO4':   {n:'Natri sunfat',                  s:'r', c:'#f4f2ec', sol:1, slb:19.5},
 'K2SO4':    {n:'Kali sunfat',                   s:'r', c:'#f4f2ec', sol:1, slb:12},
 'MgSO4':    {n:'Magie sunfat',                  s:'r', c:'#f4f2ec', sol:1, slb:35.5},
 'ZnSO4':    {n:'Kẽm sunfat',                    s:'r', c:'#f4f2ec', sol:1, slb:54},
 'FeSO4':    {n:'Sắt(II) sunfat',                s:'r', c:'#bcd6b4', sol:1, slb:26.5},
 'CuSO4':    {n:'Đồng(II) sunfat',               s:'r', c:'#5b9bd5', sol:1, slb:32},
 'BaSO4':    {n:'Bari sunfat (kết tủa trắng)',   s:'r', c:'#f7f7f0'},
 'NaNO3':    {n:'Natri nitrat',                  s:'r', c:'#f4f2ec', sol:1, slb:88},
 'AgNO3':    {n:'Bạc nitrat',                    s:'r', c:'#f4f2ec', sol:1, slb:122},
 'Cu(NO3)2': {n:'Đồng(II) nitrat',               s:'r', c:'#6aaede', sol:1, slb:138},
 'AgCl':     {n:'Bạc clorua (kết tủa trắng)',    s:'r', c:'#f5f4ee'},
 'Na2CO3':   {n:'Natri cacbonat (sô-đa)',        s:'r', c:'#f4f2ec', sol:1, slb:21.5},
 'NaHCO3':   {n:'Natri hiđrocacbonat',           s:'r', c:'#f4f2ec', sol:1, slb:9.6},
 'CaCO3':    {n:'Canxi cacbonat (đá vôi)',       s:'r', c:'#efece3'},
 'BaCO3':    {n:'Bari cacbonat (kết tủa trắng)', s:'r', c:'#f7f7f0'},
 'MgO':      {n:'Magie oxit',                    s:'r', c:'#f2f0ea'},
 'CuO':      {n:'Đồng(II) oxit (đen)',           s:'r', c:'#33322f'},
 'ZnO':      {n:'Kẽm oxit',                      s:'r', c:'#f2f0ea'},
 'Fe2O3':    {n:'Sắt(III) oxit (đỏ nâu)',        s:'r', c:'#b5502a'},
 'Fe3O4':    {n:'Oxit sắt từ (đen)',             s:'r', c:'#2f2f38'},
 'CaO':      {n:'Canxi oxit (vôi sống)',         s:'r', c:'#f2f0ea'},
 'Na2O':     {n:'Natri oxit',                    s:'r', c:'#f2f0ea'},
 'P2O5':     {n:'Điphotpho pentaoxit',           s:'r', c:'#f5f5ee'},
 'Cu(OH)2':  {n:'Đồng(II) hiđroxit (xanh lam)',  s:'r', c:'#4f9fd8'},
 'Fe(OH)3':  {n:'Sắt(III) hiđroxit (nâu đỏ)',    s:'r', c:'#a34e26'},
 'Fe(OH)2':  {n:'Sắt(II) hiđroxit (trắng xanh)', s:'r', c:'#9fb8a8'},
 // chương 4-5: halogen, nitơ, thuốc tím
 'Cl2':      {n:'Khí clo (vàng lục, độc)',       s:'k', c:'#c3d465'},
 'N2':       {n:'Khí nitơ (trơ)',                s:'k', c:'#e8edf2'},
 'NH3':      {n:'Khí amoniac (mùi khai)',        s:'k', c:'#dfe8d8', b:1},
 'NH4Cl':    {n:'Amoni clorua',                  s:'r', c:'#f6f4ee', sol:1, slb:37},
 'KMnO4':    {n:'Kali pemanganat (thuốc tím)',   s:'r', c:'#7d2b8b', sol:1, slb:6.4},
 'K2MnO4':   {n:'Kali manganat (xanh lục)',      s:'r', c:'#2f6b4f', sol:1, slb:20},
 'MnO2':     {n:'Mangan đioxit (đen)',           s:'r', c:'#2b2b2b'},
 // chất mới, sinh ra từ các phản ứng bổ sung trong phan-ung.js
 'MnCl2':    {n:'Mangan(II) clorua',             s:'r', c:'#f6ece8', sol:1, slb:72},
 'K2O':      {n:'Kali oxit',                     s:'r', c:'#f2f0ea'},
 'K2CO3':    {n:'Kali cacbonat',                 s:'r', c:'#f4f2ec', sol:1, slb:112},
 'KNO3':     {n:'Kali nitrat (diêm tiêu)',       s:'r', c:'#f4f2ec', sol:1, slb:31.6},
 'Na2SO3':   {n:'Natri sunfit',                  s:'r', c:'#f4f2ec', sol:1, slb:27},
 'Na3PO4':   {n:'Natri photphat',                s:'r', c:'#f4f2ec', sol:1, slb:12},
 'CaSO4':    {n:'Canxi sunfat (thạch cao)',      s:'r', c:'#f7f7f0'},
 'Al2O3':    {n:'Nhôm oxit',                     s:'r', c:'#f2f0ea'},
 'Al(OH)3':  {n:'Nhôm hiđroxit (keo trắng)',     s:'r', c:'#f0f0ea'},
 'Al2(SO4)3':{n:'Nhôm sunfat',                   s:'r', c:'#f4f2ec', sol:1, slb:36},
 'Mg(OH)2':  {n:'Magie hiđroxit (trắng)',        s:'r', c:'#f2f2ec'},
 'Fe2(SO4)3':{n:'Sắt(III) sunfat',               s:'r', c:'#d9a86a', sol:1, slb:44},
 'Zn(OH)2':  {n:'Kẽm hiđroxit (trắng)',          s:'r', c:'#f2f2ec'}
};
const isPrecip = f => { const c = CHEMS[f]; return c.s === 'r' && !c.sol; };
// solids less soluble than NaCl (36 g/100g nước) need stirring with the glass rod to dissolve
const SLOW_DISSOLVE = Object.keys(CHEMS).filter(f => CHEMS[f].s === 'r' && CHEMS[f].sol);

/* ---- reactions: rg = reagents (mol ratio), pr = products, heat = needs đèn cồn, exo = toả nhiệt ---- */
/* Bảng phản ứng nằm ở phan-ung.js (nạp ngay trên) — sửa hoá học thì sửa file đó. */

/* ---- formatting helpers ---- */
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const sub = f => f.replace(/([A-Za-z)])(\d+)/g, (m,ch,d) => ch + [...d].map(x=>SUBS[+x]).join(''));
const amt = n => (+(n/10).toFixed(3)).toString().replace('.',',') + ' mol'; // doses can be fractional (0,05 mol...)
function eqStr(r){ // auto-build balanced equation string with ↑/↓ markers
  const side = (obj, mark) => Object.keys(obj).map(f=>{
    let m = '';
    if(mark){ if(CHEMS[f].s==='k') m='↑'; else if(isPrecip(f)) m='↓'; }
    return (obj[f]>1? obj[f]:'') + sub(f) + m;
  }).join(' + ');
  return side(r.rg) + ' —' + rxOver(r) + '→ ' + side(r.pr, true);
}
// điều kiện ghi trên mũi tên: đốt cũng là t° như SGK viết
const rxOver = r => [(r.heat||r.burn)?'t°':'', r.elec?'đp':'', r.cat?r.cat.map(sub).join(','):''].filter(Boolean).join(', ');
function fxOf(r){ // visual effect summary for a reaction
  const fx = [];
  if(Object.keys(r.pr).some(f=>CHEMS[f].s==='k')) fx.push('sủi bọt khí');
  if(Object.keys(r.pr).some(isPrecip)) fx.push('kết tủa');
  if(r.exo) fx.push('toả nhiệt');
  return fx.join(', ');
}

/* ---- customers: [name, emoji, self-pronoun] ---- */
const CUSTOMERS = [
 ['Bà Tư','lò bánh mì','bà'], ['Chú Ba','nông dân','chú'], ['Bé Na','học sinh lớp 8','em'], ['Anh Minh','thợ xây','anh'],
 ['Cô Lan','y tá trạm xá','cô'], ['Ông Sáu','chủ ao cá','ông'], ['Bạn Tí','học sinh lớp 8','mình'], ['Chị Hoa','tiệm vàng bạc','chị'],
 ['Thầy Nam','giáo viên Hoá','thầy'], ['Cô Mai','quán chè','cô']
];
// ORDER_TPL, USE_LINES, SPECIAL_LINES: xem file loi-thoai.js (thoại khách hàng, dễ sửa)
const PRAISE = ['Cảm ơn nhé, đúng thứ {A} cần!','Tuyệt vời! Đúng chuẩn luôn!','Giỏi quá! Cảm ơn nha!','Chuẩn không cần chỉnh!'];
const COMPLAIN = ['Ơ, không phải rồi! {r}','Sai rồi bạn ơi… {r}','{A} không đặt cái này mà! {r}','Hừm, kiểm tra lại đi: {r}'];

/* ---- order builder: o(customerIdx, chemFormula, doses, opts) ---- */
function o(who, chem, n, opts){
  return Object.assign({who, chem, n}, opts||{});
}

/* ---- 31 days, 5 chương. Lab day: {t, story, chems, tools, dur, orders, s1}. Minigame day: {t, story, mg, ...data} ---- */
/* tools: spoon, book, quy, gas, heat, filter, elec (sink + đũa thuỷ tinh luôn có sẵn) */
const DAYS = [
 // ================= CHƯƠNG 1: NHẬP MÔN & OXI (1–7) =================
 {t:'Ngày đầu tiên ở tiệm',
  story:'Chào mừng trò đến với tiệm hoá chất của ta! Ta là giáo sư Hoffmann. Hôm nay trò học pha DUNG DỊCH: cho chất tan vào cốc rồi thêm nước. Chất nào ÍT TAN sẽ lắng dưới đáy — lấy ĐŨA THUỶ TINH bên cạnh cốc, kéo vào rồi khuấy tròn cho tan hết nhé!',
  chems:['H2O','NaCl','C12H22O11','MgSO4'], tools:[], dur:300, s1:2,
  orders:[ o(2,'C12H22O11',1,{water:1,pname:'nước đường'}),
           o(0,'NaCl',1,{water:1,pname:'nước muối'}),
           o(4,'MgSO4',1,{water:1,pname:'nước muối tắm Epsom (khuấy cho tan!)'}) ]},

 {t:'Khái niệm mol',
  story:'MOL là "tá" của nhà hoá học: 1 mol = 6,022×10²³ hạt! Mỗi lần trò nghiêng lọ là thêm đúng 0,1 mol. Khách hỏi 0,3 mol thì nghiêng 3 lần. Ta tặng trò cái THÌA KHUẤY — bấm để đảo đều cốc. Hôm nay có mấy vị khách "cuồng số" ghé đấy…',
  chems:['H2O','NaCl','C12H22O11'], tools:['spoon'], dur:300, s1:3,
  orders:[ o(3,'C12H22O11',2,{water:1,pname:'nước đường (0,2 mol đường)'}),
           o(8,'NaCl',3,{water:1,pname:'nước muối (0,3 mol NaCl)',
             line:SPECIAL_LINES.avogadroThay}),
           o(6,'C12H22O11',1,{water:1,pname:'nước đường loãng',
             line:SPECIAL_LINES.avogadroTro}),
           o(7,'NaCl',2,{water:1,pname:'nước muối (0,2 mol NaCl)'}) ]},

 {t:'Nguyên tử hay phân tử?', mg:'bins',
  story:'NGUYÊN TỬ là hạt nhỏ nhất của nguyên tố (Fe, Cu…). Nhiều nguyên tử gắn lại thành PHÂN TỬ. Phân tử của một nguyên tố là ĐƠN CHẤT (O₂, N₂…), của nhiều nguyên tố là HỢP CHẤT (H₂O, CO₂…). Phân loại các thẻ này nào!',
  bins:['Nguyên tử','Phân tử đơn chất','Phân tử hợp chất'], binNotes:['kim loại'],
  items:[['Fe',0],['Cu',0],['Na',0],['Ag',0],['O2',1],['H2',1],['N2',1],['Cl2',1],['H2O',2],['CO2',2],['NaCl',2],['H2SO4',2]]},

 {t:'Hoá trị — những "cánh tay" nguyên tử',
  story:'Hôm nay học HOÁ TRỊ qua thực hành! Hoá trị như số "tay" để nắm nhau: O có 2 tay, Na chỉ 1 tay → phải 2 Na nắm 1 O thành Na₂O. Mg có 2 tay → MgO cứ 1:1. Hôm nay ta ĐỐT kim loại trong oxi, mà đốt thì không bỏ vào cốc đâu nhé! Nạp khí O₂ vào LỌ KHÍ, cho kim loại lên MUÔI ĐỐT, hơ qua ĐÈN CỒN cho bén lửa rồi đưa nhanh vào lọ. Oxit rắn được gạt ra đĩa — nhìn công thức là thấy hoá trị.',
  chems:['Na','Mg','Cu','Zn','O2'], tools:['spoon','book','heat','gas','burn'], dur:320, s1:3,
  orders:[ o(4,'MgO',2,{pname:'magie oxit (Mg hoá trị II)'}),
           o(9,'Na2O',2,{pname:'natri oxit (Na hoá trị I — để ý số 2!)'}),
           o(1,'CuO',2,{pname:'đồng(II) oxit'}),
           o(6,'ZnO',1,{pname:'kẽm oxit'}) ]},

 {t:'Oxi gặp kim loại',
  story:'OXI duy trì sự cháy — kim loại cháy trong oxi tạo OXIT: 2Mg + O₂ —t°→ 2MgO sáng chói! Sắt thì đặc biệt: 3Fe + 2O₂ → Fe₃O₄ oxit sắt từ, cháy tóe hoa lửa. Ba bước: nạp O₂ vào lọ khí → kim loại lên muôi, hơ đèn cồn cho bén lửa → đưa vào lọ. Đong oxi cho đúng tỉ lệ — thiếu thì lửa tắt giữa chừng!',
  chems:['Mg','Cu','Zn','Fe','O2'], tools:['spoon','book','heat','gas','burn'], dur:320, s1:3,
  orders:[ o(4,'MgO',2,{pname:'magie oxit'}),
           o(1,'CuO',2,{pname:'đồng(II) oxit đen'}),
           o(6,'ZnO',2,{pname:'kẽm oxit'}),
           o(8,'Fe3O4',1,{pname:'oxit sắt từ'}) ]},

 {t:'Oxi gặp phi kim',
  story:'Không chỉ kim loại — than, lưu huỳnh, photpho đều cháy trong oxi! C + O₂ —t°→ CO₂: khí sinh ra nằm ngay trong lọ, đậy nắp muôi lại là giao được cả lọ. Lưu huỳnh cháy lửa XANH LAM ra SO₂ hắc mũi. Photpho cháy tạo khói trắng P₂O₅ — bột rắn rơi ra đĩa. Nhớ: oxi dư cũng là "hàng lẫn" đấy!',
  chems:['S','P','C','O2'], tools:['spoon','book','heat','gas','burn'], dur:320, s1:2,
  orders:[ o(2,'CO2',1,{pname:'khí cacbonic'}),
           o(9,'SO2',1,{pname:'khí sunfurơ'}),
           o(5,'P2O5',2,{pname:'điphotpho pentaoxit'}) ]},

 {t:'Luyện tập chương 1',
  story:'Hết chương đầu rồi! Bài kiểm tra nhỏ: pha dung dịch đúng số mol, rồi đốt vài thứ trong oxi. Bình tĩnh làm từng đơn, ta đứng sau quầy cổ vũ trò đây.',
  chems:['H2O','NaCl','Mg','C','S','O2'], tools:['spoon','book','heat','gas','burn'], dur:360, s1:3,
  orders:[ o(0,'NaCl',2,{water:1,pname:'nước muối (0,2 mol)'}),
           o(4,'MgO',2,{pname:'magie oxit'}),
           o(2,'CO2',1,{pname:'khí cacbonic'}),
           o(9,'SO2',1,{pname:'khí sunfurơ'}) ]},

 // ================= CHƯƠNG 2: HIĐRO – NƯỚC – AXIT BAZƠ (8–14) =================
 {t:'Hiđro — chất khử cừ khôi',
  story:'Chương mới, nhân vật mới: KHÍ HIĐRO — nhẹ nhất vũ trụ! Dẫn H₂ qua CuO nung nóng, nó "cướp" oxi tạo Cu đỏ rực: CuO + H₂ —t°→ Cu + H₂O. Đó gọi là PHẢN ỨNG KHỬ. Cho oxit + H₂ vào cốc, BẬT ĐÈN, rồi lọc lấy kim loại.',
  chems:['H2O','CuO','Fe2O3','H2'], tools:['spoon','book','heat','filter'], dur:320, s1:2,
  orders:[ o(8,'Cu',1,{pname:'đồng kim loại'}),
           o(9,'Fe',2,{pname:'sắt kim loại'}),
           o(4,'Cu',2,{pname:'đồng kim loại (0,2 mol)'}) ]},

 {t:'Điều chế hiđro',
  story:'Hôm qua dùng H₂, hôm nay tự làm ra nó! Kim loại + axit → muối + H₂↑: Zn + 2HCl → ZnCl₂ + H₂. Khí sẽ bay mất nếu không hứng — bật BÌNH THU KHÍ lên TRƯỚC khi bỏ kim loại vào nhé.',
  chems:['H2O','HCl','Zn','Fe','Mg','Al'], tools:['spoon','book','quy','gas'], dur:340, s1:3,
  orders:[ o(6,'H2',1,{pname:'khí hiđro'}),
           o(1,'ZnCl2',1,{pname:'kẽm clorua'}),
           o(3,'H2',2,{pname:'khí hiđro (0,2 mol)'}),
           o(7,'FeCl2',1,{pname:'sắt(II) clorua'}),
           o(5,'MgCl2',1,{pname:'magie clorua'}) ]},

 {t:'Ai là chất khử?', mg:'redox',
  story:'Sự OXI HOÁ là chiếm lấy oxi; sự KHỬ là nhường oxi đi. CHẤT KHỬ là chất chiếm oxi của chất khác (nó bị oxi hoá). Nhìn từng phương trình và chỉ ra chất khử nhé!',
  quiz:[
   {q:'CuO + H₂ —t°→ Cu + H₂O', opts:['CuO','H₂'], ans:1, why:'H₂ chiếm oxi của CuO nên H₂ là chất khử'},
   {q:'Fe₂O₃ + 3H₂ —t°→ 2Fe + 3H₂O', opts:['H₂','Fe₂O₃'], ans:0, why:'H₂ chiếm oxi → chất khử'},
   {q:'C + O₂ —t°→ CO₂', opts:['C','O₂'], ans:0, why:'C chiếm oxi của O₂ → C là chất khử'},
   {q:'2Mg + O₂ —t°→ 2MgO', opts:['O₂','Mg'], ans:1, why:'Mg kết hợp với oxi → chất khử'},
   {q:'Zn + CuSO₄ → ZnSO₄ + Cu', opts:['Zn','CuSO₄'], ans:0, why:'Zn nhường electron, đẩy Cu ra → chất khử'},
   {q:'2Cu + O₂ —t°→ 2CuO', opts:['Cu','O₂'], ans:0, why:'Cu kết hợp với oxi → chất khử'}]},

 {t:'Nước — hợp chất kỳ diệu',
  story:'NƯỚC là hợp chất của hiđro và oxi. Nó hiền mà không hiền: thả NATRI vào là chạy vòng vòng sủi bọt — 2Na + 2H₂O → 2NaOH + H₂↑! Vôi sống gặp nước cũng nóng rực: CaO + H₂O → Ca(OH)₂. (Còn muốn TÁCH nước ngược lại thành H₂ và O₂? Chờ đến ngày 29 nhé — bí mật!)',
  chems:['H2O','Na','CaO'], tools:['spoon','book','quy','gas','filter'], dur:320, s1:2,
  orders:[ o(8,'H2',1,{pname:'khí hiđro (hứng từ Na + nước!)'}),
           o(4,'NaOH',2,{pname:'natri hiđroxit'}),
           o(0,'Ca(OH)2',1,{pname:'nước vôi trong'}) ]},

 {t:'Axit hay bazơ? — Thám tử quỳ tím', mg:'identify',
  story:'AXIT có H đứng đầu, làm quỳ tím hoá ĐỎ. BAZƠ có nhóm OH, làm quỳ hoá XANH. Chất trung tính thì… vẫn TÍM. Hai lọ cùng đỏ thì sao? Gọi thêm trợ thủ: BaCl₂ cho kết tủa trắng với gốc =SO₄, AgNO₃ cho kết tủa trắng với gốc −Cl, Na₂CO₃ sủi bọt khi gặp axit. Ba lọ này bong hết nhãn rồi — nhỏ thử từng mẫu, ghi lại hiện tượng, rồi dán nhãn giúp ta!',
  // mỗi lượt bốc ngẫu nhiên MỘT bộ 3 lọ; bộ nào cũng phải phân biệt được bằng quỳ + reagents (khoi-dong.js kiểm tra)
  reagents:['BaCl2','AgNO3','Na2CO3'],
  sets:[['HCl','H2SO4','NaOH'], ['HCl','NaCl','NaOH'], ['H2SO4','Na2SO4','NaCl'],
        ['HCl','NaCl','H2O'], ['NaOH','Ca(OH)2','NaCl'], ['H2SO4','NaOH','Na2SO4']]},

 {t:'Oxit gặp nước',
  story:'Vài oxit phản ứng luôn với nước: CaO (vôi sống) + H₂O → Ca(OH)₂ là BAZƠ, còn P₂O₅ + 3H₂O → 2H₃PO₄ là AXIT. Quy luật: oxit kim loại + nước → bazơ, oxit phi kim + nước → axit. Thử quỳ để kiểm tra sản phẩm nhé!',
  chems:['H2O','CaO','Na2O','P2O5'], tools:['spoon','book','quy','filter'], dur:300, s1:2,
  orders:[ o(0,'Ca(OH)2',1,{pname:'nước vôi trong'}),
           o(4,'NaOH',2,{pname:'natri hiđroxit'}),
           o(9,'H3PO4',2,{pname:'axit photphoric'}) ]},

 {t:'Luyện tập chương 2',
  story:'Kiểm tra tay nghề chương 2: điều chế H₂, dùng H₂ khử oxit, và cho oxit gặp nước. Nhiều bước một tí nhưng trò làm được — trò đã là thợ phụ cứng tay rồi!',
  chems:['H2O','HCl','Zn','CuO','CaO','H2'], tools:['spoon','book','quy','gas','heat','filter'], dur:360, s1:3,
  orders:[ o(2,'H2',1,{pname:'khí hiđro (Zn + axit)'}),
           o(8,'Cu',1,{pname:'đồng (H₂ khử CuO)'}),
           o(0,'Ca(OH)2',1,{pname:'nước vôi trong'}),
           o(5,'CuCl2',1,{pname:'đồng(II) clorua (CuO + axit)'}) ]}
];

DAYS.push(
 // ================= CHƯƠNG 3: AXIT – BAZƠ – MUỐI (15–21) =================
 {t:'Tính chất của axit',
  story:'AXIT = hiđro + GỐC AXIT: −Cl (clorua), =SO₄ (sunfat), −NO₃ (nitrat). Axit tác dụng kim loại → muối + H₂↑, tác dụng oxit bazơ → muối + nước. Tên muối đi theo gốc axit — nhìn đơn hàng là biết cần axit nào! Và nhớ QUY TẮC VÀNG khi pha axit: rót AXIT vào NƯỚC, đừng bao giờ rót nước vào axit.',
  chems:['H2O','HCl','H2SO4','Zn','Fe','CuO'], tools:['spoon','book','quy','gas','filter'], dur:340, s1:3,
  orders:[ o(0,'CuCl2',1,{pname:'đồng(II) clorua (gốc −Cl)'}),
           o(4,'CuSO4',1,{pname:'đồng(II) sunfat (gốc =SO₄)'}),
           o(7,'FeSO4',1,{pname:'sắt(II) sunfat'}),
           o(3,'H2',1,{pname:'khí hiđro'}) ]},

 {t:'Tính chất của bazơ',
  story:'BAZƠ tan (kiềm) làm quỳ hoá xanh; bazơ KHÔNG TAN thì sắc màu rực rỡ: Cu(OH)₂ XANH LAM, Fe(OH)₃ NÂU ĐỎ. Và đun Cu(OH)₂ trên đèn cồn thì nó phân huỷ thành CuO đen! Hoá học là một hộp màu vẽ đấy trò ạ.',
  chems:['H2O','CuSO4','FeCl3','NaOH'], tools:['spoon','book','quy','heat','filter'], dur:340, s1:3,
  orders:[ o(2,'Cu(OH)2',1,{pname:'đồng(II) hiđroxit xanh lam'}),
           o(9,'Fe(OH)3',1,{pname:'sắt(III) hiđroxit nâu đỏ'}),
           o(5,'CuO',1,{pname:'đồng(II) oxit (nung Cu(OH)₂)'}),
           o(3,'Na2SO4',1,{pname:'natri sunfat (nước lọc)'}) ]},

 {t:'Phân loại chất', mg:'bins',
  story:'Bốn họ nhà hoá chất: OXIT (nguyên tố + oxi), AXIT (H + gốc axit), BAZƠ (kim loại + OH), MUỐI (kim loại + gốc axit). Phân loại chuẩn thì học gì cũng nhanh — kéo từng thẻ vào đúng giỏ nhé!',
  bins:['Oxit','Axit','Bazơ','Muối'], binScale:1.3,
  items:[['CO2',0],['CaO',0],['Fe2O3',0],['SO2',0],['HCl',1],['H2SO4',1],['HNO3',1],['NaOH',2],['KOH',2],['Cu(OH)2',2],['NaCl',3],['CuSO4',3],['Na2CO3',3],['NaHCO3',3]]},

 {t:'Axit mạnh: H₂SO₄ & HNO₃',
  story:'Hai "đại ca" nhà axit! H₂SO₄ HAI nấc: một phân tử "ăn" được HAI phân tử NaOH — muốn Na₂SO₄ phải trộn 1:2. HNO₃ tạo muối nitrat. Mẹo nhận biết gốc sunfat: nhỏ BaCl₂ vào là kết tủa trắng BaSO₄ ngay!',
  chems:['H2O','H2SO4','HNO3','NaOH','KOH','BaCl2'], tools:['spoon','book','quy','filter'], dur:340, s1:3,
  orders:[ o(4,'Na2SO4',1,{pname:'natri sunfat (tỉ lệ 1:2!)'}),
           o(8,'NaNO3',1,{pname:'natri nitrat'}),
           o(9,'K2SO4',1,{pname:'kali sunfat'}),
           o(1,'BaSO4',1,{pname:'bari sunfat trắng (nhận biết gốc =SO₄)'}) ]},

 {t:'Muối (1) — con của axit và bazơ',
  story:'AXIT + BAZƠ → MUỐI + NƯỚC — phản ứng TRUNG HOÀ! HCl gặp NaOH cho ra muối ăn NaCl. Muối mang tên "họ bố mẹ": kim loại của bazơ + gốc của axit. Trộn đúng tỉ lệ nhé!',
  chems:['H2O','HCl','H2SO4','NaOH','KOH'], tools:['spoon','book','quy'], dur:300, s1:3,
  orders:[ o(0,'NaCl',1,{pname:'muối ăn'}),
           o(8,'KCl',1,{pname:'kali clorua'}),
           o(4,'Na2SO4',1,{pname:'natri sunfat'}),
           o(5,'NaCl',2,{pname:'muối ăn (0,2 mol)'}) ]},

 {t:'Muối (2) — trao đổi và kết tủa',
  story:'Hai dung dịch trong suốt đổ vào nhau — BỤP! — trắng xoá như tuyết: AgNO₃ + NaCl → AgCl↓ + NaNO₃. Đó là phản ứng TRAO ĐỔI: hai muối "đổi bạn nhảy" cho nhau. Lọc kết tủa xong, phần nước lọc còn lại cũng bán được — không bỏ phí thứ gì!',
  chems:['H2O','AgNO3','NaCl','BaCl2','Na2SO4'], tools:['spoon','book','filter'], dur:320, s1:2,
  orders:[ o(0,'AgCl',1,{pname:'bạc clorua trắng'}),
           o(4,'BaSO4',1,{pname:'bari sunfat trắng'}),
           o(8,'NaNO3',1,{pname:'natri nitrat (nước lọc sau kết tủa)'}),
           o(1,'NaCl',2,{pname:'muối ăn (nước lọc sau kết tủa)'}) ]},

 {t:'Luyện tập chương 3',
  story:'Hôm nay khách đông và khó tính lắm — toàn đơn lắt léo về axit, bazơ, muối! Bình tĩnh, đọc kỹ đơn, nhớ tỉ lệ. Ta đứng sau quầy cổ vũ trò đây.',
  chems:['H2O','Zn','Fe','NaCl','HCl','H2SO4','NaOH','CuSO4','AgNO3','BaCl2'], tools:['spoon','book','quy','gas','heat','filter'], dur:340, s1:3,
  orders:[ o(9,'Cu(OH)2',1,{pname:'đồng(II) hiđroxit'}),
           o(3,'H2',2,{pname:'khí hiđro (0,2 mol)'}),
           o(0,'AgCl',2,{pname:'bạc clorua'}),
           o(4,'Na2SO4',1,{pname:'natri sunfat'}),
           o(7,'FeSO4',1,{pname:'sắt(II) sunfat'}) ]},

 // ================= CHƯƠNG 4: KIM LOẠI & PHI KIM (22–28) =================
 {t:'Nhôm — kim loại quốc dân',
  story:'NHÔM nhẹ, bền, làm từ nồi niêu đến máy bay! Hoá trị III nên phương trình hơi "xoắn": 2Al + 6HCl → 2AlCl₃ + 3H₂. Nhôm cũng cháy trong khí clo: 2Al + 3Cl₂ —t°→ 2AlCl₃ — nạp Cl₂ vào lọ khí rồi đốt nhôm trên muôi. Hai con đường, một sản phẩm! (Lọ khí cũng là bình thu khí: dùng xong nhớ xả sạch trước khi hứng H₂.)',
  chems:['H2O','HCl','Al','Cl2'], tools:['spoon','book','quy','heat','gas','burn'], dur:340, s1:2,
  orders:[ o(3,'AlCl3',2,{pname:'nhôm clorua (đường axit)'}),
           o(6,'H2',3,{pname:'khí hiđro (0,3 mol — nhôm hào phóng!)'}),
           o(1,'AlCl3',2,{pname:'nhôm clorua (đốt trong clo)'}) ]},

 {t:'Sắt — hoá trị II và III',
  story:'SẮT có tính "hai mặt": gặp axit HCl chỉ chịu hoá trị II (FeCl₂), nhưng cháy trong lọ khí clo thì lên hẳn hoá trị III (FeCl₃, khói nâu đỏ)! Đốt trong lọ oxi lại ra Fe₃O₄. Cùng một kim loại, ba bộ mặt — đó là sắt.',
  chems:['H2O','HCl','Cl2','Fe','O2','CuSO4'], tools:['spoon','book','heat','gas','burn','filter'], dur:360, s1:3,
  orders:[ o(7,'FeCl2',1,{pname:'sắt(II) clorua — Fe + axit'}),
           o(9,'FeCl3',2,{pname:'sắt(III) clorua — Fe + clo'}),
           o(8,'Fe3O4',1,{pname:'oxit sắt từ'}),
           o(0,'Cu',1,{pname:'đồng (Fe đẩy khỏi muối)'}) ]},

 {t:'May áo giáp sắt', mg:'sort',
  story:'Thợ rèn của làng cần may áo giáp — nhưng kim loại nào bền, kim loại nào "yếu bóng vía"? "Khi Nào May Áo Záp Sắt Đồng Bạc" — dãy hoạt động đấy! Kim loại đứng TRƯỚC mạnh hơn, đẩy được kim loại đứng SAU ra khỏi muối. Xếp từ MẠNH NHẤT đến YẾU NHẤT.',
  metals:['K','Na','Mg','Al','Zn','Fe','Cu','Ag']},

 {t:'Halogen — khí clo vàng lục',
  story:'Gặp gỡ họ HALOGEN — nghĩa là "sinh ra muối"! Đại diện: khí clo Cl₂ vàng lục, độc, phản ứng mãnh liệt: natri đốt trên muôi rồi đưa vào lọ clo là 2Na + Cl₂ → 2NaCl (muối ăn từ khí độc, kỳ diệu chưa!). Còn H₂ + Cl₂ là hai khí: trộn trong cốc rồi châm lửa → 2HCl. Cẩn thận khi thao tác nhé!',
  chems:['H2O','Na','Fe','Cu','H2','Cl2'], tools:['spoon','book','quy','heat','gas','burn'], dur:340, s1:3,
  orders:[ o(0,'NaCl',2,{pname:'muối ăn (từ Na + Cl₂!)'}),
           o(9,'FeCl3',2,{pname:'sắt(III) clorua'}),
           o(1,'CuCl2',1,{pname:'đồng(II) clorua'}),
           o(8,'HCl',2,{pname:'axit clohiđric (H₂ + Cl₂)'}) ]},

 {t:'Nitơ — khí trơ mà quý',
  story:'NITƠ chiếm 78% không khí mà lười phản ứng số một — trơ như đá! Nhưng ép nó với H₂ ở nhiệt độ cao: N₂ + 3H₂ ⇌ 2NH₃ — amoniac, nguyên liệu phân đạm nuôi cả thế giới. NH₃ gặp HCl là "khói trắng" NH₄Cl bay mù mịt!',
  chems:['N2','H2','NH3','HCl'], tools:['spoon','book','quy','gas','heat'], dur:340, s1:2,
  orders:[ o(8,'NH3',2,{pname:'khí amoniac (tổng hợp N₂ + H₂)'}),
           o(4,'NH4Cl',1,{pname:'amoni clorua (khói trắng)'}),
           o(2,'NH4Cl',2,{pname:'amoni clorua (0,2 mol)'}) ]},

 {t:'Cacbon — từ than đến đá vôi',
  story:'CACBON đa tài: than đốt trong lọ oxi cho CO₂, than nóng còn KHỬ được oxit kim loại — 2CuO + C —t°→ 2Cu + CO₂ (bí quyết lò luyện kim từ nghìn năm!). Còn đá vôi CaCO₃ nung già lửa thành vôi sống, gặp axit thì sủi bọt "đá sôi".',
  chems:['H2O','C','O2','CuO','CaCO3','HCl'], tools:['spoon','book','heat','gas','burn','filter'], dur:360, s1:3,
  orders:[ o(2,'CO2',1,{pname:'khí cacbonic (đốt than)'}),
           o(5,'Cu',2,{pname:'đồng đỏ (C khử CuO — lò luyện kim!)'}),
           o(7,'CaO',1,{pname:'vôi sống (nung đá vôi)'}),
           o(0,'CaCl2',1,{pname:'canxi clorua'}) ]},

 {t:'Luyện tập lớn — Lễ hội hoá học',
  story:'Ngày tốt nghiệp khoá chính! Cả thị trấn đến chúc mừng trò. Mọi kệ hoá chất đều mở, mọi dụng cụ sẵn sàng. Hãy cho ta thấy tất cả những gì trò đã học — và nhận danh hiệu NHÀ HOÁ HỌC NHÍ! (Nghe đồn sau lễ hội còn ba ngày bí mật trong phòng thí nghiệm nâng cao…)',
  chems:['H2O','Zn','Fe','Cu','C','O2','CO2','HCl','H2SO4','NaOH','KOH','Ca(OH)2','CuSO4','AgNO3','NaCl','BaCl2','Na2SO4'],
  tools:['spoon','book','quy','gas','heat','filter'], dur:420, s1:4,
  orders:[ o(0,'NaCl',2,{pname:'muối ăn (trung hoà axit–bazơ)'}),
           o(2,'H2',1,{pname:'khí hiđro'}),
           o(8,'Cu',1,{pname:'đồng đỏ (phản ứng thế)'}),
           o(4,'AgCl',1,{pname:'bạc clorua trắng'}),
           o(9,'Na2CO3',1,{pname:'natri cacbonat (CO₂ + 2NaOH)'}),
           o(5,'BaSO4',1,{pname:'bari sunfat trắng'}) ]},

 // ================= CHƯƠNG 5: PHÒNG THÍ NGHIỆM NÂNG CAO (29–31) =================
 {t:'Điện phân — tách chất bằng điện',
  story:'Chào mừng đến phòng thí nghiệm nâng cao! Đây là NGUỒN ĐIỆN PHÂN — kéo hai điện cực vào cốc. Nước bị dòng điện tách đôi: 2H₂O —đp→ 2H₂↑ (cực âm, hứng được) + O₂↑ (cực dương, thoát ra). Còn điện phân CuCl₂ thì đồng bám cực âm, khí clo sủi ở cực dương! Nguồn điện có bảng định lượng ở mép bàn: chọn chất, vặn số mol rồi bấm — nó tách đúng chừng ấy thôi, nên trò cân được chính xác từng đơn.',
  chems:['H2O','CuCl2'], tools:['spoon','book','gas','filter','elec'], dur:360, s1:2,
  orders:[ o(8,'H2',2,{pname:'khí hiđro (điện phân nước)'}),
           o(3,'Cu',1,{pname:'đồng (điện phân CuCl₂)'}),
           o(9,'Cl2',1,{pname:'khí clo (hứng ở cực dương)'}) ]},

 {t:'Thuốc tím — nhà máy oxi tí hon',
  story:'KMnO₄ — thuốc tím — là chất oxi hoá siêu siêu mạnh! Khuấy tan tinh thể tím (ít tan lắm đấy, dùng đũa!), rồi ĐUN GIÀ LỬA: 2KMnO₄ —t°→ K₂MnO₄ + MnO₂ + O₂↑. Trò vừa tự điều chế OXI! Hứng đầy lọ O₂ đó rồi đốt đồng trên muôi đốt mà xem.',
  chems:['H2O','KMnO4','Cu'], tools:['spoon','book','heat','gas','burn','filter'], dur:380, s1:2,
  orders:[ o(4,'O2',1,{pname:'khí oxi (nhiệt phân thuốc tím)'}),
           o(6,'MnO2',1,{pname:'mangan đioxit (bã rắn — lọc lấy)'}),
           o(1,'CuO',2,{pname:'đồng oxit (đốt Cu bằng O₂ tự chế!)'}) ]},

 {t:'Chuỗi phản ứng — Hỏi xoáy đáp xoay', mg:'chain',
  story:'Thử thách cuối cùng! Ta đưa chất ĐẦU và chất ĐÍCH — trò chọn đúng thuốc thử từng bước để nối thành chuỗi phản ứng. Toàn bộ 31 ngày dồn vào đây. Sẵn sàng chưa, NHÀ HOÁ HỌC NHÍ?',
  chains:[
   {start:'Cu', target:'Cu(OH)₂', steps:[
     {opts:['Đốt trong O₂','+ dd HCl','+ dd NaOH'], ans:0, prod:'CuO', why:'Cu đứng sau H nên không tan trong HCl; đốt trong oxi tạo CuO'},
     {opts:['+ H₂O','+ dd H₂SO₄','Đun nóng tiếp'], ans:1, prod:'CuSO₄', why:'oxit bazơ + axit → muối: CuO + H₂SO₄ → CuSO₄ + H₂O'},
     {opts:['+ dd NaOH','+ Fe','Đốt trong O₂'], ans:0, prod:'Cu(OH)₂', why:'muối đồng + kiềm → kết tủa xanh: CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄'}]},
   {start:'CaCO₃', target:'CaCO₃ (vòng tròn đá vôi)', steps:[
     {opts:['+ H₂O','Nung già lửa','+ dd NaOH'], ans:1, prod:'CaO', why:'nhiệt phân đá vôi: CaCO₃ —t°→ CaO + CO₂'},
     {opts:['+ dd HCl','Nung tiếp','+ H₂O'], ans:2, prod:'Ca(OH)₂', why:'vôi sống + nước → vôi tôi: CaO + H₂O → Ca(OH)₂'},
     {opts:['Thổi CO₂ vào','+ NaCl','Đun sôi'], ans:0, prod:'CaCO₃', why:'CO₂ làm đục nước vôi trong: CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O'}]},
   {start:'Fe', target:'Fe₂O₃', steps:[
     {opts:['+ dd CuSO₄','+ khí Cl₂ (t°)','+ H₂O'], ans:1, prod:'FeCl₃', why:'Fe + Cl₂ cho sắt hoá trị III: 2Fe + 3Cl₂ → 2FeCl₃'},
     {opts:['+ dd NaOH','+ dd HCl','Đun nóng'], ans:0, prod:'Fe(OH)₃', why:'FeCl₃ + 3NaOH → Fe(OH)₃↓ nâu đỏ + 3NaCl'},
     {opts:['+ O₂','+ H₂O','Nung khô'], ans:2, prod:'Fe₂O₃', why:'nhiệt phân bazơ không tan: 2Fe(OH)₃ —t°→ Fe₂O₃ + 3H₂O'}]},
   {start:'H₂O', target:'CuCl₂', steps:[
     {opts:['Đun sôi','+ quỳ tím','Điện phân'], ans:2, prod:'H₂', why:'điện phân nước: 2H₂O → 2H₂ (cực âm) + O₂ (cực dương)'},
     {opts:['+ CuO (t°)','+ NaOH','+ O₂'], ans:0, prod:'Cu', why:'H₂ khử oxit: CuO + H₂ —t°→ Cu + H₂O'},
     {opts:['+ dd NaCl','+ khí Cl₂ (t°)','+ H₂O'], ans:1, prod:'CuCl₂', why:'Cu + Cl₂ —t°→ CuCl₂'}]}
  ]}
);

/* ---- achievements ---- */
const ACH = {
 rxall:   {n:'Nhà hoá học',       d:'Ghi đủ mọi phản ứng vào sổ tay'},
 d1:      {n:'Ngày đầu tiên',      d:'Hoàn thành ngày làm việc đầu tiên'},
 gas1:    {n:'Bắt khí đầu tiên',   d:'Thu được khí vào bình thu khí'},
 filter1: {n:'Thợ lọc tập sự',     d:'Lọc kết tủa đầu tiên'},
 quy1:    {n:'Thám tử quỳ tím',    d:'Dùng giấy quỳ lần đầu'},
 star3:   {n:'Ngôi sao sáng',      d:'Đạt 3 sao một ngày bất kỳ'},
 week1:   {n:'Tuần hoàn hảo I',    d:'3 sao cả tuần 1'},
 week2:   {n:'Tuần hoàn hảo II',   d:'3 sao cả tuần 2'},
 week3:   {n:'Tuần hoàn hảo III',  d:'3 sao cả tuần 3'},
 week4:   {n:'Tuần hoàn hảo IV',   d:'3 sao cả tuần 4'},
 all28:   {n:'Tốt nghiệp',         d:'Hoàn thành cả 28 ngày'},
 serve10: {n:'Người bán chăm chỉ', d:'Phục vụ 10 đơn hàng'},
 serve50: {n:'Trợ lý vàng',        d:'Phục vụ 50 đơn hàng'},
 oops:    {n:'Ối, nhầm rồi!',      d:'Giao nhầm hàng lần đầu (ai chẳng có lúc sai)'},
 clean:   {n:'Bàn tay sạch',       d:'Xong một ngày trọn vẹn không giao sai'},
 master:  {n:'Nhà hoá học nhí',    d:'Đạt 3 sao ngày Lễ hội hoá học'},
 burn1:   {n:'Lửa trong lọ',       d:'Đốt cháy một chất trong lọ khí bằng muôi đốt'},
 hard1:   {n:'Cân đo chuẩn xác',   d:'Đạt ít nhất 1 sao một ngày ở chế độ khó'},
 hard3:   {n:'Phù thuỷ định lượng',d:'Đạt 3 sao chế độ khó ở 5 ngày khác nhau'}
};

// days where a perfect no-dump run is possible → star 3 also requires "no waste"
[0,1,4,5,7,8,10,11,12,13,14,15,21,24].forEach(i => DAYS[i].clean = 1);

const TOOLNAMES = {spoon:'Khuấy', book:'Sổ tay', quy:'Giấy quỳ', gas:'Bình thu khí', heat:'Đèn cồn', filter:'Phễu lọc', elec:'Nguồn điện phân', burn:'Muôi đốt'};
const TOOLSYM   = {spoon:'sym-stirrod', book:'sym-notebook', quy:'sym-litmusbox', gas:'sym-gasbottle', heat:'sym-lamp', filter:'sym-funnel', elec:'sym-electro', burn:'sym-burnspoon'};

/* ---- chemical facts (hover 5s); generated content, see scratchpad/chem-facts.js ---- */
const CHEM_FACTS = {
 'H2O': "Nước là chất duy nhất tồn tại tự nhiên ở cả ba thể rắn, lỏng, khí trên Trái Đất.",
 'NaCl': "Muối ăn chính là hợp chất natri clorua, giúp cơ thể duy trì cân bằng nước và dẫn truyền thần kinh.",
 'C12H22O11': "Đường ăn (saccarozo) khi đun nóng sẽ chuyển thành caramen có màu nâu và mùi thơm đặc trưng.",
 'HCl': "Dạ dày con người tiết ra axit clohidric để tiêu hóa thức ăn và tiêu diệt vi khuẩn.",
 'H2SO4': "Axit sunfuric đậm đặc háo nước mạnh đến mức có thể làm cháy đen đường và giấy ngay lập tức.",
 'HNO3': "Axit nitric có thể hòa tan hầu hết kim loại và dùng để sản xuất phân đạm, thuốc nổ.",
 'H3PO4': "Axit photphoric là chất tạo vị chua nhẹ trong nhiều loại nước ngọt có gas.",
 'NaOH': "Xút ăn da dùng để làm xà phòng và thông cống vì khả năng phân hủy chất béo mạnh.",
 'KOH': "Kali hidroxit cũng dùng làm xà phòng, thường tạo ra loại xà phòng mềm hơn so với NaOH.",
 'Ca(OH)2': "Nước vôi trong dùng để nhận biết khí CO2 vì tạo kết tủa trắng đục khi sục khí vào.",
 'Na': "Kim loại natri mềm đến mức cắt được bằng dao và phản ứng rất mạnh khi gặp nước.",
 'K': "Kali là kim loại phản ứng với nước mạnh hơn natri, thậm chí có thể bốc cháy ngay lập tức.",
 'Mg': "Kim loại magie cháy sáng chói lóa, được dùng trong pháo hoa và đèn flash ngày xưa.",
 'Al': "Nhôm nhẹ nhưng bền, có lớp oxit mỏng bảo vệ nên không bị gỉ như sắt.",
 'Zn': "Kẽm thường dùng để mạ lên sắt thép, tạo lớp tôn mạ kẽm chống gỉ.",
 'Fe': "Sắt là kim loại được con người sử dụng nhiều nhất và cũng có trong máu dưới dạng hemoglobin.",
 'Cu': "Đồng dẫn điện rất tốt nên được dùng làm dây điện trong hầu hết các thiết bị điện.",
 'Ag': "Bạc là kim loại dẫn điện tốt nhất trong tất cả kim loại, hơn cả đồng và vàng.",
 'S': "Lưu huỳnh có màu vàng đặc trưng và khi cháy tạo ra khí SO2 có mùi hắc khó chịu.",
 'P': "Photpho đỏ an toàn hơn photpho trắng, được phủ lên vỏ bao diêm để quẹt diêm.",
 'C': "Kim cương và than chì đều là cacbon nguyên chất, chỉ khác cách sắp xếp nguyên tử.",
 'O2': "Khí oxi chiếm khoảng 21% không khí và cần thiết cho sự hô hấp cũng như sự cháy.",
 'H2': "Khí hidro nhẹ nhất trong mọi chất khí và cháy được, tạo ra nước khi kết hợp với oxi.",
 'CO2': "Khí cacbonic được cây xanh hấp thụ để quang hợp và cũng là chất tạo ga cho nước ngọt.",
 'SO2': "Khí lưu huỳnh đioxit gây mưa axit và là một trong những nguyên nhân ô nhiễm không khí.",
 'KCl': "Kali clorua là thành phần chính trong nhiều loại phân bón kali cho cây trồng.",
 'CaCl2': "Canxi clorua hút ẩm rất mạnh nên thường dùng để làm khô không khí hoặc rã băng đường vào mùa đông.",
 'MgCl2': "Magie clorua tách ra từ nước biển và dùng làm chất làm đông trong sản xuất đậu phụ.",
 'AlCl3': "Nhôm clorua được dùng làm chất xúc tác trong nhiều phản ứng hóa học hữu cơ.",
 'ZnCl2': "Kẽm clorua có tính hút ẩm mạnh, thường dùng trong hàn kim loại để làm sạch bề mặt.",
 'FeCl2': "Sắt (II) clorua có màu lục nhạt và dễ bị oxi hóa thành sắt (III) khi để ngoài không khí.",
 'FeCl3': "Sắt (III) clorua có màu vàng nâu và được dùng để xử lý, làm sạch nước thải.",
 'CuCl2': "Đồng (II) clorua có màu xanh lam đặc trưng, thường dùng để tạo màu xanh lục trong pháo hoa.",
 'BaCl2': "Bari clorua độc với người nhưng lại dùng trong phòng thí nghiệm để nhận biết ion sunfat.",
 'Na2SO4': "Natri sunfat được dùng trong sản xuất bột giặt và thủy tinh.",
 'K2SO4': "Kali sunfat là loại phân bón kali không chứa clo, phù hợp với cây trồng nhạy cảm với clo.",
 'MgSO4': "Muối Epsom chính là magie sunfat, được hòa vào nước tắm để giúp thư giãn cơ bắp.",
 'ZnSO4': "Kẽm sunfat được dùng làm phân vi lượng bổ sung kẽm cho cây trồng thiếu chất.",
 'FeSO4': "Sắt (II) sunfat dùng làm thuốc bổ sung sắt cho người bị thiếu máu.",
 'CuSO4': "Dung dịch đồng sunfat có màu xanh lam đặc trưng, dùng để pha thuốc trừ nấm cho cây trồng.",
 'BaSO4': "Bari sunfat không tan trong axit dạ dày nên an toàn khi dùng để chụp X-quang đường tiêu hóa.",
 'NaNO3': "Natri nitrat còn gọi là diêm tiêu Chile, dùng làm phân đạm và chất bảo quản thịt.",
 'AgNO3': "Bạc nitrat dùng trong kỹ thuật tráng gương vì bạc kim loại bám rất đều lên bề mặt kính.",
 'Cu(NO3)2': "Đồng (II) nitrat có màu xanh lam và khi nhiệt phân sẽ giải phóng khí NO2 màu nâu đỏ.",
 'AgCl': "Bạc clorua là kết tủa trắng không tan trong nước, chuyển sang màu xám đen khi để ngoài ánh sáng.",
 'Na2CO3': "Sô-đa dùng để làm mềm nước cứng và là nguyên liệu quan trọng để sản xuất thủy tinh.",
 'NaHCO3': "Thuốc muối (bột nở) sinh ra khí CO2 khi gặp nhiệt hoặc axit, giúp bánh nở xốp.",
 'CaCO3': "Đá vôi, vỏ trứng và vỏ ốc đều chứa canxi cacbonat, thành phần chính tạo nên thạch nhũ trong hang động.",
 'BaCO3': "Bari cacbonat được dùng làm bả diệt chuột vì độc với động vật gặm nhấm.",
 'MgO': "Magie oxit chịu nhiệt cực tốt nên được dùng làm vật liệu chịu lửa trong lò nung.",
 'CuO': "Đồng (II) oxit có màu đen, khi cho khí hidro đi qua sẽ bị khử thành đồng kim loại màu đỏ.",
 'ZnO': "Kẽm oxit có màu trắng, thường có trong kem chống nắng và thuốc trị hăm cho trẻ em.",
 'Fe2O3': "Sắt (III) oxit chính là thành phần chính tạo nên màu đỏ của gỉ sắt.",
 'Fe3O4': "Oxit sắt từ có tính nhiễm từ, từng được dùng làm la bàn tự nhiên thời cổ đại.",
 'CaO': "Vôi sống phản ứng mạnh với nước, tỏa nhiệt lớn để tạo thành vôi tôi (nước vôi trong).",
 'Na2O': "Natri oxit phản ứng ngay với nước tạo thành dung dịch bazơ mạnh natri hidroxit.",
 'P2O5': "Điphotpho pentaoxit hút ẩm cực mạnh, thường dùng làm chất làm khô trong phòng thí nghiệm.",
 'Cu(OH)2': "Đồng (II) hidroxit là kết tủa màu xanh lam, khi đun nóng sẽ chuyển thành đồng oxit màu đen.",
 'Fe(OH)3': "Sắt (III) hidroxit là kết tủa màu nâu đỏ, thường gặp khi nước bị nhiễm sắt để lâu ngoài không khí.",
 'Fe(OH)2': "Sắt (II) hidroxit là kết tủa trắng xanh, để ngoài không khí sẽ dần hóa nâu đỏ thành sắt (III) hidroxit.",
 'Cl2': "Khí clo có màu vàng lục, mùi hắc độc hại nhưng lại dùng để khử trùng nước máy sinh hoạt.",
 'N2': "Khí nitơ chiếm khoảng 78% không khí và khá trơ nên được bơm vào túi snack để chống oxi hóa.",
 'NH3': "Khí amoniac có mùi khai đặc trưng, tan rất nhiều trong nước và là nguyên liệu sản xuất phân đạm ure.",
 'NH4Cl': "Amoni clorua (còn gọi là sal amoniac) được dùng làm chất trợ dung khi hàn thiếc.",
 'KMnO4': "Thuốc tím có màu tím đặc trưng, dùng để sát khuẩn vết thương và khử trùng nước.",
 'K2MnO4': "Kali manganat màu lục sẫm, sinh ra khi nhiệt phân thuốc tím và là bước trung gian điều chế khí oxi.",
 'MnO2': "Mangan đioxit đóng vai trò chất xúc tác giúp phản ứng phân hủy H2O2 tạo khí oxi diễn ra nhanh hơn.",
};
