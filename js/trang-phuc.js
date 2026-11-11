/* =====================================================================
   TRANG PHỤC — skin 1 và 2 của từng nhân vật (skin 0 "Cổ điển" là hình gốc, không khai báo ở đây).
   Nạp TRƯỚC js/nhan-vat-skin.js. Xem thử: tools/xem-trang-phuc.html.

   Khoá = chỉ số HD_CHARS: 0 Giáo sư Hoffmann · 1 Bà Tư (lò bánh mì) · 2 Chú Ba (nông dân) · 3 Bé Na (học sinh lớp 8)
   · 4 Anh Minh (thợ xây) · 5 Cô Lan (y tá trạm xá) · 6 Ông Sáu (chủ ao cá) · 7 Bạn Tí (học sinh lớp 8)
   · 8 Chị Hoa (tiệm vàng bạc) · 9 Thầy Nam (giáo viên Hoá) · 10 Cô Mai (quán chè)

   Mỗi skin là một object, mọi trường đều không bắt buộc:
     ten   : tên bộ đồ (tiếng Việt, ngắn)
     grad  : {idHoặcĐuôiId: ['#màu1', '#màu2', …]} — đổi màu các điểm dừng của gradient theo thứ tự.
             Khoá đủ id ('hd1__Linear14') hoặc đuôi id ('c3cloth' → cả 'hd4_c3cloth' lẫn 'hd4e_c3cloth').
     swap  : [['màu cũ', 'màu mới'], …] — thay chuỗi màu trong cả hình (cẩn thận: da, tóc dùng chung màu thì cũng đổi).
     over  : chuỗi SVG vẽ đè lên quần áo (nằm dưới mắt). Toạ độ theo viewBox của nhân vật.
     under : chuỗi SVG vẽ sau lưng mọi thứ.
     prop  : chỉ cho khách (1..10): thay đạo cụ cổ điển (CUST_PROPS trong do-hoa.js); '' là bỏ đạo cụ; không khai báo là giữ.
   Id dùng trong over / under / prop phải bắt đầu bằng 'tp<khoá>s<skin>_' để không trùng giữa các hình.

   Thứ tự lớp (xem nhan-vat-skin.js): thân + tay → over → mắt → đồ của diversify (cổ áo, tạp dề…) → prop.
   over nằm TRÊN cả hai tay, nên ở khách 4–10 lớp vẽ thêm nào phủ thân áo sẽ vẽ lại hai tay ở cuối (tpArms).
   ===================================================================== */
'use strict';

const TRANG_PHUC = (() => {
  const INK = '#3b3025';
  // nhóm nét mực chuẩn
  const g = (inner, w) => `<g stroke="${INK}" stroke-width="${w || 2.6}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
  // khách 4–10 (khung 200x280): vẽ lại hai ống tay + bàn tay lên trên lớp over (đúng nét gốc trong nhan-vat.js).
  // L, R: màu tay trái / phải (mặc định là gradient áo của chính nhân vật, nên đổi grad là tay đổi theo)
  const tpArms = (n, L, R) => {
    const id = 'hd' + n + '_c' + (n - 1);
    L = L || `url(#${id}cloth)`; R = R || `url(#${id}clothL)`;
    return `<g stroke="${INK}" stroke-width="3.2" stroke-linejoin="round">`
      + `<path fill="${L}" d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z"/>`
      + `<path fill="url(#${id}skin)" d="M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z"/>`
      + '<g transform="translate(-5,-13)"><path d="M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12" fill="none" stroke-width="2"/></g>'
      + `<path fill="${R}" d="M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/>`
      + `<path fill="url(#${id}skin)" d="M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z"/>`
      + '<g transform="translate(5,-13)"><path d="M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12" fill="none" stroke-width="2"/></g></g>';
  };
  // đạo cụ cổ điển của khách (CUST_PROPS trong do-hoa.js, khoá = khoá ở đây − 1), để skin giữ nó và vẽ thêm
  const classic = n => (typeof CUST_PROPS !== 'undefined' && CUST_PROPS[n - 1]) || '';

  return {
    /* ---------- 0 · Giáo sư Hoffmann (khung 280x320, thân áo vẽ trong nhóm dịch +20) ---------- */
    0: [
      { ten: 'Blouse cách tân',
        grad: { hd0__Linear17: ['#fbfdfb', '#dbe7e2'], hd0__Linear18: ['#e2eee9', '#fbfdfb'],
                hd0__Linear19: ['#ffffff', '#dbe7e2'], hd0__Linear22: ['#e2eee9', '#fbfdfb'],
                hd0__Linear23: ['#c9aee6', '#8d68b8'] },
        over: '<g transform="translate(20,0)">'
          // che ve áo + nơ cũ bằng chính màu áo, rồi vẽ cổ đứng có khoá kéo
          + '<path d="M80,198 q40,-34 80,0 v10 h-80z M114,238 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0 M114,266 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" fill="url(#hd0__Linear17)"/>'
          + g('<path d="M104,168 q16,9 32,0 l2,12 q-18,8 -36,0z" fill="#5fb5ab"/>', 2.8)
          + g('<path d="M98,176 q22,12 44,0 l5,12 q-27,14 -54,0z" fill="#f6faf8"/>', 3)
          + '<path d="M97,183 q23,11 46,0" fill="none" stroke="#4fa39a" stroke-width="2" stroke-linecap="round"/>'
          // khoá kéo xanh ngọc chạy dọc
          + '<path d="M120,194 v124" fill="none" stroke="#4fa39a" stroke-width="2.6"/>'
          + g('<rect x="116.5" y="194" width="7" height="11" rx="2" fill="#e8b84b"/>', 1.6)
          // túi ngực: nắp xanh ngọc + bút màu
          + g('<path d="M140,214 v-14 M147,214 v-17 M154,214 v-12" fill="none" stroke-width="4" stroke="#6f9ec9"/>'
            + '<path d="M147,197 v-3" stroke-width="4"/><path d="M154,202 v-3" stroke="#e8b84b" stroke-width="4"/>', 2)
          + g('<rect x="133" y="214" width="32" height="34" rx="3" fill="#f6faf8"/>'
            + '<path d="M133,214 h32 v7 q-16,4 -32,0z" fill="#5fb5ab"/>', 2.2)
          // thẻ tên kẹp túi
          + g('<path d="M157,244 v8" fill="none" stroke-width="2"/>'
            + '<rect x="145" y="251" width="24" height="30" rx="3" fill="#fffdf5"/>'
            + '<path d="M145,257 v-3 q0,-3 3,-3 h18 q3,0 3,3 v3z" fill="#4fa39a" stroke="none"/>'
            + '<rect x="149" y="261" width="9" height="10" rx="1.5" fill="#cfe3dd" stroke-width="1.5"/>'
            + '<path d="M161,263 h5 M161,268 h4 M149,276 h16" fill="none" stroke-width="1.5" opacity=".7"/>', 2)
          + '</g>' },
      { ten: 'Áo lab xanh than',
        grad: { hd0__Linear17: ['#617699', '#3f5276'], hd0__Linear18: ['#4c6086', '#617699'],
                hd0__Linear19: ['#6c82a8', '#3f5276'], hd0__Linear22: ['#4c6086', '#617699'],
                hd0__Linear23: ['#f6c27e', '#e0874a'] },
        swap: [['rgb(243,237,220)', '#55698f'], ['fill:rgb(232,184,75);fill-opacity:0.45', 'fill:none'], ['fill:rgb(122,169,92);fill-opacity:0.4', 'fill:none']],
        over: '<g transform="translate(20,0)">'
          // kính bảo hộ đẩy lên đầu
          + g('<path d="M44,70 q76,-44 156,0" fill="none" stroke="#4fa39a" stroke-width="7"/>'
            + '<path d="M44,70 q76,-44 156,0" fill="none" stroke="' + INK + '" stroke-width="1.5" opacity=".5"/>', 2)
          + g('<path d="M84,40 q36,-12 72,0 q4,12 -2,22 q-12,4 -24,-2 q-10,-6 -20,0 q-12,6 -24,2 q-6,-10 -2,-22z" fill="#f2d48a" fill-opacity=".9"/>'
            + '<path d="M118,58 v-14" fill="none" stroke-width="2"/>'
            + '<path d="M92,46 q8,-4 16,-3 M128,44 q8,-1 16,2" fill="none" stroke="#fff" stroke-width="2.2" opacity=".8"/>', 2.8)
          // viền trắng ở ve áo
          + '<path d="M116,181 q-11,2 -20,7 M124,181 q11,2 20,7" fill="none" stroke="#e8eef6" stroke-width="2" stroke-linecap="round"/>'
          // túi ngực xanh than, viền chỉ trắng, bút
          + g('<rect x="133" y="216" width="32" height="32" rx="3" fill="#53678c"/>'
            + '<path d="M137,221 h24" fill="none" stroke="#e8eef6" stroke-width="1.5" stroke-dasharray="3 2.5"/>', 2.2)
          // huy hiệu nguyên tử
          + g('<circle cx="152" cy="268" r="14" fill="#fffdf5"/>'
            + '<g fill="none" stroke="#6f9ec9" stroke-width="1.8"><ellipse cx="152" cy="268" rx="10" ry="4"/>'
            + '<ellipse cx="152" cy="268" rx="10" ry="4" transform="rotate(60 152 268)"/>'
            + '<ellipse cx="152" cy="268" rx="10" ry="4" transform="rotate(-60 152 268)"/></g>'
            + '<circle cx="152" cy="268" r="2.4" fill="#d9634f" stroke="none"/>', 2.4)
          + '</g>' }
    ],

    /* ---------- 1 · Bà Tư — lò bánh mì (khung 280x280) ---------- */
    1: [
      { ten: 'Bếp trưởng sáng sớm',
        grad: { hd1__Linear14: ['#fffdf6', '#e9e2cf'], hd1__Linear15: ['#f1ebdc', '#d6ccb6'], hd1__Linear18: ['#f1ebdc', '#d6ccb6'] },
        swap: [['rgb(136,105,164)', '#e6dfcc'], ['fill:rgb(125,95,153)', 'fill:#ece5d4'], ['fill:rgb(232,184,75)', 'fill:#d9634f']],
        over:
          // mũ bếp thấp, nếp gấp
          '<g transform="translate(0,4)">' + g('<path d="M122,44 q-14,-30 14,-34 q8,-14 26,-8 q16,-10 30,4 q24,2 16,34 q-40,-10 -86,4z" fill="#fffdf6"/>'
            + '<path d="M148,40 q-2,-14 4,-26 M170,38 q2,-14 -2,-28 M190,40 q4,-12 2,-24" fill="none" stroke-width="1.8" opacity=".45"/>'
            + '<path d="M120,44 q44,-14 90,-4 l-2,12 q-42,-10 -86,4z" fill="#f1ebdc"/>', 2.8) + '</g>'
          // vạt áo bếp cài chéo + hai hàng khuy
          + g('<path d="M148,204 q22,8 36,2 q-6,30 -4,84" fill="none" stroke-width="2.4"/>', 2.4)
          + g('<circle cx="152" cy="226" r="3.4" fill="#d9634f"/><circle cx="152" cy="250" r="3.4" fill="#d9634f"/><circle cx="152" cy="274" r="3.4" fill="#d9634f"/>'
            + '<circle cx="190" cy="226" r="3.4" fill="#d9634f"/><circle cx="190" cy="250" r="3.4" fill="#d9634f"/><circle cx="190" cy="274" r="3.4" fill="#d9634f"/>', 1.8),
        // khay nướng với ba ổ bánh mì nhỏ
        prop: g('<path d="M168,226 q8,-12 26,-10 q8,8 -2,16 q-18,4 -24,-6z" fill="#e3a65a"/>'
            + '<path d="M130,228 q10,-14 32,-10 q8,8 -4,16 q-22,4 -28,-6z" fill="#d99a52"/>'
            + '<path d="M150,232 q10,-12 30,-8 q6,8 -4,14 q-20,4 -26,-6z" fill="#e3a65a"/>'
            + '<path d="M140,224 l5,-5 M150,224 l5,-6 M162,232 l5,-5 M172,232 l5,-5 M178,222 l4,-4 M186,222 l4,-4" fill="none" stroke-width="2" opacity=".6"/>'
            + '<path d="M112,238 h96 l-4,10 h-88z" fill="#b8bcc0"/>'
            + '<path d="M118,243 h84" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/>', 2.8) },
      { ten: 'Tạp dề caro',
        grad: { hd1__Linear14: ['#8fbf9a', '#6fa57d'], hd1__Linear15: ['#6fa57d', '#55895f'], hd1__Linear18: ['#6fa57d', '#55895f'] },
        swap: [['rgb(136,105,164)', '#5f9468'], ['fill:rgb(125,95,153)', 'fill:#4c7d55']],
        over:
          '<defs><pattern id="tp1s2_caro" width="12" height="12" patternUnits="userSpaceOnUse">'
          + '<rect width="12" height="12" fill="#fff6ea"/><rect width="6" height="12" fill="#e8907d" opacity=".55"/>'
          + '<rect width="12" height="6" fill="#e8907d" opacity=".55"/></pattern></defs>'
          // khăn trùm tóc đỏ chấm bi
          + g('<path d="M104,74 q4,-46 56,-48 q46,0 58,44 q-8,-14 -30,-18 q-28,-6 -56,2 q-20,6 -28,20z" fill="#d9634f"/>', 2.8)
          + '<g fill="#fff6ea"><circle cx="132" cy="44" r="2.6"/><circle cx="152" cy="36" r="2.6"/><circle cx="174" cy="38" r="2.6"/><circle cx="194" cy="48" r="2.6"/><circle cx="142" cy="56" r="2.2"/><circle cx="164" cy="50" r="2.2"/><circle cx="184" cy="58" r="2.2"/><circle cx="118" cy="58" r="2.2"/></g>'
          // tạp dề caro, quai đeo cổ
          + g('<path d="M140,188 l2,22 M180,188 l-2,22" fill="none" stroke-width="3"/>', 2.6)
          + g('<path d="M136,210 q24,-6 48,0 l2,28 q12,2 14,8 l2,36 h-84 l2,-36 q2,-6 14,-8z" fill="url(#tp1s2_caro)"/>'
            + '<path d="M124,246 q36,6 72,0" fill="none" stroke-width="2"/>', 2.6),
        // giỏ mây đựng bánh sừng bò
        prop: g(
            [[134, 248, -12], [161, 242, 4], [188, 248, 14]].map(([x, y, r]) =>
              `<g transform="translate(${x},${y}) rotate(${r})"><path d="M-19,5 q-3,-7 5,-9 q4,-9 14,-9 q10,0 14,9 q8,2 5,9 q-6,-4 -11,-2 q-8,-4 -16,0 q-5,-2 -11,2z" fill="#e3a65a"/>`
              + '<path d="M-9,-8 q2,5 1,9 M0,-12 v10 M9,-8 q-2,5 -1,9" fill="none" stroke-width="1.6" opacity=".55"/></g>').join('')
            + '<path d="M112,252 q48,-8 96,0 l-8,28 h-80z" fill="#c89a63"/>'
            + '<path d="M118,260 q42,-5 84,0 M120,270 q40,-4 80,0" fill="none" stroke-width="1.6" opacity=".45"/>'
            + '<path d="M126,256 l-2,24 M146,254 l-1,26 M166,254 v26 M186,255 l1,25" fill="none" stroke-width="1.4" opacity=".35"/>', 2.6) }
    ],

    /* ---------- 2 · Chú Ba — nông dân (khung 280x280; giữ nón lá) ---------- */
    2: [
      { ten: 'Yếm bò ra đồng',
        grad: { hd2__Linear12: ['#e09478', '#cc7a5e'], hd2__Linear13: ['#cc7a5e', '#a95e45'],
                hd2__Linear15: ['#d98a6e', '#b86a50'], hd2__Linear17: ['#d98a6e', '#b86a50'] },
        swap: [['fill:rgb(106,74,41)', 'fill:#a95e45']],
        over:
          // sọc caro mờ trên áo sơ mi
          '<g stroke="#fff3e6" stroke-width="2" opacity=".35"><path d="M118,220 h88 M116,240 h92 M114,260 h96 M150,200 v80 M170,196 v84 M190,200 v80 M130,206 v74"/></g>'
          // quai yếm
          + g('<path d="M128,222 l-6,-26 M192,222 l6,-26" fill="none" stroke="#5f80a8" stroke-width="9"/>', 2.6)
          + g('<path d="M128,222 l-6,-26 M192,222 l6,-26" fill="none" stroke="' + INK + '" stroke-width="1.4" opacity=".4"/>', 1.4)
          // yếm bò
          + g('<path d="M124,220 h72 l2,34 q10,4 12,26 h-100 q2,-22 12,-26z" fill="#6f8fb5"/>'
            + '<path d="M128,224 h64 v28 h-64z" fill="none" stroke="#f2d48a" stroke-width="1.4" stroke-dasharray="3 2.5"/>'
            + '<path d="M146,232 h28 v16 q-14,5 -28,0z" fill="#7d9cc0"/>'
            + '<path d="M160,246 v-8 M160,240 q-6,-6 -9,-1 q5,3 9,1z M160,238 q6,-7 10,-2 q-5,4 -10,2z" fill="#7aa95c" stroke-width="1.4"/>', 2.6)
          + g('<circle cx="130" cy="226" r="3.6" fill="#e8b84b"/><circle cx="190" cy="226" r="3.6" fill="#e8b84b"/>', 1.6) },
      { ten: 'Kỹ sư nông nghiệp',
        grad: { hd2__Linear12: ['#9cc77e', '#7aa95c'], hd2__Linear13: ['#7aa95c', '#5e8944'],
                hd2__Linear15: ['#8dbb70', '#6e9a52'], hd2__Linear17: ['#8dbb70', '#6e9a52'] },
        swap: [['fill:rgb(106,74,41)', 'fill:#5e8944']],
        over:
          // áo gi-lê kaki nhiều túi (hai vạt, chừa giữa thấy áo thun xanh)
          g('<path d="M140,182 q-24,8 -32,22 l8,14 l-6,62 h44 v-78 z" fill="#dccb9c"/>'
            + '<path d="M180,182 q24,8 32,22 l-8,14 l6,62 h-44 v-78 z" fill="#d2c08e"/>', 2.8)
          + g('<path d="M120,236 h26 v22 h-26z M174,236 h26 v22 h-26z" fill="#cdb983"/>'
            + '<path d="M118,232 h30 v8 h-30z M172,232 h30 v8 h-30z" fill="#e6d7ac"/>'
            + '<path d="M180,212 h18 v14 h-18z" fill="#cdb983"/>', 2)
          // bút + ống nghiệm thử đất trong túi ngực
          + g('<path d="M184,212 v-12" fill="none" stroke="#d9634f" stroke-width="3.4"/>'
            + '<rect x="189" y="196" width="6" height="18" rx="3" fill="#fffdf5" stroke-width="1.6"/>'
            + '<path d="M189.8,206 h4.4 v5 q0,2.5 -2.2,2.5 q-2.2,0 -2.2,-2.5z" fill="#a37b4d" stroke="none"/>', 1.6)
          // bảng tên + mầm lúa
          + g('<rect x="124" y="208" width="20" height="13" rx="2" fill="#fffdf5"/>'
            + '<path d="M130,218 v-6 M130,214 q-4,-3 -5,0 M130,213 q4,-4 6,-1" fill="none" stroke="#7aa95c" stroke-width="1.5"/>'
            + '<path d="M136,213 h5 M136,217 h4" fill="none" stroke-width="1.2" opacity=".6"/>', 1.6)
          // dây kéo áo gi-lê
          + '<path d="M152,214 v66 M168,214 v66" fill="none" stroke="#a89668" stroke-width="1.4" stroke-dasharray="2 2"/>' }
    ],

    /* ---------- 3 · Bé Na — học sinh lớp 8 (khung 280x280; giữ khăn quàng) ---------- */
    3: [
      { ten: 'Đồng phục thể dục',
        grad: { hd3__Linear13: ['#fbfcfd', '#e1e9f1'], hd3__Linear16: ['#7aa8d2', '#5b88b8'], hd3__Linear18: ['#6f9ec9', '#4f79a6'] },
        over:
          // sọc chạy dọc hai bên hông
          '<path d="M118,214 q-4,30 -4,66 M184,214 q4,30 4,66" fill="none" stroke="#6f9ec9" stroke-width="5" opacity=".9"/>'
          + '<path d="M124,220 q-3,30 -3,60 M178,220 q3,30 3,60" fill="none" stroke="#e8b84b" stroke-width="2.4"/>'
          // logo trường trên ngực
          + g('<path d="M184,214 h22 v12 q0,10 -11,14 q-11,-4 -11,-14z" fill="#6f9ec9"/>'
            + '<path d="M188,222 q4,-3 7,0 q3,-3 7,0 v9 q-3,-3 -7,0 q-3,-3 -7,0z M195,222 v9" fill="#fffdf5" stroke="#fffdf5" stroke-width="1.4"/>', 2.2) },
      { ten: 'Áo khoác đồng phục',
        grad: { hd3__Linear13: ['#5d78a6', '#465f8c'], hd3__Linear16: ['#5d78a6', '#465f8c'], hd3__Linear18: ['#4f6a98', '#3c5480'] },
        over:
          // áo sơ mi trắng bên trong + hai vạt khoá kéo
          g('<path d="M136,186 q14,7 28,0 l6,94 h-40z" fill="#fbf8f0"/>', 2.6)
          + g('<path d="M134,186 l-5,94 M166,186 l5,94" fill="none" stroke-width="2.8"/>', 2.8)
          + '<path d="M131,198 l-4,80 M169,198 l4,80" fill="none" stroke="#c9ccd2" stroke-width="2.6" stroke-dasharray="2 2"/>'
          // cổ áo khoác đứng
          + g('<path d="M126,184 q-10,4 -16,12 l18,8z M174,184 q10,4 16,12 l-18,8z" fill="#6c87b4"/>', 2.6)
          // quai ba lô
          + g('<path d="M110,208 q6,30 4,72 M192,208 q-6,30 -4,72" fill="none" stroke="#e8b84b" stroke-width="9"/>', 2.6)
          + g('<path d="M110,208 q6,30 4,72 M192,208 q-6,30 -4,72" fill="none" stroke="' + INK + '" stroke-width="1.2" opacity=".35"/>'
            + '<rect x="106" y="246" width="13" height="8" rx="2" fill="#c89a63"/><rect x="183" y="246" width="13" height="8" rx="2" fill="#c89a63"/>', 2)
          // bảng tên
          + g('<rect x="174" y="214" width="16" height="10" rx="1.5" fill="#fffdf5"/><path d="M177,219 h10" stroke="#d9634f" stroke-width="2"/>', 1.6) }
    ],

    /* ---------- 4 · Anh Minh — thợ xây (khung 200x280) ---------- */
    4: [
      { ten: 'Áo phản quang',
        grad: { c3cloth: ['#9aa3ad', '#7d8691'], c3clothL: ['#7d8691', '#646d78'] },
        over:
          '<clipPath id="tp4s1_vest"><path d="M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 l-16,40 h-8z"/></clipPath>'
          // áo gi-lê cam phản quang, chừa cổ chữ V
          + g('<path d="M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 l-16,40 h-8z" fill="#f0883e"/>', 3.2)
          + `<g clip-path="url(#tp4s1_vest)">${g('<rect x="30" y="236" width="180" height="10" fill="#e9eef0"/><rect x="30" y="258" width="180" height="10" fill="#e9eef0"/>', 2)}`
          + '<path d="M30,241 h180 M30,263 h180" stroke="#b8c2c8" stroke-width="1.4"/></g>'
          + g('<path d="M120,218 v62" fill="none" stroke-width="2.4"/>'
            + '<rect x="134" y="206" width="22" height="14" rx="2" fill="#f6a35f"/>'
            + '<path d="M140,206 v-9" fill="none" stroke="#3b3025" stroke-width="3"/>', 2)
          + tpArms(4),
        // mũ bảo hộ trắng, sọc cam
        prop: g('<path d="M64,76 q0,-48 56,-48 q56,0 56,48z" fill="#f4f1e8"/>'
            + '<rect x="56" y="72" width="128" height="13" rx="6.5" fill="#fffdf5"/>'
            + '<path d="M112,31 v41 h16 v-41 q-8,-2 -16,0z" fill="#f0883e" stroke-width="2"/>', 3) },
      { ten: 'Dây đai an toàn',
        grad: { c3cloth: ['#cdb98e', '#b8a276'], c3clothL: ['#b8a276', '#9a855c'] },
        over:
          // túi ngực áo kaki
          g('<path d="M78,206 h24 v20 q-12,4 -24,0z M138,206 h24 v20 q-12,4 -24,0z" fill="#c2ad80"/>'
            + '<path d="M78,206 h24 v6 h-24z M138,206 h24 v6 h-24z" fill="#d6c49c"/>', 2)
          // dây đai an toàn đỏ: hai quai vai + đai ngực
          + g('<path d="M92,184 q-4,40 0,96 M148,184 q4,40 0,96 M90,236 h60" fill="none" stroke="#d9634f" stroke-width="8"/>', 2)
          + '<path d="M92,184 q-4,40 0,96 M148,184 q4,40 0,96 M90,236 h60" fill="none" stroke="#f3c0b4" stroke-width="1.2" stroke-dasharray="3 3"/>'
          + g('<rect x="112" y="229" width="16" height="14" rx="3" fill="#c9ccd2"/><rect x="117" y="233" width="6" height="6" rx="1" fill="#8a9099"/>', 2)
          // thắt lưng đồ nghề: thước cuộn + búa
          + g('<rect x="64" y="262" width="112" height="12" rx="2" fill="#8a6238"/>'
            + '<rect x="114" y="260" width="12" height="16" rx="2" fill="#e8b84b"/>'
            + '<path d="M80,268 h14 v12 h-14z" fill="#a37b4d"/>'
            + '<rect x="146" y="262" width="20" height="18" rx="4" fill="#e8b84b"/><circle cx="156" cy="271" r="4.5" fill="#c9ccd2" stroke-width="1.6"/>', 2.4)
          + tpArms(4),
        // mũ vàng cổ điển + kính bảo hộ gài trên mũ
        prop: classic(4)
          + g('<path d="M68,62 q52,-16 104,0" fill="none" stroke="#3b3025" stroke-width="5"/>'
            + '<path d="M88,50 q32,-8 64,0 q3,10 -2,18 q-10,3 -20,-2 q-10,-6 -20,0 q-10,5 -20,2 q-5,-8 -2,-18z" fill="#bfe0e6" fill-opacity=".9"/>'
            + '<path d="M96,54 q6,-2 12,-2 M128,52 q6,0 12,2" fill="none" stroke="#fff" stroke-width="2"/>', 2.6) }
    ],

    /* ---------- 5 · Cô Lan — y tá trạm xá (khung 200x280; giữ ống nghe + phù hiệu chữ thập) ---------- */
    5: [
      { ten: 'Scrubs xanh dương',
        grad: { c4cloth: ['#88aedb', '#6992c4'], c4clothL: ['#6992c4', '#4f77a8'] },
        swap: [['#f7f3e8', '#5f88ba'], ['fill="#f3eddc" d="M120,176', 'fill="#7aa2d2" d="M120,176']],
        over:
          // áo lót trắng trong cổ chữ V
          g('<path d="M108,178 q12,6 24,0 l-12,24z" fill="#fbf8f0"/>', 2.4)
          // túi ngực + bút
          + g('<path d="M75,212 v-12 M81,212 v-15 M87,212 v-10" fill="none" stroke-width="3.6" stroke="#d9634f"/>'
            + '<path d="M81,212 v-15" stroke="#e8b84b" stroke-width="3.6"/>', 1.6)
          + g('<path d="M70,212 h24 v18 q-12,4 -24,0z" fill="#7aa2d2"/>', 2.2)
          // thẻ nhân viên kẹp túi
          + g('<path d="M82,230 v6" fill="none" stroke-width="2"/><rect x="72" y="235" width="20" height="26" rx="2.5" fill="#fffdf5"/>'
            + '<rect x="76" y="240" width="8" height="8" rx="1" fill="#cfe0f0" stroke-width="1.4"/>'
            + '<path d="M76,253 h12 M76,257 h9" fill="none" stroke-width="1.4" opacity=".6"/>'
            + '<path d="M86,241 h3 M87.5,239.5 v3" stroke="#d9364a" stroke-width="1.6"/>', 1.8)
          },
      { ten: 'Áo khoác trạm xá',
        grad: { c4cloth: ['#fdfcf8', '#e9e5da'], c4clothL: ['#e9e5da', '#d3cdbe'] },
        over:
          '<clipPath id="tp5s2_arm"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z"/></clipPath>'
          // áo scrubs xanh ngọc lộ ra ở cổ
          + g('<path d="M100,176 q20,8 40,0 l-20,36z" fill="#5fb5ab"/>', 2.4)
          // túi hông + túi ngực
          + g('<path d="M71,246 v-14 M77,246 v-10" fill="none" stroke="#6f9ec9" stroke-width="3.4"/>'
            + '<path d="M68,246 h26 v22 q-13,4 -26,0z M146,246 h26 v22 q-13,4 -26,0z" fill="#f4f1e8"/>', 2.2)
          + '<path d="M120,214 v66" fill="none" stroke="#3b3025" stroke-width="2" opacity=".5"/>'
          // băng tay chữ thập đỏ
          + `<g clip-path="url(#tp5s2_arm)">${g('<rect x="20" y="214" width="60" height="18" fill="#fffdf5"/><path d="M20,214 h60 M20,232 h60" fill="none" stroke="#d9364a" stroke-width="2.6"/>'
            + '<path d="M46,217 v12 M40,223 h12" stroke="#d9364a" stroke-width="3.6"/>', 2)}</g>`
          + '<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z" fill="none" stroke="#3b3025" stroke-width="3.2" stroke-linejoin="round"/>'
          // mũ y tế xanh ngọc, hoạ tiết chấm
          + g('<path d="M76,74 q-2,-40 44,-42 q46,2 44,42 q-20,-14 -44,-14 q-24,0 -44,14z" fill="#5fb5ab"/>'
            + '<path d="M78,72 q42,-26 84,0" fill="none" stroke-width="2"/>', 2.8)
          + '<g fill="#fffdf5" opacity=".85"><circle cx="100" cy="46" r="2"/><circle cx="120" cy="40" r="2"/><circle cx="140" cy="46" r="2"/><circle cx="110" cy="56" r="2"/><circle cx="130" cy="56" r="2"/><circle cx="90" cy="60" r="1.8"/><circle cx="150" cy="60" r="1.8"/></g>' }
    ],

    /* ---------- 6 · Ông Sáu — chủ ao cá (khung 200x280) ---------- */
    6: [
      { ten: 'Áo phao câu cá',
        grad: { c5cloth: ['#9fae72', '#86965a'], c5clothL: ['#86965a', '#6c7b45'] },
        swap: [['#f7f0df', '#d3e3ef']],
        over:
          '<defs><linearGradient id="tp6s1_sl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9dcec"/><stop offset="1" stop-color="#a6c1da"/></linearGradient></defs>'
          // túi hộp trên áo phao
          + g('<path d="M82,206 h26 v20 h-26z M132,206 h26 v20 h-26z M82,240 h28 v26 h-28z M130,240 h28 v26 h-28z" fill="#7c8b4f"/>'
            + '<path d="M80,203 h30 v7 h-30z M130,203 h30 v7 h-30z M80,237 h32 v7 h-32z M128,237 h32 v7 h-32z" fill="#a8b67c"/>', 2)
          // mồi câu móc trên túi
          + '<g transform="translate(0,34)">' + g('<path d="M146,210 v6" fill="none" stroke-width="1.6"/><path d="M140,216 q6,-3 12,0 q-6,7 -12,0z" fill="#d9634f" stroke-width="1.6"/>'
            + '<path d="M152,216 l3,4" fill="none" stroke-width="1.4"/>', 1.6) + '</g>'
          + tpArms(6, 'url(#tp6s1_sl)', 'url(#tp6s1_sl)')
          // mũ tai bèo
          + g('<path d="M86,64 q2,-34 34,-34 q32,0 34,34z" fill="#b9c48c"/>'
            + '<path d="M66,70 q54,-16 108,0 q4,6 -2,9 q-52,-12 -104,0 q-6,-3 -2,-9z" fill="#a3b075"/>'
            + '<path d="M87,58 q33,-8 66,0" fill="none" stroke="#6c7b45" stroke-width="4"/>', 2.8) },
      { ten: 'Yếm lội ao',
        over:
          '<defs><pattern id="tp6s2_soc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f6f1e4"/><rect width="10" height="4.5" fill="#6f9ec9"/></pattern></defs>'
          // áo thun sọc xanh
          + g('<path d="M104,176 q-32,9 -46,30 q-14,20 -16,84 l156,0 q-2,-64 -16,-84 q-14,-21 -46,-30 q-14,8 -32,0z" fill="url(#tp6s2_soc)"/>', 3.2)
          // quai + yếm cao su xanh rêu
          + g('<path d="M84,226 l-6,-30 M156,226 l6,-30" fill="none" stroke="#4f7a5a" stroke-width="8"/>', 2)
          + g('<path d="M82,222 h76 l4,58 h-84z" fill="#5b8a66"/>'
            + '<path d="M104,232 h32 v18 q-16,5 -32,0z" fill="#4f7a5a"/>'
            + '<path d="M88,236 q2,20 0,44 M152,236 q-2,20 0,44" fill="none" stroke="#fff" stroke-width="2" opacity=".25"/>', 2.6)
          + g('<rect x="78" y="220" width="12" height="9" rx="2" fill="#c9ccd2"/><rect x="150" y="220" width="12" height="9" rx="2" fill="#c9ccd2"/>', 1.8)
          + tpArms(6, 'url(#tp6s2_soc)', 'url(#tp6s2_soc)'),
        // ôm con cá chép đỏ cam
        prop: g('<path d="M78,236 q28,-26 60,0 q-28,24 -60,0z" fill="#ef9a52"/>'
            + '<path d="M138,236 l20,-14 q-4,14 0,28z" fill="#e07a3c"/>'
            + '<path d="M100,224 q8,-8 18,-2 z" fill="#e07a3c" stroke-width="2"/>'
            + '<path d="M98,232 q4,4 0,8 M108,230 q4,6 0,12 M118,230 q4,6 0,12" fill="none" stroke-width="1.6" opacity=".5"/>'
            + '<path d="M82,238 q-4,6 -8,6" fill="none" stroke-width="1.6"/>'
            + '<circle cx="88" cy="232" r="2.6" fill="#3b3025" stroke="none"/>', 3) }
    ],

    /* ---------- 7 · Bạn Tí — học sinh lớp 8 (khung 200x280; mũ lưỡi trai dùng chung gradient áo; giữ khăn quàng) ---------- */
    7: [
      { ten: 'Áo đấu lớp 8',
        grad: { c6cloth: ['#92c67a', '#72a95c'], c6clothL: ['#72a95c', '#57893f'] },
        over:
          '<clipPath id="tp7s1_arms"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          // viền cổ trắng, sọc tay áo
          + '<path d="M102,185 q18,13 36,0" fill="none" stroke="#fffdf5" stroke-width="5" stroke-linecap="round"/>'
          + `<g clip-path="url(#tp7s1_arms)"><path d="M20,252 h200" stroke="#fffdf5" stroke-width="7"/><path d="M20,248.5 h200 M20,255.5 h200" stroke="${INK}" stroke-width="1.4" opacity=".5"/></g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2)
          // số 8 to trên ngực
          + `<g fill="none" stroke="${INK}" stroke-width="8"><circle cx="155" cy="219" r="7"/><circle cx="155" cy="237" r="9.5"/></g>`
          + '<g fill="none" stroke="#fffdf5" stroke-width="4"><circle cx="155" cy="219" r="7"/><circle cx="155" cy="237" r="9.5"/></g>'
          // logo trường nhỏ bên trái
          + g('<circle cx="82" cy="212" r="7" fill="#fffdf5"/><path d="M78,212 l3,3 l5,-6" fill="none" stroke="#72a95c" stroke-width="2"/>', 1.8),
        prop: classic(7) },
      { ten: 'Áo khoác gió',
        grad: { c6cloth: ['#78c3b8', '#56a69c'], c6clothL: ['#56a69c', '#3f857c'] },
        over:
          '<clipPath id="tp7s2_body"><path d="M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 q-16,9 -40,0z M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          // dải phối màu kem + cam ngang ngực và tay
          + `<g clip-path="url(#tp7s2_body)"><rect x="20" y="214" width="200" height="16" fill="#f4ecd6"/><rect x="20" y="230" width="200" height="6" fill="#e8925c"/>`
          + `<path d="M20,214 h200 M20,236 h200" stroke="${INK}" stroke-width="2"/></g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2)
          // khoá kéo
          + '<path d="M120,190 v90" fill="none" stroke="#3f857c" stroke-width="2.6"/>'
          // túi đeo chéo
          + g('<path d="M62,202 L150,262" fill="none" stroke="#8a6238" stroke-width="6"/>', 2)
          + g('<path d="M138,252 h34 q4,0 4,4 v20 h-42 v-20 q0,-4 4,-4z" fill="#e8b84b"/>'
            + '<path d="M134,262 q21,6 42,0" fill="none" stroke-width="2"/><rect x="151" y="261" width="8" height="6" rx="1.5" fill="#c9ccd2" stroke-width="1.4"/>', 2.6),
        prop: classic(7) }
    ],

    /* ---------- 8 · Chị Hoa — tiệm vàng bạc (khung 200x280) ---------- */
    8: [
      { ten: 'Vest ngọc bích',
        grad: { c7cloth: ['#4fa88b', '#358a70'], c7clothL: ['#358a70', '#276c58'] },
        over:
          // áo lụa kem bên trong, ve vest bản to
          g('<path d="M106,178 L120,240 L134,178z" fill="#f6eedc"/>', 2.4)
          + g('<path d="M108,176 q-10,4 -16,10 l6,10 l-6,5 l20,40 l8,-1z" fill="#3f9b7f"/>'
            + '<path d="M132,176 q10,4 16,10 l-6,10 l6,5 l-20,40 l-8,-1z" fill="#2f8068"/>', 2.6)
          // khuy vàng, túi có khăn cài
          + g('<circle cx="120" cy="254" r="3.6" fill="#f0c419"/><circle cx="120" cy="270" r="3.6" fill="#f0c419"/>', 1.6)
          + g('<path d="M148,224 l6,-8 l5,6 l5,-7 l4,9z" fill="#f2d48a" stroke-width="1.6"/><path d="M146,224 h24" fill="none" stroke-width="2.2"/>', 2)
          // trâm cài hoa vàng trên ve trái
          + g('<g transform="translate(98,214)"><circle r="3" cx="0" cy="-4" fill="#f0c419"/><circle r="3" cx="4" cy="0" fill="#f0c419"/><circle r="3" cx="0" cy="4" fill="#f0c419"/><circle r="3" cx="-4" cy="0" fill="#f0c419"/><circle r="2" fill="#d9634f"/></g>', 1.2),
        prop: classic(8) },
      { ten: 'Áo lụa đỏ may mắn',
        grad: { c7cloth: ['#d8645a', '#bf4c43'], c7clothL: ['#bf4c43', '#9e3b34'] },
        swap: [['fill="#efe3d2"', 'fill="#c9554b"'], ['#d9634f" d="M108,182', '#e8b84b" d="M108,182']],
        over:
          // hoạ tiết hoa mai vàng nhỏ trên lụa
          '<g fill="#f2c94c" opacity=".8">'
          + [[80, 214], [150, 210], [96, 250], [146, 252], [70, 272], [168, 236], [120, 274], [44, 226], [196, 230], [48, 252]].map(([x, y]) =>
              `<g transform="translate(${x},${y})"><circle cx="0" cy="-3" r="2"/><circle cx="3" cy="0" r="2"/><circle cx="0" cy="3" r="2"/><circle cx="-3" cy="0" r="2"/></g>`).join('')
          + '</g>',
        // viền vàng cổ áo + chuỗi hạt vàng + khuyên tròn + kính lúp thợ kim hoàn
        prop: '<path d="M101,181 L120,209 L139,181" fill="none" stroke="#e8b84b" stroke-width="2.6" stroke-linejoin="round"/>'
          + '<g fill="#f0c419" stroke="#8a6238" stroke-width="1.2">'
          + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => { const t = i / 8, x = 97 + 46 * t, y = 190 + 56 * t * (1 - t) + 2; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/>`; }).join('')
          + '</g>'
          + g('<path d="M120,206 l7,7 l-7,9 l-7,-9z" fill="#f0c419" stroke="#8a6238" stroke-width="2"/>', 2)
          + '<g fill="none" stroke="#c8a227" stroke-width="2.8"><circle cx="78" cy="148" r="6.5"/><circle cx="162" cy="148" r="6.5"/></g>'
          + '<g fill="none" stroke="#8a6238" stroke-width="1" opacity=".7"><circle cx="78" cy="148" r="8"/><circle cx="162" cy="148" r="8"/></g>'
          + g('<path d="M150,214 q6,12 6,24" fill="none" stroke="#c8a227" stroke-width="1.6" stroke-dasharray="2 1.6"/>'
            + '<rect x="150" y="238" width="12" height="9" rx="3" fill="#4a4038"/><circle cx="156" cy="250" r="6" fill="#dbe9f0" stroke="#3b3025" stroke-width="2"/>'
            + '<path d="M153,248 q2,-2 4,-2" fill="none" stroke="#fff" stroke-width="1.4"/>', 2) }
    ],

    /* ---------- 9 · Thầy Nam — giáo viên Hoá (khung 200x280; cổ áo sơ mi của diversify nằm trên cùng) ---------- */
    9: [
      { ten: 'Gi-lê len giảng đường',
        over:
          // áo gi-lê len vàng mù tạt, cổ chữ V, sọc gân
          '<clipPath id="tp9s1_vest"><path d="M104,174 q-38,10 -54,32 q-15,21 -17,94 l174,0 q-2,-73 -17,-94 q-16,-22 -54,-32 L120,244z"/></clipPath>'
          + g('<path d="M104,174 q-38,10 -54,32 q-15,21 -17,94 l174,0 q-2,-73 -17,-94 q-16,-22 -54,-32 L120,244z" fill="#d8a94c"/>', 3.2)
          + '<g clip-path="url(#tp9s1_vest)" stroke="#b98a35" stroke-width="1.4" opacity=".55">'
          + [70, 80, 90, 100, 110, 130, 140, 150, 160, 170].map(x => `<path d="M${x},180 v100"/>`).join('') + '</g>'
          + '<path d="M100,178 L120,236 L140,178" fill="none" stroke="#a87a2c" stroke-width="5" stroke-linejoin="round"/>'
          + g('<path d="M104,174 L120,244 L136,174" fill="none"/>', 2.6)
          // túi ngực: bút đỏ + bút xanh, ghim hình bình tam giác
          + g('<path d="M146,214 v-12 M152,214 v-9" fill="none" stroke="#d9634f" stroke-width="3.4"/><path d="M152,214 v-9" stroke="#6f9ec9" stroke-width="3.4"/>'
            + '<path d="M140,214 h24 v5 h-24z" fill="#c4943e"/>', 1.8)
          + g('<path d="M80,222 h6 v6 l6,11 q1,3 -2,3 h-14 q-3,0 -2,-3 l6,-11z" fill="#fffdf5"/><path d="M76,236 h16 l2,4 q0,2 -2,2 h-14 q-2,0 -2,-2z" fill="#7aa95c" stroke="none"/>', 1.8)
          + tpArms(9) },
      { ten: 'Blouse dạy thực hành',
        grad: { c8cloth: ['#c6d9ec', '#d9e7f4'], c8clothL: ['#d9e7f4', '#b5cbe1'] },
        swap: [['#fbf7ee', '#e6eff8']],
        over:
          '<defs><linearGradient id="tp9s2_coat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#e4dfd2"/></linearGradient></defs>'
          // cà vạt xanh lá
          + g('<path d="M112,182 l8,8 l8,-8 l-2,50 q-6,8 -12,0z" fill="#6fa557"/><path d="M114,204 l10,-6 M113,218 l12,-7" fill="none" stroke="#fffdf5" stroke-width="2" opacity=".7"/>'
            + '<path d="M120,190 l-8,-8 l8,-6 l8,6z" fill="#58894a" stroke-width="2"/>', 2.4)
          // áo blouse trắng mở vạt
          + g('<path d="M104,172 q-38,10 -54,32 q-15,21 -17,96 h60 l0,-80 l-6,-10 l8,-6 z" fill="url(#tp9s2_coat)"/>'
            + '<path d="M136,172 q38,10 54,32 q15,21 17,96 h-60 l0,-80 l6,-10 l-8,-6 z" fill="url(#tp9s2_coat)"/>', 3.2)
          + g('<path d="M104,172 l-10,18 l-6,10 M136,172 l10,18 l6,10" fill="none" stroke-width="2" opacity=".55"/>', 2)
          // túi ngực: ống nghiệm + bút; thẻ giáo viên
          + g('<path d="M160,214 v-14 M166,214 v-11" fill="none" stroke="#d9634f" stroke-width="3.4"/>'
            + '<rect x="169" y="196" width="6" height="20" rx="3" fill="#fffdf5" stroke-width="1.6"/>'
            + '<path d="M169.8,207 h4.4 v6 q0,2.5 -2.2,2.5 q-2.2,0 -2.2,-2.5z" fill="#9b7bb8" stroke="none"/>', 1.6)
          + g('<path d="M154,214 h26 v20 q-13,4 -26,0z" fill="#f4f1e8"/>', 2.2)
          + g('<rect x="70" y="210" width="22" height="15" rx="2" fill="#fffdf5"/><path d="M70,215 h22" stroke="#d9634f" stroke-width="3"/>'
            + '<path d="M74,220 h12" fill="none" stroke-width="1.4" opacity=".6"/>', 1.8)
          + tpArms(9, 'url(#tp9s2_coat)', 'url(#tp9s2_coat)') }
    ],

    /* ---------- 10 · Cô Mai — quán chè (khung 200x280; tạp dề của diversify nằm trên over, đổi màu bằng swap) ---------- */
    10: [
      { ten: 'Tạp dề sọc kẹo',
        grad: { c9cloth: ['#c3e6d7', '#a6d4c1'], c9clothL: ['#a6d4c1', '#86bba6'] },
        swap: [['fill="#e0a458"', 'fill="url(#tp10s1_soc)"']],
        over:
          '<defs><pattern id="tp10s1_soc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff6ea"/><rect width="5" height="10" fill="#e8807a"/></pattern></defs>'
          // băng đô đỏ thắt nơ
          + g('<path d="M72,74 q48,-34 96,0 l-2,9 q-46,-28 -92,0z" fill="#d9634f"/>'
            + '<path d="M160,64 l14,-12 l2,14z M160,64 l16,4 l-8,10z" fill="#e8807a"/><circle cx="160" cy="64" r="3.4" fill="#d9634f"/>', 2.4)
          + '<g fill="#fff6ea"><circle cx="96" cy="62" r="1.8"/><circle cx="110" cy="56" r="1.8"/><circle cx="124" cy="54" r="1.8"/><circle cx="138" cy="57" r="1.8"/><circle cx="150" cy="62" r="1.8"/></g>',
        // túi tạp dề + cái vá múc chè
        prop: g('<path d="M126,226 l7,-22 q2,-6 -3,-7" fill="none" stroke="#3b3025" stroke-width="6.4"/>'
            + '<path d="M126,226 l7,-22 q2,-6 -3,-7" fill="none" stroke="#c9ccd2" stroke-width="3.4"/>'
            + '<path d="M106,222 h28 v16 q-14,5 -28,0z" fill="#fff6ea"/>'
            + '<path d="M108,226 h24" fill="none" stroke="#e8807a" stroke-width="1.6" stroke-dasharray="2.5 2"/>', 2.4) },
      { ten: 'Ly chè ba màu',
        grad: { c9cloth: ['#f6b49c', '#ea9a7e'], c9clothL: ['#ea9a7e', '#d07c61'] },
        swap: [['fill="#e0a458"', 'fill="#6f8fb5"']],
        over:
          // xắn tay áo
          '<clipPath id="tp10s2_arms"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          + `<g clip-path="url(#tp10s2_arms)">${g('<path d="M20,244 q30,6 60,0 v14 q-30,6 -60,0z M160,244 q30,6 60,0 v14 q-30,6 -60,0z" fill="#fbd9c8"/>', 2.2)}</g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2),
        // ly chè ba màu cầm trước tạp dề jean
        prop: '<path d="M100,204 q20,-6 40,0 M100,250 q20,8 40,0" fill="none" stroke="#f2d48a" stroke-width="1.6" stroke-dasharray="3 2.5"/>'
          + g('<path d="M128,186 l-6,36" fill="none" stroke="#d9634f" stroke-width="4"/>'
            + '<path d="M104,206 h32 l-4,46 q-12,4 -24,0z" fill="#fbf6ec" fill-opacity=".85"/>'
            + '<path d="M105.4,222 h29.2 l-1.4,16 h-26.4z" fill="#e8c35a" stroke="none"/>'
            + '<path d="M106.8,238 h26.4 l-1,13 q-12,4 -24.4,0z" fill="#8a4a3a" stroke="none"/>'
            + '<path d="M104.6,212 h30.8 l-0.8,10 h-29.2z" fill="#9cc77e" stroke="none"/>'
            + '<path d="M103,206 q17,-8 34,0 q-17,6 -34,0z" fill="#fffdf5"/>'
            + '<path d="M104,206 h32 l-4,46 q-12,4 -24,0z" fill="none"/>'
            + '<path d="M110,214 v30" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>', 2.6) }
    ]
  };
})();
