/* =====================================================================
   SỬA HÌNH GỐC NHÂN VẬT — vá lên HD_CHARS (do-hoa.js) lúc khởi động, không sửa file hình gốc.
   Nạp SAU js/do-hoa.js, TRƯỚC js/nhan-vat-skin.js. nhan-vat-skin.js gọi suaHinhGoc(svg, i) cho từng hình
   (i = chỉ số HD_CHARS: 0 giáo sư, 1..10 khách) NGAY SAU khi đã thay mắt chấm (nhóm <g class="eyes2"> là phần tử
   cuối của svg), TRƯỚC khi ghép trang phục (skin) và đạo cụ.

   Lưu ý thứ tự lớp: sau nhóm eyes2 còn đồ của diversify (cổ áo, tạp dề… trong nhan-vat.js). Lớp "over" của skin
   được chèn ngay trước <g class="eyes2 — tức NẰM TRÊN mọi thứ ta chèn ở đây bằng chenTruocMat().
   Mọi id thêm mới bắt đầu bằng 'sua<i>_'. Toạ độ khung 200x280 (khách 4..10): mặt x 72..168, đỉnh đầu y≈54,
   mắt y≈102, cổ y 150–184, vai y≈196. Trong lab hình bị bàn che dưới y = 226.

   Những gì đã vá:
     4  Anh Minh : bỏ chỏm tóc nhọn chọc xuyên đỉnh mũ bảo hộ (giữ tóc mai dưới vành mũ).
     6  Ông Sáu  : bỏ nét cung lơ lửng trên đầu hói; áo gi-lê nâu → xanh ô-liu (màu nhận diện của ông).
     8  Chị Hoa  : bỏ ngôi sao đỏ trên trán + cục đỏ trên đỉnh tóc; cài một bông hoa 5 cánh trên tai trái.
     10 Cô Mai   : làm lại tóc nữ (mái lệch + tóc phồng ôm mặt + đuôi ngựa thấp vắt qua vai phải, dây buộc đỏ
                   san hô, kẹp tóc xanh lá dứa), lông mày mảnh, bông tai vàng có hạt san hô, áo cánh trắng → hồng đào.
     3  Bé Na    : bỏ cà vạt raster (lộ ra khi khăn quàng đã thu nhỏ).
   (Khăn quàng đỏ Bé Na / Bạn Tí và con cá của Ông Sáu là đạo cụ: sửa trong CUST_PROPS cuối do-hoa.js.)
   ===================================================================== */
'use strict';

const SUA_INK = '#3b3025';

// tìm phần tử tự đóng (<… />) có chứa chuỗi kim; trả về [đầu, cuối] hoặc null
function suaTimPhanTu(svg, kim){
  const k = svg.indexOf(kim);
  if(k < 0) return null;
  const a = svg.lastIndexOf('<', k), b = svg.indexOf('/>', k);
  return (a < 0 || b < 0) ? null : [a, b + 2];
}
// bỏ MỌI phần tử tự đóng có chứa kim
function suaBo(svg, kim){
  let r;
  while((r = suaTimPhanTu(svg, kim))) svg = svg.slice(0, r[0]) + svg.slice(r[1]);
  return svg;
}
// thay phần tử đầu tiên có chứa kim bằng chuỗi moi (không thấy thì để nguyên)
function suaThay(svg, kim, moi){
  const r = suaTimPhanTu(svg, kim);
  return r ? svg.slice(0, r[0]) + moi + svg.slice(r[1]) : svg;
}
// chèn lên trên quần áo + tay, dưới mắt (và dưới lớp over của skin)
function suaChenTruocMat(svg, s){
  const e = svg.indexOf('<g class="eyes2');
  return e >= 0 ? svg.slice(0, e) + s + svg.slice(e) : svg.replace('</svg>', s + '</svg>');
}
// đổi màu các điểm dừng của gradient (cả bản 'hdN_' lẫn 'hdNe_'), giữ nguyên offset
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

const SUA = {
  /* ---------- 3 · Bé Na: bỏ cà vạt (ảnh raster #hd3__Image15) ----------
     Trước đây khăn quàng to che luôn cà vạt; nay khăn quàng thu nhỏ (CUST_PROPS[2]) nên cà vạt lộ ra,
     trông như dân văn phòng — bỏ hẳn. Cổ áo (#hd3__Image14) giữ nguyên. */
  3(svg){
    return suaBo(svg, 'xlink:href="#hd3__Image15"');
  },

  /* ---------- 4 · Anh Minh: tóc chỉ còn phần dưới mũ ----------
     Tóc sau gáy (path 'M62,96 q-10,-44 26,-58 …') có 8 chỏm nhọn lên tới y≈20, cao hơn đỉnh mũ (y≈28):
     thay dãy chỏm bằng một đường cong thấp nằm gọn dưới vòm mũ. Phần lởm chởm hai bên thái dương giữ nguyên. */
  4(svg){
    // mép trái tóc cũng phồng ra ngoài vòm mũ (x≈57 ở y≈70): kéo vào sát đầu, phần dưới vành vẫn lộ tóc mai
    svg = svg.replace('d="M62,96 q-10,-44 26,-58 q-6,-10', 'd="M62,96 q0,-24 6,-36 q6,-14 20,-22 q-6,-10');
    return svg.replace('q-6,-10 6,-14 q4,10 10,4 q2,-12 12,-8 q0,10 8,6 q6,-10 14,0 q-4,8 4,8 q10,-6 14,4 q-8,4 -2,10',
                       'q30,-12 60,0 q8,4 6,10');
  },

  /* ---------- 6 · Ông Sáu ---------- */
  6(svg){
    // (a) nét cung mờ lơ lửng phía trên đỉnh đầu hói
    svg = suaBo(svg, 'd="M108,48 q10,-6 18,0"');
    // (b) gi-lê + hai ống tay: nâu → xanh ô-liu
    svg = suaDoiMau(svg, 'hd6', 'c5cloth',  ['#8d9a55', '#74803f']);
    svg = suaDoiMau(svg, 'hd6', 'c5clothL', ['#74803f', '#5a6430']);
    return svg;
  },

  /* ---------- 8 · Chị Hoa: hoa cài tóc thay cho "lá phong" đỏ ---------- */
  8(svg){
    svg = suaBo(svg, 'd="M126,38 q-6,-8 4,-12');                 // cục đỏ hình tim trên đỉnh tóc
    svg = suaBo(svg, 'd="M96,66 l14,-4 l0,6 l14,2');             // ngôi sao đỏ trên trán (diversify đã nudge lên)
    svg = suaBo(svg, '<circle cx="102" cy="64" r="3" fill="#d9634f"');   // nhuỵ của ngôi sao
    // bông hoa 5 cánh tròn, nhuỵ vàng, cài ở mép tóc trái ngay trên tai
    const cx = 65, cy = 71, r = 5.6, d = 6.2;
    let canh = '';
    for(let k = 0; k < 5; k++){
      const a = (-90 + k * 72) * Math.PI / 180;
      canh += '<circle cx="' + (cx + d * Math.cos(a)).toFixed(1) + '" cy="' + (cy + d * Math.sin(a)).toFixed(1) + '" r="' + r + '"/>';
    }
    const hoa = '<g class="sua8_hoa" transform="rotate(-12 ' + cx + ' ' + cy + ')">'
      + '<path d="M59,79 q-7,3 -7,10 q7,-2 9,-8z M58,70 q-8,-3 -12,2 q6,4 12,1z" fill="#6ea85a" stroke="' + SUA_INK + '" stroke-width="1.6" stroke-linejoin="round"/>'
      + '<g fill="#e8605a" stroke="' + SUA_INK + '" stroke-width="2">' + canh + '</g>'
      + '<g fill="#e8605a">' + canh.replace(/r="[\d.]+"/g, 'r="' + (r - 1.1) + '"') + '</g>'   // xoá nét mực giữa các cánh chồng nhau
      + '<circle cx="' + cx + '" cy="' + cy + '" r="3.4" fill="#f5c842" stroke="' + SUA_INK + '" stroke-width="1.6"/>'
      + '</g>';
    return suaChenTruocMat(svg, hoa);
  },

  /* ---------- 10 · Cô Mai: tóc nữ, lông mày mảnh, bông tai, áo hồng đào ---------- */
  10(svg){
    const H = 'url(#hd10_c9hair)';
    // tóc sau (nằm sau mặt + tai, trong nhóm biến đổi của khuôn mặt nên vẽ theo toạ độ gốc: mặt x 72..168, đỉnh y 54):
    // khối tóc phồng ôm đầu, hai bên rủ xuống ngang hàm (y≈132) — dáng đầu khác hẳn tóc ngắn của Thầy Nam
    svg = suaThay(svg, 'd="M62,98 q-12,-42 26,-56 q28,-18 56,-2',
      '<path fill="' + H + '" d="M68,134 q-14,-26 -9,-58 q8,-42 61,-42 q53,0 61,42 q5,32 -9,58 q-6,4 -12,0 q-34,-12 -80,0 q-6,4 -12,0z"/>'
      + '<path d="M88,44 q32,-12 64,0" fill="none" stroke="#7a6a5c" stroke-width="2" opacity=".5"/>');
    svg = suaBo(svg, 'd="M70,70 l14,-6 l2,6 l-14,6z"');          // kẹp đỏ cũ
    // mái lệch: ngôi ở x≈142, mái chính hất sang trái tới thái dương, một lọn nhỏ hất sang phải.
    // Mép dưới mái cao hơn lông mày ≥ 8 đơn vị — băng đô của skin 1 (y 57–83) đè lên vẫn gọn.
    svg = suaThay(svg, 'd="M74,66 q22,-16 46,-2 q4,6 -4,10',
      '<path fill="' + H + '" d="M142,56 q-26,6 -44,18 q-14,6 -24,22 q-6,-24 0,-36 q16,-22 52,-20 q12,2 16,16z"/>'
      + '<path fill="' + H + '" d="M142,56 q16,0 24,16 q4,10 2,20 q-6,-14 -14,-20 q-8,-6 -12,-16z"/>'
      + '<path d="M132,59 q-24,6 -40,20 M150,60 q8,4 12,12" fill="none" stroke="#7a6a5c" stroke-width="1.6" opacity=".55"/>'
      // kẹp tóc xanh lá dứa trên mái trái, cao hơn băng đô của skin 1 để không bị che dở dang
      + '<g transform="rotate(-22 96 52)"><rect x="88" y="49.6" width="16" height="4.8" rx="2.4" fill="#7cc3a4" stroke="' + SUA_INK + '" stroke-width="1.6"/>'
      + '<circle cx="92" cy="51.2" r="0.9" fill="#fff" stroke="none"/></g>');
    // lông mày mảnh, cong (bản 'thin' của nhan-vat.js vẫn đậm như lông mày đàn ông)
    svg = svg.split('M82,86 q18,-10 32,-3 q-3,5 -15,3 q-11,-1 -17,0z').join('M84,86 q14,-10 30,-4 q-15,-2 -30,4z');
    // áo cánh trắng → hồng đào / san hô (thân sáng hơn, tay phải tối hơn); cổ áo phải đi theo gradient áo để skin đổi màu được
    svg = suaDoiMau(svg, 'hd10', 'c9cloth',  ['#f6b49c', '#ea9a7e']);
    svg = suaDoiMau(svg, 'hd10', 'c9clothL', ['#ea9a7e', '#d47f63']);
    svg = svg.replace('<path fill="#f3eddc" d="M120,176 q14,2 26,13', '<path fill="url(#hd10_c9cloth)" d="M120,176 q14,2 26,13');
    // đuôi ngựa thấp: túm sau tai phải, buộc dây san hô, rủ qua vai phải ra trước ngực (đuôi tóc y≈222 < 226)
    const duoi = '<g class="sua10_toc" stroke="' + SUA_INK + '" stroke-linejoin="round" stroke-linecap="round">'
      + '<path fill="' + H + '" stroke-width="2.8" d="M163,142 q-8,18 -6,36 q2,18 -3,30 q-2,8 -7,14 q13,-1 19,-14 q8,-16 6,-34 q-1,-18 5,-32z"/>'
      + '<path d="M168,150 q-6,24 -2,44 q1,10 -4,18" fill="none" stroke="#7a6a5c" stroke-width="1.5" opacity=".55"/>'
      + '<path d="M162,140 q4,-6 16,-2 q2,6 -2,8 q-8,3 -14,-1 q-2,-2 0,-5z" fill="#e0604c" stroke-width="2"/>'
      + '<path d="M166,141 v4 M171,140 v5" fill="none" stroke="#a8402f" stroke-width="1.2" opacity=".8"/>'
      // bông tai: nụ vàng + hạt san hô
      + '<g stroke-width="1.4"><path d="M61,121 v4 M179,121 v4" fill="none"/>'
      + '<circle cx="61" cy="121" r="2" fill="#f2c94c"/><circle cx="179" cy="121" r="2" fill="#f2c94c"/>'
      + '<circle cx="61" cy="128" r="2.8" fill="#ef8a6f"/><circle cx="179" cy="128" r="2.8" fill="#ef8a6f"/></g>'
      + '</g>';
    return suaChenTruocMat(svg, duoi);
  }
};

function suaHinhGoc(svg, i){
  return SUA[i] ? SUA[i](svg) : svg;
}
