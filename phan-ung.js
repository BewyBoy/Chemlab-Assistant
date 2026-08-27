/* =====================================================================
   BẢNG PHẢN ỨNG — nguồn sự thật duy nhất cho hoá học trong cốc.
   index.html nạp file này rồi runReactions()/electrolyse() tra thẳng vào đây.

   Cấu trúc một dòng:
     rg    chất tham gia  {công thức: hệ số}
     pr    chất tạo thành {công thức: hệ số}
     heat  1 = phải đun (đèn cồn)
     elec  1 = phải cắm nguồn điện phân (người chơi tự định lượng, không tự chạy)
     exo   1 = toả nhiệt, cốc loé sáng
     vent  ['X'] = khí X thoát ra ở cực dương, KHÔNG hứng vào bình được
     last  1 = xếp sau cùng khi nhiều phản ứng cùng chạy được

   Mọi công thức xuất hiện ở đây PHẢI có trong CHEMS của index.html.
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
 {rg:{Zn:1,HCl:2},            pr:{ZnCl2:1,H2:1}},
 {rg:{Fe:1,HCl:2},            pr:{FeCl2:1,H2:1}},
 {rg:{Mg:1,HCl:2},            pr:{MgCl2:1,H2:1}},
 {rg:{Al:2,HCl:6},            pr:{AlCl3:2,H2:3}},
 {rg:{Na:2,HCl:2},            pr:{NaCl:2,H2:1}, exo:1},
 {rg:{K:2,HCl:2},             pr:{KCl:2,H2:1},  exo:1},
 {rg:{Zn:1,H2SO4:1},          pr:{ZnSO4:1,H2:1}},
 {rg:{Fe:1,H2SO4:1},          pr:{FeSO4:1,H2:1}},
 {rg:{Mg:1,H2SO4:1},          pr:{MgSO4:1,H2:1}},
 {rg:{Al:2,H2SO4:3},          pr:{'Al2(SO4)3':1,H2:3}},
 {rg:{Na:2,H2SO4:1},          pr:{Na2SO4:1,H2:1}, exo:1},
 {rg:{K:2,H2SO4:1},           pr:{K2SO4:1,H2:1},  exo:1},

 /* ---------- 4. KIM LOẠI KIỀM + NƯỚC ---------- */
 {rg:{Na:2,H2O:2},            pr:{NaOH:2,H2:1}, exo:1},
 {rg:{K:2,H2O:2},             pr:{KOH:2,H2:1},  exo:1},

 /* ---------- 5. CHÁY TRONG OXI ---------- */
 {rg:{Mg:2,O2:1},             pr:{MgO:2},    heat:1, exo:1},
 {rg:{Cu:2,O2:1},             pr:{CuO:2},    heat:1, exo:1},
 {rg:{Zn:2,O2:1},             pr:{ZnO:2},    heat:1, exo:1},
 {rg:{Fe:3,O2:2},             pr:{Fe3O4:1},  heat:1, exo:1},
 {rg:{Al:4,O2:3},             pr:{Al2O3:2},  heat:1, exo:1},
 {rg:{Na:4,O2:1},             pr:{Na2O:2},   heat:1, exo:1},
 {rg:{K:4,O2:1},              pr:{K2O:2},    heat:1, exo:1},
 {rg:{S:1,O2:1},              pr:{SO2:1},    heat:1, exo:1},
 {rg:{P:4,O2:5},              pr:{P2O5:2},   heat:1, exo:1},
 {rg:{C:1,O2:1},              pr:{CO2:1},    heat:1, exo:1},
 {rg:{H2:2,O2:1},             pr:{H2O:2},    heat:1, exo:1},   // nổ!
 {rg:{C12H22O11:1,O2:12},     pr:{CO2:12,H2O:11}, heat:1, exo:1},

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
 {rg:{Fe:1,CuSO4:1},          pr:{FeSO4:1,Cu:1}},
 {rg:{Fe:1,CuCl2:1},          pr:{FeCl2:1,Cu:1}},
 {rg:{Cu:1,AgNO3:2},          pr:{'Cu(NO3)2':1,Ag:2}},
 // sắt(III) bị chính Fe hoặc Cu khử xuống sắt(II) — mẹo khắc bảng mạch
 {rg:{Fe:1,FeCl3:2},          pr:{FeCl2:3}},
 {rg:{Cu:1,FeCl3:2},          pr:{CuCl2:1,FeCl2:2}},

 /* ---------- 7. OXIT BAZƠ + AXIT ---------- */
 {rg:{MgO:1,HCl:2},           pr:{MgCl2:1,H2O:1}},
 {rg:{MgO:1,H2SO4:1},         pr:{MgSO4:1,H2O:1}},
 {rg:{ZnO:1,HCl:2},           pr:{ZnCl2:1,H2O:1}},
 {rg:{ZnO:1,H2SO4:1},         pr:{ZnSO4:1,H2O:1}},
 {rg:{CuO:1,HCl:2},           pr:{CuCl2:1,H2O:1}},
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
 {rg:{CaO:1,H2O:1},           pr:{'Ca(OH)2':1}, exo:1},
 {rg:{Na2O:1,H2O:1},          pr:{NaOH:2},      exo:1},
 {rg:{K2O:1,H2O:1},           pr:{KOH:2},       exo:1},

 /* ---------- 9. OXIT AXIT + NƯỚC → axit ---------- */
 {rg:{P2O5:1,H2O:3},          pr:{H3PO4:2}},

 /* ---------- 10. OXIT AXIT + KIỀM ---------- */
 {rg:{CO2:1,NaOH:2},          pr:{Na2CO3:1,H2O:1}},
 {rg:{CO2:1,NaOH:1},          pr:{NaHCO3:1}},
 {rg:{CO2:1,KOH:2},           pr:{K2CO3:1,H2O:1}},
 {rg:{CO2:1,'Ca(OH)2':1},     pr:{CaCO3:1,H2O:1}},   // nước vôi trong hoá đục
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
 {rg:{CaCO3:1,HCl:2},         pr:{CaCl2:1,H2O:1,CO2:1}},
 {rg:{CaCO3:1,H2SO4:1},       pr:{CaSO4:1,H2O:1,CO2:1}},
 {rg:{BaCO3:1,HCl:2},         pr:{BaCl2:1,H2O:1,CO2:1}},
 {rg:{BaCO3:1,H2SO4:1},       pr:{BaSO4:1,H2O:1,CO2:1}},
 {rg:{Na2SO3:1,HCl:2},        pr:{NaCl:2,H2O:1,SO2:1}},
 {rg:{BaCl2:1,H2SO4:1},       pr:{BaSO4:1,HCl:2}},
 {rg:{AgNO3:1,HCl:1},         pr:{AgCl:1,HNO3:1}},
 // điều chế clo trong phòng thí nghiệm
 {rg:{MnO2:1,HCl:4},          pr:{MnCl2:1,Cl2:1,H2O:2}, heat:1},

 /* ---------- 13. MUỐI + BAZƠ → kết tủa ---------- */
 {rg:{CuSO4:1,NaOH:2},        pr:{'Cu(OH)2':1,Na2SO4:1}},
 {rg:{CuSO4:1,KOH:2},         pr:{'Cu(OH)2':1,K2SO4:1}},
 {rg:{CuCl2:1,NaOH:2},        pr:{'Cu(OH)2':1,NaCl:2}},
 {rg:{CuCl2:1,KOH:2},         pr:{'Cu(OH)2':1,KCl:2}},
 {rg:{'Cu(NO3)2':1,NaOH:2},   pr:{'Cu(OH)2':1,NaNO3:2}},
 {rg:{FeCl3:1,NaOH:3},        pr:{'Fe(OH)3':1,NaCl:3}},
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
 {rg:{AgNO3:1,NaCl:1},        pr:{AgCl:1,NaNO3:1}},
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
 {rg:{'Cu(OH)2':1},           pr:{CuO:1,H2O:1},          heat:1},
 {rg:{'Fe(OH)3':2},           pr:{Fe2O3:1,H2O:3},        heat:1},
 {rg:{'Mg(OH)2':1},           pr:{MgO:1,H2O:1},          heat:1},
 {rg:{'Zn(OH)2':1},           pr:{ZnO:1,H2O:1},          heat:1},
 {rg:{'Al(OH)3':2},           pr:{Al2O3:1,H2O:3},        heat:1},
 {rg:{CaCO3:1},               pr:{CaO:1,CO2:1},          heat:1},
 {rg:{NaHCO3:2},              pr:{Na2CO3:1,H2O:1,CO2:1}, heat:1},
 {rg:{KMnO4:2},               pr:{O2:1,K2MnO4:1,MnO2:1}, heat:1},

 /* ---------- 16. KHỬ OXIT KIM LOẠI (H₂ hoặc C) ---------- */
 {rg:{CuO:1,H2:1},            pr:{Cu:1,H2O:1},   heat:1},
 {rg:{ZnO:1,H2:1},            pr:{Zn:1,H2O:1},   heat:1},
 {rg:{Fe2O3:1,H2:3},          pr:{Fe:2,H2O:3},   heat:1},
 {rg:{Fe3O4:1,H2:4},          pr:{Fe:3,H2O:4},   heat:1},
 {rg:{CuO:2,C:1},             pr:{Cu:2,CO2:1},   heat:1},
 {rg:{ZnO:2,C:1},             pr:{Zn:2,CO2:1},   heat:1},
 {rg:{Fe2O3:2,C:3},           pr:{Fe:4,CO2:3},   heat:1},
 {rg:{Fe3O4:1,C:2},           pr:{Fe:3,CO2:2},   heat:1},

 /* ---------- 17. HALOGEN ---------- */
 {rg:{Na:2,Cl2:1},            pr:{NaCl:2},   heat:1, exo:1},
 {rg:{K:2,Cl2:1},             pr:{KCl:2},    heat:1, exo:1},
 {rg:{Mg:1,Cl2:1},            pr:{MgCl2:1},  heat:1, exo:1},
 {rg:{Zn:1,Cl2:1},            pr:{ZnCl2:1},  heat:1, exo:1},
 {rg:{Al:2,Cl2:3},            pr:{AlCl3:2},  heat:1, exo:1},
 {rg:{Fe:2,Cl2:3},            pr:{FeCl3:2},  heat:1, exo:1},
 {rg:{Cu:1,Cl2:1},            pr:{CuCl2:1},  heat:1},
 {rg:{H2:1,Cl2:1},            pr:{HCl:2},    heat:1},

 /* ---------- 18. NITƠ ---------- */
 {rg:{N2:1,H2:3},             pr:{NH3:2},    heat:1},
 {rg:{NH3:1,HCl:1},           pr:{NH4Cl:1}},

 /* ---------- 19. ĐƯỜNG GẶP AXIT SUNFURIC ĐẶC ----------
    H₂SO₄ đặc chỉ rút nước chứ không tham gia — SGK ghi nó TRÊN mũi tên.
    Dùng cat: phải có mặt mới chạy, nhưng không bị tiêu hao (nên vẫn cân bằng).  */
 {rg:{C12H22O11:1},           pr:{C:12,H2O:11}, cat:['H2SO4']},

 /* ---------- 20. ĐIỆN PHÂN ----------
    vent = khí sinh ra ở cực còn lại; game chỉ có MỘT bình nên chỉ hứng được
    một loại khí, khí kia coi như thoát ra ngoài.                            */
 {rg:{H2O:2},                 pr:{H2:2,O2:1},              elec:1, vent:['O2'], last:1},
 {rg:{CuCl2:1},               pr:{Cu:1,Cl2:1},             elec:1},
 {rg:{CuSO4:2,H2O:2},         pr:{Cu:2,O2:1,H2SO4:2},      elec:1, vent:['O2']},
 {rg:{NaCl:2,H2O:2},          pr:{NaOH:2,H2:1,Cl2:1},      elec:1, vent:['H2']}
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
 {i:163, t:'Điện phân'}
];
