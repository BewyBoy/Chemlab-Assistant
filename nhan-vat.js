// ============================================================
//  DAN NHAN VAT — ChemLab Assistant
//  index.html nap file nay luc khoi dong (phai nam cung thu muc).
//
//  Bay khach dung chung mot bo khung ve (HD_CHARS[4..10]) nen truoc day
//  trong gan nhu giong het nhau. File nay va lai tung phan cho tung nguoi:
//  khuon mat (ham) / mat / mui / long may / quan ao / mau da.
//
//  NGUYEN TAC QUAN TRONG:
//   - VOM SO giu nguyen ban ve goc, chi doi HAM. Ca vom so lan toc/mu deu di qua
//     CUNG MOT phep bien doi T, nho vay chan toc luon om khit dau.
//   - Moi bo phan dich chuyen theo do lech tinh o DUNG DO CAO cua no (ham dy()),
//     khong dung chung mot hang so — neu khong vanh mu se de len long may.
//   - Tai chi TRUOT theo mep mat, khong phong to theo.
// ============================================================

/* ============================================================
   Da dang hoa dan khach — SUA TREN SPRITE GOC (khong ve lai)
   Ca 7 khach khung 200x280 (khach 3..9) dang dung CHUNG:
     mat, mui, long may, co, mieng, tay ao va gan nhu chung ca khuon mat.
   File nay vá tung phan: khuon mat / mat / mui / long may / quan ao / mau.
   Toa do goc: tam mat x=120, mat cy=106, cam y~168, than tu y~172.
   ============================================================ */
var Q = {                      // cac chuoi goc dung chung, dung de thay the
  nose : 'M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22',
  browL: 'M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z',
  browR: 'M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z',
  faceRe: /(<path fill="url\(#hd\d+_c\d+skin\)" d=")(M(\d+),(\d+) q-4,-40 48,-42 q52,2 48,42[^"]*)(")/,
  earL : 'M68,96 q-13,-2 -11,13',
  earR : 'M172,96 q13,-2 11,13',
  eyeRe : /<g stroke="#3b3025" stroke-width="2">\s*<ellipse cx="99"[\s\S]*?<\/g>/
};


/* ---------- hinh hoc khuon mat: moc de neo cac bo phan khac ----------
   Ban goc: mep trai 72, mep phai 168, dinh dau 54, cam 168.
   Tai / ma hong / mat / mieng / toc deu duoc tinh lai theo bang nay. */
var BASE = { x0:72, x1:168, top:54, chin:168, eyeCy:106, eyeDX:21, cheekY:130 };
/* Luu y: toc trong sprite goc KHONG phu kin vom dau (co mot khe o thai duong trai).
   Cang noi rong vom dau thi khe do cang lo ra. Vi vay giu vom dau gan nguyen ban,
   con "beo/gay" thi the hien bang HAM (bang JAW) — cho hieu qua ma khong ho toc. */
var FACE_META = {
  square : {x0:71, x1:169, top:54, chin:167},
  oval   : {x0:73, x1:167, top:54, chin:166},
  chubby : {x0:70, x1:170, top:54, chin:168},
  small  : {x0:75, x1:165, top:59, chin:162},
  heart  : {x0:72, x1:168, top:52, chin:166},
  long   : {x0:75, x1:165, top:51, chin:170},
  wide   : {x0:71, x1:169, top:55, chin:167}
};

/* ---------- ham duoi ----------
   QUAN TRONG: chi doi phan HAM (tu thai duong -> cam -> thai duong).
   Phan SO (vom dau) giu y nguyen cua sprite roi cho di qua CUNG MOT phep bien doi T
   voi toc/mu — nho vay chan toc luon om khit dau, khong ho khe.
   Moi chuoi phai cong don ve (-96, 0) de khep kin voi thai duong ben kia. */
var JAW = {
  square : 'q6,36 -6,56 q-12,14 -42,14 q-30,0 -42,-14 q-12,-20 -6,-56',
  oval   : 'q3,32 -14,52 q-13,18 -34,18 q-21,0 -34,-18 q-17,-20 -14,-52',
  chubby : 'q8,32 -6,54 q-14,20 -42,20 q-28,0 -42,-20 q-14,-22 -6,-54',
  small  : 'q4,30 -10,50 q-13,16 -38,16 q-25,0 -38,-16 q-14,-20 -10,-50',
  heart  : 'q4,30 -18,52 q-16,20 -30,22 q-14,-2 -30,-22 q-22,-22 -18,-52',
  long   : 'q4,38 -12,58 q-13,18 -36,18 q-23,0 -36,-18 q-16,-20 -12,-58',
  wide   : 'q7,32 -8,52 q-14,19 -40,19 q-26,0 -40,-19 q-15,-20 -8,-52'
};

/* ---------- mui ---------- */
var NOSE = {
  flat   : 'M120,108 q-5,14 -12,20 q-1,7 12,7 q13,0 12,-7 q-7,-6 -12,-20',
  straight:'M120,110 q-3,12 -7,17 q-1,6 7,6 q8,0 7,-6 q-4,-5 -7,-17',
  bulb   : 'M120,106 q-5,16 -11,22 q-2,9 11,9 q13,0 11,-9 q-6,-6 -11,-22',
  button : 'M120,114 q-3,9 -6,13 q-1,5 6,5 q7,0 6,-5 q-3,-4 -6,-13',
  slim   : 'M120,102 q-3,18 -8,26 q-1,6 8,6 q9,0 8,-6 q-5,-8 -8,-26',
  longn  : 'M120,102 q-4,19 -9,26 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-26',
  round  : 'M120,112 q-4,10 -8,14 q-1,6 8,6 q9,0 8,-6 q-4,-4 -8,-14'
};

/* ---------- long may (ve 1 ben, ben kia lat guong quanh x=120) ---------- */
var BROW = {
  thick : 'M78,87 q19,-6 35,-1 q-2,7 -17,6 q-13,-1 -18,-5z',
  thin  : 'M82,86 q18,-10 32,-3 q-3,5 -15,3 q-11,-1 -17,0z',
  bushy : 'M78,88 q18,-9 34,-2 q-3,8 -17,7 q-13,-2 -17,-5z',
  kid   : 'M87,90 q13,-7 25,-2 q-2,4 -12,4 q-8,-1 -13,-2z',
  arch  : 'M82,82 q18,-10 32,-2 q-3,6 -15,4 q-11,-2 -17,-2z',
  flatb : 'M78,85 q19,-4 36,0 q-2,6 -18,6 q-13,0 -18,-6z'
};
function brows(kind){
  var d = BROW[kind] || BROW.thick;
  return '<path d="'+d+'" fill="#3b3025" stroke="#3b3025" stroke-width="1"/>'
       + '<g transform="translate(240,0) scale(-1,1)"><path d="'+d+'" fill="#3b3025" stroke="#3b3025" stroke-width="1"/></g>';
}

/* ---------- mat ---------- */
function eyes(idE, o){
  o = o || {};
  var dx = o.dx===undefined?21:o.dx, cy = o.cy===undefined?106:o.cy;
  var rx = o.rx===undefined?10:o.rx, ry = o.ry===undefined?8:o.ry;
  var pr = o.pr===undefined?3.6:o.pr, po = o.po===undefined?2:o.po;   // po = pupil lech ra ngoai
  var L = 120-dx, R = 120+dx, tilt = o.tilt||0;
  var out = ['<g stroke="#3b3025" stroke-width="2">'];
  [[L,1],[R,-1]].forEach(function(e){
    var x=e[0], s=e[1];
    if(tilt) out.push('<g transform="rotate('+(-s*tilt)+' '+x+' '+cy+')">');
    if(o.crescent){                                   // mat cuoi hinh trang khuyet
      var crx = rx===undefined?10:rx, cry = ry===undefined?8:ry;
      out.push('<path d="M'+(x-crx)+','+(cy+1)+' q'+crx+',-'+(cry+4)+' '+(crx*2)+',0" fill="none" stroke-width="3.2" stroke-linecap="round"/>');
      if(tilt) out.push('</g>');
      return;
    }
    out.push('<ellipse cx="'+x+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#fff"/>');
    out.push('<circle cx="'+(x+s*po)+'" cy="'+(cy+1)+'" r="'+pr+'" fill="#3b3025" stroke="none"/>');
    out.push('<circle cx="'+(x+s*po+1.4)+'" cy="'+(cy-0.4)+'" r="'+(pr*0.3)+'" fill="#fff" stroke="none"/>');
    if(o.lash){
      // diem dat phai NAM TREN vien ellipse (goc ~200 do), truoc day lay (x-rx, cy-ry)
      // la goc hop chu nhat nen mi bi treo ngoai mat.
      var lx = (x - s*0.94*rx).toFixed(1), ly = (cy - 0.34*ry).toFixed(1);
      out.push('<path d="M'+lx+','+ly+' l'+(-s*6)+',-5" fill="none" stroke-width="2.4" stroke-linecap="round"/>');
      out.push('<path d="M'+(x - s*0.72*rx).toFixed(1)+','+(cy - 0.72*ry).toFixed(1)+' l'+(-s*4)+',-5" fill="none" stroke-width="2.1" stroke-linecap="round"/>');
    }
    if(o.hood) out.push('<path d="M'+(x-rx-1)+','+(cy-ry+1)+' q'+rx+',-4 '+(rx*2+2)+',0" fill="none" stroke-width="2.6" stroke-linecap="round"/>');
    out.push('<rect class="blinklid" x="'+(x-rx-0.5)+'" y="'+(cy-ry-0.5)+'" width="'+(rx*2+1)+'" height="'+(ry+1)+'" rx="4" fill="url(#'+idE+'skin)"/>');
    if(tilt) out.push('</g>');
  });
  out.push('</g>');
  return out.join('');
}

/* ---------- quan ao: lop phu tren than (co ao / khuy / ca vat / tap de) ---------- */
var GARMENT = {
  crew: function(){                                   // co tron, ao thun
    return '<path d="M96,180 q24,16 48,0" fill="none" stroke="#3b3025" stroke-width="3" stroke-linecap="round"/>';
  },
  vneck: function(c){
    return '<path d="M98,178 L120,212 L142,178 q-22,12 -44,0z" fill="'+(c||'#f3eddc')+'" stroke="#3b3025" stroke-width="3" stroke-linejoin="round"/>';
  },
  lapel: function(c){                                 // ao so mi co be
    return '<g stroke="#3b3025" stroke-width="3" stroke-linejoin="round">'
         + '<path d="M100,180 l20,20 l-14,14 q-16,-8 -18,-22z" fill="'+(c||'#f3eddc')+'"/>'
         + '<path d="M140,180 l-20,20 l14,14 q16,-8 18,-22z" fill="'+(c||'#f3eddc')+'"/></g>';
  },
  shirt: function(c){                                 // co be + hang khuy
    return GARMENT.lapel(c)
         + '<g fill="#3b3025" opacity=".55"><circle cx="120" cy="224" r="3"/><circle cx="120" cy="248" r="3"/></g>';
  },
  openShirt: function(c){                             // ao ba lo / so mi mo cuc
    return '<g stroke="#3b3025" stroke-width="3" stroke-linejoin="round">'
         + '<path d="M98,176 q22,26 44,0 q-8,26 -22,30 q-14,-4 -22,-30z" fill="'+(c||'#efe6d2')+'"/></g>';
  },
  apron: function(c){                                 // tap de: bo goc tron, day thap, quai vat qua vai
    return '<g stroke="#3b3025" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">'
         + '<path d="M100,196 l-14,-14 M140,196 l14,-14" fill="none"/>'
         + '<path d="M98,200 q22,-7 44,0 q6,30 2,52 q-24,9 -48,0 q-4,-22 2,-52z" fill="'+(c||'#e0a458')+'"/>'
         + '<path d="M104,232 h32" fill="none" stroke-width="2.2" opacity=".45"/></g>';
  }
};

/* ---------- doi mau gradient (ca 2 khoi defs) ---------- */
function recolor(svg, id, idE, key, stops){
  [id, idE].forEach(function(pre){
    var re = new RegExp('(id="'+pre+key+'"[^>]*>)([\\s\\S]*?)(</(?:linear|radial)Gradient>)');
    svg = svg.replace(re, function(m, a, b, c){
      return a + stops.map(function(s){ return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"/>'; }).join('') + c;
    });
  });
  return svg;
}

/* ---------- ap dung ---------- */
/* Khi doi khuon mat, MOI thu thuoc phan dau phai di theo: tai, toc, mu, chop mu,
   ma hong, nep nhan, mieng, dau buc minh. Cach lam: dung mot phep bien doi T
   anh xa hop dau goc -> hop dau moi, roi boc T quanh dung nhung phan tu do.
   Co / than / tay khong dinh vao T. */
function wrapAll(svg, re, T){
  return svg.replace(re, function(m){ return '<g transform="'+T+'">'+m+'</g>'; });
}
function diversify(svg, spec, hdIndex){
  var id  = 'hd'+hdIndex+'_c'+(hdIndex-1);
  var idE = 'hd'+hdIndex+'e_c'+(hdIndex-1);
  var M = spec.face ? FACE_META[spec.face] : BASE;
  // Moc goc doc thang tu sprite: co nhan vat ve khuon mat lech vai px so voi chuan,
  // neu lay moc chung thi toc/tai se bi keo lech.
  var fm = svg.match(Q.faceRe);
  var B = BASE;
  if(fm){ var bx=+fm[3], by=+fm[4]; B = {x0:bx, x1:bx+96, top:by-42, chin:by+72, eyeCy:BASE.eyeCy, eyeDX:BASE.eyeDX, cheekY:BASE.cheekY}; }
  var sx = (M.x1-M.x0)/(B.x1-B.x0), tx = M.x0 - B.x0*sx;
  var sy = (M.chin-M.top)/(B.chin-B.top), ty = M.top - B.top*sy;
  var T  = 'translate('+tx.toFixed(2)+','+ty.toFixed(2)+') scale('+sx.toFixed(4)+','+sy.toFixed(4)+')';
  var moved = spec.face && (Math.abs(sx-1)>1e-4 || Math.abs(sy-1)>1e-4 || Math.abs(tx)>1e-4 || Math.abs(ty)>1e-4);
  var dy = function(y){ return (ty + y*sy) - y; };   // do lech tai dung do cao do
  var dEye = dy(B.eyeCy), dBrow = dy(84), dEar = dy(96);
  var eyeDx = (spec.eyes && spec.eyes.dx!==undefined) ? spec.eyes.dx
            : Math.round((M.x1-M.x0)/2 * (B.eyeDX/((B.x1-B.x0)/2)));
  var eyeRx = (spec.eyes && spec.eyes.rx!==undefined) ? spec.eyes.rx : 10;

  if(spec.face){
    // vom dau giu nguyen, chi thay ham; ca khuon mat sau do di qua T giong het toc
    svg = svg.replace(Q.faceRe, function(m,a,b,bx,by,c){
      var sk = b.match(/^(M\d+,\d+ q-4,-40 48,-42 q52,2 48,42)/);
      return a + (sk ? sk[1] + ' ' + JAW[spec.face] + ' z' : b) + c;
    });
    if(moved) svg = svg.replace(/<path fill="url\(#hd\d+_c\d+skin\)" d="M\d+,\d+ q-4,-40 48,-42[^>]*\/>/,
      function(m){ return '<g transform="'+T+'">'+m+'</g>'; });
    if(moved){
      // Tai: chi TRUOT theo mep mat, KHONG phong to. Neu phong theo T thi tai bi
      // day ra xa hon do mat no rong ra -> ho ra mot khe giua tai va dau.
      var eL = 'translate('+(M.x0-B.x0)+','+dEar.toFixed(1)+')';
      var eR = 'translate('+(M.x1-B.x1)+','+dEar.toFixed(1)+')';
      svg = svg.replace(/<path fill="url\(#hd\d+_c\d+skin\)" d="M68,96[^>]*\/>/g,
        function(m){ return '<g transform="'+eL+'">'+m+'</g>'; });
      svg = svg.replace(/<path fill="url\(#hd\d+_c\d+skin\)" d="M172,96[^>]*\/>/g,
        function(m){ return '<g transform="'+eR+'">'+m+'</g>'; });
      // toc
      svg = wrapAll(svg, /<path fill="url\(#hd\d+_c\d+hair\)"[^>]*\/>/g, T);
      // mu + vanh mu (to bang gradient cloth nhung nam o vung dau)
      svg = svg.replace(/<path fill="url\(#hd\d+_c\d+cloth\w*\)" d="M\d+,(\d+)[^>]*\/>/g,
        function(m,y){ return (+y < 115) ? '<g transform="'+T+'">'+m+'</g>' : m; });
      // chop mu / hat trang tri tren dinh dau
      svg = svg.replace(/<circle cx="\d+" cy="(\d+)" r="[\d.]+"[^>]*\/>/g,
        function(m,y){ return (+y < 62) ? '<g transform="'+T+'">'+m+'</g>' : m; });
      // ma hong
      svg = wrapAll(svg, /<ellipse cx="(?:88|154)" cy="130"[^>]*\/>/g, T);
      // nep nhan tran, toc mai tai, ghim toc: path chi co net, nam o vung dau
      svg = svg.replace(/<path d="M\d+,(\d+)[^"]*"(?![^>]*fill="url)[^>]*\/>/g,
        function(m,y){
          if(+y >= 115) return m;
          if(m.indexOf(Q.nose) >= 0) return m;                 // mui xu ly rieng
          if(m.indexOf(Q.browL) >= 0 || m.indexOf(Q.browR) >= 0) return m; // long may xu ly rieng
          if(/M114,100 l12,0|M84,96 q-10,-2|M156,96 q10,-2/.test(m)) return m;  // gong kinh xu ly rieng
          return '<g transform="'+T+'">'+m+'</g>';
        });
      // Kinh: bam theo MAT (khoang cach + co mat), khong bam theo khuon mat.
      // Neu de nguyen thi mat da doi cho ma gong kinh van dung yen -> lech han.
      if(svg.indexOf('#dbe6f0') >= 0){
        var kx = eyeDx / B.eyeDX, gs = eyeRx / 10;
        var GT = 'translate(0,'+dEye.toFixed(1)+') translate(120,'+B.eyeCy+') scale('
               + (kx*gs).toFixed(4)+','+gs.toFixed(4)+') translate(-120,'+(-B.eyeCy)+')';
        svg = svg.replace(/<g stroke="#3b3025" stroke-width="1.8" fill="#dbe6f0"[\s\S]*?<\/g>/,
          function(m){ return '<g transform="'+GT+'">'+m+'</g>'; });
        ['M114,100 l12,0','M84,96 q-10,-2 -14,3','M156,96 q10,-2 14,3'].forEach(function(d){
          var i = svg.indexOf('<path d="'+d+'"'); if(i < 0) return;
          var j = svg.indexOf('/>', i) + 2;
          svg = svg.slice(0,i) + '<g transform="'+GT+'">' + svg.slice(i,j) + '</g>' + svg.slice(j);
        });
      }
    }
  }
  // Mieng: goc ve sat cam qua, bieu cam (nhat la mieng cuoi mo) bi don xuong hep.
  // Nang len 7px cho thoang, dong thoi keo theo khuon mat neu co doi.
  var MT = (moved ? T + ' ' : '') + 'translate(0,-7)';
  ['x-neutral','x-happy','x-annoy'].forEach(function(cls){
    var re = new RegExp('(<g class="'+cls+'">)([\\s\\S]*?)(</g>)');
    svg = svg.replace(re, function(m,a,b,c){ return a+'<g transform="'+MT+'">'+b+'</g>'+c; });
  });
  if(spec.nose){
    var nd = NOSE[spec.nose].replace(/^M120,(\d+)/, function(m,y){ return 'M120,'+Math.round(+y+dy(+y)); });
    svg = svg.split(Q.nose).join(nd);
  }
  if(spec.brow){
    svg = svg.replace('<path d="'+Q.browL+'" fill="#3b3025" stroke="#3b3025" stroke-width="1"/>',
                      '<g transform="translate(0,'+dBrow.toFixed(1)+')">'+brows(spec.brow)+'</g>');
    svg = svg.replace('<path d="'+Q.browR+'" fill="#3b3025" stroke="#3b3025" stroke-width="1"/>', '');
  }
  if(spec.eyes){
    var eo = {}; for(var k in spec.eyes) eo[k]=spec.eyes[k];
    if(eo.dx===undefined) eo.dx = eyeDx;
    eo.cy = Math.round(B.eyeCy + dEye);
    svg = svg.replace(Q.eyeRe, eyes(idE, eo));
  }
  // Net chia ngon tay trong sprite goc ve o y 279..294 — tuc treo BEN DUOI ban tay
  // (ban tay chi den y 283) va tran ra ngoai khung 280. Keo len 12px cho nam tren tay.
  [['M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12', -5],
   ['M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12', 5]].forEach(function(e){
    var i = svg.indexOf('<path d="'+e[0]+'"'); if(i < 0) return;
    var j = svg.indexOf('/>', i) + 2;
    svg = svg.slice(0,i) + '<g transform="translate('+e[1]+',-13)">' + svg.slice(i,j) + '</g>' + svg.slice(j);
  });
  if(spec.skin)  svg = recolor(svg, id, idE, 'skin', spec.skin);
  if(spec.hairC) svg = recolor(svg, id, idE, 'hair', spec.hairC);
  if(spec.clothC)svg = recolor(svg, id, idE, 'cloth', spec.clothC);
  // chinh tay vai chi tiet dat sai san trong sprite goc (vd: trau cai hoa de len long may)
  if(spec.nudge) spec.nudge.forEach(function(n){
    var i = svg.indexOf(n[0]); if(i < 0) return;
    var a = svg.lastIndexOf('<', i), b = svg.indexOf('/>', i) + 2;
    svg = svg.slice(0,a) + '<g transform="translate('+n[1]+','+n[2]+')">' + svg.slice(a,b) + '</g>' + svg.slice(b);
  });
  var extra = '';
  if(spec.garment) extra += GARMENT[spec.garment[0]](spec.garment[1]);
  if(spec.prop)    extra += spec.prop;
  if(extra) svg = svg.replace('</svg>', extra+'</svg>');
  return svg;
}

/* Dac ta 7 khach dung chung rig 200x280 (khach 3..9 -> HD_CHARS[4..10])
   Moi nguoi doi: khuon mat / mat / mui / long may / quan ao / mau + tinh cach + thoai cho */
var SPECS = {
 3: { hd:4, name:'Anh Minh', earOut:3, job:'thợ xây',
      face:'square', nose:'flat', brow:'thick',
      eyes:{dx:22, rx:9.5, ry:6.5, pr:3.4, po:1.5},
      garment:['crew'],
      skin:[[0,'#f4d6ae'],[0.62,'#e3b98c'],[1,'#c99a68']],
      trait:'Vội, nói cộc nhưng không xấu tính. Ghét chờ.',
      wait:['Nhanh giùm anh cái, công trình đang đợi.',
            'Anh nghỉ trưa có nửa tiếng thôi đó.',
            'Xong chưa em? Anh còn phải về trộn vữa.'] },

 4: { hd:5, name:'Cô Lan', earOut:0, job:'y tá trạm xá',
      face:'oval', nose:'straight', brow:'thin',
      eyes:{dx:20, rx:10.5, ry:9, pr:4, po:1.6},
      garment:['lapel','#f7f3e8'],
      trait:'Cẩn thận, hay nhắc an toàn. Nói rõ ràng, dứt khoát.',
      wait:['Cứ bình tĩnh, làm sai còn nguy hơn làm chậm.',
            'Nhớ đeo kính bảo hộ nhé, cô nhắc thật đấy.',
            'Trạm xá cô còn ca trực, nhưng cô đợi thêm được.'] },

 5: { hd:6, name:'Ông Sáu', earOut:7, job:'chủ ao cá',
      face:'chubby', nose:'bulb', brow:'bushy',
      eyes:{dx:22, rx:8.5, ry:6, pr:3.2, hood:1},
      trait:'Vui tính, nhiều chuyện. Hay kể về ao cá của mình.',
      wait:['Ông kể cho nghe, cái ao nhà ông năm nay được mùa lắm…',
            'Cá nó đợi được thì ông đợi được.',
            'Hồi xưa ông cũng học Hoá đấy, mà quên sạch rồi!'] },

 6: { hd:7, name:'Bạn Tí', earOut:-3, job:'học sinh lớp 8',
      face:'small', nose:'button', brow:'kid',
      eyes:{dx:20, rx:11, ry:9.5, pr:4.6, po:1},
      garment:['crew'],
      trait:'Nghịch, nói nhanh, thiếu kiên nhẫn. Hay đùa.',
      wait:['Lâu quá à, mình đói bụng rồi nè!',
            'Bạn pha nhanh lên, tí nữa mình còn đi đá bóng!',
            'Ê ê, cái cốc kia sủi bọt kìa, ngầu ghê!'] },

 7: { hd:8, name:'Chị Hoa', earOut:-1, job:'tiệm vàng bạc',
      face:'heart', nose:'slim',
      eyes:{dx:21, rx:10.5, ry:7.2, pr:3.5, lash:1, po:2.2, tilt:4},
      garment:['vneck','#efe3d2'],
      // trau cai hoa trong sprite goc dat de len long may trai -> dua len toc
      nudge:[['M96,66 l14,-4', -6, -20], ['cx="102" cy="64"', -6, -20]],
      trait:'Sành sỏi, khó tính về số lượng. Cân đo chính xác từng li.',
      wait:['Chị cần đúng số đấy nhé, thiếu một chút là chị biết.',
            'Nghề chị cân vàng quen rồi, đừng hòng qua mắt chị.',
            'Chị đợi, nhưng đừng để chị đợi lâu quá.'] },

 8: { hd:9, name:'Thầy Nam', earOut:-2, job:'giáo viên Hoá',
      face:'long', nose:'longn', brow:'flatb',
      eyes:{dx:21, rx:9, ry:7, pr:3.4},
      garment:['shirt','#fbf7ee'],
      trait:'Nghiêm nhưng ấm. Hay hỏi ngược lại để kiểm tra kiến thức.',
      wait:['Trò làm đi, thầy xem trò có nhớ bài không.',
            'Đừng vội. Cân bằng phương trình trước đã.',
            'Thầy chờ. Sai thì thầy giảng lại, không mắng đâu.'] },

 9: { hd:10, name:'Cô Mai', earOut:6, job:'quán chè',
      face:'wide', nose:'round', brow:'thin',
      eyes:{crescent:1, rx:11, ry:8},
      garment:['apron','#e0a458'],
      trait:'Xởi lởi, nhiệt tình. Gặp ai cũng mời ăn chè.',
      wait:['Xong việc ghé quán cô, cô đãi chén chè đậu xanh!',
            'Cô đứng đây tám chuyện tí cũng vui mà.',
            'Làm từ từ thôi con, cô không giục đâu.'] }
};

