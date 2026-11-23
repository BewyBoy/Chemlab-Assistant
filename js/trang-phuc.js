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
  const g = (inner, w) => `<g stroke="${INK}" stroke-width="${w || 1.6}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
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
  // n hạt cách đều theo độ dài cung Bezier bậc hai a–c–b (bán kính r)
  const tpHat = (a, c, b, n, r) => {
    const P = t => [(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]];
    const pts = [], L = [0];
    for(let j = 0; j <= 200; j++){ pts.push(P(j / 200)); if(j) L.push(L[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1])); }
    let out = '';
    for(let q = 0; q < n; q++){ const want = L[200] * q / (n - 1); let j = 0; while(j < 200 && L[j] < want) j++;
      out += `<circle cx="${pts[j][0].toFixed(1)}" cy="${pts[j][1].toFixed(1)}" r="${r}"/>`; }
    return out;
  };
  // Vai, thân & tay chuẩn giải phẫu hội họa nam trưởng thành (khung 468, vai ~2.2× đầu, khuỷu eo 312, măng-sét 398, bàn tay 452)
  const tpMaleTorso = (fill, yBot) => {
    yBot = yBot || 404;
    return `<path class="tq-keep-body" fill="${fill}" stroke="none" d="M96,184 C72,188 44,194 26,204 L34,252 L48,252 C52,276 56,296 58,314 C56,348 53,378 52,${yBot} L188,${yBot} C187,378 184,348 182,314 C184,296 188,276 192,252 L206,252 L214,204 C196,194 168,188 144,184 Q120,202 96,184 Z"/>`
      + `<path class="tq-keep-body" d="M48,250 C58,284 62,310 60,340 C58,366 56,386 55,${yBot} L52,${yBot} C53,378 56,348 58,314 C56,296 52,276 48,250 Z M192,250 C182,284 178,310 180,340 C182,366 184,386 185,${yBot} L188,${yBot} C187,378 184,348 182,314 C184,296 188,276 192,250 Z" fill="${INK}" fill-opacity=".09" stroke="none"/>`;
  };
  const tpMaleOutline = (yBot) => {
    yBot = yBot || 404;
    return `<path class="tq-keep-body" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M26,204 C44,194 72,188 96,184 Q120,202 144,184 C168,188 196,194 214,204 M48,252 C52,276 56,296 58,314 C56,348 53,378 52,${yBot} L188,${yBot} C187,378 184,348 182,314 C184,296 188,276 192,252"/>`;
  };
  const tpProtoArms = (n, L, R, isVest, vestStroke) => {
    const id = 'hd' + n + '_c' + (n - 1);
    L = L || `url(#${id}cloth)`; R = R || `url(#${id}clothL)`;
    const S = `url(#${id}skin)`, vs = vestStroke || '#a87a2c';
    const topL = isVest
      ? 'M26,204 C12,216 10,240 11,268 C12,288 13,302 14,312 C11,334 14,366 22,398 Q33.5,404 45,396 C47,366 49,336 48,312 C49,292 50,272 49,252 C43,234 36,218 26,204 Z'
      : 'M26,204 C12,216 10,240 11,268 C12,288 13,302 14,312 C11,334 14,366 22,398 Q33.5,404 45,396 C47,366 49,336 48,312 C49,292 50,272 49,252 C48,238 46,228 44,220';
    const topR = isVest
      ? 'M214,204 C228,216 230,240 229,268 C228,288 227,302 226,312 C229,334 226,366 218,398 Q206.5,404 195,396 C193,366 191,336 192,312 C191,292 190,272 191,252 C197,234 204,218 214,204 Z'
      : 'M214,204 C228,216 230,240 229,268 C228,288 227,302 226,312 C229,334 226,366 218,398 Q206.5,404 195,396 C193,366 191,336 192,312 C191,292 190,272 191,252 C192,238 194,228 196,220';
    return `<g class="arm-l"><path fill="${S}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round" d="M24,395 C20,408 19,424 21,436 C23,446 27,452 32,452 C36,452 39,446 40,435 C41,428 42,424 43,420 C46,423 50,420 50,412 C49,405 46,399 43,394 Z"/>`
      + `<path d="M43,404 C42,411 42,416 43,420 M27,430 C27,439 27,446 26,450 M33,430 C33,440 33,447 32,451 M38,428 C38,437 38,444 37,448" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>`
      + `<path fill="${L}" stroke="none" d="M40,214 L26,204 C12,216 10,240 11,268 C12,288 13,302 14,312 C11,334 14,366 22,398 Q33.5,404 45,396 C47,366 49,336 48,312 C49,292 50,272 49,252 C48,236 45,222 40,214 Z"/>`
      + `<path fill="${INK}" fill-opacity=".09" stroke="none" d="M44,220 C48,252 47,298 45,396 L38,399 C40,310 41,254 44,220 Z"/>`
      + `<path d="M36,312 Q42,316 48,312" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`
      + `<path d="M21,390 Q33.5,396 45.5,389" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".55"/>`
      + `<path fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="${topL}"/>`
      + (isVest ? `<path d="M26,204 C36,218 43,234 49,252" fill="none" stroke="${vs}" stroke-width="3.2" stroke-linecap="round"/>` : '')
      + `</g><g class="arm-r"><path fill="${S}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round" d="M216,395 C220,408 221,424 219,436 C217,446 213,452 208,452 C204,452 201,446 200,435 C199,428 198,424 197,420 C194,423 190,420 190,412 C191,405 194,399 197,394 Z"/>`
      + `<path d="M197,404 C198,411 198,416 197,420 M213,430 C213,439 213,446 214,450 M207,430 C207,440 207,447 208,451 M202,428 C202,437 202,444 203,448" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>`
      + `<path fill="${R}" stroke="none" d="M200,214 L214,204 C228,216 230,240 229,268 C228,288 227,302 226,312 C229,334 226,366 218,398 Q206.5,404 195,396 C193,366 191,336 192,312 C191,292 190,272 191,252 C192,236 195,222 200,214 Z"/>`
      + `<path fill="${INK}" fill-opacity=".09" stroke="none" d="M196,220 C192,252 193,298 195,396 L202,399 C200,310 199,254 196,220 Z"/>`
      + `<path d="M204,312 Q198,316 192,312" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`
      + `<path d="M219,390 Q206.5,396 194.5,389" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".55"/>`
      + `<path fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="${topR}"/>`
      + (isVest ? `<path d="M214,204 C204,218 197,234 191,252" fill="none" stroke="${vs}" stroke-width="3.2" stroke-linecap="round"/>` : '')
      + `</g>`;
  };
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
          + '<path d="M82,196 q38,-22 76,0 v10 h-76z M114,238 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0 M114,266 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" fill="url(#hd0__Linear17)"/>'
          + g('<path d="M104,168 q16,9 32,0 l2,12 q-18,8 -36,0z" fill="#5fb5ab"/>', 1.6)
          + g('<path d="M98,176 q22,12 44,0 l5,12 q-27,14 -54,0z" fill="#f6faf8"/>', 1.6)
          + '<path d="M97,183 q23,11 46,0" fill="none" stroke="#4fa39a" stroke-width="2" stroke-linecap="round"/>'
          // khoá kéo xanh ngọc chạy dọc tới gấu áo 408
          + '<path d="M120,194 v214" fill="none" stroke="#4fa39a" stroke-width="2.6"/>'
          + g('<rect x="116.5" y="194" width="7" height="11" rx="2" fill="#e8b84b"/>', 1.6)
          // túi ngực: nắp xanh ngọc + bút màu
          + g('<path d="M140,214 v-14 M147,214 v-17 M154,214 v-12" fill="none" stroke-width="4" stroke="#6f9ec9"/>'
            + '<path d="M147,197 v-3" stroke-width="4"/><path d="M154,202 v-3" stroke="#e8b84b" stroke-width="4"/>', 2)
          + g('<rect x="133" y="214" width="32" height="34" rx="3" fill="#f6faf8"/>'
            + '<path d="M133,214 h32 v7 q-16,4 -32,0z" fill="#5fb5ab"/>', 1.5)
          // thẻ tên kẹp túi
          + g('<path d="M157,244 v8" fill="none" stroke-width="2"/>'
            + '<rect x="145" y="251" width="24" height="30" rx="3" fill="#fffdf5"/>'
            + '<path d="M145,257 v-3 q0,-3 3,-3 h18 q3,0 3,3 v3z" fill="#4fa39a" stroke="none"/>'
            + '<rect x="149" y="261" width="9" height="10" rx="1.5" fill="#cfe3dd" stroke-width="1.5"/>'
            + '<path d="M161,263 h5 M161,268 h4 M149,276 h16" fill="none" stroke-width="1.4" opacity=".7"/>', 1.5)
          + '</g>' },
      { ten: 'Áo lab xanh than',
        grad: { hd0__Linear17: ['#617699', '#3f5276'], hd0__Linear18: ['#4c6086', '#617699'],
                hd0__Linear19: ['#6c82a8', '#3f5276'], hd0__Linear22: ['#4c6086', '#617699'],
                hd0__Linear23: ['#f6c27e', '#e0874a'] },
        swap: [['rgb(243,237,220)', '#55698f'], ['fill:rgb(232,184,75);fill-opacity:0.45', 'fill:none'], ['fill:rgb(122,169,92);fill-opacity:0.4', 'fill:none']],
        over: '<g transform="translate(20,0)">'
          // kính bảo hộ đẩy lên đầu (dây ôm gọn trong hai mép tóc x 46..196)
          + g('<path d="M46,70 q74,-44 150,0" fill="none" stroke="#4fa39a" stroke-width="7"/>'
            + '<path d="M46,70 q74,-44 150,0" fill="none" stroke="' + INK + '" stroke-width="1.5" opacity=".5"/>', 2)
          + g('<path d="M84,40 q36,-12 72,0 q4,12 -2,22 q-12,4 -24,-2 q-10,-6 -20,0 q-12,6 -24,2 q-6,-10 -2,-22z" fill="#f2d48a" fill-opacity=".9"/>'
            + '<path d="M118,58 v-14" fill="none" stroke-width="2"/>'
            + '<path d="M92,46 q8,-4 16,-3 M128,44 q8,-1 16,2" fill="none" stroke="#fff" stroke-width="2.2" opacity=".8"/>', 2.8)
          // viền trắng ở ve áo
          + '<path d="M116,181 q-11,2 -20,7 M124,181 q11,2 20,7" fill="none" stroke="#e8eef6" stroke-width="2" stroke-linecap="round"/>'
          // túi ngực xanh than, viền chỉ trắng, bút
          + g('<rect x="133" y="216" width="32" height="32" rx="3" fill="#53678c"/>'
            + '<path d="M137,221 h24" fill="none" stroke="#e8eef6" stroke-width="1.5" stroke-dasharray="3 2.5"/>', 1.5)
          // huy hiệu nguyên tử
          + g('<circle cx="152" cy="268" r="14" fill="#fffdf5"/>'
            + '<g fill="none" stroke="#6f9ec9" stroke-width="1.8"><ellipse cx="152" cy="268" rx="10" ry="4"/>'
            + '<ellipse cx="152" cy="268" rx="10" ry="4" transform="rotate(60 152 268)"/>'
            + '<ellipse cx="152" cy="268" rx="10" ry="4" transform="rotate(-60 152 268)"/></g>'
            + '<circle cx="152" cy="268" r="2.4" fill="#d9634f" stroke="none"/>', 1.5)
          + '</g>' }
    ],

    /* ---------- 1 · Bà Tư — lò bánh mì (khung 280x280; màu nhận diện: tím / tím hoa cà) ---------- */
    1: [
      { ten: 'Bếp trưởng sáng sớm',
        grad: { hd1__Linear14: ['#fffdf6', '#e9e2cf'], hd1__Linear15: ['#c9aee6', '#a985cf'], hd1__Linear18: ['#f1ebdc', '#d6ccb6'] },
        swap: [['rgb(136,105,164)', '#e6dfcc'], ['fill:rgb(125,95,153)', 'fill:#a985cf'],
               // giấu búi tóc để mũ bếp trùm gọn đầu
               ['class="sua1_bui"', 'style="display:none"'],
               // bỏ hai khuy vàng nhỏ
               ['fill:rgb(232,184,75);stroke:rgb(59,48,37);stroke-width:1.6px', 'fill:none;stroke:none;stroke-width:1.6px']],
        over:
          // mũ bếp thấp, nếp gấp, căn giữa đầu (x=160)
          '<g transform="translate(0,4)">' + g('<path d="M114,44 q-16,-32 14,-36 q10,-14 32,-8 q20,-10 34,4 q24,2 12,36 q-46,-12 -92,4z" fill="#fffdf6"/>'
            + '<path d="M135,41 C133,26 138,14 145,10 C142,22 141,32 142,41 Z M157,39 C158,24 158,12 161,6 C164,18 165,28 164,39 Z M179,41 C183,28 185,18 184,12 C189,22 189,32 185,41 Z" fill="#dfd6c0" stroke="none"/>'
            + '<path d="M113,44 q47,-12 94,-2 l-2,12 q-45,-10 -90,2z" fill="#f1ebdc"/>', 2.8) + '</g>'
          // vạt áo bếp cài chéo, viền tím hoa cà
          + '<path d="M150,192 C162,206 180,206 185,222 L187,286" fill="none" stroke="' + INK + '" stroke-width="6.5" stroke-linecap="round"/>'
          + '<path d="M150,192 C162,206 180,206 185,222 L187,286" fill="none" stroke="#a985cf" stroke-width="4" stroke-linecap="round"/>'
          // khăn quàng cổ bếp tím mận: dải quanh cổ + nút thắt + hai đuôi ngắn
          + g('<path d="M143,178 q17,10 34,0 l3,9 q-20,12 -40,0z" fill="#7b4a9e"/>'
            + '<path d="M155,194 l-11,20 q6,3 11,-1 l5,-16z M165,194 l11,20 q-6,3 -11,-1 l-5,-16z" fill="#6a3d8c"/>'
            + '<ellipse cx="160" cy="193" rx="8" ry="6.5" fill="#8d5cb3"/>', 1.5),
        // bỏ khay bánh (nằm dưới mép bàn, không thấy trong phòng thí nghiệm)
        prop: '' },
      { ten: 'Tạp dề caro',
        grad: { hd1__Linear14: ['#b77aa8', '#9a5f8e'], hd1__Linear15: ['#9a5f8e', '#7e4874'], hd1__Linear18: ['#9a5f8e', '#7e4874'] },
        swap: [['rgb(136,105,164)', '#9a5f8e'], ['fill:rgb(125,95,153)', 'fill:#7e4874']],
        over:
          '<defs><pattern id="tp1s2_caro" width="12" height="12" patternUnits="userSpaceOnUse">'
          + '<rect width="12" height="12" fill="#fff6ea"/><rect width="6" height="12" fill="#e8907d" opacity=".6"/>'
          + '<rect width="12" height="6" fill="#e8907d" opacity=".6"/></pattern></defs>'
          // khăn trùm tóc đỏ chấm bi (ôm gọn dưới búi tóc giữa đỉnh đầu)
          + g('<path d="M102,74 q6,-46 58,-46 q52,0 58,46 q-10,-14 -30,-18 q-28,-6 -56,0 q-20,4 -30,18z" fill="#d9634f"/>', 2.8)
          + '<g fill="#fff6ea"><circle cx="134" cy="45" r="3.4"/><circle cx="160" cy="39" r="3.4"/><circle cx="186" cy="45" r="3.4"/><circle cx="147" cy="56" r="3"/><circle cx="173" cy="56" r="3"/></g>'
          // tạp dề caro kéo cao lên ngực, quai đeo cổ
          + '<path d="M141,205 Q141,192 147,182 M179,205 Q179,192 173,182" fill="none" stroke="' + INK + '" stroke-width="7.2" stroke-linecap="round"/>'
          + '<path d="M141,205 Q141,192 147,182 M179,205 Q179,192 173,182" fill="none" stroke="#e8907d" stroke-width="4.4" stroke-linecap="round"/>'
          + g('<path d="M136,204 q24,-6 48,0 l2,34 q12,2 14,8 l2,36 h-84 l2,-36 q2,-6 14,-8z" fill="url(#tp1s2_caro)"/>', 1.6),
        // bỏ giỏ bánh (nằm dưới mép bàn)
        prop: '' }
    ],

    /* ---------- 2 · Chú Ba — nông dân (khung 284x468; giữ nón lá; màu nhận diện: nâu đất / đất nung) ---------- */
    2: [
      { ten: 'Yếm bò ra đồng',
        grad: { hd2__Linear12: ['#e09478', '#cc7a5e'], hd2__Linear13: ['#cc7a5e', '#a95e45'],
                hd2__Linear15: ['#d98a6e', '#b86a50'], hd2__Linear17: ['#d98a6e', '#b86a50'] },
        swap: [['fill:rgb(106,74,41)', 'fill:#a95e45']],
        over:
          // quai yếm (viền mực) + yếm bò kéo dài theo thân tỉ lệ hội họa
          '<path d="M120,214 Q118,198 110,192 M200,214 Q202,198 210,192" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/>'
          + '<path d="M120,214 Q118,198 110,192 M200,214 Q202,198 210,192" fill="none" stroke="#5f80a8" stroke-width="7" stroke-linecap="round"/>'
          + g('<path d="M114,212 h92 l2,102 q10,20 12,90 h-120 q2,-70 12,-90z" fill="#6f8fb5"/>'
            + '<path d="M140,226 h40 v22 q-20,6 -40,0z" fill="#86a4c6"/>', 2.6) },
      { ten: 'Kỹ sư nông nghiệp',
        grad: { hd2__Linear12: ['#bf7150', '#a55c3f'], hd2__Linear13: ['#a55c3f', '#874830'],
                hd2__Linear15: ['#b4674a', '#945036'], hd2__Linear17: ['#b4674a', '#945036'] },
        swap: [['fill:rgb(106,74,41)', 'fill:#874830']],
        over:
          // áo gi-lê kaki ôm vai rộng tỉ lệ hội họa (tâm x=160)
          g('<path class="tq-keep-body" d="M142,186 C118,189 88,195 66,204 L88,252 C92,276 96,296 98,314 C96,348 93,378 92,404 h54 V192 Z M178,186 C202,189 232,195 254,204 L232,252 C228,276 224,296 222,314 C224,348 227,378 228,404 h-54 V192 Z" fill="#d7c595"/>', 2.8)
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
          // sọc hồng chạy dọc hai bên sườn, đối xứng quanh tâm thân (x=160), sát chỗ nối tay áo
          '<path d="M123,206 q-3,36 -3,76 M197,206 q3,36 3,76" fill="none" stroke="#e07a9c" stroke-width="6"/>'
          // logo trường hồng nhỏ trên ngực phải, nằm gọn trong thân (dưới đường vai, trên mép bàn)
          + g('<path d="M176,196 h17 v8 q0,8 -8.5,11 q-8.5,-3 -8.5,-11z" fill="#e07a9c"/>'
            + '<path d="M180,200 q2.3,-2 4.6,0 q2.3,-2 4.6,0 v6.5 q-2.3,-2 -4.6,0 q-2.3,-2 -4.6,0z M184.6,200 v6.5" fill="#fffdf5" stroke="#fffdf5" stroke-width="1"/>', 2) },
      { ten: 'Áo khoác mâm xôi',
        grad: { hd3__Linear13: ['#d4587c', '#b8406a'], hd3__Linear16: ['#d4587c', '#b8406a'], hd3__Linear18: ['#c44c72', '#a3365c'] },
        over:
          // áo sơ mi trắng bên trong + hai vạt áo khoác
          g('<path d="M146,186 q14,7 28,0 l6,94 h-40z" fill="#fbf8f0"/>', 2.6)
          + g('<path d="M144,186 l-5,94 M176,186 l5,94" fill="none" stroke-width="1.6"/>', 1.6)
          // ve áo khoác lật xuống, nằm trong đường vai
          + g('<path d="M144,187 q-9,4 -14,11 l14,6z M176,187 q9,4 14,11 l-14,6z" fill="#e47a98"/>', 1.5)
          // quai ba lô vàng: vắt qua đỉnh vai từ sau lưng rồi chạy xuống ngực (viền mực)
          + '<path d="M118,188 q4,4 4,14 q-1,36 -3,78 M202,188 q-4,4 -4,14 q1,36 3,78" fill="none" stroke="' + INK + '" stroke-width="9.5" stroke-linecap="round"/>'
          + '<path d="M118,188 q4,4 4,14 q-1,36 -3,78 M202,188 q-4,4 -4,14 q1,36 3,78" fill="none" stroke="#e8b84b" stroke-width="7" stroke-linecap="round"/>' }
    ],

    /* ---------- 4 · Anh Minh — thợ xây (khung 284x468; màu nhận diện: xanh dương) ---------- */
    4: [
      { ten: 'Áo phản quang',
        grad: { c3cloth: ['#3f6198', '#304f80'], c3clothL: ['#304f80', '#243e68'] },
        over:
          '<clipPath id="tp4s1_vest"><path d="M96,184 C72,188 44,194 26,204 L34,252 L48,252 C52,276 56,296 58,314 C56,348 53,378 52,404 L188,404 C187,378 184,348 182,314 C184,296 188,276 192,252 L206,252 L214,204 C196,194 168,188 144,184 Q120,202 96,184 Z"/></clipPath>'
          + tpMaleTorso('#f0883e')
          + `<g clip-path="url(#tp4s1_vest)">${g('<rect x="10" y="246" width="220" height="12" fill="#e9eef0"/><rect x="10" y="274" width="220" height="12" fill="#e9eef0"/>', 2)}</g>`
          + tpMaleOutline()
          + g('<path d="M96,184 q24,18 48,0 l-18,46 h-12z" fill="#35558a"/><path d="M120,230 v174" fill="none" stroke-width="1.6"/>', 1.6)
          + tpProtoArms(4, null, null, true, '#d46b24'),
        // mũ bảo hộ trắng, sọc cam
        prop: g('<path d="M64,76 q0,-48 56,-48 q56,0 56,48z" fill="#f4f1e8"/>'
            + '<rect x="56" y="72" width="128" height="13" rx="6.5" fill="#fffdf5"/>'
            + '<path d="M112,31 v41 h16 v-41 q-8,-2 -16,0z" fill="#f0883e" stroke-width="1.5"/>', 3) },
      { ten: 'Dây đai an toàn',
        grad: { c3cloth: ['#6189b8', '#4d73a0'], c3clothL: ['#4d73a0', '#3b5c86'] },
        over:
          // dây đai an toàn đỏ (viền mực): hai quai vai + đai ngực kéo dài tới gấu áo 404
          '<path d="M84,188 q-6,80 -2,216 M156,188 q6,80 2,216 M82,238 h76" fill="none" stroke="' + INK + '" stroke-width="9.5" stroke-linejoin="round"/>'
          + '<path d="M84,188 q-6,80 -2,216 M156,188 q6,80 2,216 M82,238 h76" fill="none" stroke="#d9634f" stroke-width="7" stroke-linejoin="round"/>'
          + g('<rect x="110" y="230" width="20" height="16" rx="3" fill="#c9ccd2"/><rect x="116" y="235" width="8" height="6" rx="1" fill="#8a9099"/>', 2.2)
          + tpProtoArms(4, null, null, false),
        // mũ vàng cổ điển + kính bảo hộ gài trên mũ (dây ôm sát hai mép mũ x 64..176)
        prop: classic(4)
          + g('<path d="M64,62 q56,-16 112,0" fill="none" stroke="#3b3025" stroke-width="5"/>'
            + '<path d="M88,50 q32,-8 64,0 q3,10 -2,18 q-10,3 -20,-2 q-10,-6 -20,0 q-10,5 -20,2 q-5,-8 -2,-18z" fill="#bfe0e6" fill-opacity=".9"/>'
            + '<path d="M96,54 q6,-2 12,-2 M128,52 q6,0 12,2" fill="none" stroke="#fff" stroke-width="2"/>', 2.6) }
    ],

    /* ---------- 5 · Cô Lan — y tá trạm xá (khung 200x280; giữ ống nghe + phù hiệu chữ thập; màu nhận diện: xanh ngọc) ---------- */
    5: [
      { ten: 'Scrubs xanh ngọc đậm',
        grad: { c4cloth: ['#3e9c95', '#2f817b'], c4clothL: ['#2f817b', '#22655f'] },
        swap: [['#f7f3e8', '#8fd3cb'], ['fill="#f3eddc" d="M120,176', 'fill="#2a7570" d="M120,176']],
        // áo lót trắng trong cổ chữ V
        over: g('<path d="M108,178 q12,6 24,0 l-12,24z" fill="#fbf8f0"/>', 1.6) },
      { ten: 'Áo khoác trạm xá',
        grad: { c4cloth: ['#fdfcf8', '#e9e5da'], c4clothL: ['#e9e5da', '#d3cdbe'] },
        // ve áo khoác viền xanh ngọc
        swap: [['#f7f3e8', '#5fb5ab']],
        over:
          '<clipPath id="tp5s2_arm"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z"/></clipPath>'
          // áo scrubs xanh ngọc đậm lộ ra ở cổ (chữ V to)
          + g('<path d="M98,176 q22,9 44,0 l-22,40z" fill="#2f8f88"/>', 1.6)
          + '<path d="M119,215 h6 v65 h-6z" fill="#3b3025" fill-opacity=".1" stroke="none"/><path d="M120,216 v64" fill="none" stroke="#3b3025" stroke-width="1.5"/>'
          // băng tay chữ thập đỏ
          + `<g clip-path="url(#tp5s2_arm)">${g('<rect x="20" y="206" width="60" height="18" fill="#fffdf5"/><path d="M20,206 h60 M20,224 h60" fill="none" stroke="#d9364a" stroke-width="1.5"/>'
            + '<path d="M53,209 v12 M47,215 h12" stroke="#d9364a" stroke-width="3.6"/>', 2)}</g>`
          + '<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z" fill="none" stroke="#3b3025" stroke-width="3.2" stroke-linejoin="round"/>'
          // mũ y tế xanh ngọc (trùm kín vòm tóc trên x 63..177)
          + g('<path d="M62,78 q-3,-49 58,-51 q61,2 58,51 q-27,-16 -58,-16 q-31,0 -58,16z" fill="#3fa39a"/>'
            + '<path d="M63,78 q57,-26 114,0 q-26,-16 -57,-16 q-31,0 -57,16z" fill="#318a82"/>', 2.8) }
    ],

    /* ---------- 6 · Ông Sáu — chủ ao cá (khung 284x468; màu nhận diện: xanh ô liu / rêu) ---------- */
    6: [
      { ten: 'Áo phao câu cá',
        grad: { c5cloth: ['#c3cd96', '#a9b67a'], c5clothL: ['#a9b67a', '#8e9c5f'],
                hd6_whL: ['#c9dcec', '#a6c1da'], hd6_whR: ['#a6c1da', '#c9dcec'] },
        swap: [['#fffef9', '#d3e3ef'], ['#5a6430', '#6c7b45']],
        over:
          // mũ tai bèo (hạ vành phủ kín viền đỉnh hộp sọ)
          g('<path d="M68,75 q-2,-48 52,-48 q54,0 52,48z" fill="#b9c48c"/>'
            + '<path d="M48,76 q72,-14 144,0 q5,7 -2,10 q-70,-10 -140,0 q-7,-3 -2,-10z" fill="#a3b075"/>'
            + '<path d="M71,64 q49,-10 98,0" fill="none" stroke="#6c7b45" stroke-width="5"/>', 2.8) },
      { ten: 'Yếm lội ao',
        over:
          '<defs><pattern id="tp6s2_soc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f3efdc"/><rect width="10" height="4.5" fill="#7f8f42"/></pattern></defs>'
          // áo thun sọc xanh ô liu + yếm cao su rêu sẫm kéo dài tới gấu áo 404
          + tpMaleTorso('url(#tp6s2_soc)') + tpMaleOutline()
          + '<path d="M76,222 l-6,-28 M164,222 l6,-28" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/>'
          + '<path d="M76,222 l-6,-28 M164,222 l6,-28" fill="none" stroke="#56663c" stroke-width="7" stroke-linecap="round"/>'
          + g('<path d="M72,220 h96 l6,184 h-108z" fill="#4e5e37"/>', 2.6)
          + tpProtoArms(6, 'url(#tp6s2_soc)', 'url(#tp6s2_soc)', false),
        // phù hiệu cá chép nhỏ in trên yếm
        prop: g('<ellipse cx="120" cy="242" rx="27" ry="15" fill="#efe6c8"/>', 2.2)
          + '<g transform="translate(118,242) scale(.5) translate(-118,-234)">' + g('<path d="M78,236 q28,-26 60,0 q-28,24 -60,0z" fill="#ef9a52"/>'
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
          + '<path d="M97,177 q23,13 46,0 l3,6 q-26,16 -52,0z" fill="#2f5592" stroke="#3b3025" stroke-width="1.5" stroke-linejoin="round"/>'
          + `<g clip-path="url(#tp7s1_arms)"><path d="M20,206 h200" stroke="#2f5592" stroke-width="8"/><path d="M20,202 h200 M20,210 h200" stroke="${INK}" stroke-width="1.6" opacity=".6"/></g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z" fill="none"/><path d="M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2)
          // số 8 xanh than to trên ngực phải (Tí được thu nhỏ: bàn che từ y≈215 của hình)
          + `<g fill="none" stroke="${INK}" stroke-width="6.6"><circle cx="160" cy="199" r="4.3"/><circle cx="160" cy="209" r="5.4"/></g>`
          + '<g fill="none" stroke="#2f5592" stroke-width="3.4"><circle cx="160" cy="199" r="4.3"/><circle cx="160" cy="209" r="5.4"/></g>',
        prop: classic(7) },
      { ten: 'Áo khoác gió',
        grad: { c6cloth: ['#f8a24a', '#ee8a2e'], c6clothL: ['#ee8a2e', '#d27220'] },
        over:
          '<clipPath id="tp7s2_body"><path d="M100,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 q-16,9 -40,0z M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          // dải phối màu kem + xanh than ngang ngực và tay (cao, thấy trên mép bàn)
          + `<clipPath id="tp7s2_torso"><path d="M100,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 q-16,9 -40,0z"/></clipPath>`
          + `<g clip-path="url(#tp7s2_torso)"><rect x="20" y="197" width="200" height="10" fill="#f4ecd6"/><rect x="20" y="207" width="200" height="6" fill="#2f5592"/>`
          + `<path d="M20,197 h200 M20,213 h200" stroke="${INK}" stroke-width="1.5"/></g>`
          + tpArms(7)
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z" fill="none"/><path d="M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2)
          // khoá kéo
          + '<rect x="117" y="188" width="6" height="92" fill="#d27220" stroke="#3b3025" stroke-width="1.4"/>',
        prop: classic(7) }
    ],

    /* ---------- 8 · Chị Hoa — tiệm vàng bạc (khung 200x280; màu nhận diện: xanh ngọc bích) ---------- */
    8: [
      { ten: 'Vest ngọc bích',
        grad: { c7cloth: ['#4fa88b', '#358a70'], c7clothL: ['#358a70', '#276c58'] },
        over:
          // áo lụa kem bên trong, ve vest bản to
          g('<path d="M106,178 L120,240 L134,178z" fill="#f6eedc"/>', 1.6)
          // dây chuyền nằm trên lót lụa, DƯỚI ve vest (ve áo che hai bên dây)
          + HOA_DAY
          + g('<path d="M108,176 q-10,4 -16,10 l6,10 l-6,5 l20,40 l8,-1z" fill="#3f9b7f"/>'
            + '<path d="M132,176 q10,4 16,10 l-6,10 l6,5 l-20,40 l-8,-1z" fill="#2f8068"/>', 1.6),
        prop: HOA_HOATAI },
      { ten: 'Áo lụa ngọc lục bảo',
        grad: { c7cloth: ['#23946a', '#1a7a56'], c7clothL: ['#1a7a56', '#115e41'] },
        swap: [['fill="#efe3d2"', 'fill="#e9d29a"'], ['#d9634f" d="M108,182', '#e8b84b" d="M108,182']],
        over:
          // hoạ tiết hoa mai vàng trên lụa (thưa, to vừa)
          '<g fill="#f2c94c">'
          + [[78, 208], [158, 206], [92, 230], [148, 232], [50, 222], [192, 222], [64, 252], [176, 254], [120, 266]].map(([x, y]) =>
              `<g transform="translate(${x},${y})"><circle cx="0" cy="-3.4" r="2.6"/><circle cx="3.4" cy="0" r="2.6"/><circle cx="0" cy="3.4" r="2.6"/><circle cx="-3.4" cy="0" r="2.6"/></g>`).join('')
          + '</g>',
        // viền vàng cổ áo + chuỗi hạt vàng + mặt dây hình thoi + khuyên tròn gắn đúng dái tai (tách 2 nhóm cho dáng 3/4)
        prop: '<path d="M101,181 L120,209 L139,181" fill="none" stroke="#e8b84b" stroke-width="2.6" stroke-linejoin="round"/>'
          + '<g fill="#f0c419" stroke="#8a6238" stroke-width="1.2">'
          // chuỗi hạt vòng ra từ hai bên chân cổ, nằm trong viền chữ V; hạt rải đều theo độ dài dây
          + tpHat([106, 181], [120, 229], [134, 181], 9, 2.6)
          + '</g>'
          + g('<path d="M120,206 l8,8 l-8,10 l-8,-10z" fill="#f0c419" stroke="#8a6238" stroke-width="2"/>', 2)
          + '<g fill="none"><circle cx="61" cy="125" r="5.8" stroke="#c8a227" stroke-width="2.6"/><circle cx="61" cy="125" r="7.2" stroke="#8a6238" stroke-width="1" opacity=".7"/></g>'
          + '<g fill="none"><circle cx="179" cy="125" r="5.8" stroke="#c8a227" stroke-width="2.6"/><circle cx="179" cy="125" r="7.2" stroke="#8a6238" stroke-width="1" opacity=".7"/></g>' }
    ],

    /* ---------- 9 · Thầy Nam — giáo viên Hoá (khung 284x468; bỏ cổ áo, tỉ lệ hội họa nam trưởng thành; màu nhận diện: trắng + vàng mù tạt) ---------- */
    9: [
      { ten: 'Gi-lê len giảng đường',
        over:
          '<clipPath id="tp9s1_vest"><path d="M96,184 C72,188 44,194 26,204 L34,252 L48,252 C52,276 56,296 58,314 C56,348 53,378 52,404 L188,404 C187,378 184,348 182,314 C184,296 188,276 192,252 L206,252 L214,204 C196,194 168,188 144,184 Q120,202 96,184 Z"/></clipPath>'
          + tpMaleTorso('#d8a94c')
          + '<g clip-path="url(#tp9s1_vest)" stroke="#b98a35" stroke-width="1.5" opacity=".55">'
          + [54, 66, 78, 90, 102, 138, 150, 162, 174, 186].map(x => `<path d="M${x},184 v220"/>`).join('') + '</g>'
          + '<path d="M96,184 Q120,202 144,184 L120,256 Z" fill="#fbf7ee" stroke="none"/>'
          + '<path d="M96,184 Q120,202 144,184 L141,192 Q120,210 99,192 Z" fill="#3b3025" fill-opacity=".12" stroke="none"/>'
          + '<path d="M99,192 Q120,210 141,192" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>'
          + '<path d="M95,185 L120,255 L145,185" fill="none" stroke="#a87a2c" stroke-width="4" stroke-linejoin="round"/>'
          + g('<path d="M97,185 L120,256 L143,185" fill="none"/>', 1.6)
          + tpMaleOutline()
          // ghim hình bình tam giác
          + '<g transform="translate(-6,-4)">' + g('<path d="M80,222 h6 v6 l6,11 q1,3 -2,3 h-14 q-3,0 -2,-3 l6,-11z" fill="#fffdf5"/><path d="M76,236 h16 l2,4 q0,2 -2,2 h-14 q-2,0 -2,-2z" fill="#7aa95c" stroke="none"/>', 1.8) + '</g>'
          + tpProtoArms(9, null, null, true, '#a87a2c') },
      { ten: 'Blouse dạy thực hành',
        grad: { c8cloth: ['#fbf6e8', '#efe6cf'], c8clothL: ['#efe6cf', '#ddd2b6'] },
        over:
          '<defs><linearGradient id="tp9s2_coat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#e4dfd2"/></linearGradient></defs>'
          + tpMaleTorso('url(#tp9s2_coat)')
          + '<path d="M96,184 Q120,202 144,184 L134,242 V404 H106 V242 Z" fill="#f3ecda" stroke="none"/>'
          + '<path d="M96,184 Q120,202 144,184 L141,192 Q120,210 99,192 Z" fill="#3b3025" fill-opacity=".12" stroke="none"/>'
          + '<path d="M99,192 Q120,210 141,192" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>'
          + g('<path d="M96,184 L106,242 V404 M144,184 L134,242 V404 M120,242 V404" fill="none"/>', 1.6)
          + '<g fill="#3b3025" opacity=".5"><circle cx="120" cy="264" r="2.6"/><circle cx="120" cy="306" r="2.6"/><circle cx="120" cy="348" r="2.6"/></g>'
          + tpMaleOutline()
          // ống nghiệm to cắm túi ngực
          + g('<rect x="158" y="212" width="10" height="28" rx="5" fill="#fffdf5"/>'
            + '<path d="M158.8,226 h8.4 v9 q0,4.2 -4.2,4.2 q-4.2,0 -4.2,-4.2z" fill="#9b7bb8" stroke="none"/>', 1.5)
          + g('<path d="M150,230 h25 v20 q-12.5,4 -25,0z" fill="#f4f1e8"/>', 1.6)
          + tpProtoArms(9, 'url(#tp9s2_coat)', 'url(#tp9s2_coat)', false) }
    ],

    /* ---------- 10 · Cô Mai — quán chè (khung 200x280; tạp dề của diversify nằm trên over, đổi màu bằng swap; màu nhận diện: san hô / đào) ---------- */
    10: [
      { ten: 'Tạp dề sọc kẹo',
        grad: { c9cloth: ['#ef8f76', '#e2755c'], c9clothL: ['#e2755c', '#c95e47'] },
        swap: [['fill="#e0a458"', 'fill="url(#tp10s1_soc)"'], ['stroke="#e0a458"', 'stroke="#c8384e"'], ['class="sua10_kep"', 'style="display:none"']],   // yếm + quai cổ, ẩn kẹp xanh khi đeo băng đô
        over:
          '<defs><pattern id="tp10s1_soc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff6ea"/><rect width="5" height="10" fill="#c8384e"/></pattern></defs>'
          // băng đô đỏ thắt nơ (ôm trọn bề ngang mái tóc phồng x 60..180)
          + g('<path d="M63,76 q57,-38 114,0 l-2,8 q-55,-32 -110,0z" fill="#c8384e"/>'
            + '<path d="M166,64 l14,-12 l2,14z M166,64 l16,4 l-8,10z" fill="#e05a6a"/><circle cx="166" cy="64" r="3.4" fill="#c8384e"/>', 2.4),
        // túi tạp dề + cái vá múc chè (nâng lên ngực)
        prop: g('<path d="M124,218 l6,-18 q2,-6 -3,-7" fill="none" stroke="#3b3025" stroke-width="5"/>'
            + '<path d="M124,218 l6,-18 q2,-6 -3,-7" fill="none" stroke="#c9ccd2" stroke-width="3"/>'
            + '<path d="M108,210 h24 v11 q-12,4 -24,0z" fill="#c8384e"/>', 1.6) },
      { ten: 'Ly chè ba màu (áo mơ)',
        grad: { c9cloth: ['#fcd5ad', '#f6bb88'], c9clothL: ['#f6bb88', '#df9c66'] },
        swap: [['fill="#e0a458"', 'fill="#6f8fb5"'], ['stroke="#e0a458"', 'stroke="#6f8fb5"']],
        over:
          // xắn tay áo
          '<clipPath id="tp10s2_arms"><path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z"/></clipPath>'
          + `<g clip-path="url(#tp10s2_arms)">${g('<path d="M20,244 q30,6 60,0 v14 q-30,6 -60,0z" fill="#fbd9c8"/><path d="M160,244 q30,6 60,0 v14 q-30,6 -60,0z" fill="#fbd9c8"/>', 2.2)}</g>`
          + g('<path d="M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z" fill="none"/><path d="M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z" fill="none"/>', 3.2),
        // hình ly chè ba màu in trên yếm jean (dẹt như logo, nằm gọn trong yếm, trên mép bàn)
        prop: g('<path d="M110,203 h20 l-3,22 q-7,3 -14,0z" fill="#fbf6ec"/>'
            + '<path d="M110.6,207 h18.8 l-0.6,5 h-17.6z" fill="#9cc77e" stroke="none"/>'
            + '<path d="M111.2,212 h17.6 l-0.7,6 h-16.2z" fill="#e8c35a" stroke="none"/>'
            + '<path d="M111.9,218 h16.2 l-0.9,6.4 q-7,2.6 -14.4,0z" fill="#8a4a3a" stroke="none"/>'
            + '<path d="M110,203 h20 l-3,22 q-7,3 -14,0z" fill="none"/>'
            + '<path d="M124,203 l3,-7" fill="none" stroke="#d9634f" stroke-width="2.6"/>', 2.2) }
    ]
  };
})();
