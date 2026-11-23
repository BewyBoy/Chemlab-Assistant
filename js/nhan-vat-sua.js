/* =====================================================================
   SỬA HÌNH GỐC NHÂN VẬT — vá lên HD_CHARS (do-hoa.js) lúc khởi động, không sửa file hình gốc.
   Nạp SAU js/do-hoa.js, TRƯỚC js/nhan-vat-skin.js. nhan-vat-skin.js gọi suaHinhGoc(svg, i) cho từng hình
   (i = chỉ số HD_CHARS: 0 giáo sư, 1..10 khách) NGAY SAU khi đã thay mắt chấm (nhóm <g class="eyes2"> là phần tử
   cuối của svg), TRƯỚC khi ghép trang phục (skin) và đạo cụ.
   ===================================================================== */
'use strict';

const SUA_INK = '#3b3025';

function suaTimPhanTu(svg, kim){
  const k = svg.indexOf(kim);
  if(k < 0) return null;
  const a = svg.lastIndexOf('<', k), b = svg.indexOf('/>', k);
  return (a < 0 || b < 0) ? null : [a, b + 2];
}
function suaBo(svg, kim){
  let r;
  while((r = suaTimPhanTu(svg, kim))) svg = svg.slice(0, r[0]) + svg.slice(r[1]);
  return svg;
}
function suaThay(svg, kim, moi){
  const r = suaTimPhanTu(svg, kim);
  return r ? svg.slice(0, r[0]) + moi + svg.slice(r[1]) : svg;
}
function suaChenTruocMat(svg, s){
  const e = svg.indexOf('<g class="eyes2');
  return e >= 0 ? svg.slice(0, e) + s + svg.slice(e) : svg.replace('</svg>', s + '</svg>');
}
function suaDoiMau(svg, hd, duoi, mau){
  [hd + '_', hd + 'e_'].forEach(pre => {
    const re = new RegExp('(<(linear|radial)Gradient id="' + pre + duoi + '"[^>]*>)([\\s\\S]*?)(</\\2Gradient>)');
    svg = svg.replace(re, (all, mo, loai, than, dong) => {
      let n = 0;
      than = than.replace(/stop-color(="|:)(#[0-9a-fA-F]{3,8}|rgb\([^)]*\))/g, (m, sep) => 'stop-color' + sep + mau[Math.min(n++, mau.length - 1)]);
      return mo + than + dong;
    });
  });
  return svg;
}
function suaCo200(svg, hd, wTop, wMid, wBot, yShadow, yBot){
  const skin = 'url(#hd' + hd + '_c' + (hd - 1) + 'skin)';
  const x0 = 120 - wTop, x1 = 120 + wTop, xm0 = 120 - wMid, xm1 = 120 + wMid, xb0 = 120 - wBot, xb1 = 120 + wBot;
  const ys = yShadow || 163, yb = yBot || 182;
  svg = svg.replace(/<path fill="url\(#hd\d+_c\d+skin\)" d="M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z"\/>/,
    `<path fill="${skin}" d="M${x0},152 Q${xm0},167 ${xb0},${yb} Q120,${yb + 8} ${xb1},${yb} Q${xm1},167 ${x1},152 Z"/>`);
  svg = svg.replace(/<path d="M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z"[^/]*\/>/,
    `<path d="M${xm0},${ys} Q120,${ys + 9} ${xm1},${ys} L${xm1},${ys + 6} Q120,${ys + 15} ${xm0},${ys + 6} Z" fill="#3b3025" opacity=".13" stroke="none"/>`);
  return svg;
}

/* --- Chuẩn giải phẫu hội họa nam trưởng thành (1 Đầu = 116x96px; vai rộng ~2.2× đầu, khuỷu ngang eo y=312, cổ tay y=398, bàn tay y=452) --- */
function suaCoNam(skin, yTop){
  yTop = yTop || 154;
  return `<path fill="${skin}" stroke="${SUA_INK}" stroke-width="3" stroke-linejoin="round" d="M100,${yTop} Q102,174 96,194 Q120,206 144,194 Q138,174 140,${yTop} Z"/>`
    + `<path d="M101,168 Q120,178 139,168 L139,176 Q120,186 101,176 Z" fill="${SUA_INK}" opacity=".14" stroke="none"/>`;
}
function suaThanNam(fill, yBot){
  yBot = yBot || 404;
  return `<path class="tq-keep-body" fill="${fill}" stroke="none" d="M96,184 C72,188 44,194 26,204 L34,252 L48,252 C52,276 56,296 58,314 C56,348 53,378 52,${yBot} L188,${yBot} C187,378 184,348 182,314 C184,296 188,276 192,252 L206,252 L214,204 C196,194 168,188 144,184 Q120,202 96,184 Z"/>`
    + `<path class="tq-keep-body" d="M48,250 C58,284 62,310 60,340 C58,366 56,386 55,${yBot} L52,${yBot} C53,378 56,348 58,314 C56,296 52,276 48,250 Z M192,250 C182,284 178,310 180,340 C182,366 184,386 185,${yBot} L188,${yBot} C187,378 184,348 182,314 C184,296 188,276 192,250 Z" fill="${SUA_INK}" fill-opacity=".09" stroke="none"/>`;
}
function suaVienThanNam(yBot){
  yBot = yBot || 404;
  return `<path class="tq-keep-body" fill="none" stroke="${SUA_INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M26,204 C44,194 72,188 96,184 Q120,202 144,184 C168,188 196,194 214,204 M48,252 C52,276 56,296 58,314 C56,348 53,378 52,${yBot} L188,${yBot} C187,378 184,348 182,314 C184,296 188,276 192,252"/>`;
}
function suaTayNam(L, R, S, opts){
  opts = opts || {};
  const isVest = !!opts.isVest, vestStroke = opts.vestStroke || '#a87a2c';
  const topL = isVest
    ? 'M26,204 C12,216 10,240 11,268 C12,288 13,302 14,312 C11,334 14,366 22,398 Q33.5,404 45,396 C47,366 49,336 48,312 C49,292 50,272 49,252 C43,234 36,218 26,204 Z'
    : 'M26,204 C12,216 10,240 11,268 C12,288 13,302 14,312 C11,334 14,366 22,398 Q33.5,404 45,396 C47,366 49,336 48,312 C49,292 50,272 49,252 C48,238 46,228 44,220';
  const topR = isVest
    ? 'M214,204 C228,216 230,240 229,268 C228,288 227,302 226,312 C229,334 226,366 218,398 Q206.5,404 195,396 C193,366 191,336 192,312 C191,292 190,272 191,252 C197,234 204,218 214,204 Z'
    : 'M214,204 C228,216 230,240 229,268 C228,288 227,302 226,312 C229,334 226,366 218,398 Q206.5,404 195,396 C193,366 191,336 192,312 C191,292 190,272 191,252 C192,238 194,228 196,220';
  return `<g class="arm-l"><path fill="${S}" stroke="${SUA_INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round" d="M24,395 C20,408 19,424 21,436 C23,446 27,452 32,452 C36,452 39,446 40,435 C41,428 42,424 43,420 C46,423 50,420 50,412 C49,405 46,399 43,394 Z"/>`
    + `<path d="M43,404 C42,411 42,416 43,420 M27,430 C27,439 27,446 26,450 M33,430 C33,440 33,447 32,451 M38,428 C38,437 38,444 37,448" fill="none" stroke="${SUA_INK}" stroke-width="1.4" stroke-linecap="round"/>`
    + `<path fill="${L}" stroke="none" d="M40,214 L26,204 C12,216 10,240 11,268 C12,288 13,302 14,312 C11,334 14,366 22,398 Q33.5,404 45,396 C47,366 49,336 48,312 C49,292 50,272 49,252 C48,236 45,222 40,214 Z"/>`
    + `<path fill="${SUA_INK}" fill-opacity=".09" stroke="none" d="M44,220 C48,252 47,298 45,396 L38,399 C40,310 41,254 44,220 Z"/>`
    + `<path d="M36,312 Q42,316 48,312" fill="none" stroke="${SUA_INK}" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`
    + `<path d="M21,390 Q33.5,396 45.5,389" fill="none" stroke="${SUA_INK}" stroke-width="1.6" opacity=".55"/>`
    + `<path fill="none" stroke="${SUA_INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="${topL}"/>`
    + (isVest ? `<path d="M26,204 C36,218 43,234 49,252" fill="none" stroke="${vestStroke}" stroke-width="3.2" stroke-linecap="round"/>` : '')
    + `</g><g class="arm-r"><path fill="${S}" stroke="${SUA_INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round" d="M216,395 C220,408 221,424 219,436 C217,446 213,452 208,452 C204,452 201,446 200,435 C199,428 198,424 197,420 C194,423 190,420 190,412 C191,405 194,399 197,394 Z"/>`
    + `<path d="M197,404 C198,411 198,416 197,420 M213,430 C213,439 213,446 214,450 M207,430 C207,440 207,447 208,451 M202,428 C202,437 202,444 203,448" fill="none" stroke="${SUA_INK}" stroke-width="1.4" stroke-linecap="round"/>`
    + `<path fill="${R}" stroke="none" d="M200,214 L214,204 C228,216 230,240 229,268 C228,288 227,302 226,312 C229,334 226,366 218,398 Q206.5,404 195,396 C193,366 191,336 192,312 C191,292 190,272 191,252 C192,236 195,222 200,214 Z"/>`
    + `<path fill="${SUA_INK}" fill-opacity=".09" stroke="none" d="M196,220 C192,252 193,298 195,396 L202,399 C200,310 199,254 196,220 Z"/>`
    + `<path d="M204,312 Q198,316 192,312" fill="none" stroke="${SUA_INK}" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`
    + `<path d="M219,390 Q206.5,396 194.5,389" fill="none" stroke="${SUA_INK}" stroke-width="1.6" opacity=".55"/>`
    + `<path fill="none" stroke="${SUA_INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="${topR}"/>`
    + (isVest ? `<path d="M214,204 C204,218 197,234 191,252" fill="none" stroke="${vestStroke}" stroke-width="3.2" stroke-linecap="round"/>` : '')
    + `</g>`;
}

const SUA = {
  /* ---------- 0 · Giáo sư Hoffmann: giữ nguyên kiểu tóc gốc đặc trưng, lông mày bạc rậm xoè, tỉ lệ hội họa nam trưởng thành ---------- */
  0(svg){
    svg = suaThay(svg, 'd="M80,84C92,78 104,77.333 116,82',
      '<path class="brw brw-l" d="M77,85 C83,76 92,74 99,78 L102,73 C109,75 114,78 117,83 C114,88 106,89 96,88 C88,87 82,87 77,85 Z" style="fill:url(#hd0__Linear14);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;"/>');
    svg = suaThay(svg, 'd="M124,82C136,77.333 148,78 160,84',
      '<path class="brw brw-r" d="M123,83 C126,78 131,75 138,73 L141,78 C148,74 157,76 163,85 C158,87 152,87 144,88 C134,89 126,88 123,83 Z" style="fill:url(#hd0__Linear15);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;"/>');
    svg = svg.replace(/<path d="M104,150C116,156\.667[^"]*"[^>]*\/>\s*<path d="M105,152C116\.333,158[^"]*"[^>]*\/>/,
      suaCoNam('url(#hd0__Radial3)', 152));
    svg = svg.replace(/<path d="M104,172C77\.333,178\.667[\s\S]*?L104,172Z"[^/]*\/>/,
      suaThanNam('url(#hd0__Linear17)', 408));
    // đổi 3 nét line shading trên áo blouse thành mảng nẹp dọc tới gấu áo 408
    svg = svg.replace(/<g opacity="0\.35">[\s\S]*?<\/g>/,
      '<rect x="118" y="196" width="5" height="212" style="fill:rgb(59,48,37);fill-opacity:0.08;stroke:none;"/>'
      + '<path d="M120,196L120,408" style="fill:none;stroke:rgb(59,48,37);stroke-opacity:0.35;stroke-width:1.6px;"/>');
    // bỏ trọn nhóm bình tam giác cũ + 2 chấm bọt cũ (khớp đủ cặp <g>...</g> để không làm lệch translate +20 của mắt & phụ kiện)
    svg = svg.replace(/<g transform="matrix\(1,0,0,1,20,0\)">\s*<path d="M78,244C75\.333[\s\S]*?stroke:rgb\(59,48,37\);stroke-width:2\.8px;[^/]*\/>\s*<\/g>\s*<\/g>/, '');
    svg = svg.replace(/<g transform="matrix\(1,0,0,1,20,0\)">\s*<circle cx="78" cy="276"[^>]*\/>\s*<\/g>/, '');
    svg = svg.replace(/<g transform="matrix\(1,0,0,1,20,0\)">\s*<circle cx="84" cy="272"[^>]*\/>\s*<\/g>/, '');
    const flaskMoved = '<g transform="translate(0,30)">'
      + '<path d="M74,238L74,254L60,280C58,286.667 60.667,290.667 68,292L92,292C99.333,290.667 102,286.667 100,280L86,254L86,238L74,238Z" style="fill:white;fill-opacity:0.22;stroke:rgb(59,48,37);stroke-width:2.8px;"/>'
      + '<path d="M67.5,273L91.5,273C96,279.6 97.5,284.3 95.5,287C84.8,291 74,291 63.5,287C61.5,284.3 62.8,279.6 67.5,273Z" style="fill:url(#hd0__Linear23);stroke:rgb(59,48,37);stroke-width:0.8px;"/>'
      + '<path d="M88,232L88,238C88,239.1 87.1,240 86,240L74,240C72.9,240 72,239.1 72,238L72,232C72,230.9 72.9,230 74,230L86,230C87.1,230 88,230.9 88,232Z" style="fill:rgb(230,224,207);stroke:rgb(59,48,37);stroke-width:2.8px;"/>'
      + '<circle cx="78" cy="281" r="2" style="fill:white;fill-opacity:0.7;"/>'
      + '<circle cx="84" cy="277" r="1.4" style="fill:white;fill-opacity:0.6;"/>'
      + '</g>';
    const newLeftArm = suaVienThanNam(408)
      + '<g class="arm-l">'
      + '<path fill="url(#hd0__Linear19)" stroke="none" d="M40,214 L26,204 C12,216 10,242 11,274 C12,298 14,316 18,328 C24,339 46,338 66,330 L64,312 C52,312 46,308 45,296 C46,274 47,252 46,236 C45,226 43,218 40,214 Z"/>'
      + '<path fill="#3b3025" fill-opacity=".08" stroke="none" d="M43,222 C46,250 45,286 45,302 L65,314 L66,330 L34,335 C38,302 40,256 43,222 Z"/>'
      + '<path d="M32,306 Q39,310 45,305" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity=".45"/>'
      + '<path d="M58,312 Q61,321 60,331" fill="none" stroke="#3b3025" stroke-width="1.5" opacity=".55"/>'
      + '<path fill="none" stroke="#3b3025" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M26,204 C12,216 10,242 11,274 C12,298 14,316 18,328 C24,339 46,338 66,330 L64,312 C52,312 46,308 45,296 C46,274 47,252 46,236 C45,226 44,220 43,217"/>'
      + '<g transform="translate(6,24)"><path d="M60,282C69.333,284.667 78,283.333 86,278C90,284.667 89.333,290.667 84,296C76.139,299.93 69.003,300.602 62.59,298.015C60.301,297.092 58.104,295.754 56,294C54.667,288.667 56,284.667 60,282Z" style="fill:url(#hd0__Radial20);stroke:rgb(59,48,37);stroke-width:2.8px;"/>'
      + '<path d="M66,287C68.4,291 68.4,295.5 66,300M74,287C76.7,292.3 77,297 75,300M82,285C84.7,290.3 85,294.6 83,298" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/></g>'
      + flaskMoved + '</g>';
    const newRightArm = suaTayNam('url(#hd0__Linear19)', 'url(#hd0__Linear22)', 'url(#hd0__Radial21)').match(/<g class="arm-r">[\s\S]*$/)[0];
    svg = svg.replace(/<g transform="matrix\(1,0,0,1\.105635[\s\S]*?<path d="M200\.192,201\.22[\s\S]*?<\/g>/, newLeftArm + newRightArm);
    return svg.replace(/viewBox="[^"]+"/, 'viewBox="-12 0 304 468"');
  },

  /* ---------- 1 · Bà Tư: đổi sang kiểu tóc bạc ngắn uốn phồng cúp ngang tai (khác với tóc búi cao của Chị Hoa), đổ bóng áo dạng khối ---------- */
  1(svg){
    svg = svg.split('fill:rgb(232,184,75);stroke:rgb(59,48,37);stroke-width:1.6px').join('fill:none;stroke:none;stroke-width:1.6px');
    svg = svg.replace('<path d="M146,96C154.667,94.667 158.333,99 157,109C155.667,117.667 150.667,121.333 142,120L146,96Z"',
      '<g transform="matrix(1,0,0,1,19.2,10.235294)"><path d="M146,96C154.667,94.667 158.333,99 157,109C155.667,117.667 150.667,121.333 142,120L146,96Z"</g>').replace('</g> style="fill:url(#hd1__Radial6);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;"/>', ' style="fill:url(#hd1__Radial6);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;"/></g>');
    svg = suaThay(svg, 'd="M80,84C92,78.667 103.333,78 114,82',
      '<path class="brw brw-l" d="M80,86 C90,77 104,76 114,82 C112,86 104,85 95,85 C88,86 83,88 80,86 Z" style="fill:#9e9b91;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.8px;"/>');
    svg = suaThay(svg, 'd="M124,82C135.333,78 146.667,78.667 158,84',
      '<path class="brw brw-r" d="M126,82 C136,76 150,77 160,86 C157,88 152,86 145,85 C136,85 128,86 126,82 Z" style="fill:#9e9b91;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.8px;"/>');
    svg = svg.replace(/<g transform="matrix\(0\.697363,0,0,1,50\.263727,20\)">[\s\S]*?<\/g>\s*<path d="M85,142[^/]*\/>/,
      '<path d="M107,156 Q108,169 105,182 Q120,189 135,182 Q132,169 133,156 Z" style="fill:url(#hd1__Radial4);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;"/>'
      + '<path d="M107,168 Q120,176 133,168 L133,174 Q120,182 107,174 Z" style="fill:rgb(59,48,37);fill-opacity:0.13;fill-rule:nonzero;"/>');
    // Tóc bạc ngắn uốn lượn sóng cúp ngang dái tai (không còn búi đỉnh đầu trùng với Chị Hoa)
    svg = svg.replace(/<g transform="matrix\(1,0,0,1,-38,2\.204651\)">[\s\S]*?<path d="M104,30C114\.667,23\.333 125\.333,23\.333 136,30"[^/]*\/>\s*<\/g>/,
      '<path class="sua_hair" d="M62,134 C50,128 48,112 55,98 C48,84 52,64 66,48 C80,34 98,28 120,28 C142,28 160,34 174,48 C188,64 192,84 185,98 C192,112 190,128 178,134 C169,138 161,134 158,124 L82,124 C79,134 71,138 62,134 Z" style="fill:url(#hd1__Linear3);stroke:rgb(59,48,37);stroke-width:3px;"/>'
      + '<path class="sua_mai" d="M57,98 C62,102 66,108 66,116 M183,98 C178,102 174,108 174,116" style="fill:none;stroke:rgb(140,138,128);stroke-width:1.6px;opacity:0.65;"/>');
    svg = svg.replace(/<g transform="matrix\(-0\.936204,0\.351457,-0\.351457,-0\.936204,226\.489764,95\.136953\)">[\s\S]*?<\/g>/,
      '<g transform="matrix(1,0,0,1,40,0)">'
      + '<path class="sua_hair" d="M67,104 C61,72 80,40 120,38 C160,40 179,72 173,104 C167,84 152,68 134,58 C110,72 82,82 67,104 Z" style="fill:url(#hd1__Linear3);stroke:rgb(59,48,37);stroke-width:2.8px;"/>'
      + '<path class="sua_mai" d="M134,58 l5,-12 M82,66 q22,-14 48,-10 M162,74 q-12,-12 -26,-14 M74,82 q18,-10 38,-14" style="fill:none;stroke:rgb(140,138,128);stroke-width:1.6px;opacity:0.65;"/>'
      + '</g>');
    // Đổi nét line giữa áo thành mảng khối đổ bóng nẹp áo và hai bên sườn
    svg = svg.replace('<path d="M120,192L120,288" style="fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-opacity:0.3;stroke-width:1.6px;stroke-linecap:butt;"/>',
      '<path d="M68,200 C74,230 75,262 72,294 L42,294 C44,248 49,219 58,206 C61,202 64,200 68,200 Z M172,200 C166,230 165,262 168,294 L198,294 C196,254 183,217 179,207 C177,203 175,201 172,200 Z" style="fill:rgb(59,48,37);fill-opacity:0.09;stroke:none;"/>'
      + '<rect x="118.5" y="192" width="4.5" height="96" style="fill:rgb(59,48,37);fill-opacity:0.1;stroke:none;"/>'
      + '<path d="M120,192L120,288" style="fill:none;stroke:rgb(59,48,37);stroke-opacity:0.35;stroke-width:1.6px;"/>');
    return svg;
  },

  /* ---------- 2 · Chú Ba: lông mày rậm góc cạnh, tỉ lệ hội họa nam trưởng thành, cân hai tai, thêm tóc dưới nón ---------- */
  2(svg){
    svg = suaBo(svg, 'xlink:href="#hd2__Image14"');
    svg = suaThay(svg, 'd="M80,84C92,78.667 103.333,78 114,82',
      '<path class="brw brw-l" d="M77,85 L95,76 L115,81 L113,88 L95,84 L79,90 Z" style="fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;"/>');
    svg = suaThay(svg, 'd="M124,82C135.333,78 146.667,78.667 158,84',
      '<path class="brw brw-r" d="M122,81 L142,76 L160,85 L158,90 L142,84 L124,88 Z" style="fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;"/>');
    svg = svg.replace(/<g transform="matrix\(0\.861111,0,0,1,73\.388889,15\.5\)">[\s\S]*?<\/g>/,
      '<g transform="matrix(1,0,0,1,40,0)">' + suaCoNam('url(#hd2__Radial1)', 154) + '</g>');
    svg = suaBo(svg, 'd="M85,142C95,147.333');
    svg = svg.replace('<g transform="matrix(1.214093,0,0,1,6.851104,-3.6804)">', '<g transform="matrix(1,0,0,1,18,0)">');
    svg = svg.replace('<path d="M146,96C154.667,94.667 158.333,99 157,109C155.667,117.667 150.667,121.333 142,120L146,96Z"',
      '<path class="sua_hair" d="M68,104 C65,92 66,80 70,72 L170,72 C174,80 175,92 172,104 L164,102 L76,102 Z" style="fill:#37302a;stroke:rgb(59,48,37);stroke-width:2.8px;"/>'
      + '<g transform="matrix(1,0,0,1,22,0)"><path d="M146,96C154.667,94.667 158.333,99 157,109C155.667,117.667 150.667,121.333 142,120L146,96Z"</g>').replace('</g> style="fill:url(#hd2__Radial4);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;"/>', ' style="fill:url(#hd2__Radial4);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;"/></g>');
    // Đổi nét line dọc trên nón lá thành khối đổ bóng
    svg = svg.replace(/<clipPath id="hd2__clip10">[\s\S]*?<\/g>\s*<\/g>/,
      '<path d="M120,40 C152,41 182,52 210,68 C212,72 211,74 206,76 L120,76 Z" style="fill:rgb(59,48,37);fill-opacity:0.1;stroke:none;"/>');
    // Thân & tay chuẩn tỉ lệ hội họa nam trưởng thành
    svg = svg.replace(/<path d="M104,178C80,184[\s\S]*?stroke-width:3\.2px;"\/>/, suaThanNam('url(#hd2__Linear12)'));
    svg = suaThay(svg, 'd="M70,220C74,244 74.667,269.333 72,296M170,220', suaVienThanNam());
    svg = svg.replace('M120,182C111.333,183.333 103.333,187.667 96,195C108,193 116,195.333 120,202L120,182Z',
      'M120,188C111,189 102,193 94,200C107,198 115,200 120,208L120,188Z');
    svg = svg.replace('M120,182C128.667,183.333 136.667,187.667 144,195C132,193 124,195.333 120,202L120,182Z',
      'M120,188C129,189 138,193 146,200C133,198 125,200 120,208L120,188Z');
    svg = svg.replace(/<g transform="matrix\(1\.063859[\s\S]*?<path d="M155,263[\s\S]*?<\/g>/,
      suaTayNam('url(#hd2__Linear15)', 'url(#hd2__Linear17)', 'url(#hd2__Radial16)'));
    const mai = '<g>'
      + '<path d="M70,74 L78,74 C76,84 75,94 74,102 C71,102 69,96 70,74 Z" style="fill:#37302a;stroke:rgb(59,48,37);stroke-width:2.6px;"/>'
      + '<path d="M170,74 L162,74 C164,84 165,94 166,102 C169,102 171,96 170,74 Z" style="fill:#37302a;stroke:rgb(59,48,37);stroke-width:2.6px;"/>'
      + '</g>';
    svg = svg.replace('<path d="M30,68C90,30.667', mai + '<path d="M30,68C90,30.667');
    return svg.replace(/viewBox="[^"]+"/, 'viewBox="18 0 284 468"');
  },

  /* ---------- 3 · Bé Na: lông mày hạt đậu bầu dễ thương, cổ học sinh, căn đối xứng 2 chùm tóc & đổi line shading áo thành khối ---------- */
  3(svg){
    svg = suaBo(svg, 'xlink:href="#hd3__Image15"');
    svg = suaBo(svg, 'xlink:href="#hd3__Image14"');
    svg = suaThay(svg, 'd="M80,84C92,78.667 103.333,78 114,82',
      '<path class="brw brw-l" d="M87,85 C93,79 105,79 112,84 C110,88 103,88 98,88 C92,88 88,88 87,85 Z" style="fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;"/>');
    svg = suaThay(svg, 'd="M124,82C135.333,78 146.667,78.667 158,84',
      '<path class="brw brw-r" d="M128,84 C135,79 147,79 153,85 C152,88 148,88 142,88 C137,88 130,88 128,84 Z" style="fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;"/>');
    svg = svg.replace(/<g transform="matrix\(0\.606572,0,0,0\.917808,60\.951146,38\.003729\)">[\s\S]*?<\/g>\s*<g transform="matrix\(1,0,0,0\.917808,-0,23\.671156\)">\s*<path d="M85,142[\s\S]*?<\/g>/,
      '<g transform="matrix(1,0,0,0.917808,0,23.671156)">'
      + '<path d="M107,152 Q108,165 105,179 Q120,186 135,179 Q132,165 133,152 Z" style="fill:url(#hd3__Radial5);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;"/>'
      + '<path d="M107,160 Q120,168 133,160 L133,166 Q120,174 107,166 Z" style="fill:rgb(59,48,37);fill-opacity:0.13;fill-rule:nonzero;"/></g>');
    svg = svg.replace(/<g transform="matrix\(1,0,0,0\.917808,-0,23\.671156\)">\s*<path d="M146,96/, '<g transform="matrix(1,0,0,0.917808,19.66,31.0041)"><path d="M146,96');
    svg = svg.replace(/<g transform="matrix\(1,0,0,0\.917808,-0,23\.671156\)">\s*<path d="M60,90[\s\S]*?<path d="M174,100[^/]*\/>\s*<\/g>/,
      '<g transform="matrix(1,0,0,0.917808,0,23.671156)">'
      + '<path class="sua_hair" d="M64,104 C56,70 72,30 120,28 C168,30 184,70 176,104 C172,114 166,112 164,104 L76,104 C74,112 68,114 64,104 Z" style="fill:url(#hd3__Linear2);stroke:rgb(59,48,37);stroke-width:3px;"/>'
      + '<g><path d="M64,78 C48,81 40,92 42,108 C43,118 49,124 60,125 C55,112 56,100 64,94 Z" style="fill:url(#hd3__Linear3);stroke:rgb(59,48,37);stroke-width:3px;"/>'
      + '<path d="M54,94 C49,91 48,88 52,84 C56,81 59,83 62,88 C65,83 68,82 72,86 C73,91 71,94 64,96 C60,97 57,96 54,94 Z" style="fill:rgb(217,99,79);stroke:rgb(59,48,37);stroke-width:2px;"/></g>'
      + '<g><path d="M176,78 C192,81 200,92 198,108 C197,118 191,124 180,125 C185,112 184,100 176,94 Z" style="fill:url(#hd3__Linear4);stroke:rgb(59,48,37);stroke-width:3px;"/>'
      + '<path d="M186,94 C191,91 192,88 188,84 C184,81 181,83 178,88 C175,83 172,82 168,86 C167,91 169,94 176,96 C180,97 183,96 186,94 Z" style="fill:rgb(217,99,79);stroke:rgb(59,48,37);stroke-width:2px;"/></g>'
      + '</g>');
    svg = svg.replace(/<g transform="matrix\(1,0,0,0\.917808,53\.737632,10\.005213\)">[\s\S]*?<\/g>/,
      '<g transform="matrix(1,0,0,0.917808,40,23.671156)">'
      + '<path class="sua_hair" d="M68,98 C62,64 78,34 120,32 C162,34 178,64 172,98 C168,86 165,78 162,73 C148,75 138,76 128,76 C126,71 125,68 124,68 C123,68 122,71 120,76 C104,76 90,75 78,73 C75,78 72,86 68,98 Z" style="fill:url(#hd3__Linear2);stroke:rgb(59,48,37);stroke-width:2.8px;"/>'
      + '<path class="sua_mai" d="M88,48 C108,40 132,40 152,48" style="fill:none;stroke:rgb(122,106,92);stroke-width:1.6px;opacity:0.55;"/>'
      + '</g>');
    // Đổi nét line lẻ trên áo hồng thành khối đổ bóng hai bên sườn áo
    svg = suaThay(svg, 'd="M166,214C162,234 161.333,256 164,280"',
      '<path d="M74,196 C78,224 78,256 76,288 L48,288 C47,246 52,217 62,204 C66,200 70,197 74,196 Z M166,196 C162,224 162,256 164,288 L192,288 C193,246 188,217 178,204 C174,200 170,197 166,196 Z" style="fill:rgb(59,48,37);fill-opacity:0.08;stroke:none;"/>');
    return svg;
  },

  /* ---------- 4 · Anh Minh: bỏ tóc nhọn ẩn dưới mũ, tóc ngắn + tóc mai cân đối, tỉ lệ hội họa nam trưởng thành ---------- */
  4(svg){
    const H = 'url(#hd4_c3hair)';
    svg = svg.replace(/<path fill="url\(#hd4_c3skin\)" d="M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z"\/>\s*<path d="M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z"[^/]*\/>/,
      suaCoNam('url(#hd4_c3skin)', 154));
    svg = svg.replace(/<path fill="url\(#hd4_c3cloth\)" d="M100,178[^"]*"\/>[\s\S]*?<path d="M70,218[^"]*"[^/]*\/>/,
      suaThanNam('url(#hd4_c3cloth)') + suaVienThanNam());
    svg = svg.replace(/<g stroke="#3b3025" stroke-width="3\.2" stroke-linejoin="round"><path fill="url\(#hd4_c3cloth\)" d="M56,196[\s\S]*?<\/g><\/g>/,
      suaTayNam('url(#hd4_c3cloth)', 'url(#hd4_c3clothL)', 'url(#hd4_c3skin)'));
    svg = svg.replace('M97,177 q23,13 46,0 l3,6 q-26,16 -52,0z', 'M95,184 Q120,202 145,184 L147,192 Q120,212 93,192 Z');
    svg = suaBo(svg, 'd="M78,62 l6,-20');
    svg = suaThay(svg, 'd="M62,96 q-10,-44 26,-58',
      '<path class="sua_hair" fill="' + H + '" d="M65,104 q-4,-22 7,-36 q18,-18 48,-18 q30,0 48,18 q11,14 7,36 q-4,2 -7,-4 h-96 q-3,6 -7,4z"/>');
    const mai = '<g stroke="' + SUA_INK + '" stroke-width="2.6" stroke-linejoin="round">'
      + '<path fill="' + H + '" d="M70,74 h9 l-2,28 q-4,2 -7,-3z"/>'
      + '<path fill="' + H + '" d="M170,74 h-9 l2,28 q4,2 7,-3z"/></g>';
    return suaChenTruocMat(svg, mai).replace(/viewBox="[^"]+"/, 'viewBox="-22 0 284 468"');
  },

  /* ---------- 5 · Cô Lan: cổ nữ thon gọn, bỏ 2 tam giác cổ áo cũ chồng chéo, tóc xõa ngang vai + mái rẽ ngôi lệch ---------- */
  5(svg){
    const H = 'url(#hd5_c4hair)';
    svg = suaCo200(svg, 5, 14, 12.5, 15, 162, 184);
    svg = suaBo(svg, 'd="M120,176 q14,2 26,13');
    svg = suaThay(svg, 'd="M120,176 q-14,2 -26,13',
      '<path fill="#f3eddc" d="M100,177 q20,9 40,0 l-20,25z"/>');
    svg = svg.replace('d="M104,172 q-38,10 -54,32 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-22 -54,-32 q-16,9 -32,0z"',
      'd="M104,176 q-38,8 -54,28 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-20 -54,-28 q-16,11 -32,0z"');
    svg = suaThay(svg, 'd="M58,100 q-14,-48 30,-64',
      '<path class="sua_hair" fill="' + H + '" d="M62,98 C52,58 76,30 120,30 C164,30 188,58 178,98 C182,128 180,158 172,182 C164,186 154,182 150,172 L90,172 C86,182 76,186 68,182 C60,158 58,128 62,98 Z"/>'
      + '<path class="sua_hair" d="M72,122 C70,144 72,164 76,178 M168,122 C170,144 168,164 164,178 M158,118 C160,142 158,162 155,176" fill="none" stroke="#7a6a5c" stroke-width="1.5" opacity=".55"/>');
    svg = suaThay(svg, 'd="M74,66 q22,-16 46,-2',
      '<path class="sua_hair" fill="' + H + '" d="M68,98 C62,66 82,36 120,34 C158,36 178,66 172,98 C166,78 156,64 140,56 C116,68 86,74 68,98 Z"/>'
      + '<path class="sua_mai" d="M140,56 l5,-11 M90,46 q28,-10 56,0 M132,54 q-22,8 -42,16" fill="none" stroke="#7a6a5c" stroke-width="1.6" opacity=".55"/>');
    return svg;
  },

  /* ---------- 6 · Ông Sáu: tóc mai bạc ngắn, gi-lê xanh ô-liu ngoài + áo dài tay trắng trong, tỉ lệ hội họa nam trưởng thành ---------- */
  6(svg){
    const H = 'url(#hd6_c5hair)';
    svg = svg.replace(/<path fill="url\(#hd6_c5skin\)" d="M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z"\/>\s*<path d="M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z"[^/]*\/>/,
      suaCoNam('url(#hd6_c5skin)', 154));
    svg = suaBo(svg, 'd="M108,48 q10,-6 18,0"');
    svg = suaDoiMau(svg, 'hd6', 'c5cloth',  ['#8d9a55', '#74803f']);
    svg = suaDoiMau(svg, 'hd6', 'c5clothL', ['#74803f', '#5a6430']);
    svg = suaBo(svg, 'd="M84,138 q-6,26 6,44');
    svg = suaThay(svg, 'd="M60,132 q-10,-18 4,-32',
      '<path fill="' + H + '" d="M69,98 C65,88 67,78 73,74 C76,78 76,88 74,98 Z"/>');
    svg = suaThay(svg, 'd="M180,132 q10,-18 -4,-32',
      '<path fill="' + H + '" d="M171,98 C175,88 173,78 167,74 C164,78 164,88 166,98 Z"/>');
    const whiteGrad = '<linearGradient id="hd6_whL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffef9"/><stop offset="1" stop-color="#ebe4d2"/></linearGradient>'
      + '<linearGradient id="hd6_whR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ebe4d2"/><stop offset="1" stop-color="#fffef9"/></linearGradient>';
    svg = svg.replace('<defs>', '<defs>' + whiteGrad);
    svg = svg.replace(/<path fill="#f7f0df" d="M104,176[\s\S]*?<circle cx="120" cy="248"[^>]*\/>/,
      suaThanNam('url(#hd6_c5cloth)')
      + '<path class="tq-keep-body" fill="url(#hd6_c5cloth)" stroke="none" d="M96,184 C72,188 44,194 26,204 L34,252 L48,252 C52,276 56,296 58,314 C56,348 53,378 52,404 L117,404 L117,193 Q106,189 96,184 Z"/>'
      + '<path class="tq-keep-body" fill="url(#hd6_c5clothL)" stroke="none" d="M144,184 C168,188 196,194 214,204 L206,252 L192,252 C188,276 184,296 182,314 C184,348 187,378 188,404 L123,404 L123,193 Q134,189 144,184 Z"/>'
      + '<path d="M117,194 V404 M123,194 V404" fill="none" stroke="' + SUA_INK + '" stroke-width="1.6" opacity=".55"/>'
      + suaVienThanNam()
      + '<circle cx="120" cy="246" r="3" fill="#fffef9" stroke="' + SUA_INK + '" stroke-width="1.6"/>'
      + '<circle cx="120" cy="296" r="3" fill="#fffef9" stroke="' + SUA_INK + '" stroke-width="1.6"/>');
    svg = svg.replace(/<g stroke="#3b3025" stroke-width="3\.2" stroke-linejoin="round"><path fill="url\(#hd6_c5cloth\)" d="M56,196[\s\S]*?<\/g><\/g>/,
      suaTayNam('url(#hd6_whL)', 'url(#hd6_whR)', 'url(#hd6_c5skin)', { isVest: true, vestStroke: '#5a6430' }));
    svg = suaChenTruocMat(svg, '<path fill="#fffef9" stroke="' + SUA_INK + '" stroke-width="1.6" stroke-linejoin="round" d="M96,184 Q120,202 144,184 L120,236 Z"/>');
    return svg.replace(/viewBox="[^"]+"/, 'viewBox="-22 0 284 468"');
  },

  /* ---------- 7 · Bạn Tí: bỏ miệng mũ ở góc thẳng, đổi line shading trên mũ thành khối đổ bóng vành mũ ---------- */
  7(svg){
    const H = 'url(#hd7_c6hair)';
    svg = suaCo200(svg, 7, 13.5, 12, 14.5, 166, 184);
    svg = suaBo(svg, 'd="M96,180 q24,16 48,0"');
    svg = suaBo(svg, 'd="M172,80 q22,-2 30,8');
    svg = suaThay(svg, 'd="M98,74 q22,-22 44,0"',
      '<path d="M63,72 q57,-11 114,0 l-2,6 q-55,-9 -110,0z" fill="#3b3025" fill-opacity=".14" stroke="none"/>');
    svg = svg.replace('<path d="M113,130 q7,4 14,0" stroke-width="1.8"', '<path d="M115,139 q5,3 10,0" stroke-width="1.8"');
    const toc = '<path fill="' + H + '" d="M68,96 C66,86 68,76 74,72 L84,72 C79,82 77,90 75,98 Z"/>'
      + '<path fill="' + H + '" d="M172,96 C174,86 172,76 166,72 L156,72 C161,82 163,90 165,98 Z"/>'
      + '<path class="sua_mai" fill="' + H + '" d="M92,74 C96,82 102,84 106,76 C110,82 116,84 120,74 Z"/>';
    return svg.replace('<path fill="url(#hd7_c6cloth)" d="M62,72', toc + '<path fill="url(#hd7_c6cloth)" d="M62,72');
  },

  /* ---------- 8 · Chị Hoa: làm búi tóc cao to tròn nổi bật hơn kèm đai ngọc/vàng chân búi, mái phồng rẽ ngôi + hoa 5 cánh ---------- */
  8(svg){
    const H = 'url(#hd8_c7hair)';
    const v = suaTimPhanTu(svg, 'd="M98,178 L120,212 L142,178');
    if(v){ const el = svg.slice(v[0], v[1]); svg = suaChenTruocMat(svg.slice(0, v[0]) + svg.slice(v[1]), el); }
    svg = suaCo200(svg, 8, 13, 11.5, 13.5, 162, 183);
    svg = suaBo(svg, 'd="M108,182 q12,10 24,0');
    svg = suaBo(svg, '<circle cx="120" cy="206" r="3" fill="#fff"');
    svg = suaBo(svg, 'class="hairwisp"');
    svg = suaBo(svg, 'd="M126,38 q-6,-8 4,-12');
    svg = suaBo(svg, 'd="M96,66 l14,-4 l0,6 l14,2');
    svg = suaBo(svg, '<circle cx="102" cy="64" r="3" fill="#d9634f"');
    svg = suaThay(svg, 'd="M60,98 q-12,-42 26,-58',
      '<path class="sua1_bui" fill="' + H + '" d="M82,42 C72,-2 168,-2 158,42 Z"/>'
      + '<path class="sua1_bui" d="M96,19 q24,-9 48,0 M98,27 q22,-6 44,0" fill="none" stroke="#7a6a5c" stroke-width="1.6" opacity=".55"/>'
      + '<path class="sua1_bui" d="M86,36 Q120,27 154,36 L152,42 Q120,34 88,42 Z" fill="#e8b84b" stroke="' + SUA_INK + '" stroke-width="2.2"/>'
      + '<path class="sua_hair" fill="' + H + '" d="M64,104 C54,70 72,34 120,32 C168,34 186,70 176,104 C172,110 167,108 165,100 L75,100 C73,108 68,110 64,104 Z"/>');
    svg = suaThay(svg, 'd="M74,66 q22,-16 46,-2',
      '<path class="sua_hair" fill="' + H + '" d="M68,98 C62,64 82,34 120,32 C158,34 178,64 172,98 C165,76 150,60 134,54 C108,66 84,74 68,98 Z"/>'
      + '<path class="sua_mai" d="M134,54 l5,-11 M88,46 q32,-12 64,0 M126,52 q-24,8 -44,18" fill="none" stroke="#7a6a5c" stroke-width="1.6" opacity=".55"/>');
    const cx = 67, cy = 72, r = 5.6, d = 6.2;
    let canh = '';
    for(let k = 0; k < 5; k++){
      const a = (-90 + k * 72) * Math.PI / 180;
      canh += '<circle cx="' + (cx + d * Math.cos(a)).toFixed(1) + '" cy="' + (cy + d * Math.sin(a)).toFixed(1) + '" r="' + r + '"/>';
    }
    const hoa = '<g class="sua8_hoa" transform="rotate(-12 ' + cx + ' ' + cy + ')">'
      + '<path d="M61,80 q-7,3 -7,10 q7,-2 9,-8z M60,71 q-8,-3 -12,2 q6,4 12,1z" fill="#6ea85a" stroke="' + SUA_INK + '" stroke-width="1.6" stroke-linejoin="round"/>'
      + '<g fill="#e8605a" stroke="' + SUA_INK + '" stroke-width="2">' + canh + '</g>'
      + '<g fill="#e8605a">' + canh.replace(/r="[\d.]+"/g, 'r="' + (r - 1.1) + '"') + '</g>'
      + '<circle cx="' + cx + '" cy="' + cy + '" r="3.4" fill="#f5c842" stroke="' + SUA_INK + '" stroke-width="1.6"/>'
      + '</g>';
    return suaChenTruocMat(svg, hoa);
  },

  /* ---------- 9 · Thầy Nam: tỉ lệ hội họa nam trưởng thành, bỏ hoàn toàn cổ áo ---------- */
  9(svg){
    const H = 'url(#hd9_c8hair)';
    svg = svg.replace(/<path fill="url\(#hd9_c8skin\)" d="M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z"\/>\s*<path d="M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z"[^/]*\/>/,
      suaCoNam('url(#hd9_c8skin)', 154));
    svg = suaBo(svg, 'd="M120,176 q-14,2 -26,13');
    svg = suaBo(svg, 'd="M120,176 q14,2 26,13');
    svg = suaBo(svg, 'd="M100,180 l20,20');
    svg = suaBo(svg, 'd="M140,180 l-20,20');
    svg = suaBo(svg, 'd="M112,182 l8,8');
    svg = suaBo(svg, 'd="M120,190 l-8,-8');
    svg = suaBo(svg, 'cx="120" cy="224"');
    svg = suaBo(svg, 'cx="120" cy="248"');
    svg = suaBo(svg, 'cx="120" cy="240"');
    svg = suaBo(svg, 'cx="120" cy="266"');
    svg = svg.replace('<path fill="url(#hd9_c8cloth)" d="M104,172 q-38,10 -54,32 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-22 -54,-32 q-16,9 -32,0z"/>',
      suaThanNam('url(#hd9_c8cloth)') + suaVienThanNam());
    svg = svg.replace(/<g stroke="#3b3025" stroke-width="3\.2" stroke-linejoin="round"><path fill="url\(#hd9_c8cloth\)" d="M56,196[\s\S]*?<\/g><\/g>/,
      suaTayNam('url(#hd9_c8cloth)', 'url(#hd9_c8clothL)', 'url(#hd9_c8skin)'));
    svg = suaBo(svg, 'd="M100,50 q4,-8 12,-6"');
    svg = suaThay(svg, 'd="M64,98 q-10,-40 22,-54',
      '<path class="sua_hair" fill="' + H + '" d="M66,102 C58,66 74,34 122,32 C164,34 180,66 174,102 L165,102 L75,102 Z"/>');
    svg = suaThay(svg, 'd="M76,64 q22,-14 44,-4',
      '<path class="sua_hair" fill="' + H + '" d="M69,102 C63,68 78,34 122,32 C162,34 177,64 171,102 L164,102 C163,84 160,72 152,64 C132,62 112,60 96,54 C84,64 77,78 76,102 Z"/>'
      + '<path class="sua_mai" d="M96,54 l-5,-12 M106,44 q26,-8 48,4 M112,52 q22,-4 38,4" fill="none" stroke="#7a6a5c" stroke-width="1.6" opacity=".55"/>');
    const coTrong = '<g stroke="' + SUA_INK + '" stroke-linejoin="round" stroke-linecap="round">'
      + '<path fill="#3b3025" fill-opacity=".14" stroke="none" d="M96,184 Q120,202 144,184 L141,192 Q120,210 99,192 Z"/>'
      + '<path fill="none" stroke-width="1.6" d="M99,192 Q120,210 141,192"/>'
      + '</g>';
    return suaChenTruocMat(svg, coTrong).replace(/viewBox="[^"]+"/, 'viewBox="-22 0 284 468"');
  },

  /* ---------- 10 · Cô Mai: vòm tóc tròn mượt tự nhiên (bỏ viền đôi bè đỉnh đầu), đuôi gà buộc cao gọn sau tai phải ---------- */
  10(svg){
    const H = 'url(#hd10_c9hair)';
    svg = suaCo200(svg, 10, 14.5, 13, 15.5, 163, 184);
    svg = suaBo(svg, 'd="M120,176 q-14,2 -26,13');
    svg = suaBo(svg, 'd="M120,176 q14,2 26,13');
    svg = svg.replace('d="M104,172 q-38,10 -54,32 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-22 -54,-32 q-16,9 -32,0z"',
      'd="M104,176 q-38,8 -54,28 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-20 -54,-28 q-16,12 -32,0z"');
    // Vòm tóc sau ôm tròn tự nhiên + đuôi tóc buộc gọn sau tai phải (nằm ở lớp tóc sau để không đè lên má/khuyên tai)
    svg = suaThay(svg, 'd="M62,98 q-12,-42 26,-56 q28,-18 56,-2',
      '<path class="sua_hair" fill="' + H + '" d="M65,106 C58,68 76,32 120,30 C164,32 182,68 175,106 C171,112 166,110 164,102 L76,102 C74,110 69,112 65,106 Z"/>'
      + '<g class="sua10_duoi" stroke="' + SUA_INK + '" stroke-linejoin="round" stroke-linecap="round">'
      + '<path fill="' + H + '" stroke-width="2.8" d="M172,102 C192,106 202,126 196,154 C192,172 182,186 168,192 C171,176 169,160 164,146 C160,132 162,114 172,102 Z"/>'
      + '<path d="M180,118 C188,134 188,156 179,176" fill="none" stroke="#7a6a5c" stroke-width="1.6" opacity=".55"/>'
      + '<path d="M167,102 C171,95 183,98 185,106 C183,113 171,112 167,106 Z" fill="#e0604c" stroke-width="2.2"/>'
      + '</g>');
    svg = suaBo(svg, 'd="M70,70 l14,-6 l2,6 l-14,6z"');
    // Mái tóc rẽ lệch mềm mại trùng khít đường đỉnh vòm tóc (không tạo viền đôi trên đỉnh đầu)
    svg = suaThay(svg, 'd="M74,66 q22,-16 46,-2 q4,6 -4,10',
      '<path class="sua_hair" fill="' + H + '" d="M67,100 C60,66 78,32 120,30 C162,32 180,66 173,100 C166,78 152,62 134,54 C110,68 84,78 67,100 Z"/>'
      + '<path class="sua_mai" d="M134,54 l5,-11 M90,46 q28,-10 56,0 M126,56 q-22,8 -40,18" fill="none" stroke="#7a6a5c" stroke-width="1.6" opacity=".55"/>'
      + '<g class="sua10_kep" transform="rotate(-20 94 54)"><rect x="86" y="51.6" width="16" height="4.8" rx="2.4" fill="#7cc3a4" stroke="' + SUA_INK + '" stroke-width="1.6"/>'
      + '<circle cx="90" cy="53.2" r="0.9" fill="#fff" stroke="none"/></g>');
    svg = suaDoiMau(svg, 'hd10', 'c9cloth',  ['#f6b49c', '#ea9a7e']);
    svg = suaDoiMau(svg, 'hd10', 'c9clothL', ['#ea9a7e', '#d47f63']);
    const hoatai = '<g stroke="' + SUA_INK + '" stroke-width="1.4" stroke-linecap="round"><path d="M61,121 v4" fill="none"/><circle cx="61" cy="121" r="2" fill="#f2c94c"/><circle cx="61" cy="128" r="2.8" fill="#ef8a6f"/></g>'
      + '<g stroke="' + SUA_INK + '" stroke-width="1.4" stroke-linecap="round"><path d="M179,121 v4" fill="none"/><circle cx="179" cy="121" r="2" fill="#f2c94c"/><circle cx="179" cy="128" r="2.8" fill="#ef8a6f"/></g>';
    return suaChenTruocMat(svg, hoatai);
  }
};

const SUA_CHUNG = [
  /<path d="M80,122 q-6,20 8,34[^"]*"[^>]*\/>/g,
  /<path d="M80,122C76,135\.333[^"]*"[^>]*\/>/g,
  /<path d="M71\.8,76C66\.726,96\.067[^"]*"[^>]*\/>/g,
  /<path d="M(?:80|160),150[ Cq][^"]*"[^>]*\/>/g
];
const SUA_CO_AO = [
  ['M120,180C112,181.333 104.667,185.333 98,192C109.333,190.667 116.667,193 120,199L120,180Z', 'M120,180C112,181.3 104.7,185.3 99,191C104,198 113,201 120,199L120,180Z'],
  ['M120,180C128,181.333 135.333,185.333 142,192C130.667,190.667 123.333,193 120,199L120,180Z', 'M120,180C128,181.3 135.3,185.3 141,191C136,198 127,201 120,199L120,180Z'],
  ['M120,182C111.333,183.333 103.333,187.667 96,195C108,193 116,195.333 120,202L120,182Z', 'M120,182C111.3,183.3 103.3,187.7 97,194C102,201 112,204 120,202L120,182Z'],
  ['M120,182C128.667,183.333 136.667,187.667 144,195C132,193 124,195.333 120,202L120,182Z', 'M120,182C128.7,183.3 136.7,187.7 143,194C138,201 128,204 120,202L120,182Z']
];
const SUA_CHAM = {8:['<circle cx="120" cy="226" r="3" fill="#fff"'], 9:['<circle cx="120" cy="240" r="3" fill="#d9d3c0"', '<circle cx="120" cy="266" r="3" fill="#d9d3c0"']};
const SUA_BONG_AO = '<path d="M62,196 C68,224 69,254 67,280 L33,280 C35,230 42,204 52,198 C55,196 58,196 62,196 Z M178,196 C172,224 171,254 173,280 L207,280 C205,230 198,204 188,198 C185,196 182,196 178,196 Z" fill="#3b3025" fill-opacity=".08" stroke="none"/>';

function suaHinhGoc(svg, i){
  if(i >= 4){
    svg = svg.replace('<svg ', '<svg overflow="visible" ');
    svg = svg.replace('<ellipse cx="100" cy="270"', '<ellipse cx="120" cy="270"');
  }
  SUA_CHUNG.forEach(re => { svg = svg.replace(re, ''); });
  SUA_CO_AO.forEach(([a, b]) => { svg = svg.split(a).join(b); });
  if(i <= 2) svg = svg.replace(/(M120,17[68][\s\S]*?stroke-width:)3\.2px/g, '$11.6px').replace(/(M104,168[\s\S]*?stroke-width:)3\.2px/g, '$11.6px').replace(/(M120,190[\s\S]*?stroke-width:)2\.4px/g, '$11.6px');
  (SUA_CHAM[i] || []).forEach(k => { svg = suaBo(svg, k); });
  svg = SUA[i] ? SUA[i](svg) : svg;
  if(i >= 4 && i !== 6){
    svg = svg.replace(/(<path fill="url\(#hd\d+_c\d+cloth\)" d="M104,17[26][^"]*"\/>)/, '$1' + SUA_BONG_AO);
  }
  return svg;
}
