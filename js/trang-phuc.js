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

    /* ---------- 1 · Bà Tư — lò bánh mì (khung 280x280; màu nhận diện: tím / tím hoa cà) ---------- */
    1: [
      { ten: 'Bếp trưởng sáng sớm',
        grad: { hd1__Linear14: ['#fffdf6', '#e9e2cf'], hd1__Linear15: ['#c9aee6', '#a985cf'], hd1__Linear18: ['#f1ebdc', '#d6ccb6'] },
        swap: [['rgb(136,105,164)', '#e6dfcc'], ['fill:rgb(125,95,153)', 'fill:#a985cf'],
               // giấu búi tóc + nét búi để mũ bếp trùm gọn đầu
               ['fill:url(#hd1__Linear2);stroke:rgb(59,48,37);stroke-width:3px;', 'fill:none;stroke:none;'],
               ['M104,30C114.667,23.333 125.333,23.333 136,30" style="fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);', 'M104,30C114.667,23.333 125.333,23.333 136,30" style="fill:none;fill-rule:nonzero;stroke:none;'],
               // bỏ hai khuy vàng nhỏ
               ['fill:rgb(232,184,75);stroke:rgb(59,48,37);stroke-width:1.6px', 'fill:none;stroke:none;stroke-width:1.6px']],
        over:
          // mũ bếp thấp, nếp gấp
          '<g transform="translate(0,4)">' + g('<path d="M122,44 q-14,-30 14,-34 q8,-14 26,-8 q16,-10 30,4 q24,2 16,34 q-40,-10 -86,4z" fill="#fffdf6"/>'
            + '<path d="M148,40 q-2,-14 4,-26 M170,38 q2,-14 -2,-28 M190,40 q4,-12 2,-24" fill="none" stroke-width="1.8" opacity=".45"/>'
            + '<path d="M120,44 q44,-14 90,-4 l-2,12 q-42,-10 -86,4z" fill="#f1ebdc"/>', 2.8) + '</g>'
          // vạt áo bếp cài chéo, viền tím hoa cà
          + '<path d="M148,204 q22,8 36,2 q-6,30 -4,84" fill="none" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>'
          + '<path d="M148,204 q22,8 36,2 q-6,30 -4,84" fill="none" stroke="#a985cf" stroke-width="4" stroke-linecap="round"/>'
          // khăn quàng cổ bếp tím mận: dải quanh cổ + nút thắt + hai đuôi ngắn
          + g('<path d="M143,178 q17,10 34,0 l3,9 q-20,12 -40,0z" fill="#7b4a9e"/>'
            + '<path d="M155,194 l-11,20 q6,3 11,-1 l5,-16z M165,194 l11,20 q-6,3 -11,-1 l-5,-16z" fill="#6a3d8c"/>'
            + '<ellipse cx="160" cy="193" rx="8" ry="6.5" fill="#8d5cb3"/>', 2.6),
        // bỏ khay bánh (nằm dưới mép bàn, không thấy trong phòng thí nghiệm)
        prop: '' },
      { ten: 'Tạp dề caro',
        grad: { hd1__Linear14: ['#b77aa8', '#9a5f8e'], hd1__Linear15: ['#9a5f8e', '#7e4874'], hd1__Linear18: ['#9a5f8e', '#7e4874'] },
        swap: [['rgb(136,105,164)', '#9a5f8e'], ['fill:rgb(125,95,153)', 'fill:#7e4874']],
        over:
          '<defs><pattern id="tp1s2_caro" width="12" height="12" patternUnits="userSpaceOnUse">'
          + '<rect width="12" height="12" fill="#fff6ea"/><rect width="6" height="12" fill="#e8907d" opacity=".6"/>'
          + '<rect width="12" height="6" fill="#e8907d" opacity=".6"/></pattern></defs>'
          // khăn trùm tóc đỏ chấm bi (ít chấm, chấm to)
          + g('<path d="M104,74 q4,-46 56,-48 q46,0 58,44 q-8,-14 -30,-18 q-28,-6 -56,2 q-20,6 -28,20z" fill="#d9634f"/>', 2.8)
          + '<g fill="#fff6ea"><circle cx="134" cy="44" r="3.4"/><circle cx="160" cy="36" r="3.4"/><circle cx="186" cy="42" r="3.4"/><circle cx="148" cy="56" r="3"/><circle cx="174" cy="55" r="3"/></g>'
          // tạp dề caro kéo cao lên ngực, quai đeo cổ
          + g('<path d="M140,186 l2,20 M180,186 l-2,20" fill="none" stroke-width="3"/>', 2.6)
          + g('<path d="M136,204 q24,-6 48,0 l2,34 q12,2 14,8 l2,36 h-84 l2,-36 q2,-6 14,-8z" fill="url(#tp1s2_caro)"/>', 2.6),
        // bỏ giỏ bánh (nằm dưới mép bàn)
        prop: '' }
    ],

    /* ---------- 2 · Chú Ba — nông dân (khung 280x280; giữ nón lá; màu nhận diện: nâu đất / đất nung) ---------- */
    2: [
      { ten: 'Yếm bò ra đồng',
        grad: { hd2__Linear12: ['#e09478', '#cc7a5e'], hd2__Linear13: ['#cc7a5e', '#a95e45'],
                hd2__Linear15: ['#d98a6e', '#b86a50'], hd2__Linear17: ['#d98a6e', '#b86a50'] },
        swap: [['fill:rgb(106,74,41)', 'fill:#a95e45']],
        over:
          // quai yếm (viền mực) + yếm bò kéo cao lên ngực
          '<path d="M130,206 l-6,-20 M190,206 l6,-20" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/>'
          + '<path d="M130,206 l-6,-20 M190,206 l6,-20" fill="none" stroke="#5f80a8" stroke-width="7" stroke-linecap="round"/>'
          + g('<path d="M124,204 h72 l2,40 q10,6 12,36 h-100 q2,-30 12,-36z" fill="#6f8fb5"/>'
            + '<path d="M144,212 h32 v16 q-16,5 -32,0z" fill="#86a4c6"/>', 2.6) },
      { ten: 'Kỹ sư nông nghiệp',
        grad: { hd2__Linear12: ['#bf7150', '#a55c3f'], hd2__Linear13: ['#a55c3f', '#874830'],
                hd2__Linear15: ['#b4674a', '#945036'], hd2__Linear17: ['#b4674a', '#945036'] },
        swap: [['fill:rgb(106,74,41)', 'fill:#874830']],
        over:
          // áo gi-lê kaki (hai vạt, chừa giữa thấy áo sơ mi nâu đất)
          g('<path d="M138,182 q-22,8 -30,22 l8,14 l-6,62 h36 v-80 z" fill="#dccb9c"/>'
            + '<path d="M182,182 q22,8 30,22 l-8,14 l6,62 h-36 v-80 z" fill="#d2c08e"/>', 2.8)
          // ống nghiệm mẫu đất to cắm túi ngực
          + g('<rect x="185" y="188" width="10" height="28" rx="5" fill="#fffdf5"/>'
            + '<path d="M185.8,202 h8.4 v9 q0,4.2 -4.2,4.2 q-4.2,0 -4.2,-4.2z" fill="#8a5a32" stroke="none"/>', 2)
          + g('<path d="M178,204 h26 v20 h-26z" fill="#cdb983"/>', 2.2) }
    ],

    /* ---------- 3 · Bé Na — học sinh lớp 8 (khung 280x280; giữ khăn quàng; màu nhận diện: hồng) ---------- */
    3: [
      { ten: 'Đồng phục thể dục',
        grad: { hd3__Linear13: ['#fdeef3', '#f7d9e4'], hd3__Linear16: ['#f29bb6', '#e07a9c'], hd3__Linear18: ['#e88aa8', '#cc6588'] },
        over:
          // sọc hồng chạy dọc hai bên hông
          '<path d="M120,202 q-5,36 -5,78 M182,202 q5,36 5,78" fill="none" stroke="#e07a9c" stroke-width="6"/>'
          // logo trường hồng trên ngực
          + g('<path d="M176,190 h24 v12 q0,10 -12,14 q-12,-4 -12,-14z" fill="#e07a9c"/>'
            + '<path d="M181,197 q3.5,-3 7,0 q3.5,-3 7,0 v10 q-3.5,-3 -7,0 q-3.5,-3 -7,0z M188,197 v10" fill="#fffdf5" stroke="#fffdf5" stroke-width="1.4"/>', 2.2) },
      { ten: 'Áo khoác mâm xôi',
        grad: { hd3__Linear13: ['#d4587c', '#b8406a'], hd3__Linear16: ['#d4587c', '#b8406a'], hd3__Linear18: ['#c44c72', '#a3365c'] },
        over:
          // áo sơ mi trắng bên trong + hai vạt áo khoác
          g('<path d="M136,186 q14,7 28,0 l6,94 h-40z" fill="#fbf8f0"/>', 2.6)
          + g('<path d="M134,186 l-5,94 M166,186 l5,94" fill="none" stroke-width="2.8"/>', 2.8)
          // cổ áo khoác đứng
          + g('<path d="M126,184 q-10,4 -16,12 l18,8z M174,184 q10,4 16,12 l-18,8z" fill="#e47a98"/>', 2.6)
          // quai ba lô vàng (viền mực)
          + '<path d="M110,204 q6,30 4,76 M192,204 q-6,30 -4,76" fill="none" stroke="' + INK + '" stroke-width="12"/>'
          + '<path d="M110,204 q6,30 4,76 M192,204 q-6,30 -4,76" fill="none" stroke="#e8b84b" stroke-width="7"/>' }
    ],

    /* ---------- 4 · Anh Minh — thợ xây (khung 200x280; màu nhận diện: xanh dương) ---------- */
    4: [
      { ten: 'Áo phản quang',
        grad: { c3cloth: ['#3f6198', '#304f80'], c3clothL: ['#304f80', '#243e68'] },
        over:
          '<clipPath id="tp4s1_vest"><path d="M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 l-16,40 h-8z"/></clipPath>'
          // áo gi-lê cam phản quang, chừa cổ chữ V (áo trong xanh than)
          + g('<path d="M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 l-16,40 h-8z" fill="#f0883e"/>', 3.2)
          // hai sọc phản quang kéo lên ngực cho thấy trên mép bàn
          + `<g clip-path="url(#tp4s1_vest)">${g('<rect x="30" y="198" width="180" height="9" fill="#e9eef0"/><rect x="30" y="214" width="180" height="9" fill="#e9eef0"/>', 2)}</g>`
          + g('<path d="M120,218 v62" fill="none" stroke-width="2.4"/>', 2)
          + tpArms(4),
        // mũ bảo hộ trắng, sọc cam
        prop: g('<path d="M64,76 q0,-48 56,-48 q56,0 56,48z" fill="#f4f1e8"/>'
            + '<rect x="56" y="72" width="128" height="13" rx="6.5" fill="#fffdf5"/>'
            + '<path d="M112,31 v41 h16 v-41 q-8,-2 -16,0z" fill="#f0883e" stroke-width="2"/>', 3) },
      { ten: 'Dây đai an toàn',
        grad: { c3cloth: ['#6189b8', '#4d73a0'], c3clothL: ['#4d73a0', '#3b5c86'] },
        over:
          // dây đai an toàn đỏ (viền mực): hai quai vai + đai ngực kéo cao
          '<path d="M92,184 q-4,40 0,96 M148,184 q4,40 0,96 M90,214 h60" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linejoin="round"/>'
          + '<path d="M92,184 q-4,40 0,96 M148,184 q4,40 0,96 M90,214 h60" fill="none" stroke="#d9634f" stroke-width="7" stroke-linejoin="round"/>'
          + g('<rect x="110" y="206" width="20" height="16" rx="3" fill="#c9ccd2"/><rect x="116" y="211" width="8" height="6" rx="1" fill="#8a9099"/>', 2.2)
          + tpArms(4),
        // mũ vàng cổ điển + kính bảo hộ gài trên mũ
        prop: classic(4)
          + g('<path d="M68,62 q52,-16 104,0" fill="none" stroke="#3b3025" stroke-width="5"/>'
            + '<path d="M88,50 q32,-8 64,0 q3,10 -2,18 q-10,3 -20,-2 q-10,-6 -20,0 q-10,5 -20,2 q-5,-8 -2,-18z" fill="#bfe0e6" fill-opacity=".9"/>'
            + '<path d="M96,54 q6,-2 12,-2 M128,52 q6,0 12,2" fill="none" stroke="#fff" stroke-width="2"/>', 2.6) }
    ],

    /* ---------- 5 · Cô Lan — y tá trạm xá (khung 200x280; giữ ống nghe + phù hiệu chữ thập; màu nhận diện: xanh ngọc) ---------- */
    5: [
      { ten: 'Scrubs xanh ngọc đậm',
        grad: { c4cloth: ['#3e9c95', '#2f817b'], c4clothL: ['#2f817b', '#22655f'] },
        swap: [['#f7f3e8', '#8fd3cb'], ['fill="#f3eddc" d="M120,176', 'fill="#2a7570" d="M120,176']],
        // áo lót trắng trong cổ chữ V
        over: g('<path d="M108,178 q12,6 24,0 l-12,24z" fill="#fbf8f0"/>', 2.4) },
      { ten: 'Áo khoác trạm xá',
        grad: { c4cloth: ['#fdfcf8', '#e9e5da'], c4clothL: ['#e9e5da', '#d3cdbe'] },
        // ve áo khoác viền xanh ngọc
        swap: [['#f7f3e8', '#5fb5ab']],
        over:
          '<clipPath id="tp5s2_arm"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z"/></clipPath>'
          // áo scrubs xanh ngọc đậm lộ ra ở cổ (chữ V to)
          + g('<path d="M98,176 q22,9 44,0 l-22,40z" fill="#2f8f88"/>', 2.4)
          + '<path d="M120,216 v64" fill="none" stroke="#3b3025" stroke-width="2" opacity=".5"/>'
          // băng tay chữ thập đỏ
          + `<g clip-path="url(#tp5s2_arm)">${g('<rect x="20" y="200" width="60" height="18" fill="#fffdf5"/><path d="M20,200 h60 M20,218 h60" fill="none" stroke="#d9364a" stroke-width="2.6"/>'
            + '<path d="M46,203 v12 M40,209 h12" stroke="#d9364a" stroke-width="3.6"/>', 2)}</g>`
          + '<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z" fill="none" stroke="#3b3025" stroke-width="3.2" stroke-linejoin="round"/>'
          // mũ y tế xanh ngọc
          + g('<path d="M76,74 q-2,-40 44,-42 q46,2 44,42 q-20,-14 -44,-14 q-24,0 -44,14z" fill="#3fa39a"/>'
            + '<path d="M78,72 q42,-26 84,0" fill="none" stroke-width="2"/>', 2.8) }
    ],

    /* ---------- 6 · Ông Sáu — chủ ao cá (khung 200x280; màu nhận diện: xanh ô liu / rêu) ---------- */
    6: [
      { ten: 'Áo phao câu cá',
        grad: { c5cloth: ['#c3cd96', '#a9b67a'], c5clothL: ['#a9b67a', '#8e9c5f'] },
        swap: [['#f7f0df', '#d3e3ef']],
        over:
          '<defs><linearGradient id="tp6s1_sl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9dcec"/><stop offset="1" stop-color="#a6c1da"/></linearGradient></defs>'
          + tpArms(6, 'url(#tp6s1_sl)', 'url(#tp6s1_sl)')
          // mũ tai bèo
          + g('<path d="M86,64 q2,-34 34,-34 q32,0 34,34z" fill="#b9c48c"/>'
            + '<path d="M66,70 q54,-16 108,0 q4,6 -2,9 q-52,-12 -104,0 q-6,-3 -2,-9z" fill="#a3b075"/>'
            + '<path d="M87,58 q33,-8 66,0" fill="none" stroke="#6c7b45" stroke-width="4"/>', 2.8) },
      { ten: 'Yếm lội ao',
        over:
          '<defs><pattern id="tp6s2_soc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f3efdc"/><rect width="10" height="4.5" fill="#7f8f42"/></pattern></defs>'
          // áo thun sọc xanh ô liu
          + g('<path d="M104,176 q-32,9 -46,30 q-14,20 -16,84 l156,0 q-2,-64 -16,-84 q-14,-21 -46,-30 q-14,8 -32,0z" fill="url(#tp6s2_soc)"/>', 3.2)
          // quai (viền mực) + yếm cao su rêu sẫm kéo cao lên ngực
          + '<path d="M86,206 l-6,-20 M154,206 l6,-20" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/>'
          + '<path d="M86,206 l-6,-20 M154,206 l6,-20" fill="none" stroke="#56663c" stroke-width="7" stroke-linecap="round"/>'
          + g('<path d="M82,204 h76 l4,76 h-84z" fill="#4e5e37"/>', 2.6)
          + tpArms(6, 'url(#tp6s2_soc)', 'url(#tp6s2_soc)'),
        // phù hiệu cá chép nhỏ in trên yếm (trên mép bàn)
        prop: g('<ellipse cx="120" cy="211" rx="27" ry="15" fill="#efe6c8"/>', 2.2)
          + '<g transform="translate(118,211) scale(.5) translate(-118,-234)">' + g('<path d="M78,236 q28,-26 60,0 q-28,24 -60,0z" fill="#ef9a52"/>'
            + '<path d="M138,236 l20,-14 q-4,14 0,28z" fill="#e07a3c"/>'
            + '<path d="M100,224 q8,-8 18,-2 z" fill="#e07a3c" stroke-width="2"/>'
            + '<path d="M108,230 q4,6 0,12 M118,230 q4,6 0,12" fill="none" stroke-width="1.8" opacity=".5"/>'
            + '<circle cx="88" cy="232" r="3.6" fill="#3b3025" stroke="none"/>', 4.4) + '</g>' }
    ],

    /* ---------- 7 · Bạn Tí — học sinh lớp 8 (khung 200x280; mũ lưỡi trai dùng chung gradient áo; giữ khăn quàng; màu nhận diện: vàng) ---------- */
    7: [
      { ten: 'Áo đấu lớp 8',
        grad: { c6cloth: ['#f7c63f', '#eaa91c'], c6clothL: ['#eaa91c', '#c98912'] },
        over:
          '<clipPath id="tp7s1_arms"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          // viền cổ xanh than, sọc tay áo xanh than (kéo lên cao cho thấy trên mép bàn)
          + '<path d="M102,185 q18,13 36,0" fill="none" stroke="#2f5592" stroke-width="5" stroke-linecap="round"/>'
          + `<g clip-path="url(#tp7s1_arms)"><path d="M20,206 h200" stroke="#2f5592" stroke-width="8"/><path d="M20,202 h200 M20,210 h200" stroke="${INK}" stroke-width="1.6" opacity=".6"/></g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2)
          // số 8 xanh than to trên ngực phải (Tí được thu nhỏ: bàn che từ y≈215 của hình)
          + `<g fill="none" stroke="${INK}" stroke-width="8"><circle cx="157" cy="194" r="5.5"/><circle cx="157" cy="207" r="7"/></g>`
          + '<g fill="none" stroke="#2f5592" stroke-width="4.2"><circle cx="157" cy="194" r="5.5"/><circle cx="157" cy="207" r="7"/></g>',
        prop: classic(7) },
      { ten: 'Áo khoác gió',
        grad: { c6cloth: ['#f8a24a', '#ee8a2e'], c6clothL: ['#ee8a2e', '#d27220'] },
        over:
          '<clipPath id="tp7s2_body"><path d="M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 q-16,9 -40,0z M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          // dải phối màu kem + xanh than ngang ngực và tay (cao, thấy trên mép bàn)
          + `<g clip-path="url(#tp7s2_body)"><rect x="20" y="192" width="200" height="12" fill="#f4ecd6"/><rect x="20" y="204" width="200" height="7" fill="#2f5592"/>`
          + `<path d="M20,192 h200 M20,211 h200" stroke="${INK}" stroke-width="2"/></g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2)
          // khoá kéo
          + '<path d="M120,190 v90" fill="none" stroke="#b8661a" stroke-width="2.6"/>',
        prop: classic(7) }
    ],

    /* ---------- 8 · Chị Hoa — tiệm vàng bạc (khung 200x280; màu nhận diện: xanh ngọc bích) ---------- */
    8: [
      { ten: 'Vest ngọc bích',
        grad: { c7cloth: ['#4fa88b', '#358a70'], c7clothL: ['#358a70', '#276c58'] },
        over:
          // áo lụa kem bên trong, ve vest bản to
          g('<path d="M106,178 L120,240 L134,178z" fill="#f6eedc"/>', 2.4)
          + g('<path d="M108,176 q-10,4 -16,10 l6,10 l-6,5 l20,40 l8,-1z" fill="#3f9b7f"/>'
            + '<path d="M132,176 q10,4 16,10 l-6,10 l6,5 l-20,40 l-8,-1z" fill="#2f8068"/>', 2.6),
        prop: classic(8) },
      { ten: 'Áo lụa ngọc lục bảo',
        grad: { c7cloth: ['#23946a', '#1a7a56'], c7clothL: ['#1a7a56', '#115e41'] },
        swap: [['fill="#efe3d2"', 'fill="#e9d29a"'], ['#d9634f" d="M108,182', '#e8b84b" d="M108,182']],
        over:
          // hoạ tiết hoa mai vàng trên lụa (thưa, to vừa)
          '<g fill="#f2c94c">'
          + [[78, 208], [158, 206], [92, 230], [148, 232], [50, 222], [192, 222], [64, 252], [176, 254], [120, 266]].map(([x, y]) =>
              `<g transform="translate(${x},${y})"><circle cx="0" cy="-3.4" r="2.6"/><circle cx="3.4" cy="0" r="2.6"/><circle cx="0" cy="3.4" r="2.6"/><circle cx="-3.4" cy="0" r="2.6"/></g>`).join('')
          + '</g>',
        // viền vàng cổ áo + chuỗi hạt vàng + mặt dây hình thoi + khuyên tròn
        prop: '<path d="M101,181 L120,209 L139,181" fill="none" stroke="#e8b84b" stroke-width="2.6" stroke-linejoin="round"/>'
          + '<g fill="#f0c419" stroke="#8a6238" stroke-width="1.2">'
          + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => { const t = i / 8, x = 97 + 46 * t, y = 190 + 56 * t * (1 - t) + 2; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8"/>`; }).join('')
          + '</g>'
          + g('<path d="M120,206 l8,8 l-8,10 l-8,-10z" fill="#f0c419" stroke="#8a6238" stroke-width="2"/>', 2)
          + '<g fill="none" stroke="#c8a227" stroke-width="2.8"><circle cx="78" cy="148" r="6.5"/><circle cx="162" cy="148" r="6.5"/></g>'
          + '<g fill="none" stroke="#8a6238" stroke-width="1" opacity=".7"><circle cx="78" cy="148" r="8"/><circle cx="162" cy="148" r="8"/></g>' }
    ],

    /* ---------- 9 · Thầy Nam — giáo viên Hoá (khung 200x280; cổ áo sơ mi của diversify nằm trên cùng; màu nhận diện: trắng + vàng mù tạt) ---------- */
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
          // ghim hình bình tam giác (nâng lên ngực trái)
          + '<g transform="translate(0,-20)">' + g('<path d="M80,222 h6 v6 l6,11 q1,3 -2,3 h-14 q-3,0 -2,-3 l6,-11z" fill="#fffdf5"/><path d="M76,236 h16 l2,4 q0,2 -2,2 h-14 q-2,0 -2,-2z" fill="#7aa95c" stroke="none"/>', 1.8) + '</g>'
          + tpArms(9) },
      { ten: 'Blouse dạy thực hành',
        grad: { c8cloth: ['#fbf6e8', '#efe6cf'], c8clothL: ['#efe6cf', '#ddd2b6'] },
        over:
          '<defs><linearGradient id="tp9s2_coat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#e4dfd2"/></linearGradient></defs>'
          // cà vạt vàng mù tạt
          + g('<path d="M112,182 l8,8 l8,-8 l-2,50 q-6,8 -12,0z" fill="#d8a94c"/>'
            + '<path d="M120,190 l-8,-8 l8,-6 l8,6z" fill="#b98a35" stroke-width="2"/>', 2.4)
          // áo blouse trắng mở vạt
          + g('<path d="M104,172 q-38,10 -54,32 q-15,21 -17,96 h60 l0,-80 l-6,-10 l8,-6 z" fill="url(#tp9s2_coat)"/>'
            + '<path d="M136,172 q38,10 54,32 q15,21 17,96 h-60 l0,-80 l6,-10 l-8,-6 z" fill="url(#tp9s2_coat)"/>', 3.2)
          + g('<path d="M104,172 l-10,18 l-6,10 M136,172 l10,18 l6,10" fill="none" stroke-width="2" opacity=".55"/>', 2)
          // ống nghiệm to cắm túi ngực
          + g('<rect x="163" y="186" width="10" height="28" rx="5" fill="#fffdf5"/>'
            + '<path d="M163.8,200 h8.4 v9 q0,4.2 -4.2,4.2 q-4.2,0 -4.2,-4.2z" fill="#9b7bb8" stroke="none"/>', 2)
          + g('<path d="M154,204 h28 v20 q-14,4 -28,0z" fill="#f4f1e8"/>', 2.2)
          + tpArms(9, 'url(#tp9s2_coat)', 'url(#tp9s2_coat)') }
    ],

    /* ---------- 10 · Cô Mai — quán chè (khung 200x280; tạp dề của diversify nằm trên over, đổi màu bằng swap; màu nhận diện: san hô / đào) ---------- */
    10: [
      { ten: 'Tạp dề sọc kẹo',
        grad: { c9cloth: ['#ef8f76', '#e2755c'], c9clothL: ['#e2755c', '#c95e47'] },
        swap: [['fill="#e0a458"', 'fill="url(#tp10s1_soc)"']],
        over:
          '<defs><pattern id="tp10s1_soc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff6ea"/><rect width="5" height="10" fill="#c8384e"/></pattern></defs>'
          // băng đô đỏ thắt nơ
          + g('<path d="M72,74 q48,-34 96,0 l-2,9 q-46,-28 -92,0z" fill="#c8384e"/>'
            + '<path d="M160,64 l14,-12 l2,14z M160,64 l16,4 l-8,10z" fill="#e05a6a"/><circle cx="160" cy="64" r="3.4" fill="#c8384e"/>', 2.4),
        // túi tạp dề + cái vá múc chè (nâng lên ngực)
        prop: '<g transform="translate(0,-16)">' + g('<path d="M126,226 l7,-22 q2,-6 -3,-7" fill="none" stroke="#3b3025" stroke-width="6.4"/>'
            + '<path d="M126,226 l7,-22 q2,-6 -3,-7" fill="none" stroke="#c9ccd2" stroke-width="3.4"/>'
            + '<path d="M106,222 h28 v16 q-14,5 -28,0z" fill="#fff6ea"/>', 2.4) + '</g>' },
      { ten: 'Ly chè ba màu (áo mơ)',
        grad: { c9cloth: ['#fcd5ad', '#f6bb88'], c9clothL: ['#f6bb88', '#df9c66'] },
        swap: [['fill="#e0a458"', 'fill="#6f8fb5"']],
        over:
          // xắn tay áo
          '<clipPath id="tp10s2_arms"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          + `<g clip-path="url(#tp10s2_arms)">${g('<path d="M20,244 q30,6 60,0 v14 q-30,6 -60,0z M160,244 q30,6 60,0 v14 q-30,6 -60,0z" fill="#fbd9c8"/>', 2.2)}</g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2),
        // ly chè ba màu cầm trước tạp dề jean (nâng lên ngực, ống hút ngắn)
        prop: '<g transform="translate(0,-16)">'
          + g('<path d="M127,194 l-5,28" fill="none" stroke="#d9634f" stroke-width="4"/>'
            + '<path d="M104,206 h32 l-4,46 q-12,4 -24,0z" fill="#fbf6ec" fill-opacity=".85"/>'
            + '<path d="M105.4,222 h29.2 l-1.4,16 h-26.4z" fill="#e8c35a" stroke="none"/>'
            + '<path d="M106.8,238 h26.4 l-1,13 q-12,4 -24.4,0z" fill="#8a4a3a" stroke="none"/>'
            + '<path d="M104.6,212 h30.8 l-0.8,10 h-29.2z" fill="#9cc77e" stroke="none"/>'
            + '<path d="M103,206 q17,-8 34,0 q-17,6 -34,0z" fill="#fffdf5"/>'
            + '<path d="M104,206 h32 l-4,46 q-12,4 -24,0z" fill="none"/>'
            + '<path d="M110,214 v30" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>', 2.6) + '</g>' }
    ]
  };
})();
