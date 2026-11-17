/* =====================================================================
   STICKER DỤNG CỤ — hình dán trên ô lịch (LICH.sticker trong js/lich.js). Mỗi sticker là một hình nét mực
   trong khung 100×100, dán lên giấy: viền trắng dày bao quanh + mép mực mờ (bộ lọc #stkf), nghiêng nhẹ vài độ —
   cùng kiểu sticker phân tử của minigame ngày 3. Khoá không có ở đây thì coi là công thức hoá học và vẽ mô hình
   bi–que (molBox, js/che-do.js).
   Thêm sticker: thêm một khoá vào STICKERS (chuỗi SVG, toạ độ 0–100), rồi ghi khoá đó vào LICH.sticker.
   ===================================================================== */
'use strict';

const STK_INK = '#3b3025';
const stk = (w = 3.5) => `stroke="${STK_INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const stkT = (x, y, t, sz = 15, c = STK_INK) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="${sz}" font-weight="bold" fill="${c}">${t}</text>`;
const GLASS = '#e6f2f4';

const STICKERS = {
  // (chưa dùng) cốc thuỷ tinh có dung dịch, đũa khuấy cắm chéo
  'coc-khuay': `<path d="M56,6 L42,78" stroke="${STK_INK}" stroke-width="9" stroke-linecap="round"/><path d="M56,6 L42,78" stroke="#dff1f7" stroke-width="4" stroke-linecap="round"/>`
    + `<path d="M24,28 L30,32 L30,82 Q30,92 40,92 L64,92 Q74,92 74,82 L74,30" fill="${GLASS}" ${stk()}/>`
    + `<path d="M31,56 Q52,50 73,56 L73,82 Q73,90 64,90 L40,90 Q31,90 31,82 Z" fill="#9fd3e6"/>`
    + `<path d="M24,28 L30,32 L30,82 Q30,92 40,92 L64,92 Q74,92 74,82 L74,30" fill="none" ${stk()}/>`
    + `<path d="M62,42 h8 M64,54 h6 M62,66 h8" ${stk(2.2)}/><path d="M38,66 q4,-3 8,0 M44,76 q4,-3 8,0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`,
  // 1 · thìa xúc chất rắn trắng
  'thia': `<path d="M50,58 L88,14" stroke="${STK_INK}" stroke-width="10" stroke-linecap="round"/><path d="M50,58 L88,14" stroke="#c9cdd2" stroke-width="5" stroke-linecap="round"/>`
    + `<ellipse cx="34" cy="70" rx="24" ry="16" transform="rotate(-38 34 70)" fill="#c9cdd2" ${stk()}/>`
    + `<path d="M18,74 Q22,58 34,60 Q44,54 50,64 Q46,80 30,84 Z" fill="#fffdf5" ${stk(2.5)}/>`
    + `<circle cx="58" cy="82" r="3" fill="#fffdf5" ${stk(2)}/><circle cx="66" cy="74" r="2.4" fill="#fffdf5" ${stk(1.8)}/>`,
  // 2 · số Avogadro viết trên mẩu giấy vàng: 6,023 × 10²³ hạt trong một mol
  'avogadro': `<rect x="2" y="12" width="96" height="76" rx="8" fill="#f6d27a" ${stk()} transform="rotate(-3 50 50)"/>`
    + stkT(50, 46, '6,023', 34)
    + `<text x="45" y="78" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="28" font-weight="bold" fill="${STK_INK}">× 10<tspan font-size="17" dy="-12">23</tspan></text>`,
  // 5 · mũi tên phản ứng: chất tham gia → sản phẩm
  'mui-ten': `<path d="M8,41 L60,41 L60,22 L94,50 L60,78 L60,59 L8,59 Z" fill="#f2a868" ${stk()}/>`
    + `<path d="M16,48 L56,48" stroke="#fff6d8" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,
  // 3 · mô hình nguyên tử: hạt nhân và ba quỹ đạo electron
  'nguyentu': [0, 60, 120].map(a => `<ellipse cx="50" cy="50" rx="42" ry="15" transform="rotate(${a} 50 50)" fill="none" ${stk(3)}/>`).join('')
    + `<circle cx="50" cy="50" r="11" fill="#d9634f" ${stk()}/>`
    + [[92, 50], [29, 13.6], [29, 86.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#6f9ec9" ${stk(2.5)}/>`).join(''),
  // (chưa dùng) cân hai đĩa thăng bằng — vế trái, vế phải
  'can': `<path d="M30,92 L70,92 L62,82 L38,82 Z" fill="#a97c4b" ${stk()}/><path d="M50,82 L50,24" ${stk(5)}/>`
    + `<path d="M14,28 L86,28" ${stk(5)}/><circle cx="50" cy="22" r="6" fill="#f6d27a" ${stk(2.5)}/>`
    + [14, 86].map(x => `<path d="M${x},28 L${x - 12},60 M${x},28 L${x + 12},60" ${stk(2)}/><path d="M${x - 16},60 Q${x},72 ${x + 16},60 Z" fill="#f6d27a" ${stk(3)}/>`).join('')
    + `<circle cx="9" cy="54" r="5" fill="#d9634f" ${stk(2)}/><circle cx="18" cy="54" r="5" fill="#fffdf5" ${stk(2)}/>`
    + `<circle cx="81" cy="54" r="5" fill="#fffdf5" ${stk(2)}/><circle cx="90" cy="54" r="5" fill="#d9634f" ${stk(2)}/>`,
  // 6 · muôi đốt đang cháy
  'muoi-dot': `<path d="M84,10 L36,70" stroke="${STK_INK}" stroke-width="8" stroke-linecap="round"/><path d="M84,10 L36,70" stroke="#c9cdd2" stroke-width="3.5" stroke-linecap="round"/>`
    + `<ellipse cx="62" cy="38" rx="17" ry="6" transform="rotate(-51 62 38)" fill="#c9cdd2" ${stk(3)}/><circle cx="86" cy="8" r="6" fill="none" ${stk(3)}/>`
    + `<path d="M24,32 Q8,52 22,66 Q14,48 30,40 Q30,52 38,56 Q46,40 34,24 Q32,36 24,32 Z" fill="#f39a3a" ${stk(2.5)}/><path d="M26,60 Q22,50 30,46 Q32,54 36,56 Q34,62 26,60 Z" fill="#f6d27a"/>`
    + `<path d="M22,72 Q22,84 34,84 Q46,84 44,72 Z" fill="#aab1b8" ${stk(3)}/><ellipse cx="33" cy="72" rx="11" ry="3.5" fill="#f6d27a" ${stk(2)}/>`,
  // 7 · bảng kẹp bài kiểm tra có dấu tích
  'kiemtra': `<rect x="18" y="14" width="64" height="80" rx="6" fill="#c99a5a" ${stk()}/><rect x="25" y="24" width="50" height="64" rx="3" fill="#fffdf5" ${stk(2.5)}/>`
    + `<rect x="38" y="8" width="24" height="12" rx="3" fill="#c9cdd2" ${stk(2.5)}/>`
    + [38, 54, 70].map((y, k) => `<path d="M31,${y} l4,4 l7,-8" fill="none" stroke="${k === 2 ? '#d9634f' : '#5e8944'}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M48,${y} h20" ${stk(2.2)}/>`).join(''),
  // 8 · bình thu khí hiđro úp ngược, bọt khí sủi lên
  'khi-h2': `<path d="M30,14 Q30,8 36,8 L64,8 Q70,8 70,14 L70,74 Q70,82 62,84 L60,92 L40,92 L38,84 Q30,82 30,74 Z" fill="${GLASS}" ${stk()}/>`
    + [[44, 70, 5], [56, 58, 4], [46, 46, 3.5], [58, 38, 3], [50, 26, 2.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${stk(2)}/>`).join('')
    + `<rect x="34" y="14" width="32" height="18" rx="4" fill="#fffdf5" ${stk(2.2)}/>` + stkT(50, 28, 'H₂', 14),
  // 9 · ống nghiệm thuốc tím trên ngọn lửa, que đóm bùng cháy ở miệng ống — thử khí oxi
  'que-dom': `<path d="M34,22 L34,72 Q34,82 44,82 Q54,82 54,72 L54,22" fill="${GLASS}" ${stk()}/><path d="M35,62 L53,62 L53,72 Q53,80 44,80 Q35,80 35,72 Z" fill="#7d2b8b"/>`
    + `<path d="M34,22 L34,72 Q34,82 44,82 Q54,82 54,72 L54,22 M30,22 L58,22" fill="none" ${stk()}/>`
    + `<path d="M36,96 Q30,88 38,84 Q40,90 44,90 Q48,84 52,88 Q56,94 50,98 Z" fill="#6f9ec9" ${stk(2)}/>`
    + `<path d="M88,90 L62,16" stroke="${STK_INK}" stroke-width="7" stroke-linecap="round"/><path d="M88,90 L62,16" stroke="#d9b27a" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="M60,4 Q50,14 58,24 Q56,16 64,12 Q66,20 70,22 Q74,12 66,2 Q66,8 60,4 Z" fill="#f39a3a" ${stk(2.2)}/>`,
  // (chưa dùng — bài "Ai là chất khử?" đã bỏ) kính lúp soi CuO đen hoá đồng đỏ — đi tìm chất khử
  'kinh-lup': `<path d="M62,62 L88,88" stroke="${STK_INK}" stroke-width="12" stroke-linecap="round"/><path d="M64,64 L87,87" stroke="#a97c4b" stroke-width="6" stroke-linecap="round"/>`
    + `<circle cx="42" cy="42" r="30" fill="#dff1f7" ${stk(4)}/>`
    + `<circle cx="34" cy="46" r="9" fill="#3b3025"/><circle cx="52" cy="38" r="9" fill="#c8693a" ${stk(2)}/><path d="M40,42 l6,-3" ${stk(2)}/>`
    + `<path d="M24,26 Q30,18 40,18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  // 20 · giấy quỳ: một dải hoá đỏ (axit), một dải hoá xanh (bazơ)
  'giay-quy': `<rect x="20" y="10" width="22" height="78" rx="3" transform="rotate(-12 31 49)" fill="#b48ad1" ${stk()}/><rect x="20" y="48" width="22" height="40" transform="rotate(-12 31 49)" fill="#d9634f"/>`
    + `<rect x="20" y="10" width="22" height="78" rx="3" transform="rotate(-12 31 49)" fill="none" ${stk()}/>`
    + `<rect x="56" y="12" width="22" height="78" rx="3" transform="rotate(10 67 51)" fill="#b48ad1" ${stk()}/><rect x="56" y="50" width="22" height="40" transform="rotate(10 67 51)" fill="#6f9ec9"/>`
    + `<rect x="56" y="12" width="22" height="78" rx="3" transform="rotate(10 67 51)" fill="none" ${stk()}/>`,
  // 13 · ngôi nhà, cửa sổ có lọ muối — hoá học trong nhà
  'nha': `<path d="M16,48 L50,16 L84,48" fill="#d9634f" ${stk()}/><rect x="24" y="46" width="52" height="44" fill="#f3e6c8" ${stk()}/>`
    + `<path d="M8,50 L50,12 L92,50" fill="none" ${stk(5)}/><rect x="44" y="62" width="16" height="28" fill="#a97c4b" ${stk(2.5)}/>`
    + `<rect x="28" y="56" width="12" height="12" fill="#bfe0e4" ${stk(2.2)}/><path d="M66,72 q0,-8 6,-8 q6,0 6,8 v10 h-12 z" fill="#fffdf5" ${stk(2.2)}/>` + stkT(72, 80, 'S', 8),
  // 14 · sổ ghi chép gáy lò xo
  'so-tay': `<rect x="22" y="10" width="60" height="82" rx="6" fill="#7fc4c9" ${stk()}/><rect x="30" y="18" width="46" height="66" rx="3" fill="#fffdf5" ${stk(2.5)}/>`
    + [20, 34, 48, 62, 76].map(y => `<circle cx="22" cy="${y + 4}" r="4" fill="#fffdf5" ${stk(2)}/>`).join('')
    + [32, 44, 56, 68].map(y => `<path d="M38,${y} h${y === 44 ? 22 : 30}" ${stk(2)} opacity=".6"/>`).join('') + stkT(57, 80, 'Zn+2HCl', 7),
  // 15 · giá ba ống nghiệm, một ống đang sủi bọt
  'gia-ong-nghiem': [26, 50, 74].map((x, k) => `<path d="M${x - 8},14 L${x - 8},70 Q${x - 8},80 ${x},80 Q${x + 8},80 ${x + 8},70 L${x + 8},14" fill="${GLASS}" ${stk(3)}/>`
      + `<path d="M${x - 7},${50 - k*6} L${x + 7},${50 - k*6} L${x + 7},70 Q${x + 7},79 ${x},79 Q${x - 7},79 ${x - 7},70 Z" fill="${['#f6d27a', '#9fd3e6', '#f2a868'][k]}"/>`
      + `<path d="M${x - 8},14 L${x - 8},70 Q${x - 8},80 ${x},80 Q${x + 8},80 ${x + 8},70 L${x + 8},14" fill="none" ${stk(3)}/>`).join('')
    + [[48, 40], [53, 32], [49, 24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" ${stk(1.6)}/>`).join('')
    + `<rect x="8" y="52" width="84" height="10" rx="3" fill="#a97c4b" ${stk(3)}/><path d="M12,62 L12,94 M88,62 L88,94 M8,92 L92,92" ${stk(4)}/>`,
  // 16 · pipet nhỏ giọt vào dung dịch bazơ hoá hồng
  'pipet-hong': `<path d="M58,6 Q70,6 70,18 L66,24 L62,24 L56,18 Q50,8 58,6 Z" fill="#d9634f" ${stk(3)}/>`
    + `<path d="M58,24 L70,24 L67,62 L64,72 L61,62 Z" fill="${GLASS}" ${stk(3)}/><path d="M59,46 L69,46 L67,62 L64,70 L61,62 Z" fill="#9fd3e6"/>`
    + `<path d="M58,24 L70,24 L67,62 L64,72 L61,62 Z" fill="none" ${stk(3)}/>`
    + `<path d="M64,76 Q60,82 64,86 Q68,82 64,76 Z" fill="#f08fb0" ${stk(2)}/>`
    + `<path d="M16,78 Q50,70 88,78 L82,94 L22,94 Z" fill="#f08fb0" ${stk()}/><path d="M28,84 q6,-3 12,0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`,
  // 17 · ba giỏ phân loại, bi màu nằm trong
  'gio-phan-loai': [20, 50, 80].map((x, k) => `<path d="M${x - 14},52 L${x - 11},86 L${x + 11},86 L${x + 14},52 Z" fill="${['#f6d27a', '#9fd3e6', '#f2a868'][k]}" ${stk(3)}/>`
      + `<circle cx="${x - 3}" cy="${44 - k*2}" r="6" fill="${['#d9634f', '#6f9ec9', '#7aa95c'][k]}" ${stk(2)}/><circle cx="${x + 6}" cy="${40 - k*2}" r="4.5" fill="#fffdf5" ${stk(2)}/>`).join('')
    + `<path d="M6,52 L94,52" ${stk(3)}/>`,
  // (chưa dùng — bài "Axit mạnh" đã bỏ) lọ axit nâu, nhãn cảnh báo ăn mòn
  'lo-axit': `<rect x="40" y="6" width="20" height="14" rx="3" fill="#d9634f" ${stk(3)}/><path d="M42,20 L42,28 Q24,34 24,50 L24,86 Q24,94 32,94 L68,94 Q76,94 76,86 L76,50 Q76,34 58,28 L58,20 Z" fill="#a9653a" ${stk()}/>`
    + `<rect x="30" y="48" width="40" height="34" rx="4" fill="#fffdf5" ${stk(2.5)}/>`
    + `<path d="M50,52 L64,65 L50,78 L36,65 Z" fill="#f39a3a" ${stk(2.2)}/>` + stkT(50, 71, '!', 13),
  // 19 · phễu lọc có giấy lọc, nước lọc nhỏ xuống
  'pheu-loc': `<path d="M14,16 L86,16 L56,54 L56,80 L44,80 L44,54 Z" fill="${GLASS}" ${stk()}/>`
    + `<path d="M22,20 L78,20 L52,50 L48,50 Z" fill="#fffdf5" ${stk(2.2)}/><path d="M30,24 Q50,30 70,24 L58,38 Q50,40 42,38 Z" fill="#6f9ec9" opacity=".85"/>`
    + `<path d="M50,84 Q46,90 50,94 Q54,90 50,84 Z" fill="#9fd3e6" ${stk(2)}/>`,
  // 21 · huy chương
  'huy-chuong': `<path d="M30,6 L46,44 L56,40 L42,6 Z" fill="#d9634f" ${stk(3)}/><path d="M70,6 L54,44 L44,40 L58,6 Z" fill="#6f9ec9" ${stk(3)}/>`
    + `<circle cx="50" cy="66" r="26" fill="#f2c94c" ${stk()}/><circle cx="50" cy="66" r="17" fill="none" stroke="#c99a1e" stroke-width="3"/>`
    + `<path d="M50,54 L54,63 L63,63 L56,69 L59,78 L50,72 L41,78 L44,69 L37,63 L46,63 Z" fill="#fffdf5" ${stk(2)}/>`,
  // 25 · lon nhôm
  'lon-nhom': `<path d="M26,18 Q26,10 34,10 L66,10 Q74,10 74,18 L74,84 Q74,92 66,92 L34,92 Q26,92 26,84 Z" fill="#d6dbe0" ${stk()}/>`
    + `<ellipse cx="50" cy="14" rx="22" ry="5" fill="#c9cdd2" ${stk(2.5)}/><path d="M52,12 l8,-4" ${stk(3)}/>`
    + `<rect x="26" y="40" width="48" height="24" fill="#7fc4c9" ${stk(2.5)}/>` + stkT(50, 58, 'Al', 15)
    + `<path d="M34,22 L34,82" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  // 26 · đinh sắt lốm đốm gỉ
  'dinh-sat': `<path d="M28,14 L72,14 Q76,22 64,24 L36,24 Q24,22 28,14 Z" fill="#8a9198" ${stk()}/>`
    + `<path d="M44,24 L56,24 L54,82 L50,96 L46,82 Z" fill="#aab1b8" ${stk()}/>`
    + [[49, 40, 3.5], [52, 58, 3], [48, 70, 2.6], [40, 18, 2.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#b5652e"/>`).join(''),
  // 24 · bảng tuần hoàn thu nhỏ
  'bang-tuan-hoan': [[0, 0], [7, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]].map(([c, r]) =>
      `<rect x="${8 + c*11}" y="${22 + r*14}" width="10" height="13" rx="1.5" fill="${c < 2 ? '#f2a868' : c > 5 ? '#9fd3e6' : r === 0 ? '#fff' : '#f6d27a'}" ${stk(1.8)}/>`).join('')
    + stkT(50, 16, 'H … He', 10),
  // 12 · bình khí clo vàng lục
  'binh-clo': `<path d="M40,8 L60,8 L60,24 Q80,32 80,54 L80,82 Q80,92 70,92 L30,92 Q20,92 20,82 L20,54 Q20,32 40,24 Z" fill="#d7e48a" ${stk()}/>`
    + `<path d="M28,60 Q40,50 52,60 T76,60 M26,76 Q38,66 50,76 T74,76" fill="none" stroke="#a9b84a" stroke-width="3" stroke-linecap="round"/>`
    + `<rect x="38" y="4" width="24" height="8" rx="2" fill="#a97c4b" ${stk(2.5)}/>` + stkT(50, 46, 'Cl₂', 15),
  // 27 · nhà máy ống khói
  'nha-may': `<path d="M8,92 L8,52 L28,62 L28,52 L48,62 L48,52 L68,62 L68,92 Z" fill="#e6dcc6" ${stk()}/>`
    + `<rect x="72" y="26" width="16" height="66" fill="#c9cdd2" ${stk(3)}/><rect x="72" y="32" width="16" height="7" fill="#d9634f"/>`
    + `<rect x="72" y="26" width="16" height="66" fill="none" ${stk(3)}/><path d="M4,92 L96,92" ${stk(4)}/>`
    + [[18, 74], [38, 74], [58, 74]].map(([x, y]) => `<rect x="${x - 5}" y="${y}" width="10" height="9" fill="#7fc4c9" ${stk(2)}/>`).join('')
    + `<circle cx="80" cy="16" r="7" fill="#f7f4ec" ${stk(2.2)}/><circle cx="90" cy="8" r="5.5" fill="#f7f4ec" ${stk(2)}/>`,
  // 28 · cúp vàng
  'cup': `<path d="M28,10 L72,10 L70,40 Q66,58 50,60 Q34,58 30,40 Z" fill="#f2c94c" ${stk()}/>`
    + `<path d="M28,16 Q12,16 14,30 Q16,42 30,42 M72,16 Q88,16 86,30 Q84,42 70,42" fill="none" ${stk(3.5)}/>`
    + `<path d="M46,60 L54,60 L56,76 L44,76 Z" fill="#c99a1e" ${stk(3)}/><rect x="30" y="76" width="40" height="14" rx="3" fill="#a97c4b" ${stk(3)}/>`
    + `<path d="M40,20 Q38,34 46,44" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>`,
  // 29 · bình điện phân hai điện cực, pin phía trên
  'dien-phan': `<rect x="28" y="6" width="44" height="18" rx="4" fill="#f6d27a" ${stk(3)}/><rect x="72" y="11" width="5" height="8" fill="#3b3025"/>` + stkT(40, 20, '+', 13) + stkT(62, 20, '−', 13)
    + `<path d="M36,24 L36,58 M64,24 L64,58" ${stk(4)}/>`
    + `<path d="M16,44 L16,84 Q16,92 26,92 L74,92 Q84,92 84,84 L84,44" fill="${GLASS}" ${stk()}/><path d="M17,62 L83,62 L83,84 Q83,91 74,91 L26,91 Q17,91 17,84 Z" fill="#7fbfa0"/>`
    + `<path d="M16,44 L16,84 Q16,92 26,92 L74,92 Q84,92 84,84 L84,44" fill="none" ${stk()}/>`
    + `<rect x="32" y="56" width="8" height="26" fill="#4a4238" ${stk(2)}/><rect x="60" y="56" width="8" height="26" fill="#c8693a" ${stk(2)}/>`
    + [[66, 50], [70, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" ${stk(1.6)}/>`).join(''),
  // 30 · bình tam giác dung dịch thuốc tím
  'lo-thuoc-tim': `<path d="M40,8 L60,8 M42,8 L42,36 L18,84 Q14,92 24,92 L76,92 Q86,92 82,84 L58,36 L58,8" fill="${GLASS}" ${stk()}/>`
    + `<path d="M31,60 L69,60 L81,84 Q84,90 76,90 L24,90 Q16,90 19,84 Z" fill="#7d2b8b"/>`
    + `<path d="M40,8 L60,8 M42,8 L42,36 L18,84 Q14,92 24,92 L76,92 Q86,92 82,84 L58,36 L58,8" fill="none" ${stk()}/>`
    + `<path d="M30,76 q6,-3 12,0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`,
  // 10 · hai lọ khí mất nhãn và que đóm đang cháy — đi tìm lọ nào là khí nào
  'lo-khi': `<rect x="12" y="8" width="16" height="9" rx="2" fill="#a97c4b" ${stk(2.2)}/><path d="M14,16 L26,16 L26,26 Q35,30 35,42 L35,84 Q35,91 28,91 L12,91 Q5,91 5,84 L5,42 Q5,30 14,26 Z" fill="${GLASS}" ${stk(3)}/><rect x="10" y="50" width="20" height="20" rx="2" fill="#fffdf5" ${stk(2)}/>` + stkT(20, 66, '?', 16)
    + `<rect x="42" y="8" width="16" height="9" rx="2" fill="#a97c4b" ${stk(2.2)}/><path d="M44,16 L56,16 L56,26 Q65,30 65,42 L65,84 Q65,91 58,91 L42,91 Q35,91 35,84 L35,42 Q35,30 44,26 Z" fill="${GLASS}" ${stk(3)}/><rect x="40" y="50" width="20" height="20" rx="2" fill="#fffdf5" ${stk(2)}/>` + stkT(50, 66, '?', 16)
    + `<path d="M92,94 L78,34" stroke="${STK_INK}" stroke-width="7" stroke-linecap="round"/><path d="M92,94 L78,34" stroke="#d9b27a" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="M76,32 Q64,22 72,10 Q72,18 78,20 Q82,12 80,4 Q92,16 84,30 Q82,34 76,32 Z" fill="#f39a3a" ${stk(2.2)}/><path d="M78,28 Q74,22 78,16 Q80,22 82,24 Q82,28 78,28 Z" fill="#f6d27a"/>`,
  // 22 · mẩu natri ngâm trong lọ dầu hoả — kim loại kiềm
  'kim-loai-kiem': `<path d="M22,24 L78,24 L78,84 Q78,92 70,92 L30,92 Q22,92 22,84 Z" fill="${GLASS}"/>`
    + `<path d="M23,48 Q50,42 77,48 L77,84 Q77,91 70,91 L30,91 Q23,91 23,84 Z" fill="#f3e3a0"/>`
    + `<path d="M22,24 L78,24 L78,84 Q78,92 70,92 L30,92 Q22,92 22,84 Z" fill="none" ${stk()}/>`
    + `<rect x="18" y="12" width="64" height="13" rx="3" fill="#d9634f" ${stk(3)}/>` + stkT(50, 41, 'Na', 14)
    + `<path d="M34,66 L52,60 L66,66 L66,82 L48,88 L34,82 Z" fill="#b9bec4" ${stk(2.5)}/><path d="M34,66 L52,60 L66,66 L48,72 Z" fill="#eef0f2" ${stk(2)}/><path d="M48,72 L48,88" ${stk(2)}/>`
    + `<path d="M30,56 q6,-3 12,0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`,
  // 23 · kẹp gắp dải magie cháy sáng chói — kim loại kiềm thổ
  'kiem-tho': `<path d="M94,94 L58,56 M86,98 L52,62" stroke="${STK_INK}" stroke-width="8" stroke-linecap="round"/><path d="M94,94 L58,56 M86,98 L52,62" stroke="#c9cdd2" stroke-width="3.5" stroke-linecap="round"/>`
    + `<path d="M56,58 L46,48 L50,42 L38,36" fill="none" stroke="${STK_INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M56,58 L46,48 L50,42 L38,36" fill="none" stroke="#dfe3e7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    + '<path d="' + Array.from({length:16}, (_, k) => { const a = k*Math.PI/8, r = k % 2 ? 9 : 21; return (k ? 'L' : 'M') + (28 + r*Math.cos(a)).toFixed(1) + ',' + (30 + r*Math.sin(a)).toFixed(1); }).join('') + `Z" fill="#fffbe6" ${stk(2.5)}/>`
    + `<circle cx="28" cy="30" r="7" fill="#ffe58a"/>` + [[56, 14], [10, 60], [62, 34]].map(([x, y]) => `<path d="M${x - 4},${y} h8 M${x},${y - 4} v8" ${stk(2)}/>`).join('')
    + stkT(76, 24, 'Mg', 14),
  // 31 · ba mắt xích nối nhau
  'xich': [[22, 50, -30, '#9fd3e6'], [50, 50, 30, '#f6d27a'], [78, 50, -30, '#f2a868']].map(([x, y, a, c]) =>
      `<rect x="${x - 18}" y="${y - 11}" width="36" height="22" rx="11" transform="rotate(${a} ${x} ${y})" fill="none" stroke="${STK_INK}" stroke-width="11"/>`
      + `<rect x="${x - 18}" y="${y - 11}" width="36" height="22" rx="11" transform="rotate(${a} ${x} ${y})" fill="none" stroke="${c}" stroke-width="5"/>`).join('')
};

// bộ lọc dán sticker: viền trắng dày quanh hình + mép mực mờ bên ngoài (cùng kiểu sticker phân tử)
const STK_FILTER = '<filter id="stkf" x="-25%" y="-25%" width="150%" height="150%">'
  + '<feMorphology in="SourceAlpha" operator="dilate" radius="5.5" result="w"/>'
  + '<feMorphology in="SourceAlpha" operator="dilate" radius="7" result="e"/>'
  + `<feFlood flood-color="${STK_INK}" flood-opacity=".28"/><feComposite in2="e" operator="in" result="edge"/>`
  + '<feFlood flood-color="#fff"/><feComposite in2="w" operator="in" result="white"/>'
  + '<feMerge><feMergeNode in="edge"/><feMergeNode in="white"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

// sticker cho ô W×H: dụng cụ (STICKERS) nghiêng nhẹ theo khoá, hoặc mô hình bi–que nếu khoá là công thức hoá học
function stickerBox(key, W, H, seed){
  const art = STICKERS[key];
  if(!art) return molBox(key, W, H, 1.15);
  const tilt = ((seed || 0) * 37 % 13) - 6;   // −6…6 độ, cố định theo ngày
  const sz = Math.min(W, H) + 12;   // tràn ra ngoài khung một chút: viền trắng của sticker không tính vào cỡ hình
  return `<div class="stkbox" style="width:${W}px;height:${H}px"><svg viewBox="-8 -8 116 116" width="${sz}" height="${sz}" style="transform:rotate(${tilt}deg)" aria-hidden="true">`
    + `<defs>${STK_FILTER}</defs><g filter="url(#stkf)">${art}</g></svg></div>`;
}
