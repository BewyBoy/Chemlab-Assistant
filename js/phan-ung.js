/* =====================================================================
   BẢNG PHẢN ỨNG — nguồn sự thật duy nhất cho hoá học trong cốc.
   index.html nạp file này; runReactions()/electrolyse()/burnInJar() (phong-thi-nghiem.js) tra thẳng vào đây.

   Cấu trúc một dòng:
     rg    chất tham gia  {công thức: hệ số}
     pr    chất tạo thành {công thức: hệ số}
     heat  1 = phải đun (đèn cồn)
     burn  1 = phản ứng CHÁY: KHÔNG chạy trong cốc. Chất rắn đặt lên muôi đốt, hơ qua
             đèn cồn cho bén lửa rồi đưa vào lọ khí (O₂ / Cl₂) — xem burnInJar()
     elec  1 = phải cắm nguồn điện phân (người chơi tự định lượng, không tự chạy)
     exo   1 = toả nhiệt, cốc loé sáng
     vent  ['X'] = khí X thoát ra ở cực dương, KHÔNG hứng vào bình được
     last  1 = xếp sau cùng khi nhiều phản ứng cùng chạy được
     obs   hiện tượng quan sát được — hiện trên thẻ phản ứng và lúc đốt
     tag   {X:"đặc"} = ghi nồng độ sau công thức: HCl(đặc), H₂SO₄(loãng) — chỉ để hiển thị
     cond  "xt, p" = điều kiện thêm ghi trên mũi tên — chỉ để hiển thị
     rev   1 = phản ứng thuận nghịch, viết mũi tên ⇌

   Mọi công thức xuất hiện ở đây PHẢI có trong CHEMS (du-lieu.js).
   Sổ tay lưu phản ứng đã gặp theo SỐ THỨ TỰ trong mảng này (save.rx), nên
   KHÔNG chèn/xoá/đảo dòng ở giữa — chỉ sửa tại chỗ hoặc thêm vào cuối.
   ===================================================================== */
const REACTIONS = [

 /* ---------- 1. AXIT + BAZƠ TAN (trung hoà) ---------- */
 {rg:{HCl:1,NaOH:1},          pr:{NaCl:1,H2O:1}},
 {rg:{HCl:1,KOH:1},           pr:{KCl:1,H2O:1}},
 {rg:{HCl:2,'Ca(OH)2':1},     pr:{CaCl2:1,H2O:2}},
 {rg:{H2SO4:1,NaOH:2},        pr:{Na2SO4:1,H2O:2}},
 {rg:{H2SO4:1,KOH:2},         pr:{K2SO4:1,H2O:2}},
 {rg:{H2SO4:1,'Ca(OH)2':1},   pr:{CaSO4:1,H2O:2}},
 {rg:{HNO3:1,NaOH:1},         pr:{NaNO3:1,H2O:1}},
 {rg:{HNO3:1,KOH:1},          pr:{KNO3:1,H2O:1}},
 {rg:{H3PO4:1,NaOH:3},        pr:{Na3PO4:1,H2O:3}},

 /* ---------- 2. AXIT + BAZƠ KHÔNG TAN (hoà tan kết tủa) ---------- */
 {rg:{'Cu(OH)2':1,HCl:2},     pr:{CuCl2:1,H2O:2}},
 {rg:{'Cu(OH)2':1,H2SO4:1},   pr:{CuSO4:1,H2O:2}},
 {rg:{'Fe(OH)3':1,HCl:3},     pr:{FeCl3:1,H2O:3}},
 {rg:{'Fe(OH)3':2,H2SO4:3},   pr:{'Fe2(SO4)3':1,H2O:6}},
 {rg:{'Fe(OH)2':1,HCl:2},     pr:{FeCl2:1,H2O:2}},
 {rg:{'Fe(OH)2':1,H2SO4:1},   pr:{FeSO4:1,H2O:2}},
 {rg:{'Mg(OH)2':1,HCl:2},     pr:{MgCl2:1,H2O:2}},
 {rg:{'Mg(OH)2':1,H2SO4:1},   pr:{MgSO4:1,H2O:2}},
 {rg:{'Zn(OH)2':1,HCl:2},     pr:{ZnCl2:1,H2O:2}},
 {rg:{'Zn(OH)2':1,H2SO4:1},   pr:{ZnSO4:1,H2O:2}},
 {rg:{'Al(OH)3':1,HCl:3},     pr:{AlCl3:1,H2O:3}},
 {rg:{'Al(OH)3':2,H2SO4:3},   pr:{'Al2(SO4)3':1,H2O:6}},

 /* ---------- 3. KIM LOẠI + AXIT → muối + H₂ ---------- */
 {rg:{Zn:1,HCl:2},            pr:{ZnCl2:1,H2:1}, obs:'Viên kẽm tan dần, sủi bọt khí H₂ không màu.'},
 {rg:{Fe:1,HCl:2},            pr:{FeCl2:1,H2:1}},
 {rg:{Mg:1,HCl:2},            pr:{MgCl2:1,H2:1}},
 {rg:{Al:2,HCl:6},            pr:{AlCl3:2,H2:3}},
 {rg:{Na:2,HCl:2},            pr:{NaCl:2,H2:1}, exo:1},
 {rg:{K:2,HCl:2},             pr:{KCl:2,H2:1},  exo:1},
 {rg:{Zn:1,H2SO4:1},          pr:{ZnSO4:1,H2:1}, tag:{H2SO4:'loãng'}},
 {rg:{Fe:1,H2SO4:1},          pr:{FeSO4:1,H2:1}, tag:{H2SO4:'loãng'}},
 {rg:{Mg:1,H2SO4:1},          pr:{MgSO4:1,H2:1}, tag:{H2SO4:'loãng'}},
 {rg:{Al:2,H2SO4:3},          pr:{'Al2(SO4)3':1,H2:3}, tag:{H2SO4:'loãng'}},
 {rg:{Na:2,H2SO4:1},          pr:{Na2SO4:1,H2:1}, exo:1, tag:{H2SO4:'loãng'}},
 {rg:{K:2,H2SO4:1},           pr:{K2SO4:1,H2:1},  exo:1, tag:{H2SO4:'loãng'}},

 /* ---------- 4. KIM LOẠI KIỀM + NƯỚC ---------- */
 {rg:{Na:2,H2O:2},            pr:{NaOH:2,H2:1}, exo:1, obs:'Mẩu natri chạy vòng vòng trên mặt nước, sủi bọt và nóng lên.'},
 {rg:{K:2,H2O:2},             pr:{KOH:2,H2:1},  exo:1},

 /* ---------- 5. CHÁY TRONG OXI ----------
    Đốt thật: chất rắn trên muôi đốt → hơ đèn cồn → đưa vào lọ oxi (burn).
    Riêng H₂ là khí, không lên muôi được: trộn với O₂ trong cốc rồi châm lửa (heat). */
 {rg:{Mg:2,O2:1},             pr:{MgO:2},    burn:1, exo:1, obs:'Magie cháy sáng chói loá, để lại bột trắng MgO.'},
 {rg:{Cu:2,O2:1},             pr:{CuO:2},    burn:1, exo:1, obs:'Đồng nóng đỏ rồi phủ một lớp màu đen — đó là CuO.'},
 {rg:{Zn:2,O2:1},             pr:{ZnO:2},    burn:1, exo:1, obs:'Kẽm cháy, để lại bột ZnO (vàng khi còn nóng, trắng khi nguội).'},
 {rg:{Fe:3,O2:2},             pr:{Fe3O4:1},  burn:1, exo:1, obs:'Sắt cháy sáng, bắn tia lửa tung toé, tạo hạt nâu đen Fe₃O₄.'},
 {rg:{Al:4,O2:3},             pr:{Al2O3:2},  burn:1, exo:1, obs:'Bột nhôm cháy sáng chói, để lại bột trắng Al₂O₃.'},
 {rg:{Na:4,O2:1},             pr:{Na2O:2},   burn:1, exo:1, obs:'Natri cháy với ngọn lửa màu vàng.'},
 {rg:{K:4,O2:1},              pr:{K2O:2},    burn:1, exo:1, obs:'Kali cháy với ngọn lửa màu tím hồng.'},
 {rg:{S:1,O2:1},              pr:{SO2:1},    burn:1, exo:1, obs:'Lưu huỳnh cháy với ngọn lửa xanh lam, sinh khí SO₂ mùi hắc.'},
 {rg:{P:4,O2:5},              pr:{P2O5:2},   burn:1, exo:1, obs:'Photpho cháy sáng, tạo khói trắng dày đặc là bột P₂O₅.'},
 {rg:{C:1,O2:1},              pr:{CO2:1},    burn:1, exo:1, obs:'Than hồng rực rồi cháy sáng, sinh khí CO₂ không màu.'},
 {rg:{H2:2,O2:1},             pr:{H2O:2},    heat:1, exo:1, obs:'Hỗn hợp hiđro và oxi gặp lửa thì nổ "tách", sinh ra nước.'},
 {rg:{C12H22O11:1,O2:12},     pr:{CO2:12,H2O:11}, burn:1, exo:1, obs:'Đường chảy lỏng, hoá đen rồi cháy hết, sinh khí CO₂ và hơi nước.'},

 /* ---------- 6. KIM LOẠI ĐẨY KIM LOẠI KHỎI DUNG DỊCH MUỐI ----------
    Theo dãy hoạt động: Mg > Al > Zn > Fe > Cu > Ag                     */
 {rg:{Mg:1,ZnSO4:1},          pr:{MgSO4:1,Zn:1}},
 {rg:{Mg:1,FeSO4:1},          pr:{MgSO4:1,Fe:1}},
 {rg:{Mg:1,CuSO4:1},          pr:{MgSO4:1,Cu:1}},
 {rg:{Mg:1,CuCl2:1},          pr:{MgCl2:1,Cu:1}},
 {rg:{Al:2,CuSO4:3},          pr:{'Al2(SO4)3':1,Cu:3}},
 {rg:{Zn:1,FeSO4:1},          pr:{ZnSO4:1,Fe:1}},
 {rg:{Zn:1,CuSO4:1},          pr:{ZnSO4:1,Cu:1}},
 {rg:{Zn:1,CuCl2:1},          pr:{ZnCl2:1,Cu:1}},
 {rg:{Fe:1,CuSO4:1},          pr:{FeSO4:1,Cu:1}, obs:'Đinh sắt phủ một lớp đồng đỏ, màu xanh của dung dịch nhạt dần.'},
 {rg:{Fe:1,CuCl2:1},          pr:{FeCl2:1,Cu:1}},
 {rg:{Cu:1,AgNO3:2},          pr:{'Cu(NO3)2':1,Ag:2}, obs:'Dây đồng phủ lớp bạc trắng xám, dung dịch chuyển dần sang xanh lam.'},
 // sắt(III) bị chính Fe hoặc Cu khử xuống sắt(II) — mẹo khắc bảng mạch
 {rg:{Fe:1,FeCl3:2},          pr:{FeCl2:3}},
 {rg:{Cu:1,FeCl3:2},          pr:{CuCl2:1,FeCl2:2}},

 /* ---------- 7. OXIT BAZƠ + AXIT ---------- */
 {rg:{MgO:1,HCl:2},           pr:{MgCl2:1,H2O:1}},
 {rg:{MgO:1,H2SO4:1},         pr:{MgSO4:1,H2O:1}},
 {rg:{ZnO:1,HCl:2},           pr:{ZnCl2:1,H2O:1}},
 {rg:{ZnO:1,H2SO4:1},         pr:{ZnSO4:1,H2O:1}},
 {rg:{CuO:1,HCl:2},           pr:{CuCl2:1,H2O:1}, obs:'Bột đen CuO tan dần, dung dịch chuyển màu xanh.'},
 {rg:{CuO:1,H2SO4:1},         pr:{CuSO4:1,H2O:1}},
 {rg:{CuO:1,HNO3:2},          pr:{'Cu(NO3)2':1,H2O:1}},
 {rg:{Fe2O3:1,HCl:6},         pr:{FeCl3:2,H2O:3}},
 {rg:{Fe2O3:1,H2SO4:3},       pr:{'Fe2(SO4)3':1,H2O:3}},
 {rg:{Fe3O4:1,HCl:8},         pr:{FeCl2:1,FeCl3:2,H2O:4}},
 {rg:{CaO:1,HCl:2},           pr:{CaCl2:1,H2O:1}},
 {rg:{CaO:1,H2SO4:1},         pr:{CaSO4:1,H2O:1}},
 {rg:{Na2O:1,HCl:2},          pr:{NaCl:2,H2O:1}},
 {rg:{Na2O:1,H2SO4:1},        pr:{Na2SO4:1,H2O:1}},
 {rg:{K2O:1,HCl:2},           pr:{KCl:2,H2O:1}},
 {rg:{Al2O3:1,HCl:6},         pr:{AlCl3:2,H2O:3}},
 {rg:{Al2O3:1,H2SO4:3},       pr:{'Al2(SO4)3':1,H2O:3}},

 /* ---------- 8. OXIT BAZƠ TAN + NƯỚC → kiềm ---------- */
 {rg:{CaO:1,H2O:1},           pr:{'Ca(OH)2':1}, exo:1, obs:'Vôi sống tôi trong nước, toả nhiều nhiệt — nước có thể sôi lên.'},
 {rg:{Na2O:1,H2O:1},          pr:{NaOH:2},      exo:1},
 {rg:{K2O:1,H2O:1},           pr:{KOH:2},       exo:1},

 /* ---------- 9. OXIT AXIT + NƯỚC → axit ---------- */
 {rg:{P2O5:1,H2O:3},          pr:{H3PO4:2}},

 /* ---------- 10. OXIT AXIT + KIỀM ---------- */
 {rg:{CO2:1,NaOH:2},          pr:{Na2CO3:1,H2O:1}},
 {rg:{CO2:1,NaOH:1},          pr:{NaHCO3:1}},
 {rg:{CO2:1,KOH:2},           pr:{K2CO3:1,H2O:1}},
 {rg:{CO2:1,'Ca(OH)2':1},     pr:{CaCO3:1,H2O:1}, obs:'Nước vôi trong vẩn đục vì có kết tủa trắng CaCO₃.'},
 {rg:{SO2:1,NaOH:2},          pr:{Na2SO3:1,H2O:1}},
 {rg:{P2O5:1,NaOH:6},         pr:{Na3PO4:2,H2O:3}},
 {rg:{NaHCO3:1,NaOH:1},       pr:{Na2CO3:1,H2O:1}},

 /* ---------- 11. OXIT BAZƠ + OXIT AXIT → muối ---------- */
 {rg:{CaO:1,CO2:1},           pr:{CaCO3:1}},         // vôi sống để lâu hoá đá
 {rg:{Na2O:1,CO2:1},          pr:{Na2CO3:1}},
 {rg:{K2O:1,CO2:1},           pr:{K2CO3:1}},

 /* ---------- 12. MUỐI + AXIT ---------- */
 {rg:{Na2CO3:1,HCl:2},        pr:{NaCl:2,H2O:1,CO2:1}},
 {rg:{Na2CO3:1,H2SO4:1},      pr:{Na2SO4:1,H2O:1,CO2:1}},
 {rg:{Na2CO3:1,HNO3:2},       pr:{NaNO3:2,H2O:1,CO2:1}},
 {rg:{K2CO3:1,HCl:2},         pr:{KCl:2,H2O:1,CO2:1}},
 {rg:{NaHCO3:1,HCl:1},        pr:{NaCl:1,H2O:1,CO2:1}},
 {rg:{NaHCO3:2,H2SO4:1},      pr:{Na2SO4:1,H2O:2,CO2:2}},
 {rg:{CaCO3:1,HCl:2},         pr:{CaCl2:1,H2O:1,CO2:1}, obs:'Đá vôi sủi bọt mạnh — khí CO₂ thoát ra.'},
 {rg:{CaCO3:1,H2SO4:1},       pr:{CaSO4:1,H2O:1,CO2:1}},
 {rg:{BaCO3:1,HCl:2},         pr:{BaCl2:1,H2O:1,CO2:1}},
 {rg:{BaCO3:1,H2SO4:1},       pr:{BaSO4:1,H2O:1,CO2:1}},
 {rg:{Na2SO3:1,HCl:2},        pr:{NaCl:2,H2O:1,SO2:1}},
 {rg:{BaCl2:1,H2SO4:1},       pr:{BaSO4:1,HCl:2}, obs:'Xuất hiện kết tủa trắng BaSO₄ — dấu hiệu nhận ra gốc sunfat.'},
 {rg:{AgNO3:1,HCl:1},         pr:{AgCl:1,HNO3:1}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 // điều chế clo trong phòng thí nghiệm
 {rg:{MnO2:1,HCl:4},          pr:{MnCl2:1,Cl2:1,H2O:2}, heat:1, tag:{HCl:'đặc'}},

 /* ---------- 13. MUỐI + BAZƠ → kết tủa ---------- */
 {rg:{CuSO4:1,NaOH:2},        pr:{'Cu(OH)2':1,Na2SO4:1}, obs:'Xuất hiện kết tủa xanh lam Cu(OH)₂.'},
 {rg:{CuSO4:1,KOH:2},         pr:{'Cu(OH)2':1,K2SO4:1}},
 {rg:{CuCl2:1,NaOH:2},        pr:{'Cu(OH)2':1,NaCl:2}},
 {rg:{CuCl2:1,KOH:2},         pr:{'Cu(OH)2':1,KCl:2}},
 {rg:{'Cu(NO3)2':1,NaOH:2},   pr:{'Cu(OH)2':1,NaNO3:2}},
 {rg:{FeCl3:1,NaOH:3},        pr:{'Fe(OH)3':1,NaCl:3}, obs:'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'},
 {rg:{FeCl3:1,KOH:3},         pr:{'Fe(OH)3':1,KCl:3}},
 {rg:{'Fe2(SO4)3':1,NaOH:6},  pr:{'Fe(OH)3':2,Na2SO4:3}},
 {rg:{FeCl2:1,NaOH:2},        pr:{'Fe(OH)2':1,NaCl:2}},
 {rg:{FeSO4:1,NaOH:2},        pr:{'Fe(OH)2':1,Na2SO4:1}},
 {rg:{MgCl2:1,NaOH:2},        pr:{'Mg(OH)2':1,NaCl:2}},
 {rg:{MgSO4:1,NaOH:2},        pr:{'Mg(OH)2':1,Na2SO4:1}},
 {rg:{AlCl3:1,NaOH:3},        pr:{'Al(OH)3':1,NaCl:3}},
 {rg:{'Al2(SO4)3':1,NaOH:6},  pr:{'Al(OH)3':2,Na2SO4:3}},
 {rg:{ZnCl2:1,NaOH:2},        pr:{'Zn(OH)2':1,NaCl:2}},
 {rg:{ZnSO4:1,NaOH:2},        pr:{'Zn(OH)2':1,Na2SO4:1}},
 {rg:{Na2CO3:1,'Ca(OH)2':1},  pr:{CaCO3:1,NaOH:2}},
 {rg:{NH4Cl:1,NaOH:1},        pr:{NaCl:1,NH3:1,H2O:1}},   // điều chế amoniac

 /* ---------- 14. MUỐI + MUỐI ---------- */
 {rg:{AgNO3:1,NaCl:1},        pr:{AgCl:1,NaNO3:1}, obs:'Hai dung dịch trong suốt đổ vào nhau — kết tủa trắng AgCl.'},
 {rg:{AgNO3:1,KCl:1},         pr:{AgCl:1,KNO3:1}},
 {rg:{AgNO3:2,CuCl2:1},       pr:{AgCl:2,'Cu(NO3)2':1}},
 {rg:{BaCl2:1,Na2SO4:1},      pr:{BaSO4:1,NaCl:2}},
 {rg:{BaCl2:1,K2SO4:1},       pr:{BaSO4:1,KCl:2}},
 {rg:{BaCl2:1,MgSO4:1},       pr:{BaSO4:1,MgCl2:1}},
 {rg:{BaCl2:1,ZnSO4:1},       pr:{BaSO4:1,ZnCl2:1}},
 {rg:{BaCl2:1,FeSO4:1},       pr:{BaSO4:1,FeCl2:1}},
 {rg:{BaCl2:1,CuSO4:1},       pr:{BaSO4:1,CuCl2:1}},
 {rg:{BaCl2:1,Na2CO3:1},      pr:{BaCO3:1,NaCl:2}},
 {rg:{Na2CO3:1,CaCl2:1},      pr:{CaCO3:1,NaCl:2}},
 {rg:{K2CO3:1,CaCl2:1},       pr:{CaCO3:1,KCl:2}},
 {rg:{Na2SO4:1,CaCl2:1},      pr:{CaSO4:1,NaCl:2}},

 /* ---------- 15. NHIỆT PHÂN ---------- */
 {rg:{'Cu(OH)2':1},           pr:{CuO:1,H2O:1},          heat:1, obs:'Kết tủa xanh lam hoá đen khi đun — tạo CuO và hơi nước.'},
 {rg:{'Fe(OH)3':2},           pr:{Fe2O3:1,H2O:3},        heat:1},
 {rg:{'Mg(OH)2':1},           pr:{MgO:1,H2O:1},          heat:1},
 {rg:{'Zn(OH)2':1},           pr:{ZnO:1,H2O:1},          heat:1},
 {rg:{'Al(OH)3':2},           pr:{Al2O3:1,H2O:3},        heat:1},
 {rg:{CaCO3:1},               pr:{CaO:1,CO2:1},          heat:1},
 {rg:{NaHCO3:2},              pr:{Na2CO3:1,H2O:1,CO2:1}, heat:1},
 {rg:{KMnO4:2},               pr:{O2:1,K2MnO4:1,MnO2:1}, heat:1, obs:'Thuốc tím đun nóng giải phóng khí oxi — que đóm còn tàn đỏ bùng cháy.'},

 /* ---------- 16. KHỬ OXIT KIM LOẠI (H₂ hoặc C) ---------- */
 {rg:{CuO:1,H2:1},            pr:{Cu:1,H2O:1},   heat:1, obs:'Bột đen CuO chuyển dần thành đồng màu đỏ gạch, thành ống đọng hơi nước.'},
 {rg:{ZnO:1,H2:1},            pr:{Zn:1,H2O:1},   heat:1},
 {rg:{Fe2O3:1,H2:3},          pr:{Fe:2,H2O:3},   heat:1},
 {rg:{Fe3O4:1,H2:4},          pr:{Fe:3,H2O:4},   heat:1},
 {rg:{CuO:2,C:1},             pr:{Cu:2,CO2:1},   heat:1},
 {rg:{ZnO:2,C:1},             pr:{Zn:2,CO2:1},   heat:1},
 {rg:{Fe2O3:2,C:3},           pr:{Fe:4,CO2:3},   heat:1},
 {rg:{Fe3O4:1,C:2},           pr:{Fe:3,CO2:2},   heat:1},

 /* ---------- 17. HALOGEN ----------
    Kim loại cháy trong lọ khí clo (burn). H₂ + Cl₂ là hai khí → trộn trong cốc, châm lửa. */
 {rg:{Na:2,Cl2:1},            pr:{NaCl:2},   burn:1, exo:1, obs:'Natri cháy sáng trong clo, tạo khói trắng là muối ăn NaCl.'},
 {rg:{K:2,Cl2:1},             pr:{KCl:2},    burn:1, exo:1, obs:'Kali cháy mãnh liệt trong clo, tạo khói trắng KCl.'},
 {rg:{Mg:1,Cl2:1},            pr:{MgCl2:1},  burn:1, exo:1, obs:'Magie cháy sáng trong clo, tạo khói trắng MgCl₂.'},
 {rg:{Zn:1,Cl2:1},            pr:{ZnCl2:1},  burn:1, exo:1, obs:'Kẽm cháy trong clo, tạo khói trắng ZnCl₂.'},
 {rg:{Al:2,Cl2:3},            pr:{AlCl3:2},  burn:1, exo:1, obs:'Nhôm cháy sáng trong clo, tạo khói trắng AlCl₃.'},
 {rg:{Fe:2,Cl2:3},            pr:{FeCl3:2},  burn:1, exo:1, obs:'Sắt cháy sáng trong clo, tạo khói màu nâu đỏ FeCl₃.'},
 {rg:{Cu:1,Cl2:1},            pr:{CuCl2:1},  burn:1, obs:'Dây đồng nóng đỏ cháy trong clo, tạo khói màu nâu vàng CuCl₂.'},
 {rg:{H2:1,Cl2:1},            pr:{HCl:2},    heat:1, obs:'Hỗn hợp hiđro và clo gặp lửa thì nổ, khí HCl tan vào nước thành axit.'},

 /* ---------- 18. NITƠ ---------- */
 {rg:{N2:1,H2:3},             pr:{NH3:2},    heat:1, cond:'xt, p', rev:1},
 {rg:{NH3:1,HCl:1},           pr:{NH4Cl:1}, obs:'Hai khí gặp nhau tạo khói trắng NH₄Cl.'},

 /* ---------- 19. ĐƯỜNG GẶP AXIT SUNFURIC ĐẶC ----------
    H₂SO₄ đặc chỉ rút nước chứ không tham gia — SGK ghi nó TRÊN mũi tên.
    Dùng cat: phải có mặt mới chạy, nhưng không bị tiêu hao (nên vẫn cân bằng).  */
 {rg:{C12H22O11:1},           pr:{C:12,H2O:11}, cat:['H2SO4'], tag:{H2SO4:'đặc'}, obs:'Đường hoá đen, cột than xốp trào lên, bốc hơi nóng.'},

 /* ---------- 20. ĐIỆN PHÂN ----------
    vent = khí sinh ra ở cực còn lại; game chỉ có MỘT bình nên chỉ hứng được
    một loại khí, khí kia coi như thoát ra ngoài.                            */
 {rg:{H2O:2},                 pr:{H2:2,O2:1},              elec:1, vent:['O2'], last:1, obs:'Hai điện cực sủi bọt: khí H₂ ở cực âm nhiều gấp đôi khí O₂ ở cực dương.'},
 {rg:{CuCl2:1},               pr:{Cu:1,Cl2:1},             elec:1, obs:'Cực âm phủ lớp đồng đỏ, cực dương sủi bọt khí clo mùi hắc.'},
 {rg:{CuSO4:2,H2O:2},         pr:{Cu:2,O2:1,H2SO4:2},      elec:1, vent:['O2']},
 {rg:{NaCl:2,H2O:2},          pr:{NaOH:2,H2:1,Cl2:1},      elec:1, cond:'có màng ngăn', vent:['H2']},

 /* ---------- 21. NƯỚC VÔI Ca(OH)₂ GẶP AXIT VÀ MUỐI ----------
    Ca(OH)₂ cũng là bazơ tan (ít tan): làm được mọi việc NaOH làm với muối có hiđroxit kết tủa.
    CaSO₄ ít tan nên game coi là kết tủa (như H₂SO₄ + Ca(OH)₂ ở nhóm 1).  */
 {rg:{HNO3:2,'Ca(OH)2':1},    pr:{'Ca(NO3)2':1,H2O:2}},
 {rg:{CuSO4:1,'Ca(OH)2':1},   pr:{'Cu(OH)2':1,CaSO4:1}, obs:'Kết tủa xanh lam Cu(OH)₂ lẫn kết tủa trắng CaSO₄.'},
 {rg:{CuCl2:1,'Ca(OH)2':1},   pr:{'Cu(OH)2':1,CaCl2:1}, obs:'Xuất hiện kết tủa xanh lam Cu(OH)₂.'},
 {rg:{'Cu(NO3)2':1,'Ca(OH)2':1}, pr:{'Cu(OH)2':1,'Ca(NO3)2':1}},
 {rg:{FeCl3:2,'Ca(OH)2':3},   pr:{'Fe(OH)3':2,CaCl2:3}, obs:'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'},
 {rg:{'Fe2(SO4)3':1,'Ca(OH)2':3}, pr:{'Fe(OH)3':2,CaSO4:3}},
 {rg:{FeCl2:1,'Ca(OH)2':1},   pr:{'Fe(OH)2':1,CaCl2:1}, obs:'Kết tủa trắng xanh Fe(OH)₂, để lâu ngoài không khí hoá nâu đỏ.'},
 {rg:{FeSO4:1,'Ca(OH)2':1},   pr:{'Fe(OH)2':1,CaSO4:1}},
 {rg:{MgCl2:1,'Ca(OH)2':1},   pr:{'Mg(OH)2':1,CaCl2:1}, obs:'Kết tủa trắng Mg(OH)₂ — cách lấy magie từ nước biển.'},
 {rg:{MgSO4:1,'Ca(OH)2':1},   pr:{'Mg(OH)2':1,CaSO4:1}},
 {rg:{AlCl3:2,'Ca(OH)2':3},   pr:{'Al(OH)3':2,CaCl2:3}, obs:'Kết tủa keo trắng Al(OH)₃.'},
 {rg:{'Al2(SO4)3':1,'Ca(OH)2':3}, pr:{'Al(OH)3':2,CaSO4:3}},
 {rg:{ZnCl2:1,'Ca(OH)2':1},   pr:{'Zn(OH)2':1,CaCl2:1}},
 {rg:{ZnSO4:1,'Ca(OH)2':1},   pr:{'Zn(OH)2':1,CaSO4:1}},
 {rg:{K2CO3:1,'Ca(OH)2':1},   pr:{CaCO3:1,KOH:2}, obs:'Kết tủa trắng CaCO₃, dung dịch còn lại là kiềm KOH.'},
 {rg:{NH4Cl:2,'Ca(OH)2':1},   pr:{CaCl2:1,NH3:2,H2O:2}, heat:1, obs:'Khí NH₃ mùi khai bay ra — cách điều chế amoniac trong phòng thí nghiệm.'},

 /* Từ đây trở xuống: phản ứng bổ sung sau khi rà MỌI cặp chất theo quy tắc SGK lớp 8–9 (trao đổi ion khi có kết tủa /
    khí / nước, dãy hoạt động kim loại, oxit với nước / axit / bazơ, nhiệt phân). Chủ yếu gặp ở ca tự do. */
 /* ---------- 22. AXIT + OXIT BAZƠ, BAZƠ, MUỐI (MỞ RỘNG) ---------- */
 {rg:{Ag2O:1,HCl:2}, pr:{AgCl:2,H2O:1}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{HCl:2,K2SO3:1}, pr:{SO2:1,H2O:1,KCl:2}, obs:'Sủi bọt khí SO₂.'},
 {rg:{HCl:2,MgCO3:1}, pr:{CO2:1,H2O:1,MgCl2:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HCl:2,ZnCO3:1}, pr:{CO2:1,H2O:1,ZnCl2:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HCl:2,FeCO3:1}, pr:{CO2:1,H2O:1,FeCl2:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HCl:2,Ag2CO3:1}, pr:{CO2:1,H2O:1,AgCl:2}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa trắng AgCl.'},
 {rg:{HCl:2,MnCO3:1}, pr:{CO2:1,H2O:1,MnCl2:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HCl:2,'Mn(OH)2':1}, pr:{H2O:2,MnCl2:1}},
 {rg:{HCl:2,CaSO3:1}, pr:{SO2:1,H2O:1,CaCl2:1}, obs:'Sủi bọt khí SO₂.'},
 {rg:{HCl:2,BaSO3:1}, pr:{SO2:1,H2O:1,BaCl2:1}, obs:'Sủi bọt khí SO₂.'},
 {rg:{NH3:2,H2SO4:1}, pr:{'(NH4)2SO4':1}},
 {rg:{K2O:1,H2SO4:1}, pr:{K2SO4:1,H2O:1}},
 {rg:{H2SO4:1,K2CO3:1}, pr:{CO2:1,H2O:1,K2SO4:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{H2SO4:1,Na2SO3:1}, pr:{SO2:1,H2O:1,Na2SO4:1}, obs:'Sủi bọt khí SO₂.'},
 {rg:{H2SO4:1,'Ba(NO3)2':1}, pr:{HNO3:2,BaSO4:1}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{H2SO4:1,K2SO3:1}, pr:{SO2:1,H2O:1,K2SO4:1}, obs:'Sủi bọt khí SO₂.'},
 {rg:{H2SO4:1,MgCO3:1}, pr:{CO2:1,H2O:1,MgSO4:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{H2SO4:1,ZnCO3:1}, pr:{CO2:1,H2O:1,ZnSO4:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{H2SO4:1,FeCO3:1}, pr:{CO2:1,H2O:1,FeSO4:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{H2SO4:1,CaSO3:1}, pr:{SO2:1,H2O:1,CaSO4:1}, obs:'Sủi bọt khí SO₂, xuất hiện kết tủa CaSO₄.'},
 {rg:{H2SO4:1,BaSO3:1}, pr:{SO2:1,H2O:1,BaSO4:1}, obs:'Sủi bọt khí SO₂, xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{HNO3:1,NaHCO3:1}, pr:{CO2:1,H2O:1,NaNO3:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HNO3:2,CaCO3:1}, pr:{CO2:1,H2O:1,'Ca(NO3)2':1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HNO3:2,BaCO3:1}, pr:{CO2:1,H2O:1,'Ba(NO3)2':1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{MgO:1,HNO3:2}, pr:{'Mg(NO3)2':1,H2O:1}},
 {rg:{ZnO:1,HNO3:2}, pr:{'Zn(NO3)2':1,H2O:1}},
 {rg:{Fe2O3:1,HNO3:6}, pr:{'Fe(NO3)3':2,H2O:3}},
 {rg:{CaO:1,HNO3:2}, pr:{'Ca(NO3)2':1,H2O:1}},
 {rg:{Na2O:1,HNO3:2}, pr:{NaNO3:2,H2O:1}},
 {rg:{HNO3:2,'Cu(OH)2':1}, pr:{H2O:2,'Cu(NO3)2':1}},
 {rg:{HNO3:3,'Fe(OH)3':1}, pr:{H2O:3,'Fe(NO3)3':1}},
 {rg:{NH3:1,HNO3:1}, pr:{NH4NO3:1}},
 {rg:{K2O:1,HNO3:2}, pr:{KNO3:2,H2O:1}},
 {rg:{HNO3:2,K2CO3:1}, pr:{CO2:1,H2O:1,KNO3:2}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HNO3:2,Na2SO3:1}, pr:{SO2:1,H2O:1,NaNO3:2}, obs:'Sủi bọt khí SO₂.'},
 {rg:{Al2O3:1,HNO3:6}, pr:{'Al(NO3)3':2,H2O:3}},
 {rg:{HNO3:3,'Al(OH)3':1}, pr:{H2O:3,'Al(NO3)3':1}},
 {rg:{HNO3:2,'Mg(OH)2':1}, pr:{H2O:2,'Mg(NO3)2':1}},
 {rg:{HNO3:2,'Zn(OH)2':1}, pr:{H2O:2,'Zn(NO3)2':1}},
 {rg:{Ag2O:1,HNO3:2}, pr:{AgNO3:2,H2O:1}},
 {rg:{HNO3:2,K2SO3:1}, pr:{SO2:1,H2O:1,KNO3:2}, obs:'Sủi bọt khí SO₂.'},
 {rg:{HNO3:2,MgCO3:1}, pr:{CO2:1,H2O:1,'Mg(NO3)2':1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HNO3:2,ZnCO3:1}, pr:{CO2:1,H2O:1,'Zn(NO3)2':1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HNO3:2,Ag2CO3:1}, pr:{CO2:1,H2O:1,AgNO3:2}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HNO3:2,MnCO3:1}, pr:{CO2:1,H2O:1,'Mn(NO3)2':1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{HNO3:2,'Mn(OH)2':1}, pr:{H2O:2,'Mn(NO3)2':1}},
 {rg:{HNO3:2,CaSO3:1}, pr:{SO2:1,H2O:1,'Ca(NO3)2':1}, obs:'Sủi bọt khí SO₂.'},
 {rg:{HNO3:2,BaSO3:1}, pr:{SO2:1,H2O:1,'Ba(NO3)2':1}, obs:'Sủi bọt khí SO₂.'},
 {rg:{H3PO4:1,KOH:3}, pr:{H2O:3,K3PO4:1}},
 {rg:{H3PO4:2,'Ca(OH)2':3}, pr:{H2O:6,'Ca3(PO4)2':1}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{H3PO4:2,Na2CO3:3}, pr:{CO2:3,H2O:3,Na3PO4:2}, obs:'Sủi bọt khí CO₂.'},
 {rg:{H3PO4:1,NaHCO3:3}, pr:{CO2:3,H2O:3,Na3PO4:1}, obs:'Sủi bọt khí CO₂.'},
 {rg:{H3PO4:2,CaCO3:3}, pr:{CO2:3,H2O:3,'Ca3(PO4)2':1}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{H3PO4:2,BaCO3:3}, pr:{CO2:3,H2O:3,'Ba3(PO4)2':1}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa trắng Ba₃(PO₄)₂.'},
 {rg:{MgO:3,H3PO4:2}, pr:{'Mg3(PO4)2':1,H2O:3}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{CuO:3,H3PO4:2}, pr:{'Cu3(PO4)2':1,H2O:3}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{ZnO:3,H3PO4:2}, pr:{'Zn3(PO4)2':1,H2O:3}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{Fe2O3:1,H3PO4:2}, pr:{FePO4:2,H2O:3}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{CaO:3,H3PO4:2}, pr:{'Ca3(PO4)2':1,H2O:3}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{Na2O:3,H3PO4:2}, pr:{Na3PO4:2,H2O:3}},
 {rg:{H3PO4:2,'Cu(OH)2':3}, pr:{H2O:6,'Cu3(PO4)2':1}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{H3PO4:1,'Fe(OH)3':1}, pr:{H2O:3,FePO4:1}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{H3PO4:2,'Fe(OH)2':3}, pr:{H2O:6,'Fe3(PO4)2':1}, obs:'Xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{K2O:3,H3PO4:2}, pr:{K3PO4:2,H2O:3}},
 {rg:{H3PO4:2,K2CO3:3}, pr:{CO2:3,H2O:3,K3PO4:2}, obs:'Sủi bọt khí CO₂.'},
 {rg:{H3PO4:2,Na2SO3:3}, pr:{SO2:3,H2O:3,Na3PO4:2}, obs:'Sủi bọt khí SO₂.'},
 {rg:{Al2O3:1,H3PO4:2}, pr:{AlPO4:2,H2O:3}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{H3PO4:1,'Al(OH)3':1}, pr:{H2O:3,AlPO4:1}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{H3PO4:2,'Mg(OH)2':3}, pr:{H2O:6,'Mg3(PO4)2':1}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{H3PO4:2,'Zn(OH)2':3}, pr:{H2O:6,'Zn3(PO4)2':1}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{Ag2O:3,H3PO4:2}, pr:{Ag3PO4:2,H2O:3}, obs:'Xuất hiện kết tủa vàng Ag₃PO₄.'},
 {rg:{H3PO4:2,K2SO3:3}, pr:{SO2:3,H2O:3,K3PO4:2}, obs:'Sủi bọt khí SO₂.'},
 {rg:{H3PO4:2,MgCO3:3}, pr:{CO2:3,H2O:3,'Mg3(PO4)2':1}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{H3PO4:2,ZnCO3:3}, pr:{CO2:3,H2O:3,'Zn3(PO4)2':1}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{H3PO4:2,FeCO3:3}, pr:{CO2:3,H2O:3,'Fe3(PO4)2':1}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{H3PO4:2,Ag2CO3:3}, pr:{CO2:3,H2O:3,Ag3PO4:2}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa vàng Ag₃PO₄.'},
 {rg:{H3PO4:2,MnCO3:3}, pr:{CO2:3,H2O:3,'Mn3(PO4)2':1}, obs:'Sủi bọt khí CO₂, xuất hiện kết tủa Mn₃(PO₄)₂.'},
 {rg:{H3PO4:2,'Mn(OH)2':3}, pr:{H2O:6,'Mn3(PO4)2':1}, obs:'Xuất hiện kết tủa Mn₃(PO₄)₂.'},
 {rg:{H3PO4:2,CaSO3:3}, pr:{SO2:3,H2O:3,'Ca3(PO4)2':1}, obs:'Sủi bọt khí SO₂, xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{H3PO4:2,BaSO3:3}, pr:{SO2:3,H2O:3,'Ba3(PO4)2':1}, obs:'Sủi bọt khí SO₂, xuất hiện kết tủa trắng Ba₃(PO₄)₂.'},

 /* ---------- 23. KIỀM + MUỐI (MỞ RỘNG) ---------- */
 {rg:{NaOH:2,AgNO3:2}, pr:{NaNO3:2,Ag2O:1,H2O:1}, obs:'Xuất hiện kết tủa nâu đen Ag₂O.'},
 {rg:{NaOH:2,MnCl2:1}, pr:{NaCl:2,'Mn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mn(OH)₂.'},
 {rg:{NaOH:2,'Mg(NO3)2':1}, pr:{NaNO3:2,'Mg(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mg(OH)₂.'},
 {rg:{NaOH:2,'Zn(NO3)2':1}, pr:{NaNO3:2,'Zn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Zn(OH)₂.'},
 {rg:{NaOH:2,'Fe(NO3)2':1}, pr:{NaNO3:2,'Fe(OH)2':1}, obs:'Xuất hiện kết tủa trắng xanh Fe(OH)₂.'},
 {rg:{NaOH:3,'Fe(NO3)3':1}, pr:{NaNO3:3,'Fe(OH)3':1}, obs:'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'},
 {rg:{NaOH:3,'Al(NO3)3':1}, pr:{NaNO3:3,'Al(OH)3':1}, obs:'Xuất hiện kết tủa keo trắng Al(OH)₃.'},
 {rg:{NaOH:2,'Mn(NO3)2':1}, pr:{NaNO3:2,'Mn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mn(OH)₂.'},
 {rg:{NaOH:1,NH4NO3:1}, pr:{NaNO3:1,NH3:1,H2O:1}, obs:'Có khí NH₃ mùi khai bay ra.'},
 {rg:{NaOH:2,'(NH4)2SO4':1}, pr:{Na2SO4:1,NH3:2,H2O:2}, obs:'Có khí NH₃ mùi khai bay ra.'},
 {rg:{KOH:2,MgCl2:1}, pr:{KCl:2,'Mg(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mg(OH)₂.'},
 {rg:{KOH:3,AlCl3:1}, pr:{KCl:3,'Al(OH)3':1}, obs:'Xuất hiện kết tủa keo trắng Al(OH)₃.'},
 {rg:{KOH:2,ZnCl2:1}, pr:{KCl:2,'Zn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Zn(OH)₂.'},
 {rg:{KOH:2,FeCl2:1}, pr:{KCl:2,'Fe(OH)2':1}, obs:'Xuất hiện kết tủa trắng xanh Fe(OH)₂.'},
 {rg:{KOH:2,MgSO4:1}, pr:{K2SO4:1,'Mg(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mg(OH)₂.'},
 {rg:{KOH:2,ZnSO4:1}, pr:{K2SO4:1,'Zn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Zn(OH)₂.'},
 {rg:{KOH:2,FeSO4:1}, pr:{K2SO4:1,'Fe(OH)2':1}, obs:'Xuất hiện kết tủa trắng xanh Fe(OH)₂.'},
 {rg:{KOH:2,AgNO3:2}, pr:{KNO3:2,Ag2O:1,H2O:1}, obs:'Xuất hiện kết tủa nâu đen Ag₂O.'},
 {rg:{KOH:2,'Cu(NO3)2':1}, pr:{KNO3:2,'Cu(OH)2':1}, obs:'Xuất hiện kết tủa xanh lam Cu(OH)₂.'},
 {rg:{KOH:1,NH4Cl:1}, pr:{KCl:1,NH3:1,H2O:1}, obs:'Có khí NH₃ mùi khai bay ra.'},
 {rg:{KOH:2,MnCl2:1}, pr:{KCl:2,'Mn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mn(OH)₂.'},
 {rg:{KOH:6,'Al2(SO4)3':1}, pr:{K2SO4:3,'Al(OH)3':2}, obs:'Xuất hiện kết tủa keo trắng Al(OH)₃.'},
 {rg:{KOH:6,'Fe2(SO4)3':1}, pr:{K2SO4:3,'Fe(OH)3':2}, obs:'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'},
 {rg:{KOH:2,'Mg(NO3)2':1}, pr:{KNO3:2,'Mg(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mg(OH)₂.'},
 {rg:{KOH:2,'Zn(NO3)2':1}, pr:{KNO3:2,'Zn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Zn(OH)₂.'},
 {rg:{KOH:2,'Fe(NO3)2':1}, pr:{KNO3:2,'Fe(OH)2':1}, obs:'Xuất hiện kết tủa trắng xanh Fe(OH)₂.'},
 {rg:{KOH:3,'Fe(NO3)3':1}, pr:{KNO3:3,'Fe(OH)3':1}, obs:'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'},
 {rg:{KOH:3,'Al(NO3)3':1}, pr:{KNO3:3,'Al(OH)3':1}, obs:'Xuất hiện kết tủa keo trắng Al(OH)₃.'},
 {rg:{KOH:2,'Mn(NO3)2':1}, pr:{KNO3:2,'Mn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mn(OH)₂.'},
 {rg:{KOH:1,NH4NO3:1}, pr:{KNO3:1,NH3:1,H2O:1}, obs:'Có khí NH₃ mùi khai bay ra.'},
 {rg:{KOH:2,'(NH4)2SO4':1}, pr:{K2SO4:1,NH3:2,H2O:2}, obs:'Có khí NH₃ mùi khai bay ra.'},
 {rg:{'Ca(OH)2':1,AgNO3:2}, pr:{'Ca(NO3)2':1,Ag2O:1,H2O:1}, obs:'Xuất hiện kết tủa nâu đen Ag₂O.'},
 {rg:{'Ca(OH)2':1,MnCl2:1}, pr:{CaCl2:1,'Mn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mn(OH)₂.'},
 {rg:{'Ca(OH)2':1,Na2SO3:1}, pr:{CaSO3:1,NaOH:2}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},
 {rg:{'Ca(OH)2':3,Na3PO4:2}, pr:{'Ca3(PO4)2':1,NaOH:6}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{'Ca(OH)2':1,'Mg(NO3)2':1}, pr:{'Ca(NO3)2':1,'Mg(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mg(OH)₂.'},
 {rg:{'Ca(OH)2':1,'Zn(NO3)2':1}, pr:{'Ca(NO3)2':1,'Zn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Zn(OH)₂.'},
 {rg:{'Ca(OH)2':1,'Fe(NO3)2':1}, pr:{'Ca(NO3)2':1,'Fe(OH)2':1}, obs:'Xuất hiện kết tủa trắng xanh Fe(OH)₂.'},
 {rg:{'Ca(OH)2':3,'Fe(NO3)3':2}, pr:{'Ca(NO3)2':3,'Fe(OH)3':2}, obs:'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'},
 {rg:{'Ca(OH)2':3,'Al(NO3)3':2}, pr:{'Ca(NO3)2':3,'Al(OH)3':2}, obs:'Xuất hiện kết tủa keo trắng Al(OH)₃.'},
 {rg:{'Ca(OH)2':1,'Mn(NO3)2':1}, pr:{'Ca(NO3)2':1,'Mn(OH)2':1}, obs:'Xuất hiện kết tủa trắng Mn(OH)₂.'},
 {rg:{'Ca(OH)2':1,NH4NO3:2}, pr:{'Ca(NO3)2':1,NH3:2,H2O:2}, obs:'Có khí NH₃ mùi khai bay ra.'},
 {rg:{'Ca(OH)2':1,'(NH4)2SO4':1}, pr:{CaSO4:1,NH3:2,H2O:2}, obs:'Xuất hiện kết tủa CaSO₄; Có khí NH₃ mùi khai bay ra.'},
 {rg:{'Ca(OH)2':3,K3PO4:2}, pr:{'Ca3(PO4)2':1,KOH:6}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{'Ca(OH)2':1,K2SO3:1}, pr:{CaSO3:1,KOH:2}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},

 /* ---------- 24. MUỐI + MUỐI (MỞ RỘNG) ---------- */
 {rg:{CaCl2:1,AgNO3:2}, pr:{'Ca(NO3)2':1,AgCl:2}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{CaCl2:1,Na2SO3:1}, pr:{CaSO3:1,NaCl:2}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},
 {rg:{CaCl2:3,Na3PO4:2}, pr:{'Ca3(PO4)2':1,NaCl:6}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{CaCl2:3,K3PO4:2}, pr:{'Ca3(PO4)2':1,KCl:6}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{CaCl2:1,K2SO3:1}, pr:{CaSO3:1,KCl:2}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},
 {rg:{'Ca(NO3)2':1,Na2CO3:1}, pr:{CaCO3:1,NaNO3:2}, obs:'Xuất hiện kết tủa CaCO₃.'},
 {rg:{'Ca(NO3)2':1,K2CO3:1}, pr:{CaCO3:1,KNO3:2}, obs:'Xuất hiện kết tủa CaCO₃.'},
 {rg:{'Ca(NO3)2':1,Na2SO3:1}, pr:{CaSO3:1,NaNO3:2}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},
 {rg:{'Ca(NO3)2':3,Na3PO4:2}, pr:{'Ca3(PO4)2':1,NaNO3:6}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{'Ca(NO3)2':3,K3PO4:2}, pr:{'Ca3(PO4)2':1,KNO3:6}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{'Ca(NO3)2':1,K2SO3:1}, pr:{CaSO3:1,KNO3:2}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},
 {rg:{MgCl2:1,AgNO3:2}, pr:{'Mg(NO3)2':1,AgCl:2}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{MgCl2:1,Na2CO3:1}, pr:{MgCO3:1,NaCl:2}, obs:'Xuất hiện kết tủa trắng MgCO₃.'},
 {rg:{MgCl2:1,K2CO3:1}, pr:{MgCO3:1,KCl:2}, obs:'Xuất hiện kết tủa trắng MgCO₃.'},
 {rg:{MgCl2:3,Na3PO4:2}, pr:{'Mg3(PO4)2':1,NaCl:6}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{MgCl2:3,K3PO4:2}, pr:{'Mg3(PO4)2':1,KCl:6}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{AlCl3:1,AgNO3:3}, pr:{'Al(NO3)3':1,AgCl:3}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{AlCl3:1,Na3PO4:1}, pr:{AlPO4:1,NaCl:3}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{AlCl3:1,K3PO4:1}, pr:{AlPO4:1,KCl:3}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{ZnCl2:1,AgNO3:2}, pr:{'Zn(NO3)2':1,AgCl:2}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{ZnCl2:1,Na2CO3:1}, pr:{ZnCO3:1,NaCl:2}, obs:'Xuất hiện kết tủa trắng ZnCO₃.'},
 {rg:{ZnCl2:1,K2CO3:1}, pr:{ZnCO3:1,KCl:2}, obs:'Xuất hiện kết tủa trắng ZnCO₃.'},
 {rg:{ZnCl2:3,Na3PO4:2}, pr:{'Zn3(PO4)2':1,NaCl:6}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{ZnCl2:3,K3PO4:2}, pr:{'Zn3(PO4)2':1,KCl:6}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{FeCl2:1,AgNO3:2}, pr:{'Fe(NO3)2':1,AgCl:2}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{FeCl2:1,Na2CO3:1}, pr:{FeCO3:1,NaCl:2}, obs:'Xuất hiện kết tủa FeCO₃.'},
 {rg:{FeCl2:1,K2CO3:1}, pr:{FeCO3:1,KCl:2}, obs:'Xuất hiện kết tủa FeCO₃.'},
 {rg:{FeCl2:3,Na3PO4:2}, pr:{'Fe3(PO4)2':1,NaCl:6}, obs:'Xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{FeCl2:3,K3PO4:2}, pr:{'Fe3(PO4)2':1,KCl:6}, obs:'Xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{FeCl3:1,AgNO3:3}, pr:{'Fe(NO3)3':1,AgCl:3}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{FeCl3:1,Na3PO4:1}, pr:{FePO4:1,NaCl:3}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{FeCl3:1,K3PO4:1}, pr:{FePO4:1,KCl:3}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{CuCl2:3,Na3PO4:2}, pr:{'Cu3(PO4)2':1,NaCl:6}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{CuCl2:3,K3PO4:2}, pr:{'Cu3(PO4)2':1,KCl:6}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{BaCl2:1,AgNO3:2}, pr:{'Ba(NO3)2':1,AgCl:2}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{BaCl2:1,K2CO3:1}, pr:{BaCO3:1,KCl:2}, obs:'Xuất hiện kết tủa trắng BaCO₃.'},
 {rg:{BaCl2:1,Na2SO3:1}, pr:{BaSO3:1,NaCl:2}, obs:'Xuất hiện kết tủa trắng BaSO₃.'},
 {rg:{BaCl2:3,Na3PO4:2}, pr:{'Ba3(PO4)2':1,NaCl:6}, obs:'Xuất hiện kết tủa trắng Ba₃(PO₄)₂.'},
 {rg:{BaCl2:3,'Al2(SO4)3':1}, pr:{BaSO4:3,AlCl3:2}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{BaCl2:3,'Fe2(SO4)3':1}, pr:{BaSO4:3,FeCl3:2}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{BaCl2:1,'(NH4)2SO4':1}, pr:{BaSO4:1,NH4Cl:2}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{BaCl2:3,K3PO4:2}, pr:{'Ba3(PO4)2':1,KCl:6}, obs:'Xuất hiện kết tủa trắng Ba₃(PO₄)₂.'},
 {rg:{BaCl2:1,K2SO3:1}, pr:{BaSO3:1,KCl:2}, obs:'Xuất hiện kết tủa trắng BaSO₃.'},
 {rg:{Na2SO4:1,'Ba(NO3)2':1}, pr:{NaNO3:2,BaSO4:1}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{K2SO4:1,'Ba(NO3)2':1}, pr:{KNO3:2,BaSO4:1}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{MgSO4:1,Na2CO3:1}, pr:{MgCO3:1,Na2SO4:1}, obs:'Xuất hiện kết tủa trắng MgCO₃.'},
 {rg:{MgSO4:1,K2CO3:1}, pr:{MgCO3:1,K2SO4:1}, obs:'Xuất hiện kết tủa trắng MgCO₃.'},
 {rg:{MgSO4:3,Na3PO4:2}, pr:{'Mg3(PO4)2':1,Na2SO4:3}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{MgSO4:1,'Ba(NO3)2':1}, pr:{'Mg(NO3)2':1,BaSO4:1}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{MgSO4:3,K3PO4:2}, pr:{'Mg3(PO4)2':1,K2SO4:3}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{ZnSO4:1,Na2CO3:1}, pr:{ZnCO3:1,Na2SO4:1}, obs:'Xuất hiện kết tủa trắng ZnCO₃.'},
 {rg:{ZnSO4:1,K2CO3:1}, pr:{ZnCO3:1,K2SO4:1}, obs:'Xuất hiện kết tủa trắng ZnCO₃.'},
 {rg:{ZnSO4:3,Na3PO4:2}, pr:{'Zn3(PO4)2':1,Na2SO4:3}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{ZnSO4:1,'Ba(NO3)2':1}, pr:{'Zn(NO3)2':1,BaSO4:1}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{ZnSO4:3,K3PO4:2}, pr:{'Zn3(PO4)2':1,K2SO4:3}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{FeSO4:1,Na2CO3:1}, pr:{FeCO3:1,Na2SO4:1}, obs:'Xuất hiện kết tủa FeCO₃.'},
 {rg:{FeSO4:1,K2CO3:1}, pr:{FeCO3:1,K2SO4:1}, obs:'Xuất hiện kết tủa FeCO₃.'},
 {rg:{FeSO4:3,Na3PO4:2}, pr:{'Fe3(PO4)2':1,Na2SO4:3}, obs:'Xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{FeSO4:1,'Ba(NO3)2':1}, pr:{'Fe(NO3)2':1,BaSO4:1}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{FeSO4:3,K3PO4:2}, pr:{'Fe3(PO4)2':1,K2SO4:3}, obs:'Xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{CuSO4:3,Na3PO4:2}, pr:{'Cu3(PO4)2':1,Na2SO4:3}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{CuSO4:1,'Ba(NO3)2':1}, pr:{'Cu(NO3)2':1,BaSO4:1}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{CuSO4:3,K3PO4:2}, pr:{'Cu3(PO4)2':1,K2SO4:3}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{AgNO3:2,Na2CO3:1}, pr:{Ag2CO3:1,NaNO3:2}, obs:'Xuất hiện kết tủa vàng nhạt Ag₂CO₃.'},
 {rg:{AgNO3:1,NH4Cl:1}, pr:{AgCl:1,NH4NO3:1}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{AgNO3:2,MnCl2:1}, pr:{AgCl:2,'Mn(NO3)2':1}, obs:'Xuất hiện kết tủa trắng AgCl.'},
 {rg:{AgNO3:2,K2CO3:1}, pr:{Ag2CO3:1,KNO3:2}, obs:'Xuất hiện kết tủa vàng nhạt Ag₂CO₃.'},
 {rg:{AgNO3:3,Na3PO4:1}, pr:{Ag3PO4:1,NaNO3:3}, obs:'Xuất hiện kết tủa vàng Ag₃PO₄.'},
 {rg:{AgNO3:3,K3PO4:1}, pr:{Ag3PO4:1,KNO3:3}, obs:'Xuất hiện kết tủa vàng Ag₃PO₄.'},
 {rg:{'Cu(NO3)2':3,Na3PO4:2}, pr:{'Cu3(PO4)2':1,NaNO3:6}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{'Cu(NO3)2':3,K3PO4:2}, pr:{'Cu3(PO4)2':1,KNO3:6}, obs:'Xuất hiện kết tủa xanh lam Cu₃(PO₄)₂.'},
 {rg:{Na2CO3:1,MnCl2:1}, pr:{NaCl:2,MnCO3:1}, obs:'Xuất hiện kết tủa MnCO₃.'},
 {rg:{Na2CO3:1,'Mg(NO3)2':1}, pr:{NaNO3:2,MgCO3:1}, obs:'Xuất hiện kết tủa trắng MgCO₃.'},
 {rg:{Na2CO3:1,'Zn(NO3)2':1}, pr:{NaNO3:2,ZnCO3:1}, obs:'Xuất hiện kết tủa trắng ZnCO₃.'},
 {rg:{Na2CO3:1,'Fe(NO3)2':1}, pr:{NaNO3:2,FeCO3:1}, obs:'Xuất hiện kết tủa FeCO₃.'},
 {rg:{Na2CO3:1,'Ba(NO3)2':1}, pr:{NaNO3:2,BaCO3:1}, obs:'Xuất hiện kết tủa trắng BaCO₃.'},
 {rg:{Na2CO3:1,'Mn(NO3)2':1}, pr:{NaNO3:2,MnCO3:1}, obs:'Xuất hiện kết tủa MnCO₃.'},
 {rg:{MnCl2:1,K2CO3:1}, pr:{MnCO3:1,KCl:2}, obs:'Xuất hiện kết tủa MnCO₃.'},
 {rg:{MnCl2:3,Na3PO4:2}, pr:{'Mn3(PO4)2':1,NaCl:6}, obs:'Xuất hiện kết tủa Mn₃(PO₄)₂.'},
 {rg:{MnCl2:3,K3PO4:2}, pr:{'Mn3(PO4)2':1,KCl:6}, obs:'Xuất hiện kết tủa Mn₃(PO₄)₂.'},
 {rg:{K2CO3:1,'Mg(NO3)2':1}, pr:{KNO3:2,MgCO3:1}, obs:'Xuất hiện kết tủa trắng MgCO₃.'},
 {rg:{K2CO3:1,'Zn(NO3)2':1}, pr:{KNO3:2,ZnCO3:1}, obs:'Xuất hiện kết tủa trắng ZnCO₃.'},
 {rg:{K2CO3:1,'Fe(NO3)2':1}, pr:{KNO3:2,FeCO3:1}, obs:'Xuất hiện kết tủa FeCO₃.'},
 {rg:{K2CO3:1,'Ba(NO3)2':1}, pr:{KNO3:2,BaCO3:1}, obs:'Xuất hiện kết tủa trắng BaCO₃.'},
 {rg:{K2CO3:1,'Mn(NO3)2':1}, pr:{KNO3:2,MnCO3:1}, obs:'Xuất hiện kết tủa MnCO₃.'},
 {rg:{Na2SO3:1,'Ba(NO3)2':1}, pr:{NaNO3:2,BaSO3:1}, obs:'Xuất hiện kết tủa trắng BaSO₃.'},
 {rg:{Na3PO4:2,'Al2(SO4)3':1}, pr:{Na2SO4:3,AlPO4:2}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{Na3PO4:2,'Fe2(SO4)3':1}, pr:{Na2SO4:3,FePO4:2}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{Na3PO4:2,'Mg(NO3)2':3}, pr:{NaNO3:6,'Mg3(PO4)2':1}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{Na3PO4:2,'Zn(NO3)2':3}, pr:{NaNO3:6,'Zn3(PO4)2':1}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{Na3PO4:2,'Fe(NO3)2':3}, pr:{NaNO3:6,'Fe3(PO4)2':1}, obs:'Xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{Na3PO4:1,'Fe(NO3)3':1}, pr:{NaNO3:3,FePO4:1}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{Na3PO4:1,'Al(NO3)3':1}, pr:{NaNO3:3,AlPO4:1}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{Na3PO4:2,'Ba(NO3)2':3}, pr:{NaNO3:6,'Ba3(PO4)2':1}, obs:'Xuất hiện kết tủa trắng Ba₃(PO₄)₂.'},
 {rg:{Na3PO4:2,'Mn(NO3)2':3}, pr:{NaNO3:6,'Mn3(PO4)2':1}, obs:'Xuất hiện kết tủa Mn₃(PO₄)₂.'},
 {rg:{'Al2(SO4)3':1,'Ba(NO3)2':3}, pr:{'Al(NO3)3':2,BaSO4:3}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{'Al2(SO4)3':1,K3PO4:2}, pr:{AlPO4:2,K2SO4:3}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{'Fe2(SO4)3':1,'Ba(NO3)2':3}, pr:{'Fe(NO3)3':2,BaSO4:3}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{'Fe2(SO4)3':1,K3PO4:2}, pr:{FePO4:2,K2SO4:3}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{'Mg(NO3)2':3,K3PO4:2}, pr:{'Mg3(PO4)2':1,KNO3:6}, obs:'Xuất hiện kết tủa trắng Mg₃(PO₄)₂.'},
 {rg:{'Zn(NO3)2':3,K3PO4:2}, pr:{'Zn3(PO4)2':1,KNO3:6}, obs:'Xuất hiện kết tủa trắng Zn₃(PO₄)₂.'},
 {rg:{'Fe(NO3)2':3,K3PO4:2}, pr:{'Fe3(PO4)2':1,KNO3:6}, obs:'Xuất hiện kết tủa Fe₃(PO₄)₂.'},
 {rg:{'Fe(NO3)3':1,K3PO4:1}, pr:{FePO4:1,KNO3:3}, obs:'Xuất hiện kết tủa vàng nhạt FePO₄.'},
 {rg:{'Al(NO3)3':1,K3PO4:1}, pr:{AlPO4:1,KNO3:3}, obs:'Xuất hiện kết tủa trắng AlPO₄.'},
 {rg:{'Ba(NO3)2':1,'(NH4)2SO4':1}, pr:{BaSO4:1,NH4NO3:2}, obs:'Xuất hiện kết tủa trắng BaSO₄.'},
 {rg:{'Ba(NO3)2':3,K3PO4:2}, pr:{'Ba3(PO4)2':1,KNO3:6}, obs:'Xuất hiện kết tủa trắng Ba₃(PO₄)₂.'},
 {rg:{'Ba(NO3)2':1,K2SO3:1}, pr:{BaSO3:1,KNO3:2}, obs:'Xuất hiện kết tủa trắng BaSO₃.'},
 {rg:{'Mn(NO3)2':3,K3PO4:2}, pr:{'Mn3(PO4)2':1,KNO3:6}, obs:'Xuất hiện kết tủa Mn₃(PO₄)₂.'},

 /* ---------- 25. KIM LOẠI ĐẨY KIM LOẠI (MỞ RỘNG) ---------- */
 {rg:{Mg:3,AlCl3:2}, pr:{MgCl2:3,Al:2}},
 {rg:{Mg:1,ZnCl2:1}, pr:{MgCl2:1,Zn:1}},
 {rg:{Mg:1,FeCl2:1}, pr:{MgCl2:1,Fe:1}},
 {rg:{Mg:3,FeCl3:2}, pr:{MgCl2:3,Fe:2}},
 {rg:{Mg:1,AgNO3:2}, pr:{'Mg(NO3)2':1,Ag:2}},
 {rg:{Mg:1,'Cu(NO3)2':1}, pr:{'Mg(NO3)2':1,Cu:1}},
 {rg:{Mg:3,'Al2(SO4)3':1}, pr:{MgSO4:3,Al:2}},
 {rg:{Mg:3,'Fe2(SO4)3':1}, pr:{MgSO4:3,Fe:2}},
 {rg:{Mg:1,'Zn(NO3)2':1}, pr:{'Mg(NO3)2':1,Zn:1}},
 {rg:{Mg:1,'Fe(NO3)2':1}, pr:{'Mg(NO3)2':1,Fe:1}},
 {rg:{Mg:3,'Fe(NO3)3':2}, pr:{'Mg(NO3)2':3,Fe:2}},
 {rg:{Mg:3,'Al(NO3)3':2}, pr:{'Mg(NO3)2':3,Al:2}},
 {rg:{Al:2,ZnCl2:3}, pr:{AlCl3:2,Zn:3}},
 {rg:{Al:2,FeCl2:3}, pr:{AlCl3:2,Fe:3}},
 {rg:{Al:1,FeCl3:1}, pr:{AlCl3:1,Fe:1}},
 {rg:{Al:2,CuCl2:3}, pr:{AlCl3:2,Cu:3}},
 {rg:{Al:2,ZnSO4:3}, pr:{'Al2(SO4)3':1,Zn:3}},
 {rg:{Al:2,FeSO4:3}, pr:{'Al2(SO4)3':1,Fe:3}},
 {rg:{Al:1,AgNO3:3}, pr:{'Al(NO3)3':1,Ag:3}},
 {rg:{Al:2,'Cu(NO3)2':3}, pr:{'Al(NO3)3':2,Cu:3}},
 {rg:{Al:2,'Fe2(SO4)3':1}, pr:{'Al2(SO4)3':1,Fe:2}},
 {rg:{Al:2,'Zn(NO3)2':3}, pr:{'Al(NO3)3':2,Zn:3}},
 {rg:{Al:2,'Fe(NO3)2':3}, pr:{'Al(NO3)3':2,Fe:3}},
 {rg:{Al:1,'Fe(NO3)3':1}, pr:{'Al(NO3)3':1,Fe:1}},
 {rg:{Zn:1,FeCl2:1}, pr:{ZnCl2:1,Fe:1}},
 {rg:{Zn:3,FeCl3:2}, pr:{ZnCl2:3,Fe:2}},
 {rg:{Zn:1,AgNO3:2}, pr:{'Zn(NO3)2':1,Ag:2}},
 {rg:{Zn:1,'Cu(NO3)2':1}, pr:{'Zn(NO3)2':1,Cu:1}},
 {rg:{Zn:3,'Fe2(SO4)3':1}, pr:{ZnSO4:3,Fe:2}},
 {rg:{Zn:1,'Fe(NO3)2':1}, pr:{'Zn(NO3)2':1,Fe:1}},
 {rg:{Zn:3,'Fe(NO3)3':2}, pr:{'Zn(NO3)2':3,Fe:2}},
 {rg:{Fe:1,AgNO3:2}, pr:{'Fe(NO3)2':1,Ag:2}},
 {rg:{Fe:1,'Cu(NO3)2':1}, pr:{'Fe(NO3)2':1,Cu:1}},

 /* ---------- 26. OXIT AXIT + KIỀM, OXIT BAZƠ + OXIT AXIT (MỞ RỘNG) ---------- */
 {rg:{SO2:1,KOH:2}, pr:{K2SO3:1,H2O:1}},
 {rg:{P2O5:1,KOH:6}, pr:{K3PO4:2,H2O:3}},
 {rg:{SO2:1,'Ca(OH)2':1}, pr:{CaSO3:1,H2O:1}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},
 {rg:{P2O5:1,'Ca(OH)2':3}, pr:{'Ca3(PO4)2':1,H2O:3}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{SO2:1,CaO:1}, pr:{CaSO3:1}, obs:'Xuất hiện kết tủa trắng CaSO₃.'},
 {rg:{SO2:1,Na2O:1}, pr:{Na2SO3:1}},
 {rg:{SO2:1,K2O:1}, pr:{K2SO3:1}},
 {rg:{P2O5:1,CaO:3}, pr:{'Ca3(PO4)2':1}, obs:'Xuất hiện kết tủa trắng Ca₃(PO₄)₂.'},
 {rg:{P2O5:1,Na2O:3}, pr:{Na3PO4:2}},
 {rg:{P2O5:1,K2O:3}, pr:{K3PO4:2}},

 /* ---------- 27. NHIỆT PHÂN (MỞ RỘNG) ---------- */
 {rg:{MgCO3:1}, pr:{MgO:1,CO2:1}, heat:1, obs:'Xuất hiện kết tủa MgO; Sủi bọt khí CO₂.'},
 {rg:{ZnCO3:1}, pr:{ZnO:1,CO2:1}, heat:1, obs:'Xuất hiện kết tủa ZnO; Sủi bọt khí CO₂.'},
 {rg:{Ag2CO3:1}, pr:{Ag2O:1,CO2:1}, heat:1, obs:'Xuất hiện kết tủa nâu đen Ag₂O; Sủi bọt khí CO₂.'}
];

/* Mốc chia nhóm cho Sổ tay ở màn hình chính. i = số thứ tự phản ứng đầu tiên của nhóm.
   Thêm/bớt phản ứng ở trên thì phải chỉnh lại các số này. */
const RX_GROUPS = [
 {i:0,   t:'Axit + bazơ tan (trung hoà)'},
 {i:9,   t:'Axit + bazơ không tan'},
 {i:21,  t:'Kim loại + axit → muối + H₂'},
 {i:33,  t:'Kim loại kiềm + nước'},
 {i:35,  t:'Cháy trong oxi'},
 {i:47,  t:'Kim loại đẩy kim loại khỏi muối'},
 {i:60,  t:'Oxit bazơ + axit'},
 {i:77,  t:'Oxit bazơ tan + nước → kiềm'},
 {i:80,  t:'Oxit axit + nước → axit'},
 {i:81,  t:'Oxit axit + kiềm'},
 {i:88,  t:'Oxit bazơ + oxit axit → muối'},
 {i:91,  t:'Muối + axit'},
 {i:105, t:'Muối + bazơ → kết tủa'},
 {i:123, t:'Muối + muối'},
 {i:136, t:'Nhiệt phân'},
 {i:144, t:'Khử oxit kim loại (H₂ hoặc C)'},
 {i:152, t:'Halogen'},
 {i:160, t:'Nitơ'},
 {i:162, t:'Đường gặp axit sunfuric đặc'},
 {i:163, t:'Điện phân'},
 {i:167, t:'Nước vôi Ca(OH)₂ + axit, muối'},
 {i:183, t:'Axit + oxit bazơ, bazơ, muối (mở rộng)'},
 {i:263, t:'Kiềm + muối (mở rộng)'},
 {i:308, t:'Muối + muối (mở rộng)'},
 {i:416, t:'Kim loại đẩy kim loại (mở rộng)'},
 {i:449, t:'Oxit axit + kiềm, oxit bazơ + oxit axit (mở rộng)'},
 {i:459, t:'Nhiệt phân (mở rộng)'}
];

/* =====================================================================
   THUỐC THỬ NHẬN BIẾT — minigame xác định chất (MG.identify, che-do.js).
   Nhỏ một MẪU (lọ mất nhãn) vào thuốc thử thì thấy gì:
     tip   một dòng mẹo, hiện trong sổ ghi chép
     on    {mẫu: hiện tượng}; mẫu không có ở đây = không hiện tượng (NO_TEST)
   Một hiện tượng:
     t     chữ ngắn ghi vào ô của sổ — hai mẫu khác nhau mà cùng t thì người chơi coi như giống nhau
     d     câu mô tả đầy đủ, hiện dưới bảng
     fx    hình trong cốc: {ppt:'màu kết tủa'} (faint:1 = chỉ hơi vẩn đục) · {gas:1} sủi bọt ·
           {spot:'màu'} vết trên giấy quỳ · {} không đổi. col = tên màu, cho dòng chữ "kết tủa trắng" hiện trên trạm
   'quy' là giấy quỳ tím (luôn có, không nằm trong day.reagents) — mẫu nào cũng phải có dòng 'quy'.
   ===================================================================== */
const NO_TEST = {t:'—', d:'Không thấy hiện tượng gì.', fx:{}};
const TESTS = {
 quy:   {tip:'Quỳ tím: axit → ĐỎ, bazơ → XANH, trung tính → vẫn TÍM', on:{
   HCl:      {t:'đỏ',   d:'Quỳ tím hoá ĐỎ → mẫu là axit.',            fx:{spot:'#d9634f', col:'đỏ'}},
   H2SO4:    {t:'đỏ',   d:'Quỳ tím hoá ĐỎ → mẫu là axit.',            fx:{spot:'#d9634f', col:'đỏ'}},
   NaOH:     {t:'xanh', d:'Quỳ tím hoá XANH → mẫu là bazơ.',          fx:{spot:'#4f78c9', col:'xanh'}},
   'Ca(OH)2':{t:'xanh', d:'Quỳ tím hoá XANH → mẫu là bazơ.',          fx:{spot:'#4f78c9', col:'xanh'}},
   NaCl:     {t:'tím',  d:'Quỳ vẫn TÍM → mẫu trung tính.',            fx:{spot:'#9b7bb8', col:'tím'}},
   Na2SO4:   {t:'tím',  d:'Quỳ vẫn TÍM → mẫu trung tính.',            fx:{spot:'#9b7bb8', col:'tím'}},
   H2O:      {t:'tím',  d:'Quỳ vẫn TÍM → mẫu trung tính.',            fx:{spot:'#9b7bb8', col:'tím'}}}},
 BaCl2: {tip:'BaCl₂: kết tủa trắng với gốc sunfat =SO₄', on:{
   H2SO4:    {t:'↓ trắng', d:'Kết tủa trắng BaSO₄ → mẫu có gốc sunfat (=SO₄).', fx:{ppt:'#ffffff', col:'trắng'}},
   Na2SO4:   {t:'↓ trắng', d:'Kết tủa trắng BaSO₄ → mẫu có gốc sunfat (=SO₄).', fx:{ppt:'#ffffff', col:'trắng'}}}},
 AgNO3: {tip:'AgNO₃: kết tủa trắng với gốc clorua −Cl', on:{
   HCl:      {t:'↓ trắng',   d:'Kết tủa trắng AgCl → mẫu có gốc clorua (−Cl).', fx:{ppt:'#ffffff', col:'trắng'}},
   NaCl:     {t:'↓ trắng',   d:'Kết tủa trắng AgCl → mẫu có gốc clorua (−Cl).', fx:{ppt:'#ffffff', col:'trắng'}},
   NaOH:     {t:'↓ nâu đen', d:'Kết tủa nâu đen Ag₂O → mẫu là bazơ tan (kiềm).', fx:{ppt:'#4a3a2a', col:'nâu đen'}},
   'Ca(OH)2':{t:'↓ nâu đen', d:'Kết tủa nâu đen Ag₂O → mẫu là bazơ tan (kiềm).', fx:{ppt:'#4a3a2a', col:'nâu đen'}},
   // Ag₂SO₄ ít tan: dung dịch loãng chỉ hơi đục — đúng thực tế, và là lý do nên thử =SO₄ bằng BaCl₂ trước
   H2SO4:    {t:'hơi đục',   d:'Chỉ hơi vẩn đục — Ag₂SO₄ ít tan, dễ nhầm với AgCl. Thử gốc =SO₄ bằng BaCl₂ cho chắc!', fx:{ppt:'#ffffff', col:'trắng', faint:1}},
   Na2SO4:   {t:'hơi đục',   d:'Chỉ hơi vẩn đục — Ag₂SO₄ ít tan, dễ nhầm với AgCl. Thử gốc =SO₄ bằng BaCl₂ cho chắc!', fx:{ppt:'#ffffff', col:'trắng', faint:1}}}},
 Na2CO3:{tip:'Na₂CO₃: sủi bọt khí CO₂ với axit', on:{
   HCl:      {t:'sủi bọt', d:'Sủi bọt khí CO₂ → mẫu là axit.',            fx:{gas:1}},
   H2SO4:    {t:'sủi bọt', d:'Sủi bọt khí CO₂ → mẫu là axit.',            fx:{gas:1}},
   'Ca(OH)2':{t:'↓ trắng', d:'Kết tủa trắng CaCO₃ → mẫu có canxi (Ca).', fx:{ppt:'#ffffff', col:'trắng'}}}}
};
const testOf = (r, f) => TESTS[r].on[f] || NO_TEST;
