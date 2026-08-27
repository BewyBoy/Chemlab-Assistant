// Dựng file mẫu "bàn nhỏ có phối cảnh".
// Kéo nguyên stylesheet + SVG + dữ liệu từ index.html sang, để bản mẫu ghép ĐÚNG vào
// layout hiện tại (cột khách bên trái, tủ hoá chất bên phải) và chỉ khác mỗi cái bàn.
const fs = require('fs');
const path = require('path');

// script nằm ở <repo>/mau-goc-nhin.src/ → thư mục game là thư mục cha
const GAME = path.resolve(__dirname, '..');
const h = fs.readFileSync(path.join(GAME, 'index.html'), 'utf8');

function tpl(name){
  const i = h.indexOf('const ' + name + ' = `');
  const s = h.indexOf('`', i) + 1;
  const e = h.indexOf('`;', s);
  return h.slice(s, e);
}
function block(startsWith, endTok){
  const i = h.indexOf(startsWith);
  const e = h.indexOf(endTok, i) + endTok.length;
  return h.slice(i, e);
}
function oneLine(prefix){                       // khai báo nằm trọn trên MỘT dòng
  return h.split(/\r?\n/).find(l => l.startsWith(prefix));
}

const STYLE     = h.slice(h.indexOf('<style>') + 7, h.indexOf('</style>'));
const SVG_DEFS  = tpl('SVG_DEFS');
const BEAKER    = tpl('BEAKER_SVG');
const HD_CHARS  = oneLine('var HD_CHARS = [');
const HD_HEADS  = oneLine('var HD_HEADS = [');
const CUST_PROPS= block('const CUST_PROPS = {', '\n};');   // object → đóng bằng };
const CHEMS     = block('const CHEMS = {', '\n};');
const CUSTOMERS = block('const CUSTOMERS = [', '\n];');
// engine hoá học thật của game, để bản demo phản ứng đúng chứ không giả vờ.
// Bảng phản ứng đã tách sang phan-ung.js — đọc thẳng file đó, không moi trong index.html nữa.
const PU = fs.readFileSync(path.join(GAME, 'phan-ung.js'), 'utf8');
const REACTIONS = PU.slice(PU.indexOf('const REACTIONS = ['));
const ISPRECIP  = oneLine('const isPrecip =');
const SLOWDISS  = oneLine('const SLOW_DISSOLVE =');
const EQSTR     = block('function eqStr(r){', '\n}');

// mỗi khối phải tự đóng gọn, không được nuốt sang khai báo kế tiếp
const parts = {HD_CHARS, HD_HEADS, CUST_PROPS, CHEMS, ISPRECIP, SLOWDISS,
               CUSTOMERS, REACTIONS, EQSTR};
Object.keys(parts).forEach(n => {
  const s = parts[n];
  if(!s) throw new Error(n + ': không tìm thấy');
  if(s.includes('function custArt')) throw new Error(n + ' trích lố — kiểm lại token kết thúc');
  console.log('  ' + n, (s.length/1024).toFixed(1) + 'KB');
});

const body = fs.readFileSync(path.join(__dirname, 'pov-body.html'), 'utf8');
const out = body
  .replace('/*__STYLE__*/',    () => STYLE)
  .replace('/*__SVG_DEFS__*/', () => SVG_DEFS)
  .replace('/*__BEAKER__*/',   () => BEAKER)
  .replace('/*__DATA__*/',     () => Object.values(parts).join('\n'));

fs.writeFileSync(path.join(GAME, 'mau-goc-nhin.html'), out, 'utf8');
console.log('wrote mau-goc-nhin.html', (out.length/1024).toFixed(0) + 'KB');
