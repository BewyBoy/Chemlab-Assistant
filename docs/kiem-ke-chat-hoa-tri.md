# Kiểm kê chất cho mini-game hoá trị (ngày 4)

Mục đích: xem với **17 nguyên tố** của bảng Khám phá (H, O, C, N, S, P, Cl, Na, K, Ag, Mg, Ca, Ba, Zn, Al, Fe, Cu) còn chất thật nào chưa có trong sổ chất.
Giới hạn đã tính: không phức chất, không muối ngậm nước, không hợp kim; chơi tự do tối đa 3 nguyên tố mỗi chất (chất 4 nguyên tố chỉ dùng được trong Khám phá);
hữu cơ mỗi nhóm tối đa 2 C; nhận chất theo **thành phần** nguyên tử, nên hai đồng phân cùng thành phần chỉ giữ được một.

Cột **Xếp mô hình**: đã chạy thử bằng bộ xếp hiện tại của `che-do.js` (đúng hoá trị từng bóng, không hai bóng nào sát nhau — cùng phép kiểm với `khoi-dong.js`).
- ✓ vẽ được ngay · ✓+gốc vẽ được sau khi thêm một dòng gốc vào `VL_RAD` · ✗ cần kiểu xếp mới · ✎ phải vẽ tay hoặc thêm kiểu cation / gốc mới (chưa thử).
- ★ mình đề xuất thêm trước (có trong sách, đời sống, hoặc là cặp đôi hiển nhiên của chất đã có); không ★ là có thật nhưng ít gặp hoặc kém bền.

## 1. Hiện có và kết quả kiểm lại

Sổ chất hiện có **158** mục: 139 chất trong `pools` + `freeExtra` (trong đó 32 muối hữu cơ thêm theo quyết định mới), 7 chất hữu cơ vẽ tay (`VL_MOL`), 12 chất bí mật (`VL_EGG`);
Khám phá còn nhận thêm 18 đơn chất (`VL_ELEM`) và báo 10 chất không tồn tại (`VL_GONE`).
Chạy lại toàn bộ (cả bộ tự kiểm tra của `khoi-dong.js`): **0 lỗi** — mọi bóng đúng số tay theo hoá trị, không trùng thành phần giữa hai chất, không chồng bóng.

Chỗ còn thưa của sổ (đều là chất rất quen trong sách):
- **Nhôm, sắt, kẽm, bạc** chỉ có vài muối: không có Al(NO₃)₃, Al₂(SO₄)₃, FeSO₄, Fe₂(SO₄)₃, Fe(NO₃)₂/₃, ZnCO₃, FeCO₃, Ag₂SO₄, Ag₂CO₃…
- **Photphat**: chỉ Na₃PO₄ và K₃PO₄; thiếu Ca₃(PO₄)₂ (phân lân, xương) và mọi muối còn lại.
- **Phân bón**: có urê, KNO₃, K₂SO₄, KCl nhưng thiếu NH₄NO₃, (NH₄)₂SO₄, NH₄Cl, Ca(H₂PO₄)₂, (NH₄)₂HPO₄.
- **Nước cứng**: có Ca(HCO₃)₂ nhưng thiếu Mg(HCO₃)₂. **Tẩy trắng**: chưa có NaClO, Ca(ClO)₂, HClO.
- Cu(I) chỉ có Cu₂O; thiếu CuCl, Cu₂S.

## 2. Chất còn thiếu theo nhóm

**228 chất** thật chưa có: 70 vẽ được ngay chỉ bằng dữ liệu · 41 sau khi thêm một dòng gốc · 12 cần kiểu xếp mới · 105 phải vẽ tay hoặc thêm cation / gốc kiểu mới. 62 chất đánh ★ là đề xuất.

### Oxit, clorua, sunfua còn thiếu

*Cần:* dữ liệu thôi (một dòng trong freeExtra mỗi chất); Cl₂O₇ cần kiểu xếp mới.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ N₂O | đinitơ oxit | 2 | ✓ | khí cười |
| N₂O₃ | đinitơ trioxit | 2 | ✓ | chỉ bền ở nhiệt độ rất thấp |
| ★ P₂O₃ | điphotpho trioxit | 2 | ✓ | thực tế là P₄O₆, viết gọn như P₂O₅ |
| Cl₂O | điclo oxit | 2 | ✓ | mô hình hiện vẽ thẳng hàng (thật là gấp khúc) |
| Cl₂O₇ | điclo heptaoxit | 2 | ✗ | 7 liên kết: bộ xếp hiện chỉ tới 5 (như P₂O₅) |
| ★ CuCl | đồng(I) clorua | 2 | ✓ | chất rắn trắng, ít tan |
| ★ Cu₂S | đồng(I) sunfua | 2 | ✓ | quặng chancocit |
| SCl₂ | lưu huỳnh điclorua | 2 | ✓ |  |
| SCl₄ | lưu huỳnh tetraclorua | 2 | ✓ | chỉ bền dưới −30 °C |
| NCl₃ | nitơ triclorua | 2 | ✓ | rất nhạy nổ |
| P₂S₃ | điphotpho trisunfua | 2 | ✓ |  |
| ★ P₂S₅ | điphotpho pentasunfua | 2 | ✓ | thuốc trừ sâu, phụ gia |

### Nitrua, photphua, hiđrua, cacbua

*Cần:* dữ liệu thôi; Al₄C₃ cần kiểu xếp 4 : 3.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ Ca₃N₂ | canxi nitrua | 2 | ✓ |  |
| Ba₃N₂ | bari nitrua | 2 | ✓ |  |
| Zn₃N₂ | kẽm nitrua | 2 | ✓ |  |
| ★ AlN | nhôm nitrua | 2 | ✓ |  |
| Cu₃N | đồng(I) nitrua | 2 | ✓ |  |
| Na₃N | natri nitrua | 2 | ✓ | rất kém bền |
| K₃N | kali nitrua | 2 | ✓ | rất kém bền |
| Ag₃N | bạc nitrua | 2 | ✓ | nổ khi chạm |
| ★ Ca₃P₂ | canxi photphua | 2 | ✓ | gặp nước sinh PH₃ |
| Mg₃P₂ | magie photphua | 2 | ✓ |  |
| ★ Zn₃P₂ | kẽm photphua | 2 | ✓ | bả chuột |
| Ba₃P₂ | bari photphua | 2 | ✓ |  |
| ★ AlP | nhôm photphua | 2 | ✓ | thuốc xông hơi trừ sâu |
| Na₃P | natri photphua | 2 | ✓ |  |
| K₃P | kali photphua | 2 | ✓ |  |
| Cu₃P | đồng(I) photphua | 2 | ✓ |  |
| ★ PH₃ | photphin | 2 | ✓ | khí độc |
| ★ NaH | natri hiđrua | 2 | ✓ |  |
| KH | kali hiđrua | 2 | ✓ |  |
| ★ CaH₂ | canxi hiđrua | 2 | ✓ | hút ẩm, sinh H₂ khi gặp nước |
| MgH₂ | magie hiđrua | 2 | ✓ |  |
| BaH₂ | bari hiđrua | 2 | ✓ |  |
| AlH₃ | nhôm hiđrua | 2 | ✓ | thực tế là polime |
| ZnH₂ | kẽm hiđrua | 2 | ✓ | kém bền |
| Al₄C₃ | nhôm cacbua | 2 | ✗ | tỉ lệ 4 : 3, chưa có kiểu xếp; gặp nước sinh CH₄ |

### Gốc đã có × kim loại còn thiếu

*Cần:* dữ liệu thôi; muối có x > 1 và y > 1 (Al₂(SO₄)₃, Ca₃(PO₄)₂, AlPO₄…) cần kiểu xếp mới.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ Mg(NO₃)₂ | magie nitrat | 3 | ✓ |  |
| ★ Zn(NO₃)₂ | kẽm nitrat | 3 | ✓ |  |
| ★ Al(NO₃)₃ | nhôm nitrat | 3 | ✓ |  |
| ★ Fe(NO₃)₂ | sắt(II) nitrat | 3 | ✓ |  |
| ★ Fe(NO₃)₃ | sắt(III) nitrat | 3 | ✓ |  |
| ★ Ag₂SO₄ | bạc sunfat | 3 | ✓ |  |
| ★ FeSO₄ | sắt(II) sunfat | 3 | ✓ |  |
| ★ Fe₂(SO₄)₃ | sắt(III) sunfat | 3 | ✗ | x > 1 và y > 1: bộ xếp trả null |
| ★ Al₂(SO₄)₃ | nhôm sunfat | 3 | ✗ | phèn nhôm; x > 1 và y > 1 |
| ★ ZnCO₃ | kẽm cacbonat | 3 | ✓ | quặng smithsonit |
| ★ FeCO₃ | sắt(II) cacbonat | 3 | ✓ | quặng xiđerit |
| ★ Ag₂CO₃ | bạc cacbonat | 3 | ✓ |  |
| ★ Ag₃PO₄ | bạc photphat | 3 | ✓ | kết tủa vàng, nhận ra ion photphat |
| ★ Ca₃(PO₄)₂ | canxi photphat | 3 | ✗ | phân lân, xương; x > 1 và y > 1 |
| Mg₃(PO₄)₂ | magie photphat | 3 | ✗ |  |
| Ba₃(PO₄)₂ | bari photphat | 3 | ✗ |  |
| Zn₃(PO₄)₂ | kẽm photphat | 3 | ✗ |  |
| ★ AlPO₄ | nhôm photphat | 3 | ✗ | hoá trị 3–3 chưa có kiểu xếp |
| Fe₃(PO₄)₂ | sắt(II) photphat | 3 | ✗ |  |
| FePO₄ | sắt(III) photphat | 3 | ✗ | hoá trị 3–3 chưa có kiểu xếp |
| Cu₃(PO₄)₂ | đồng(II) photphat | 3 | ✗ |  |
| AgNO₂ | bạc nitrit | 3 | ✓ |  |
| Ca(NO₂)₂ | canxi nitrit | 3 | ✓ |  |
| Ba(NO₂)₂ | bari nitrit | 3 | ✓ |  |
| Mg(NO₂)₂ | magie nitrit | 3 | ✓ |  |
| Zn(NO₂)₂ | kẽm nitrit | 3 | ✓ |  |
| Ag₂SO₃ | bạc sunfit | 3 | ✓ |  |
| MgSO₃ | magie sunfit | 3 | ✓ |  |
| ZnSO₃ | kẽm sunfit | 3 | ✓ |  |
| FeSO₃ | sắt(II) sunfit | 3 | ✓ |  |
| ★ Mg(HCO₃)₂ | magie hiđrocacbonat | 4 (chỉ Khám phá) | ✓ | nước cứng; chỉ có trong dung dịch (như Ca(HCO₃)₂ đã có) |
| Ba(HCO₃)₂ | bari hiđrocacbonat | 4 (chỉ Khám phá) | ✓ | chỉ có trong dung dịch |
| Fe(HCO₃)₂ | sắt(II) hiđrocacbonat | 4 (chỉ Khám phá) | ✓ | chỉ có trong dung dịch |
| ★ K₂HPO₄ | kali hiđrophotphat | 4 (chỉ Khám phá) | ✓ | phân bón |
| MgHPO₄ | magie hiđrophotphat | 4 (chỉ Khám phá) | ✓ |  |
| BaHPO₄ | bari hiđrophotphat | 4 (chỉ Khám phá) | ✓ |  |
| ★ KH₂PO₄ | kali đihiđrophotphat | 4 (chỉ Khám phá) | ✓ | phân bón MKP |
| ★ Ca(H₂PO₄)₂ | canxi đihiđrophotphat | 4 (chỉ Khám phá) | ✓ | supephotphat (phân lân) |
| Mg(H₂PO₄)₂ | magie đihiđrophotphat | 4 (chỉ Khám phá) | ✓ |  |
| Ba(H₂PO₄)₂ | bari đihiđrophotphat | 4 (chỉ Khám phá) | ✓ |  |
| Ca(ClO₃)₂ | canxi clorat | 3 | ✓ |  |
| Mg(ClO₃)₂ | magie clorat | 3 | ✓ |  |
| Ba(ClO₃)₂ | bari clorat | 3 | ✓ | pháo hoa xanh lục |
| AgClO₃ | bạc clorat | 3 | ✓ |  |
| Zn(ClO₃)₂ | kẽm clorat | 3 | ✓ |  |

### Gốc mới: hipoclorit, clorit, peclorat

*Cần:* thêm một dòng gốc vào VL_RAD (ClO cần thêm VL_AROUND[1]).

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ HClO | axit hipoclorơ | 3 | ✓+gốc | axit yếu, diệt khuẩn |
| ★ NaClO | natri hipoclorit | 3 | ✓+gốc | nước Gia-ven |
| KClO | kali hipoclorit | 3 | ✓+gốc |  |
| ★ Ca(ClO)₂ | canxi hipoclorit | 3 | ✓+gốc | clorua vôi, bột tẩy |
| HClO₂ | axit clorơ | 3 | ✓+gốc |  |
| NaClO₂ | natri clorit | 3 | ✓+gốc |  |
| KClO₂ | kali clorit | 3 | ✓+gốc |  |
| ★ HClO₄ | axit pecloric | 3 | ✓+gốc | axit mạnh nhất |
| NaClO₄ | natri peclorat | 3 | ✓+gốc |  |
| ★ KClO₄ | kali peclorat | 3 | ✓+gốc | pháo hoa, thuốc nổ |
| Mg(ClO₄)₂ | magie peclorat | 3 | ✓+gốc |  |
| Ca(ClO₄)₂ | canxi peclorat | 3 | ✓+gốc |  |
| Ba(ClO₄)₂ | bari peclorat | 3 | ✓+gốc |  |
| AgClO₄ | bạc peclorat | 3 | ✓+gốc |  |
| Cu(ClO₄)₂ | đồng(II) peclorat | 3 | ✓+gốc |  |
| Fe(ClO₄)₃ | sắt(III) peclorat | 3 | ✓+gốc |  |
| Al(ClO₄)₃ | nhôm peclorat | 3 | ✓+gốc |  |

### Gốc mới: metaphotphat, hiđrosunfit

*Cần:* thêm gốc PO₃, HSO₃.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| HPO₃ | axit metaphotphoric | 3 | ✓+gốc |  |
| NaPO₃ | natri metaphotphat | 3 | ✓+gốc |  |
| KPO₃ | kali metaphotphat | 3 | ✓+gốc |  |
| Ca(PO₃)₂ | canxi metaphotphat | 3 | ✓+gốc |  |
| ★ NaHSO₃ | natri hiđrosunfit | 4 (chỉ Khám phá) | ✓+gốc |  |
| KHSO₃ | kali hiđrosunfit | 4 (chỉ Khám phá) | ✓+gốc |  |
| Ca(HSO₃)₂ | canxi hiđrosunfit | 4 (chỉ Khám phá) | ✓+gốc |  |
| Mg(HSO₃)₂ | magie hiđrosunfit | 4 (chỉ Khám phá) | ✓+gốc |  |

### Gốc mới: aluminat, zincat, ferit (không phải phức)

*Cần:* thêm gốc AlO₂, ZnO₂, FeO₂.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| HAlO₂ | nhôm oxit-hiđroxit | 3 | ✓+gốc | viết gọn của AlO(OH), quặng bôxit |
| ★ NaAlO₂ | natri aluminat | 3 | ✓+gốc | sinh ra khi Al(OH)₃ tan trong kiềm |
| KAlO₂ | kali aluminat | 3 | ✓+gốc |  |
| Ca(AlO₂)₂ | canxi aluminat | 3 | ✓+gốc | tức CaAl₂O₄ |
| Mg(AlO₂)₂ | magie aluminat | 3 | ✓+gốc | tức MgAl₂O₄ (spinen) |
| Zn(AlO₂)₂ | kẽm aluminat | 3 | ✓+gốc | tức ZnAl₂O₄ |
| Ba(AlO₂)₂ | bari aluminat | 3 | ✓+gốc | tức BaAl₂O₄ |
| ★ Na₂ZnO₂ | natri zincat | 3 | ✓+gốc | sinh ra khi Zn(OH)₂ tan trong kiềm |
| K₂ZnO₂ | kali zincat | 3 | ✓+gốc |  |
| HFeO₂ | sắt(III) oxit-hiđroxit | 3 | ✓+gốc | viết gọn của FeO(OH), gỉ sắt |
| NaFeO₂ | natri ferit | 3 | ✓+gốc |  |
| KFeO₂ | kali ferit | 3 | ✓+gốc |  |
| Ca(FeO₂)₂ | canxi ferit | 3 | ✓+gốc | tức CaFe₂O₄ |
| Mg(FeO₂)₂ | magie ferit | 3 | ✓+gốc | tức MgFe₂O₄ |
| Zn(FeO₂)₂ | kẽm ferit | 3 | ✓+gốc | tức ZnFe₂O₄ |
| Cu(FeO₂)₂ | đồng(II) ferit | 3 | ✓+gốc | tức CuFe₂O₄ |

### Peoxit và đisunfua (có liên kết O–O, S–S, N–N)

*Cần:* vẽ tay kiểu VL_EGG — như Na₂O₂ / H₂O₂ đã có.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ K₂O₂ | kali peoxit | 2 | ✎ | như Na₂O₂ |
| MgO₂ | magie peoxit | 2 | ✎ | như CaO₂ |
| ★ CaO₂ | canxi peoxit | 2 | ✎ | như trên, Ca ôm cả hai O |
| ★ BaO₂ | bari peoxit | 2 | ✎ | giống Na₂O₂ (đã có): hai O nắm tay nhau |
| ZnO₂ | kẽm peoxit | 2 | ✎ | như CaO₂ |
| ★ FeS₂ | sắt(II) đisunfua (pirit) | 2 | ✎ | pirit — Fe ôm hai S nắm tay nhau (như CaC₂) |
| S₂Cl₂ | lưu huỳnh monoclorua | 2 | ✎ | Cl–S–S–Cl |
| ★ N₂O₄ | đinitơ tetraoxit | 2 | ✎ | O₂N–NO₂, hai N cùng hoá trị V |
| Na₂S₂ | natri đisunfua | 2 | ✎ | như Na₂O₂ |
| H₂S₂ | hiđro đisunfua | 2 | ✎ | như H₂O₂, kém bền |

### Axetilua và cacbua (như CaC₂ đã có)

*Cần:* vẽ tay kiểu VL_EGG.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| Na₂C₂ | natri axetilua | 2 | ✎ | như CaC₂ nhưng 2 Na |
| K₂C₂ | kali axetilua | 2 | ✎ | như Na₂C₂ |
| BaC₂ | bari cacbua | 2 | ✎ | như CaC₂ |
| MgC₂ | magie cacbua | 2 | ✎ | như CaC₂, kém bền |
| ★ Ag₂C₂ | bạc axetilua | 2 | ✎ | bạc axetilua, kết tủa vàng khi thử axetilen |
| Cu₂C₂ | đồng(I) axetilua | 2 | ✎ | đồng(I) axetilua, kết tủa đỏ nâu |
| CaCN₂ | canxi xianamit | 3 | ✎ | vôi nitơ (phân bón): Ca ôm N=C=N |

### Xianua và azit

*Cần:* vẽ tay; hoặc thêm gốc CN (C≡N) / N₃.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| C₂N₂ | xianogen | 2 | ✎ | N≡C–C≡N, khí độc |
| ClCN | xianogen clorua | 3 | ✎ | Cl–C≡N, khí độc |
| ★ NaCN | natri xianua | 3 | ✎ | Na–C≡N, cực độc |
| ★ KCN | kali xianua | 3 | ✎ | như NaCN, cực độc |
| AgCN | bạc xianua | 3 | ✎ |  |
| CuCN | đồng(I) xianua | 3 | ✎ |  |
| Ca(CN)₂ | canxi xianua | 3 | ✎ |  |
| Zn(CN)₂ | kẽm xianua | 3 | ✎ |  |
| Ba(CN)₂ | bari xianua | 3 | ✎ |  |
| HN₃ | axit hiđrazoic | 2 | ✎ | H–N=N=N, dễ nổ |
| ★ NaN₃ | natri azit | 2 | ✎ | túi khí ô tô |
| KN₃ | kali azit | 2 | ✎ | như NaN3 |
| AgN₃ | bạc azit | 2 | ✎ | rất dễ nổ |

### Muối amoni (cation NH₄)

*Cần:* thêm kiểu cation NH₄ (N nắm 4 H + 1 tay nối gốc, N hoá trị V trong bảng), hoặc vẽ tay từng muối.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ NH₄Cl | amoni clorua | 3 | ✎ | phân đạm / pin |
| ★ NH₄NO₃ | amoni nitrat | 3 | ✎ | phân đạm hai lá |
| NH₄NO₂ | amoni nitrit | 3 | ✎ |  |
| ★ (NH₄)₂SO₄ | amoni sunfat | 4 (chỉ Khám phá) | ✎ | phân đạm một lá |
| (NH₄)₂SO₃ | amoni sunfit | 4 (chỉ Khám phá) | ✎ |  |
| NH₄HSO₄ | amoni hiđrosunfat | 4 (chỉ Khám phá) | ✎ |  |
| (NH₄)₂CO₃ | amoni cacbonat | 4 (chỉ Khám phá) | ✎ | amoni cacbonat |
| ★ NH₄HCO₃ | amoni hiđrocacbonat | 4 (chỉ Khám phá) | ✎ | bột nở, phân bón |
| (NH₄)₃PO₄ | amoni photphat | 4 (chỉ Khám phá) | ✎ |  |
| ★ (NH₄)₂HPO₄ | amoni hiđrophotphat | 4 (chỉ Khám phá) | ✎ | phân DAP |
| ★ NH₄H₂PO₄ | amoni đihiđrophotphat | 4 (chỉ Khám phá) | ✎ | phân MAP |
| (NH₄)₂S | amoni sunfua | 3 | ✎ |  |
| NH₄HS | amoni hiđrosunfua | 3 | ✎ |  |
| NH₄ClO₃ | amoni clorat | 4 (chỉ Khám phá) | ✎ | kém bền, nổ |
| NH₄ClO₄ | amoni peclorat | 4 (chỉ Khám phá) | ✎ |  |
| NH₅O | amoni hiđroxit (NH₄OH) | 3 | ✎ | NH₃ tan trong nước (không tách riêng được) |
| NH₄CN | amoni xianua | 3 | ✎ |  |

### Dẫn xuất của NH₃

*Cần:* vẽ tay.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| NaNH₂ | natri amiđua | 3 | ✎ | bazơ rất mạnh |
| KNH₂ | kali amiđua | 3 | ✎ |  |
| Ca(NH₂)₂ | canxi amiđua | 3 | ✎ |  |
| Mg(NH₂)₂ | magie amiđua | 3 | ✎ |  |
| Ba(NH₂)₂ | bari amiđua | 3 | ✎ |  |
| NH₂OH | hiđroxylamin | 3 | ✎ | hiđroxylamin |
| NH₂Cl | cloramin | 3 | ✎ | xử lí nước, kém bền ở dạng tinh khiết |

### Oxo-halogenua (3 nguyên tố)

*Cần:* vẽ tay.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ COCl₂ | photgen | 3 | ✎ | khí độc, từng dùng làm vũ khí |
| COS | cacbonyl sunfua | 3 | ✎ | O=C=S |
| SOCl₂ | thionyl clorua | 3 | ✎ |  |
| SO₂Cl₂ | sunfuryl clorua | 3 | ✎ |  |
| POCl₃ | photpho oxiclorua | 3 | ✎ |  |
| PSCl₃ | thiophotphoryl clorua | 3 | ✎ |  |
| NOCl | nitrozyl clorua | 3 | ✎ |  |
| NO₂Cl | nitryl clorua | 3 | ✎ |  |

### Oxoaxit và muối còn thiếu (thiosunfat, hiđrosunfua, photphit, persunfat…)

*Cần:* vẽ tay hoặc thêm gốc S₂O₃ (S neo thay cho O), HS.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| H₃PO₃ | axit photphorơ | 3 | ✎ | axit hai nấc |
| H₃PO₂ | axit hipophotphorơ | 3 | ✎ | axit một nấc |
| H₄P₂O₇ | axit điphotphoric | 3 | ✎ |  |
| H₂S₂O₃ | axit thiosunfuric | 3 | ✎ |  |
| H₂S₂O₈ | axit peoxođisunfuric | 3 | ✎ |  |
| ★ Na₂S₂O₃ | natri thiosunfat | 3 | ✎ | hypo, rửa ảnh / giải độc xianua |
| K₂S₂O₃ | kali thiosunfat | 3 | ✎ |  |
| CaS₂O₃ | canxi thiosunfat | 3 | ✎ |  |
| BaS₂O₃ | bari thiosunfat | 3 | ✎ |  |
| Ag₂S₂O₃ | bạc thiosunfat | 3 | ✎ |  |
| Na₂S₂O₅ | natri metabisunfit | 3 | ✎ | chất bảo quản E223 |
| K₂S₂O₅ | kali metabisunfit | 3 | ✎ |  |
| Na₂S₂O₈ | natri persunfat | 3 | ✎ |  |
| K₂S₂O₈ | kali persunfat | 3 | ✎ | chất oxi hoá mạnh |
| Na₄P₂O₇ | natri điphotphat | 3 | ✎ | chất làm mềm nước, bột giặt |
| ★ NaHS | natri hiđrosunfua | 3 | ✎ | H₂S + NaOH (1 : 1) |
| KHS | kali hiđrosunfua | 3 | ✎ |  |
| Ca(HS)₂ | canxi hiđrosunfua | 3 | ✎ |  |
| Mg(HS)₂ | magie hiđrosunfua | 3 | ✎ |  |
| Ba(HS)₂ | bari hiđrosunfua | 3 | ✎ |  |

### Hữu cơ tới 2 nguyên tử C

*Cần:* vẽ tay kiểu VL_MOL (đồng phân cùng thành phần chỉ nhận được một chất).

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| CH₃Cl | metyl clorua | 3 | ✎ |  |
| CH₂Cl₂ | điclometan | 3 | ✎ |  |
| ★ CHCl₃ | cloroform | 3 | ✎ | dung môi, thuốc mê ngày xưa |
| CH₃SH | metanthiol | 3 | ✎ | chất tạo mùi cho khí gas |
| CH₃NO₂ | nitrometan | 4 (chỉ Khám phá) | ✎ |  |
| HCONH₂ | fomamit | 4 (chỉ Khám phá) | ✎ |  |
| CS(NH₂)₂ | thioure | 4 (chỉ Khám phá) | ✎ |  |
| ★ C₂H₆O₂ | etilen glicol | 3 | ✎ | chống đông |
| C₂H₅Cl | etyl clorua | 3 | ✎ |  |
| C₂H₃Cl | vinyl clorua | 3 | ✎ | monome làm PVC |
| C₂H₇N | etylamin | 3 | ✎ | đồng phân đimetylamin cùng thành phần |
| CH₃CONH₂ | axetamit | 4 (chỉ Khám phá) | ✎ |  |
| ★ C₂H₅NO₂ | glyxin | 4 (chỉ Khám phá) | ✎ | amino axit đơn giản nhất; đồng phân nitroetan |
| CH₃CN | axetonitrin | 3 | ✎ |  |

### Muối hữu cơ tới 2 nguyên tử C (một gốc)

*Cần:* vẽ tay; hoặc thêm gốc HCOO, CH₃COO, C₂O₄, ancolat.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| HCOONH₄ | amoni fomat | 4 (chỉ Khám phá) | ✎ |  |
| CH₃COONH₄ | amoni axetat | 4 (chỉ Khám phá) | ✎ |  |
| (NH₄)₂C₂O₄ | amoni oxalat | 4 (chỉ Khám phá) | ✎ |  |

### Muối hỗn tạp, muối bazơ, khoáng

*Cần:* vẽ tay.

| Công thức | Tên | Nguyên tố | Xếp mô hình | Ghi chú |
|---|---|---|---|---|
| ★ CaOCl₂ | clorua vôi | 3 | ✎ | muối hỗn tạp Ca(OCl)Cl |
| Cu₂(OH)₂CO₃ | đồng(II) hiđroxicacbonat (malachit) | 4 (chỉ Khám phá) | ✎ | gỉ đồng |
| CuFeS₂ | đồng pirit | 3 | ✎ | quặng |
| KMgCl₃ | cacnalit khan | 3 | ✎ |  |
| CaMg(CO₃)₂ | đolomit | 4 (chỉ Khám phá) | ✎ |  |
| KAl(SO₄)₂ | phèn chua khan | 4 (chỉ Khám phá) | ✎ |  |

## 3. Chất loại ra

- **Phức chất** (theo yêu cầu): [Cu(NH₃)₄]SO₄, [Ag(NH₃)₂]Cl, Na[Al(OH)₄], Na₂[Zn(OH)₄], K₄[Fe(CN)₆], K₃[Fe(CN)₆], Fe(SCN)₃ dạng phức…
- **Ngậm nước**: CuSO₄·5H₂O, FeSO₄·7H₂O, Na₂CO₃·10H₂O, CaSO₄·2H₂O, phèn chua dạng ngậm 12H₂O…
- **Không tồn tại hoặc bị nước phân huỷ**: đã có lời nhắn riêng (mục 4), không còn nằm trong danh sách thiếu.
- **Hoá trị bất thường, chưa vẽ nổi bằng "tay"**: KO₂, KO₃ (siêu oxit), ClO₂ (Cl hoá trị IV không có trong bảng), Fe₃C, Fe₄N, hợp kim.

## 4. Đã làm theo quyết định mới

1. **Đơn chất — nhận ở Khám phá** (18 chất): H₂, O₂, N₂, Cl₂, S₈ (vòng 8 nguyên tử); kim loại, C, S, P là một nguyên tử đứng riêng, viết như trong sách. Tạo chất tự do vẫn đòi hợp chất để khỏi kiếm điểm dễ.
2. **Chất không tồn tại → "phân huỷ ngay lập tức"** (10 chất, kèm sản phẩm): Al₂(CO₃)₃, Fe₂(CO₃)₃, Al(HCO₃)₃, Fe(HCO₃)₃, Al₂(SO₃)₃, Fe₂(SO₃)₃, CuCO₃, AgOH, CuOH, Fe₂S₃. Báo cả ở tạo chất tự do lẫn Khám phá, thay cho "chưa có trong sổ".
3. **Hữu cơ: nới thành "mỗi nhóm ≤ 2 C"**: thêm 32 muối hữu cơ — fomat (9), axetat (9), oxalat + axit oxalic (10), metylat / etylat của Na, K (4). Muối hai gốc như (CH₃COO)₂Ca có 4 C vẫn nhận; chất hữu cơ đứng riêng vẫn tối đa 2 C. Không thêm nhôm / sắt(III) axetat (22 bóng, vượt giới hạn 16 bóng trên bàn).

Còn lại: 62 chất ★ ở trên là đề xuất tiếp theo; muốn đủ cả 228 chất thì thêm nốt phần không ★.
