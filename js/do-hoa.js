/* =====================================================================
   ĐỒ HOẠ — kho SVG (dụng cụ, lọ, biểu tượng), cái cốc, và nhân vật vẽ sẵn.
   Chỉ là hình: sửa nét vẽ ở đây, không đụng logic.
   ===================================================================== */
'use strict';

const SVG_DEFS = `
<defs>
  <!-- Shared gradients for all symbols, gwA-prefixed -->
  <linearGradient id="gwAglassSheen" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.38"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
  </linearGradient>
  <linearGradient id="gwAwoodGrain" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c89a63"/>
    <stop offset="100%" stop-color="#9a7240"/>
  </linearGradient>
  <linearGradient id="gwAbulbGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#e8756a"/>
    <stop offset="100%" stop-color="#b54535"/>
  </linearGradient>
  <linearGradient id="gwAerlFlask" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
  </linearGradient>
</defs>

<!-- ============================================================
     ERLENMEYER FLASK
     ============================================================ -->
<symbol id="sym-erlenmeyer" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="gwAerlClip">
      <path d="M44,48 L20,130 Q18,144 30,147 L90,147 Q102,144 100,130 L76,48 Z"/>
    </clipPath>
  </defs>

  <!-- Liquid fill clipped to flask interior -->
  <g clip-path="url(#gwAerlClip)">
    <rect x="18" y="100" width="84" height="48" fill="var(--lc,#cfe6f2)" opacity="0.88"/>
    <!-- Mini meniscus at liquid surface -->
    <path d="M20,100 Q60,95 100,100" fill="none" stroke="var(--lc,#cfe6f2)" stroke-width="3" opacity="0.7"/>
  </g>

  <!-- Flask glass body -->
  <path d="M46,10 Q46,8 48,7 L72,7 Q74,8 74,10 L74,46 Q75,47 78,52 L100,128 Q103,143 90,147 L30,147 Q17,143 20,128 L42,52 Q45,47 46,46 Z"
        fill="#ffffff" opacity="0.15" stroke="none"/>

  <!-- Flask outline -->
  <path d="M48,8 L72,8 Q74,9 74,12 L74,46 Q76,49 79,54 L101,129 Q105,145 90,148 L30,148 Q15,145 19,129 L41,54 Q44,49 46,46 L46,12 Q46,9 48,8 Z"
        fill="none" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Neck opening rim -->
  <path d="M44,8 Q44,4 46,4 L74,4 Q76,4 76,8"
        fill="none" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Shine highlight left side -->
  <path d="M30,75 Q27,100 28,132" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.35"/>
  <path d="M37,60 Q35,80 36,100" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.25"/>

  <!-- Neck shine -->
  <path d="M50,12 L50,44" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>

  <!-- Bottom shadow -->
  <ellipse cx="60" cy="148" rx="32" ry="4" fill="#3b3025" opacity="0.13"/>
</symbol>


<!-- ============================================================
     TEST TUBE RACK
     ============================================================ -->
<symbol id="sym-tuberack" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gwAwoodTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c89a63"/>
      <stop offset="60%" stop-color="#a87840"/>
      <stop offset="100%" stop-color="#8a6238"/>
    </linearGradient>
    <linearGradient id="gwAtubeBlue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6f9ec9" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#4e7eaa" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="gwAtubeGreen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7aa95c" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#5a8840" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="gwAtubeAmber" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e8b84b" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#c89428" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="gwAtubePink" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e8a4a0" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#c87470" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <!-- Rack shadow -->
  <ellipse cx="110" cy="136" rx="95" ry="5" fill="#3b3025" opacity="0.13"/>

  <!-- Bottom rail -->
  <path d="M14,110 Q12,112 14,114 L206,114 Q208,112 206,110 Q208,108 206,106 L14,106 Q12,108 14,110 Z"
        fill="url(#gwAwoodTop)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bottom rail grain lines -->
  <path d="M20,108 Q60,107 100,108 Q140,109 180,108" fill="none" stroke="#8a6238" stroke-width="1" opacity="0.5"/>
  <path d="M25,111 Q70,110 115,111 Q155,112 190,111" fill="none" stroke="#8a6238" stroke-width="1" opacity="0.4"/>

  <!-- Top rail -->
  <path d="M14,38 Q12,40 14,42 L206,42 Q208,40 206,38 Q208,36 206,34 L14,34 Q12,36 14,38 Z"
        fill="url(#gwAwoodTop)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Top rail grain lines -->
  <path d="M20,36 Q65,35 110,36 Q150,37 185,36" fill="none" stroke="#8a6238" stroke-width="1" opacity="0.5"/>
  <path d="M22,39 Q70,38 112,39 Q155,40 188,39" fill="none" stroke="#8a6238" stroke-width="1" opacity="0.4"/>

  <!-- Left end post -->
  <path d="M14,34 Q10,34 10,38 L10,110 Q10,114 14,114 L22,114 L22,110 L18,110 L18,42 L22,42 L22,38 Z"
        fill="url(#gwAwoodTop)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Right end post -->
  <path d="M206,34 Q210,34 210,38 L210,110 L206,110 L198,110 L198,114 L206,114 Q210,114 210,110 L210,38 Q210,34 206,34 L198,34 L198,42 L206,42 Z"
        fill="url(#gwAwoodTop)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Test tube 1 (blue) -->
  <g transform="translate(42,22)">
    <!-- Tube glass -->
    <path d="M6,16 L6,88 Q6,96 12,96 Q18,96 18,88 L18,16 Z"
          fill="#ffffff" opacity="0.15"/>
    <!-- Liquid fill -->
    <path d="M6,52 L6,88 Q6,96 12,96 Q18,96 18,88 L18,52 Z"
          fill="url(#gwAtubeBlue)"/>
    <!-- Tube outline -->
    <path d="M6,16 L6,88 Q6,97 12,97 Q18,97 18,88 L18,16"
          fill="none" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Rim -->
    <path d="M4,16 L20,16" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Shine -->
    <path d="M8,20 L8,82" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.38"/>
  </g>

  <!-- Test tube 2 (green) -->
  <g transform="translate(82,22)">
    <path d="M6,16 L6,88 Q6,96 12,96 Q18,96 18,88 L18,16 Z"
          fill="#ffffff" opacity="0.15"/>
    <path d="M6,60 L6,88 Q6,96 12,96 Q18,96 18,88 L18,60 Z"
          fill="url(#gwAtubeGreen)"/>
    <path d="M6,16 L6,88 Q6,97 12,97 Q18,97 18,88 L18,16"
          fill="none" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4,16 L20,16" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M8,20 L8,82" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.38"/>
  </g>

  <!-- Test tube 3 (amber) -->
  <g transform="translate(122,22)">
    <path d="M6,16 L6,88 Q6,96 12,96 Q18,96 18,88 L18,16 Z"
          fill="#ffffff" opacity="0.15"/>
    <path d="M6,44 L6,88 Q6,96 12,96 Q18,96 18,88 L18,44 Z"
          fill="url(#gwAtubeAmber)"/>
    <path d="M6,16 L6,88 Q6,97 12,97 Q18,97 18,88 L18,16"
          fill="none" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4,16 L20,16" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M8,20 L8,82" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.38"/>
  </g>

  <!-- Test tube 4 (pink) -->
  <g transform="translate(162,22)">
    <path d="M6,16 L6,88 Q6,96 12,96 Q18,96 18,88 L18,16 Z"
          fill="#ffffff" opacity="0.15"/>
    <path d="M6,68 L6,88 Q6,96 12,96 Q18,96 18,88 L18,68 Z"
          fill="url(#gwAtubePink)"/>
    <path d="M6,16 L6,88 Q6,97 12,97 Q18,97 18,88 L18,16"
          fill="none" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4,16 L20,16" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M8,20 L8,82" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.38"/>
  </g>
</symbol>


<!-- ============================================================
     PIPETTE
     ============================================================ -->
<symbol id="sym-pipette" viewBox="0 0 44 160" xmlns="http://www.w3.org/2000/svg">
  <!-- Rubber bulb -->
  <path d="M22,8 Q8,8 6,20 Q4,30 10,36 Q14,40 18,42 L18,52 L26,52 L26,42 Q30,40 34,36 Q40,30 38,20 Q36,8 22,8 Z"
        fill="url(#gwAbulbGrad)" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bulb highlight -->
  <path d="M12,14 Q10,20 11,28" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.3"/>
  <!-- Bulb shading crease -->
  <path d="M30,12 Q34,18 33,26" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>

  <!-- Glass barrel -->
  <path d="M18,52 L18,110 L20,115 L22,155 L24,115 L26,110 L26,52 Z"
        fill="#ffffff" opacity="0.15"/>
  <!-- Liquid column inside barrel -->
  <rect x="19" y="68" width="6" height="42" fill="var(--lc,#6f9ec9)" opacity="var(--pipop,1)" rx="1"/>
  <!-- Fine tip -->
  <path d="M20,110 Q20,130 21,155 Q21.5,158 22,158 Q22.5,158 23,155 Q24,130 24,110"
        fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>

  <!-- Barrel outline -->
  <path d="M18,52 L18,112 Q19,125 22,158 Q25,125 26,112 L26,52"
        fill="none" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Graduation marks on barrel -->
  <line x1="19" y1="75" x2="25" y2="75" stroke="#3b3025" stroke-width="1" opacity="0.5"/>
  <line x1="19" y1="85" x2="25" y2="85" stroke="#3b3025" stroke-width="1" opacity="0.5"/>
  <line x1="19" y1="95" x2="25" y2="95" stroke="#3b3025" stroke-width="1" opacity="0.5"/>

  <!-- Barrel shine -->
  <path d="M20,56 L20,108" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.35"/>
</symbol>


<!-- ============================================================
     GAS COLLECTION BOTTLE
     ============================================================ -->
<symbol id="sym-gasbottle" viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg">
  <!-- Ống thu khí (canister) — dựng theo bản vẽ tay gas_collect: thân trụ, miệng loe
       phía trên, ống dẫn cong ra từ đáy. Miệng hướng LÊN khi đứng trên bàn; lúc thu khí
       cả zone xoay 180° nên miệng úp xuống cốc, đúng thao tác thật. -->

  <!-- bóng đổ dưới đáy -->
  <ellipse cx="66" cy="124" rx="32" ry="5" fill="#3b3025" opacity="0.14"/>

  <!-- thân trụ -->
  <path d="M36,32 L36,102 Q36,114 48,118 Q66,121 84,118 Q96,114 96,102 L96,32"
        fill="#ffffff" fill-opacity="0.16" stroke="#3b3025" stroke-width="3.5"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- khí bên trong (bật bằng --gasop) -->
  <g opacity="0" style="opacity:var(--gasop,0)">
    <path d="M66,96 Q82,86 77,70 Q72,54 56,59 Q44,64 48,78" fill="none" stroke="#6f9ec9" stroke-width="2.4" stroke-linecap="round" opacity="0.6">
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="3s" repeatCount="indefinite"/>
    </path>
    <path d="M52,112 Q40,100 44,84 Q48,70 62,75 Q72,79 68,91" fill="none" stroke="#6f9ec9" stroke-width="2.4" stroke-linecap="round" opacity="0.5">
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="4s" begin="1s" repeatCount="indefinite"/>
    </path>
    <path d="M80,110 Q90,98 85,84 Q79,70 66,76" fill="none" stroke="#6f9ec9" stroke-width="2.2" stroke-linecap="round" opacity="0.4">
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="3.5s" begin="0.5s" repeatCount="indefinite"/>
    </path>
  </g>

  <!-- vành miệng: nét ngoài + lòng ống -->
  <ellipse cx="66" cy="32" rx="30" ry="10" fill="#ffffff" fill-opacity="0.22"
           stroke="#3b3025" stroke-width="3.5"/>
  <ellipse cx="66" cy="33" rx="23" ry="6.5" fill="#e6ecef" fill-opacity="0.55"
           stroke="#3b3025" stroke-width="2.5"/>
  <!-- gờ dưới vành, nét tay hơi run -->
  <path d="M38,44 Q52,50 66,50 Q80,50 94,44" fill="none" stroke="#3b3025"
        stroke-width="2.5" stroke-linecap="round"/>

  <!-- vệt sáng dọc bên phải (viền như bản vẽ, không phải mảng trắng) -->
  <path d="M85,60 Q90,58 90,66 L90,100 Q90,106 86,106 Q82,106 82,100 L82,66 Q82,61 85,60 Z"
        fill="#ffffff" fill-opacity="0.5" stroke="#3b3025" stroke-width="2" stroke-linejoin="round"/>
  <!-- vệt sáng mảnh bên trái -->
  <path d="M44,56 Q42,86 44,104" fill="none" stroke="#ffffff" stroke-width="5"
        stroke-linecap="round" opacity="0.35"/>

  <!-- cổ nối xuống ống dẫn -->
  <path d="M60,117 L60,129 Q66,132 74,129 L74,117" fill="#e6ecef"
        stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- vòi dẫn rời (tắt bằng --tubeop khi bình đã cắm vào bộ thu khí) -->
  <g style="opacity:var(--tubeop,1)">
    <path d="M67,130 Q69,144 52,148 Q34,152 30,162" fill="none" stroke="#3b3025"
          stroke-width="9" stroke-linecap="round"/>
    <path d="M67,130 Q69,144 52,148 Q34,152 30,162" fill="none" stroke="#f3f1e8"
          stroke-width="5" stroke-linecap="round"/>
    <path d="M22,156 L36,160 L33,170 L19,166 Z" fill="#e6ecef" stroke="#3b3025"
          stroke-width="3" stroke-linejoin="round"/>
  </g>

  <!-- nút chặn (bật bằng --stopop) — đậy miệng ống lại khi đã có khí -->
  <g style="opacity:var(--stopop,0)">
    <path d="M46,30 Q48,20 66,19 Q84,20 86,30 Q84,38 66,39 Q48,38 46,30 Z"
          fill="#c89a63" stroke="#3b3025" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M52,27 Q66,25 80,27" fill="none" stroke="#8a6238" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
  </g>
</symbol>


<!-- ============================================================
     FUNNEL WITH FILTER PAPER
     ============================================================ -->
<symbol id="sym-funnel" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Funnel glass body -->
  <path d="M12,16 Q14,12 18,12 L102,12 Q106,12 108,16 L72,88 Q70,92 68,96 L68,138 Q66,142 60,143 Q54,142 52,138 L52,96 Q50,92 48,88 Z"
        fill="#ffffff" opacity="0.15" stroke="none"/>

  <!-- Filter paper cone inside funnel -->
  <path d="M22,18 Q60,22 98,18 L64,84 Q62,88 60,90 Q58,88 56,84 Z"
        fill="#fffdf5" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <!-- Filter paper fold lines -->
  <path d="M60,90 L22,18" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
  <path d="M60,90 Q80,50 98,18" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
  <path d="M60,90 Q40,54 22,18" stroke="#3b3025" stroke-width="1" stroke-linecap="round" opacity="0.25"/>

  <!-- Funnel outline -->
  <path d="M14,12 L106,12 Q110,12 110,16 L72,90 Q70,94 68,98 L68,138 Q68,144 60,145 Q52,144 52,138 L52,98 Q50,94 48,90 L10,16 Q10,12 14,12 Z"
        fill="none" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Funnel rim (top ellipse suggestion) -->
  <path d="M14,12 Q62,18 106,12" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>

  <!-- Stem -->
  <path d="M52,120 L52,138 Q52,144 60,145 Q68,144 68,138 L68,120"
        fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>

  <!-- Shine on funnel bowl -->
  <path d="M24,20 Q36,50 40,82" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.33"/>
  <path d="M30,18 Q44,48 48,78" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.22"/>

  <!-- Stem shine -->
  <path d="M55,100 L55,136" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>

  <!-- Drip group (controlled by --dripop) -->
  <g style="opacity:var(--dripop,0)">
    <!-- Drip 1 -->
    <g>
      <path d="M60,145 Q58,150 60,155 Q62,150 60,145 Z" fill="#6f9ec9" opacity="0.8" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,12;0,12" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0.8;0" dur="1.8s" repeatCount="indefinite"/>
      </path>
    </g>
    <!-- Drip 2 (offset) -->
    <g>
      <path d="M60,145 Q58,150 60,155 Q62,150 60,145 Z" fill="#6f9ec9" opacity="0.8" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,12;0,12" dur="1.8s" begin="0.9s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0.8;0" dur="1.8s" begin="0.9s" repeatCount="indefinite"/>
      </path>
    </g>
  </g>

  <!-- Shadow -->
  <ellipse cx="60" cy="147" rx="14" ry="3" fill="#3b3025" opacity="0.12"/>
</symbol>
<defs>

  <!-- === GRADIENTS & CLIP PATHS (all ids prefixed cnB) === -->

  <linearGradient id="cnBglass" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity=".18"/>
    <stop offset="100%" stop-color="#dce8f0" stop-opacity=".12"/>
  </linearGradient>

  <linearGradient id="cnBsteel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#c5cdd4"/>
    <stop offset="45%"  stop-color="#e2e8ec"/>
    <stop offset="100%" stop-color="#7e8890"/>
  </linearGradient>

  <linearGradient id="cnBsteelV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#d4dde3"/>
    <stop offset="100%" stop-color="#9daab3"/>
  </linearGradient>

  <linearGradient id="cnBwood" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#d9b47a"/>
    <stop offset="100%" stop-color="#b07d42"/>
  </linearGradient>

  <linearGradient id="cnBcork" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#d8b478"/>
    <stop offset="100%" stop-color="#b8864e"/>
  </linearGradient>

  <linearGradient id="cnBoil" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#ede5b2" stop-opacity=".6"/>
    <stop offset="100%" stop-color="#d4c87a" stop-opacity=".5"/>
  </linearGradient>

  <linearGradient id="cnBbottleBody" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#d0e8f5" stop-opacity=".25"/>
    <stop offset="60%"  stop-color="#eef5fa" stop-opacity=".15"/>
    <stop offset="100%" stop-color="#b8d4e8" stop-opacity=".20"/>
  </linearGradient>

  <linearGradient id="cnBsilver" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#bfc6cc"/>
    <stop offset="50%"  stop-color="#e8ecef"/>
    <stop offset="100%" stop-color="#9aa4ab"/>
  </linearGradient>

  <clipPath id="cnBbottleClip">
    <rect x="22" y="44" width="56" height="88" rx="4"/>
  </clipPath>

  <clipPath id="cnBjarClip">
    <rect x="14" y="50" width="72" height="76" rx="4"/>
  </clipPath>

  <clipPath id="cnBcanisterClip">
    <rect x="20" y="10" width="60" height="118" rx="30"/>
  </clipPath>

</defs>


<!-- =====================================================================
     1. REAGENT BOTTLE WITH GROUND-GLASS STOPPER
     ===================================================================== -->
<symbol id="sym-bottle-liquid" viewBox="0 0 100 140">
  <defs>
    <linearGradient id="cnBbotLiquid" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#000000" stop-opacity=".06"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity=".08"/>
    </linearGradient>
  </defs>

  <!-- Bottle body: rounded shoulders, straight sides -->
  <path d="M34,47 C26,49 22,55 22,62 L22,120 C22,126 26,130 32,130 L68,130 C74,130 78,126 78,120 L78,62 C78,55 74,49 66,47 Z"
        fill="url(#cnBbottleBody)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Liquid fill: sits at the bottom, ~60% -->
  <path d="M23,78 Q37,75.5 50,76.5 Q64,77.5 77,78 L77,120 C77,126 74,128.5 68,128.5 L32,128.5 C26,128.5 23,126 23,120 Z"
        fill="var(--lc,#cfe6f2)" opacity=".85"/>

  <!-- Meniscus edge -->
  <path d="M23,78 Q37,75.5 50,76.5 Q64,77.5 77,78"
        fill="none" stroke="var(--lc,#cfe6f2)" stroke-width="2"
        stroke-linecap="round" opacity=".9"/>

  <!-- Liquid inner shading -->
  <path d="M23,78 Q37,75.5 50,76.5 Q64,77.5 77,78 L77,120 C77,126 74,128.5 68,128.5 L32,128.5 C26,128.5 23,126 23,120 Z"
        fill="url(#cnBbotLiquid)" opacity=".5"/>

  <!-- Bottle body glass highlight -->
  <path d="M28,124 Q26,95 26,66 Q26,55 31,50"
        fill="none" stroke="#ffffff" stroke-width="4"
        stroke-linecap="round" opacity=".32"/>

  <!-- Neck -->
  <path d="M34,47 Q33,38 33,30 L67,30 Q67,38 66,47"
        fill="url(#cnBbottleBody)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Frosted neck band -->
  <rect x="33" y="36" width="34" height="8" rx="2"
        fill="#dde9f0" opacity=".55" stroke="#3b3025" stroke-width="1.5"
        stroke-linecap="round"/>
  <!-- Band texture lines -->
  <line x1="39" y1="37" x2="39" y2="43" stroke="#b8cdd8" stroke-width="1" stroke-linecap="round"/>
  <line x1="45" y1="37" x2="45" y2="43" stroke="#b8cdd8" stroke-width="1" stroke-linecap="round"/>
  <line x1="51" y1="37" x2="51" y2="43" stroke="#b8cdd8" stroke-width="1" stroke-linecap="round"/>
  <line x1="57" y1="37" x2="57" y2="43" stroke="#b8cdd8" stroke-width="1" stroke-linecap="round"/>
  <line x1="63" y1="37" x2="63" y2="43" stroke="#b8cdd8" stroke-width="1" stroke-linecap="round"/>

  <!-- Stopper stem -->
  <path d="M39,30 Q38,22 39,18 L61,18 Q62,22 61,30"
        fill="#ddeaf2" stroke="#3b3025" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Stopper knob (faceted) -->
  <path d="M38,18 C37,14 38,8 41,6 Q50,3 59,6 C62,8 63,14 62,18 C57,16 43,16 38,18 Z"
        fill="#ccdee8" stroke="#3b3025" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Knob facet lines -->
  <path d="M41,15 Q50,12 59,15" fill="none" stroke="#3b3025" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>
  <path d="M40,10 Q50,7 60,10" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".35"/>
  <!-- Knob shine -->
  <ellipse cx="44" cy="9" rx="4" ry="2.5"
           fill="#ffffff" opacity=".4" transform="rotate(-15,44,9)"/>
</symbol>


<!-- =====================================================================
     2. WIDE-MOUTH JAR WITH CORK LID & POWDER
     ===================================================================== -->
<symbol id="sym-jar-powder" viewBox="0 0 100 140">

  <!-- Jar body -->
  <path d="M15,130 C14,130 12,127 12,124 L12,58 C12,54 15,52 18,51 L82,51 C85,52 88,54 88,58 L88,124 C88,127 86,130 85,130 Z"
        fill="#f0f7fc" fill-opacity=".22" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Powder heap fill -->
  <path d="M18,130 L18,92 Q25,84 35,87 Q42,82 50,83 Q60,81 68,86 Q76,82 82,90 L82,130 Z"
        fill="var(--lc,#ffffff)" clip-path="url(#cnBjarClip)"/>

  <!-- Powder mounded top edge -->
  <path d="M18,92 Q25,84 35,87 Q42,82 50,83 Q60,81 68,86 Q76,82 82,90"
        fill="none" stroke="var(--lc,#ffffff)" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18,92 Q25,84 35,87 Q42,82 50,83 Q60,81 68,86 Q76,82 82,90"
        fill="none" stroke="#3b3025" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" opacity=".4"/>

  <!-- Powder speckles (lc2) -->
  <circle cx="28" cy="100" r="2" fill="var(--lc2,#00000022)"/>
  <circle cx="38" cy="112" r="1.5" fill="var(--lc2,#00000022)"/>
  <circle cx="50" cy="95" r="2.5" fill="var(--lc2,#00000022)"/>
  <circle cx="60" cy="108" r="1.5" fill="var(--lc2,#00000022)"/>
  <circle cx="70" cy="100" r="2" fill="var(--lc2,#00000022)"/>
  <circle cx="33" cy="122" r="1.5" fill="var(--lc2,#00000022)"/>
  <circle cx="55" cy="120" r="2" fill="var(--lc2,#00000022)"/>
  <circle cx="72" cy="118" r="1.5" fill="var(--lc2,#00000022)"/>
  <circle cx="42" cy="88" r="1" fill="var(--lc2,#00000022)"/>
  <circle cx="63" cy="90" r="1" fill="var(--lc2,#00000022)"/>

  <!-- Glass shine left -->
  <path d="M17,125 Q16,90 17,60" fill="none" stroke="#ffffff" stroke-width="4.5"
        stroke-linecap="round" opacity=".3"/>
  <!-- Glass shine small right -->
  <path d="M83,80 Q84,70 83,62" fill="none" stroke="#ffffff" stroke-width="2.5"
        stroke-linecap="round" opacity=".22"/>

  <!-- Jar rim -->
  <path d="M12,58 Q12,50 50,49 Q88,50 88,58"
        fill="#d8eaf4" fill-opacity=".3" stroke="#3b3025" stroke-width="2.5"
        stroke-linecap="round"/>

  <!-- Cork lid -->
  <path d="M10,50 Q10,40 15,38 L85,38 Q90,40 90,50 Q90,54 85,56 L15,56 Q10,54 10,50 Z"
        fill="url(#cnBcork)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Cork texture strokes -->
  <path d="M22,41 Q22,53 22,55" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".55"/>
  <path d="M34,39 Q33,50 34,55" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>
  <path d="M50,38 Q50,50 50,55" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>
  <path d="M66,39 Q67,50 66,55" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".55"/>
  <!-- Cork top highlight -->
  <path d="M16,42 Q50,39 84,42" fill="none" stroke="#e8c87a" stroke-width="1.5"
        stroke-linecap="round" opacity=".45"/>
</symbol>


<!-- =====================================================================
     3. PRESSURIZED STEEL GAS CANISTER
     ===================================================================== -->
<symbol id="sym-canister" viewBox="0 0 100 140">
  <defs>
    <linearGradient id="cnBcanBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#8a9ba6"/>
      <stop offset="30%"  stop-color="#c8d4da"/>
      <stop offset="65%"  stop-color="#e4eaed"/>
      <stop offset="100%" stop-color="#7e8890"/>
    </linearGradient>
  </defs>

  <!-- Canister body -->
  <path d="M22,118 Q20,128 26,132 Q50,136 74,132 Q80,128 78,118 L78,42 Q79,28 74,22 Q50,18 26,22 Q21,28 22,42 Z"
        fill="url(#cnBcanBody)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Rounded shoulder -->
  <path d="M22,42 Q20,28 26,22 Q50,18 74,22 Q80,28 78,42"
        fill="url(#cnBsteelV)" fill-opacity=".6" stroke="#3b3025" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Bottom base band -->
  <path d="M22,118 Q20,128 26,132 Q50,136 74,132 Q80,128 78,118"
        fill="#8a9ba6" fill-opacity=".6" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round"/>

  <!-- Color band (middle) -->
  <rect x="22" y="72" width="56" height="24" rx="2"
        fill="var(--lc,#dbeefc)" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round"/>

  <!-- Hazard diamond on body (below band) -->
  <rect x="40" y="104" width="20" height="20" rx="1"
        fill="#fffdf5" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        transform="rotate(45,50,114)"/>

  <!-- Steel shine stripe left -->
  <path d="M26,118 Q24,80 26,42" fill="none" stroke="#ffffff" stroke-width="5"
        stroke-linecap="round" opacity=".28"/>
  <!-- Subtle right edge shadow -->
  <path d="M74,115 Q76,78 74,45" fill="none" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" opacity=".12"/>

  <!-- Neck / valve base -->
  <path d="M34,22 Q33,14 36,11 L64,11 Q67,14 66,22"
        fill="#9aaab3" stroke="#3b3025" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Outlet pipe (side) -->
  <path d="M64,14 Q72,13 75,11 Q77,9 76,7"
        fill="none" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="76" cy="7" r="2.5" fill="#7e8890" stroke="#3b3025" stroke-width="1.5"/>

  <!-- Valve wheel -->
  <circle cx="50" cy="8" r="9" fill="none" stroke="#3b3025" stroke-width="2.5"
          stroke-linecap="round"/>
  <circle cx="50" cy="8" r="3" fill="#9aaab3" stroke="#3b3025" stroke-width="2"/>
  <!-- Spokes -->
  <line x1="50" y1="8" x2="50" y2="1"  stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="50" y1="8" x2="50" y2="15" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="50" y1="8" x2="43" y2="8"  stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="50" y1="8" x2="57" y2="8"  stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>


<!-- =====================================================================
     4a. METAL TRAY — IRON (Fe)  rough grey-brown chunks + rust
     ===================================================================== -->
<symbol id="sym-metal-fe" viewBox="0 0 100 140">
  <!-- Tray (3/4 perspective, back edge higher) -->
  <path d="M8,115 Q8,130 12,132 L88,132 Q92,130 92,115 L88,90 Q10,88 8,90 Z"
        fill="url(#cnBwood)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Tray back wall -->
  <path d="M10,92 Q10,85 14,84 L86,84 Q90,85 90,92 L88,90 Q10,88 10,92 Z"
        fill="#b07d42" fill-opacity=".7" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Wood grain -->
  <path d="M20,132 Q18,108 20,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".4"/>
  <path d="M40,132 Q38,108 40,89" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".35"/>
  <path d="M60,132 Q60,108 60,89" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".35"/>
  <path d="M80,132 Q80,108 80,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".4"/>

  <!-- Fe chunk 1 -->
  <path d="M14,112 Q16,95 24,92 Q34,90 36,98 Q38,108 32,116 Q22,118 14,112 Z"
        fill="#8a8d90" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16,100 Q22,93 30,96" fill="none" stroke="#6f7275" stroke-width="2"
        stroke-linecap="round" opacity=".7"/>
  <circle cx="20" cy="107" r="2" fill="#b5502a"/>
  <circle cx="28" cy="112" r="1.5" fill="#b5502a"/>

  <!-- Fe chunk 2 -->
  <path d="M32,118 Q34,100 44,96 Q56,94 58,104 Q60,116 50,122 Q38,124 32,118 Z"
        fill="#8a8d90" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M36,104 Q44,98 52,102" fill="none" stroke="#6f7275" stroke-width="2"
        stroke-linecap="round" opacity=".65"/>
  <circle cx="42" cy="115" r="1.5" fill="#b5502a"/>
  <circle cx="52" cy="108" r="2" fill="#b5502a"/>

  <!-- Fe chunk 3 -->
  <path d="M56,116 Q56,98 66,94 Q76,92 80,102 Q82,112 74,120 Q62,122 56,116 Z"
        fill="#8a8d90" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M60,102 Q67,96 74,100" fill="none" stroke="#6f7275" stroke-width="2"
        stroke-linecap="round" opacity=".65"/>
  <circle cx="65" cy="112" r="2" fill="#b5502a"/>
  <circle cx="74" cy="106" r="1.5" fill="#b5502a"/>

  <!-- Fe chunk 4 (small, back) -->
  <path d="M22,94 Q24,88 32,87 Q40,86 42,93 Q34,96 22,94 Z"
        fill="#7e8184" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="30" cy="91" r="1" fill="#b5502a"/>

  <!-- Fe chunk 5 (small, back right) -->
  <path d="M60,93 Q62,87 70,86 Q78,86 80,93 Q70,96 60,93 Z"
        fill="#7e8184" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="70" cy="90" r="1" fill="#b5502a"/>
</symbol>


<!-- =====================================================================
     4b. METAL TRAY — COPPER (Cu)  shiny orange-brown strips
     ===================================================================== -->
<symbol id="sym-metal-cu" viewBox="0 0 100 140">
  <!-- Tray -->
  <path d="M8,115 Q8,130 12,132 L88,132 Q92,130 92,115 L88,90 Q10,88 8,90 Z"
        fill="url(#cnBwood)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10,92 Q10,85 14,84 L86,84 Q90,85 90,92 L88,90 Q10,88 10,92 Z"
        fill="#b07d42" fill-opacity=".7" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25,132 Q23,108 25,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".4"/>
  <path d="M55,132 Q53,108 55,89" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".38"/>
  <path d="M80,132 Q79,108 80,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".4"/>

  <!-- Cu strip 1 (leftmost) -->
  <path d="M13,128 Q12,100 14,90 Q20,88 26,90 Q28,100 26,128 Z"
        fill="#c96f33" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16,126 Q15,104 16,92" fill="none" stroke="#e8945a" stroke-width="2.5"
        stroke-linecap="round" opacity=".65"/>

  <!-- Cu strip 2 (center, overlapping) -->
  <path d="M22,130 Q21,98 24,88 Q34,85 44,88 Q46,98 44,130 Z"
        fill="#c96f33" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M26,128 Q25,102 26,90" fill="none" stroke="#e8945a" stroke-width="3"
        stroke-linecap="round" opacity=".7"/>
  <path d="M36,128 Q36,104 36,91" fill="none" stroke="#e8945a" stroke-width="2"
        stroke-linecap="round" opacity=".5"/>

  <!-- Cu strip 3 (right, overlapping) -->
  <path d="M40,129 Q39,100 42,89 Q54,86 62,89 Q64,100 62,129 Z"
        fill="#b8612a" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M44,127 Q43,105 44,91" fill="none" stroke="#e8945a" stroke-width="2.5"
        stroke-linecap="round" opacity=".6"/>
  <path d="M56,127 Q56,106 56,92" fill="none" stroke="#e8945a" stroke-width="1.5"
        stroke-linecap="round" opacity=".45"/>
</symbol>


<!-- =====================================================================
     4c. METAL TRAY — ZINC (Zn)  blue-grey granules
     ===================================================================== -->
<symbol id="sym-metal-zn" viewBox="0 0 100 140">
  <!-- Tray -->
  <path d="M8,115 Q8,130 12,132 L88,132 Q92,130 92,115 L88,90 Q10,88 8,90 Z"
        fill="url(#cnBwood)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10,92 Q10,85 14,84 L86,84 Q90,85 90,92 L88,90 Q10,88 10,92 Z"
        fill="#b07d42" fill-opacity=".7" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30,132 Q28,108 30,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".38"/>
  <path d="M65,132 Q63,108 65,89" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".38"/>

  <!-- Zn granule pile — many small rounded polys -->
  <circle cx="22" cy="122" r="5.5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="32" cy="118" r="5" fill="#8f979e" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="42" cy="124" r="6" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="52" cy="120" r="5.5" fill="#8f979e" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="62" cy="123" r="5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="72" cy="119" r="5.5" fill="#8f979e" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="82" cy="122" r="5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <!-- second row -->
  <circle cx="18" cy="112" r="5" fill="#9da4aa" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="28" cy="109" r="5.5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="38" cy="114" r="5" fill="#8f979e" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="48" cy="110" r="5.5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="58" cy="113" r="5" fill="#9da4aa" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="68" cy="110" r="5.5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="78" cy="113" r="5" fill="#8f979e" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <!-- third / back row -->
  <circle cx="24" cy="101" r="4.5" fill="#9da4aa" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="36" cy="98" r="4.5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="50" cy="100" r="5" fill="#8f979e" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="64" cy="98" r="4.5" fill="#aab1b6" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="76" cy="101" r="4.5" fill="#9da4aa" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>
  <!-- highlight specks -->
  <circle cx="22" cy="120" r="1.5" fill="#d8dde0" opacity=".7"/>
  <circle cx="48" cy="109" r="1.5" fill="#d8dde0" opacity=".65"/>
  <circle cx="72" cy="118" r="1.5" fill="#d8dde0" opacity=".65"/>
</symbol>


<!-- =====================================================================
     4d. METAL TRAY — MAGNESIUM (Mg)  coiled silver ribbon
     ===================================================================== -->
<symbol id="sym-metal-mg" viewBox="0 0 100 140">
  <!-- Tray -->
  <path d="M8,115 Q8,130 12,132 L88,132 Q92,130 92,115 L88,90 Q10,88 8,90 Z"
        fill="url(#cnBwood)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10,92 Q10,85 14,84 L86,84 Q90,85 90,92 L88,90 Q10,88 10,92 Z"
        fill="#b07d42" fill-opacity=".7" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M35,132 Q33,108 35,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".38"/>
  <path d="M70,132 Q68,108 70,89" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".38"/>

  <!-- Mg coiled ribbon — spiral drawn as nested arcs -->
  <!-- Outermost coil -->
  <path d="M50,130 Q18,128 16,112 Q14,96 32,92 Q50,88 68,94 Q82,100 80,114 Q78,126 62,130 Q50,132 40,128"
        fill="none" stroke="#ccd2d8" stroke-width="6"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M50,130 Q18,128 16,112 Q14,96 32,92 Q50,88 68,94 Q82,100 80,114 Q78,126 62,130 Q50,132 40,128"
        fill="none" stroke="#ffffff" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>

  <!-- Middle coil -->
  <path d="M50,124 Q26,122 24,112 Q22,100 38,97 Q50,94 62,98 Q72,102 70,112 Q68,120 56,124"
        fill="none" stroke="#b8c0c8" stroke-width="5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M50,124 Q26,122 24,112 Q22,100 38,97 Q50,94 62,98 Q72,102 70,112 Q68,120 56,124"
        fill="none" stroke="#ffffff" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>

  <!-- Inner coil -->
  <path d="M50,118 Q32,117 31,110 Q30,102 42,100 Q50,98 58,102 Q64,106 62,112 Q60,118 50,118"
        fill="none" stroke="#ccd2d8" stroke-width="4"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M50,118 Q32,117 31,110 Q30,102 42,100 Q50,98 58,102 Q64,106 62,112 Q60,118 50,118"
        fill="none" stroke="#ffffff" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>

  <!-- Loose ribbon end -->
  <path d="M16,112 Q10,104 12,96 Q14,90 18,88"
        fill="none" stroke="#ccd2d8" stroke-width="5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16,112 Q10,104 12,96 Q14,90 18,88"
        fill="none" stroke="#ffffff" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
  <!-- ribbon end tip highlight -->
  <circle cx="18" cy="88" r="3" fill="#d8dfe5" stroke="#3b3025" stroke-width="1.5"/>
  <circle cx="18" cy="87" r="1.2" fill="#ffffff" opacity=".6"/>
</symbol>


<!-- =====================================================================
     4e. METAL TRAY — ALUMINIUM (Al)  crumpled foil pieces
     ===================================================================== -->
<symbol id="sym-metal-al" viewBox="0 0 100 140">
  <!-- Tray -->
  <path d="M8,115 Q8,130 12,132 L88,132 Q92,130 92,115 L88,90 Q10,88 8,90 Z"
        fill="url(#cnBwood)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10,92 Q10,85 14,84 L86,84 Q90,85 90,92 L88,90 Q10,88 10,92 Z"
        fill="#b07d42" fill-opacity=".7" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40,132 Q38,108 40,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".38"/>

  <!-- Al foil piece 1 (left, crumpled) -->
  <path d="M12,126 Q14,112 10,100 Q12,92 20,90 Q28,89 34,94 Q38,100 36,108 Q40,116 36,126 Q26,130 12,126 Z"
        fill="#ccd2d8" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Facet lines -->
  <path d="M14,122 Q18,108 16,97" fill="none" stroke="#3b3025" stroke-width="1.5"
        stroke-linecap="round" opacity=".3"/>
  <path d="M22,128 Q28,114 24,100 Q22,95 26,92" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".25"/>
  <path d="M30,125 Q34,115 32,104" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".25"/>
  <!-- White highlights -->
  <path d="M18,110 Q16,102 18,95" fill="none" stroke="#ffffff" stroke-width="2.5"
        stroke-linecap="round" opacity=".4"/>
  <path d="M28,120 Q30,112 28,106" fill="none" stroke="#ffffff" stroke-width="2"
        stroke-linecap="round" opacity=".35"/>

  <!-- Al foil piece 2 (center) -->
  <path d="M32,128 Q36,110 32,97 Q36,88 48,87 Q60,87 62,96 Q66,108 62,124 Q50,132 32,128 Z"
        fill="#d6dce0" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M36,124 Q40,106 38,96" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".25"/>
  <path d="M48,130 Q52,112 48,96" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".2"/>
  <path d="M58,124 Q60,110 58,98" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".25"/>
  <path d="M40,115 Q42,104 40,96" fill="none" stroke="#ffffff" stroke-width="3"
        stroke-linecap="round" opacity=".4"/>
  <path d="M54,120 Q56,110 54,100" fill="none" stroke="#ffffff" stroke-width="2"
        stroke-linecap="round" opacity=".35"/>

  <!-- Al foil piece 3 (right) -->
  <path d="M60,126 Q62,110 58,100 Q62,90 72,89 Q82,88 86,96 Q90,106 86,118 Q80,128 60,126 Z"
        fill="#ccd2d8" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M64,122 Q66,108 64,98" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".3"/>
  <path d="M74,126 Q76,110 74,98" fill="none" stroke="#3b3025" stroke-width="1"
        stroke-linecap="round" opacity=".25"/>
  <path d="M68,118 Q66,106 68,96" fill="none" stroke="#ffffff" stroke-width="2.5"
        stroke-linecap="round" opacity=".4"/>
  <path d="M80,120 Q82,110 80,100" fill="none" stroke="#ffffff" stroke-width="2"
        stroke-linecap="round" opacity=".35"/>
</symbol>


<!-- =====================================================================
     4f. METAL TRAY — SILVER (Ag)  bright silvery lumps
     ===================================================================== -->
<symbol id="sym-metal-ag" viewBox="0 0 100 140">
  <!-- Tray -->
  <path d="M8,115 Q8,130 12,132 L88,132 Q92,130 92,115 L88,90 Q10,88 8,90 Z"
        fill="url(#cnBwood)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10,92 Q10,85 14,84 L86,84 Q90,85 90,92 L88,90 Q10,88 10,92 Z"
        fill="#b07d42" fill-opacity=".7" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M50,132 Q48,108 50,90" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".38"/>

  <!-- Ag lump 1 (left) -->
  <path d="M12,122 Q10,106 18,96 Q28,90 38,96 Q44,104 40,118 Q32,128 12,122 Z"
        fill="url(#cnBsilver)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Strong shine spot -->
  <ellipse cx="22" cy="100" rx="6" ry="4"
           fill="#ffffff" opacity=".6" transform="rotate(-20,22,100)"/>
  <ellipse cx="18" cy="98" rx="2" ry="1.5"
           fill="#ffffff" opacity=".8"/>
  <!-- Subtle facet -->
  <path d="M16,116 Q22,104 30,110" fill="none" stroke="#9aa4ab" stroke-width="2"
        stroke-linecap="round" opacity=".5"/>

  <!-- Ag lump 2 (center, largest) -->
  <path d="M34,126 Q32,104 40,94 Q50,88 62,94 Q70,102 68,120 Q58,130 34,126 Z"
        fill="url(#cnBsilver)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="46" cy="98" rx="7" ry="4.5"
           fill="#ffffff" opacity=".62" transform="rotate(-15,46,98)"/>
  <ellipse cx="42" cy="96" rx="2.5" ry="1.5"
           fill="#ffffff" opacity=".8"/>
  <path d="M38,118 Q46,106 56,114" fill="none" stroke="#9aa4ab" stroke-width="2"
        stroke-linecap="round" opacity=".45"/>

  <!-- Ag lump 3 (right) -->
  <path d="M62,122 Q60,106 68,96 Q76,90 86,96 Q92,104 88,118 Q80,128 62,122 Z"
        fill="url(#cnBsilver)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="72" cy="100" rx="6" ry="4"
           fill="#ffffff" opacity=".6" transform="rotate(-20,72,100)"/>
  <ellipse cx="68" cy="98" rx="2" ry="1.5"
           fill="#ffffff" opacity=".8"/>
  <path d="M66,116 Q72,106 80,110" fill="none" stroke="#9aa4ab" stroke-width="2"
        stroke-linecap="round" opacity=".5"/>
</symbol>


<!-- =====================================================================
     5. SODIUM (Na) — sealed jar, oil + lump at bottom
     ===================================================================== -->
<symbol id="sym-metal-na" viewBox="0 0 100 140">
  <defs>
    <linearGradient id="cnBnaOil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#ede5b2" stop-opacity=".58"/>
      <stop offset="100%" stop-color="#cfc080" stop-opacity=".48"/>
    </linearGradient>
    <clipPath id="cnBnaJarClip">
      <path d="M16,53 Q14,130 50,132 Q86,130 84,53 Z"/>
    </clipPath>
  </defs>

  <!-- Jar body (glass) -->
  <path d="M16,130 Q14,134 18,136 L82,136 Q86,134 84,130 L84,54 Q83,50 78,49 L22,49 Q17,50 16,54 Z"
        fill="#eef5fa" fill-opacity=".20" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Oil fill ~80% — covers most of the jar -->
  <path d="M16,130 L16,72 Q50,70 84,72 L84,130 Z"
        fill="url(#cnBnaOil)" clip-path="url(#cnBnaJarClip)"/>

  <!-- Oil top surface line -->
  <path d="M16,72 Q50,70 84,72"
        fill="none" stroke="#c8b460" stroke-width="1.5"
        stroke-linecap="round" opacity=".6"/>

  <!-- Na lump at bottom under oil (matte grey-beige irregular shape) -->
  <path d="M28,134 Q24,122 26,116 Q30,108 38,107 Q50,106 62,108 Q70,110 72,118 Q74,126 70,134 Z"
        fill="#d8d8cc" stroke="#3b3025" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        clip-path="url(#cnBnaJarClip)"/>
  <!-- Lump surface matte texture -->
  <path d="M30,128 Q36,118 46,116" fill="none" stroke="#bfbfb4" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>
  <path d="M50,122 Q58,118 64,122" fill="none" stroke="#bfbfb4" stroke-width="1.5"
        stroke-linecap="round" opacity=".45"/>
  <!-- Very slight top of lump where oil meets -->
  <path d="M28,116 Q38,112 50,111 Q62,112 72,116"
        fill="none" stroke="#c8c8bc" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>

  <!-- Oil shimmery layer above lump -->
  <path d="M20,104 Q50,102 80,104 L84,130 Q84,130 16,130 L16,104 Z"
        fill="#e8dfa8" fill-opacity=".18" clip-path="url(#cnBnaJarClip)"/>

  <!-- Glass jar body shine (upper-left) -->
  <path d="M19,128 Q17,92 19,56" fill="none" stroke="#ffffff" stroke-width="5"
        stroke-linecap="round" opacity=".30"/>
  <path d="M82,80 Q83,68 82,58" fill="none" stroke="#ffffff" stroke-width="2.5"
        stroke-linecap="round" opacity=".22"/>

  <!-- Jar neck / shoulder -->
  <path d="M22,49 Q22,40 26,38 L74,38 Q78,40 78,49"
        fill="#d8eaf4" fill-opacity=".25" stroke="#3b3025" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Cork lid -->
  <path d="M18,38 Q17,28 22,26 L78,26 Q83,28 82,38 Q82,44 78,46 L22,46 Q18,44 18,38 Z"
        fill="url(#cnBcork)" stroke="#3b3025" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Cork texture -->
  <path d="M28,28 Q27,42 28,45" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".55"/>
  <path d="M40,27 Q39,41 40,45" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>
  <path d="M52,26 Q52,40 52,45" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>
  <path d="M64,27 Q64,41 64,45" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".55"/>
  <path d="M76,28 Q76,41 76,45" fill="none" stroke="#8a6238" stroke-width="1.5"
        stroke-linecap="round" opacity=".5"/>
  <!-- Cork highlight -->
  <path d="M20,30 Q50,27 80,30" fill="none" stroke="#e8c87a" stroke-width="1.5"
        stroke-linecap="round" opacity=".4"/>
</symbol>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none">
<defs>

<!-- ==================== GRADIENTS & FILTERS ==================== -->

<linearGradient id="teCFlamOuter" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#e8b84b"/>
  <stop offset="100%" stop-color="#d9634f"/>
</linearGradient>

<linearGradient id="teCFuelLiq" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#e8dfa8" stop-opacity="0.55"/>
  <stop offset="100%" stop-color="#c8cc80" stop-opacity="0.7"/>
</linearGradient>

<linearGradient id="teCGlassBody" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="#e8f4f8" stop-opacity="0.5"/>
  <stop offset="100%" stop-color="#b8d4e0" stop-opacity="0.3"/>
</linearGradient>

<linearGradient id="teCBrassGrad" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#d4b84c"/>
  <stop offset="100%" stop-color="#a8821e"/>
</linearGradient>

<linearGradient id="teCSpoonGrad" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="#c8d0d6"/>
  <stop offset="100%" stop-color="#8a9aa4"/>
</linearGradient>

<linearGradient id="teCWoodRim" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#c89a63"/>
  <stop offset="100%" stop-color="#8a6238"/>
</linearGradient>

<linearGradient id="teCWindowSky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#bfe3f2"/>
  <stop offset="100%" stop-color="#e8f4fa"/>
</linearGradient>

<linearGradient id="teCNbkCover" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="#6a9450"/>
  <stop offset="100%" stop-color="#4e7038"/>
</linearGradient>

<linearGradient id="teCBasinShad" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#3b3025" stop-opacity="0.18"/>
  <stop offset="100%" stop-color="#3b3025" stop-opacity="0.04"/>
</linearGradient>

<linearGradient id="teCFlaskGrad" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#a8d4e8" stop-opacity="0.6"/>
  <stop offset="100%" stop-color="#6f9ec9" stop-opacity="0.4"/>
</linearGradient>

<clipPath id="teCPaneClip1">
  <rect x="10" y="20" width="68" height="80"/>
</clipPath>

</defs>

<!-- ==================== TOOLS ==================== -->

<!-- Alcohol Lamp -->
<!-- Giá đỡ vòng (kiềng sắt) — dựng theo bản vẽ tay frame: đế phẳng nhìn phối cảnh,
     trụ đứng, vòng đỡ chìa sang trái. Chỉ hiện khi đang đun. -->
<!-- Kiềng đun + lưới amiăng. Không đun trực tiếp trên ngọn lửa được — cốc phải đặt
     lên lưới, nên khi bật đèn thì kiềng hiện ra đỡ cốc.
     Kiềng phải RỘNG HƠN đáy cốc thì mới đỡ được — hẹp hơn là nhìn ra ngay là sai. -->
<symbol id="sym-tripod" viewBox="0 0 160 60">
  <!-- chân sau, vẽ trước để vành kiềng đè lên -->
  <path d="M80,24 L80,54" fill="none" stroke="#3b3025" stroke-width="5" stroke-linecap="round"/>
  <!-- vành kiềng -->
  <ellipse cx="80" cy="22" rx="58" ry="10" fill="none" stroke="#3b3025" stroke-width="5"/>
  <!-- lưới amiăng đặt trên vành -->
  <rect x="34" y="9" width="92" height="13" rx="3" fill="#e8e0cc" stroke="#3b3025" stroke-width="3"/>
  <path d="M49,9 L49,22 M64,9 L64,22 M80,9 L80,22 M96,9 L96,22 M111,9 L111,22"
        stroke="#3b3025" stroke-width="1.2" opacity=".45"/>
  <path d="M34,15.5 L126,15.5" stroke="#3b3025" stroke-width="1.2" opacity=".45"/>
  <!-- 2 chân trước -->
  <path d="M26,26 L14,54" fill="none" stroke="#3b3025" stroke-width="5" stroke-linecap="round"/>
  <path d="M134,26 L146,54" fill="none" stroke="#3b3025" stroke-width="5" stroke-linecap="round"/>
</symbol>

<symbol id="sym-ringstand" viewBox="0 0 150 256">
  <!-- vòng đỡ (vẽ trước để trụ đè lên chỗ giao nhau) -->
  <ellipse cx="56" cy="44" rx="46" ry="13" fill="none" stroke="#3b3025" stroke-width="5"/>
  <!-- tay nối vòng ra trụ -->
  <path d="M101,45 L114,47" fill="none" stroke="#3b3025" stroke-width="5" stroke-linecap="round"/>
  <!-- trụ đứng -->
  <path d="M118,28 L118,230" fill="none" stroke="#3b3025" stroke-width="7" stroke-linecap="round"/>
  <path d="M115,36 L115,222" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.3"/>
  <!-- đế phẳng nhìn phối cảnh -->
  <path d="M74,222 L134,212 L148,228 L88,240 Z" fill="#e8e0cc" stroke="#3b3025"
        stroke-width="4.5" stroke-linejoin="round"/>
  <path d="M88,240 L88,250 L148,238 L148,228" fill="#c9c0a6" stroke="#3b3025"
        stroke-width="4" stroke-linejoin="round"/>
</symbol>

<!-- Chuông thu khí: cái phễu ÚP NGƯỢC chụp lên miệng cốc. Khí bốc lên bị dồn vào
     cổ hẹp rồi theo ống dẫn sang bình. Miệng loe phải rộng bằng miệng cốc. -->
<symbol id="sym-gashood" viewBox="0 0 200 130">
  <!-- thân phễu úp -->
  <path d="M4,112 L64,44 Q68,36 76,36 L92,36 Q100,36 104,44 L172,112 Z"
        fill="#ffffff" fill-opacity="0.18" stroke="#3b3025" stroke-width="4"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- vệt sáng trên mặt kính -->
  <path d="M40,92 Q60,62 74,46" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.4"/>
  <!-- vành miệng loe (nhìn phối cảnh) -->
  <ellipse cx="88" cy="112" rx="84" ry="12" fill="#ffffff" fill-opacity="0.14"
           stroke="#3b3025" stroke-width="4"/>
  <!-- cổ hẹp -->
  <path d="M72,20 L72,40 Q88,44 96,40 L96,20 Z" fill="#e6ecef"
        stroke="#3b3025" stroke-width="3.5" stroke-linejoin="round"/>
  <ellipse cx="84" cy="20" rx="12" ry="4.5" fill="#e6ecef" stroke="#3b3025" stroke-width="3"/>
  <!-- ống ra: nét viền dày rồi lòng ống sáng đè lên -->
  <path d="M92,20 Q140,10 176,24 Q196,32 198,50" fill="none" stroke="#3b3025" stroke-width="10" stroke-linecap="round"/>
  <path d="M92,20 Q140,10 176,24 Q196,32 198,50" fill="none" stroke="#f3f1e8" stroke-width="5.5" stroke-linecap="round"/>
</symbol>



<symbol id="sym-lamp" viewBox="0 0 100 120">
  <!-- Đèn cồn — dựng theo bản vẽ tay dencon: thân bè thấp có vai gãy góc,
       nhãn chữ nhật lõm ở bụng, cổ đồng ngắn to bản, bấc dài ngoằn ngoèo. -->

  <!-- thân thuỷ tinh, vai gãy góc kiểu vẽ tay -->
  <path d="M20,96 Q18,106 27,110 Q50,113 73,110 Q82,106 80,96 L75,78 Q68,67 56,65 L44,65 Q32,67 25,78 Z"
        fill="url(#teCGlassBody)" stroke="#3b3025" stroke-width="3.5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- cồn bên trong -->
  <path d="M23,84 Q50,80 77,84 L79,96 Q50,101 21,96 Z" fill="url(#teCFuelLiq)"/>
  <!-- nhãn chữ nhật lõm ở bụng (đúng bản vẽ) -->
  <path d="M28,86 Q50,83 72,86 L71,102 Q50,105 29,102 Z"
        fill="none" stroke="#3b3025" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <!-- bóng sáng vai trái -->
  <path d="M30,74 Q34,70 39,69" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>

  <!-- cổ đồng: khối trụ ngắn to bản, có vành trên -->
  <path d="M35,48 L35,64 Q50,68 65,64 L65,48 Z" fill="url(#teCBrassGrad)"
        stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="50" cy="48" rx="15" ry="5" fill="url(#teCBrassGrad)" stroke="#3b3025" stroke-width="3"/>
  <path d="M37,57 Q50,60 63,57" fill="none" stroke="#a8821e" stroke-width="1.5" stroke-linecap="round"/>

  <!-- bấc: sợi dài chạy từ trong bình lên, ngoằn ngoèo như nét vẽ tay -->
  <path d="M52,92 Q46,86 51,78 Q56,70 50,62 Q45,55 50,48 Q54,42 51,36"
        fill="none" stroke="#3b3025" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- đoạn bấc nhô ra khỏi cổ: cháy thì bị ngọn lửa nuốt nên mờ dần theo --flame -->
  <path d="M51,36 Q49,32 53,29" fill="none" stroke="#3b3025" stroke-width="4" stroke-linecap="round"
        opacity="calc(1 - var(--flame,0))"/>

  <!-- ngọn lửa — bật bằng --flame -->
  <g style="opacity:var(--flame,0)">
    <path d="M52,40 Q41,31 44,17 Q46,3 52,-2 Q58,3 60,17 Q63,31 52,40 Z" fill="url(#teCFlamOuter)" stroke="#d9634f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <animateTransform attributeName="transform" type="skewX" values="0;3;-2;1;0" dur="0.6s" repeatCount="indefinite"/>
      <animate attributeName="d" values="M52,40 Q41,31 44,17 Q46,3 52,-2 Q58,3 60,17 Q63,31 52,40 Z;M52,40 Q40,32 43,16 Q46,1 52,-3 Q58,2 61,16 Q64,32 52,40 Z;M52,40 Q42,30 44,18 Q47,4 52,-1 Q57,4 60,18 Q62,30 52,40 Z;M52,40 Q41,31 44,17 Q46,3 52,-2 Q58,3 60,17 Q63,31 52,40 Z" dur="0.6s" repeatCount="indefinite"/>
    </path>
    <path d="M52,38 Q46,32 47,22 Q49,12 52,7 Q55,12 57,22 Q58,32 52,38 Z" fill="#6f9ec9" fill-opacity="0.8" stroke="none">
      <animateTransform attributeName="transform" type="skewX" values="0;-2;2;0" dur="0.6s" repeatCount="indefinite"/>
    </path>
  </g>
</symbol>

<!-- Stirring Spoon -->
<symbol id="sym-spoon" viewBox="0 0 100 100">
  <!-- Thìa xúc — dựng theo bản vẽ tay spoon: cán dài mảnh chạy chéo, đầu cán bo tròn,
       lòng thìa là ô-van nhỏ dẹt ở góc dưới trái. --spop=1 thì đội thêm đụn bột. -->

  <!-- cán: nét viền đậm rồi lõi thép sáng đè lên, cho ra kiểu vẽ tay có outline -->
  <path d="M33,70 Q52,52 78,24" fill="none" stroke="#3b3025" stroke-width="7" stroke-linecap="round"/>
  <path d="M33,70 Q52,52 78,24" fill="none" stroke="url(#teCSpoonGrad)" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M40,63 Q56,48 74,29" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
  <!-- đầu cán bo tròn -->
  <circle cx="79" cy="23" r="4.5" fill="url(#teCSpoonGrad)" stroke="#3b3025" stroke-width="3"/>

  <!-- lòng thìa: ô-van dẹt, nghiêng theo cán -->
  <ellipse cx="25" cy="78" rx="14" ry="8.5" transform="rotate(-38,25,78)"
           fill="url(#teCSpoonGrad)" stroke="#3b3025" stroke-width="3" stroke-linejoin="round"/>
  <path d="M16,80 Q20,86 28,86" fill="none" stroke="#3b3025" stroke-width="1.6" stroke-linecap="round" opacity="0.35"/>
  <path d="M18,73 Q23,70 29,72" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.5"/>

  <!-- đụn bột (chỉ hiện khi --spop; thìa khuấy trên bàn thì để trống) -->
  <g opacity="var(--spop,0)">
    <ellipse cx="25" cy="78" rx="12.5" ry="7" transform="rotate(-38,25,78)" fill="var(--lc,#d8c58a)"/>
    <!-- đụn nhọn lởm chởm như bản vẽ -->
    <path d="M13,74 Q16,64 21,62 Q24,66 27,60 Q31,63 34,60 Q37,66 36,72 Q25,66 13,74 Z"
          fill="var(--lc,#d8c58a)" stroke="#3b3025" stroke-width="2.2" stroke-linejoin="round"/>
    <ellipse cx="22" cy="68" rx="3.5" ry="2" transform="rotate(-38,22,68)" fill="#ffffff" opacity="0.3"/>
    <circle cx="30" cy="66" r="1.4" fill="#3b3025" opacity="0.35"/>
    <circle cx="24" cy="72" r="1.2" fill="#3b3025" opacity="0.3"/>
  </g>
</symbol>

<!-- Electrolysis rig: battery + two electrodes -->
<symbol id="sym-electro" viewBox="0 0 90 100">
  <!-- battery body -->
  <rect x="18" y="8" width="54" height="30" rx="5" fill="#e8b84b" stroke="#3b3025" stroke-width="3"/>
  <rect x="18" y="8" width="18" height="30" rx="5" fill="#d9634f" stroke="#3b3025" stroke-width="3"/>
  <text x="27" y="28" font-size="14" font-weight="bold" fill="#fffdf5" text-anchor="middle" font-family="sans-serif">−</text>
  <text x="54" y="28" font-size="14" font-weight="bold" fill="#3b3025" text-anchor="middle" font-family="sans-serif">+</text>
  <!-- wires -->
  <path d="M28,38 Q24,58 30,78" fill="none" stroke="#3b3025" stroke-width="3" stroke-linecap="round"/>
  <path d="M62,38 Q66,58 60,78" fill="none" stroke="#3b3025" stroke-width="3" stroke-linecap="round"/>
  <!-- electrode plates -->
  <rect x="26" y="76" width="8" height="20" rx="2" fill="#8a8d90" stroke="#3b3025" stroke-width="2.5"/>
  <rect x="56" y="76" width="8" height="20" rx="2" fill="#c96f33" stroke="#3b3025" stroke-width="2.5"/>
  <!-- spark when powered -->
  <g opacity="var(--zap,0)">
    <path d="M43,52 L47,45 L45,52 L49,46" fill="none" stroke="#e8b84b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="30" cy="74" r="3" fill="#dbeefc" opacity="0.8"/>
    <circle cx="60" cy="74" r="3" fill="#dbeefc" opacity="0.8"/>
  </g>
</symbol>

<!-- Glass stirring rod (long, so its tip visibly reaches the bottom of a tall beaker) -->
<symbol id="sym-stirrod" viewBox="0 0 36 160">
  <path d="M24,6 L12,150" stroke="#3b3025" stroke-width="8" stroke-linecap="round"/>
  <path d="M24,6 L12,150" stroke="#cfe4ea" stroke-width="5" stroke-linecap="round"/>
  <path d="M23,10 L13,140" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>
  <ellipse cx="23.5" cy="8" rx="1.8" ry="1.2" fill="#ffffff" opacity="0.7" transform="rotate(-8,23.5,8)"/>
</symbol>

<!-- Muôi đốt (muỗng đốt hoá chất): vòng cầm, cán thép dài, NẮP tròn để đậy miệng lọ khí,
     chén nhỏ ở đầu dưới đựng chất cháy. --fuel/--lc = chất trên chén, --flame/--fc = lửa. -->
<symbol id="sym-burnspoon" viewBox="0 0 50 170">
  <circle cx="25" cy="10" r="7" fill="none" stroke="#3b3025" stroke-width="3.5"/>
  <path d="M25,17 L25,148" stroke="#3b3025" stroke-width="6" stroke-linecap="round"/>
  <path d="M25,17 L25,148" stroke="#c9cdd2" stroke-width="2.6" stroke-linecap="round"/>
  <ellipse cx="25" cy="62" rx="21" ry="6" fill="#c9cdd2" stroke="#3b3025" stroke-width="3"/>
  <path d="M9,60 Q25,56 41,60" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
  <path d="M12,148 Q12,162 25,163 Q38,162 38,148 Z" fill="#aab1b8" stroke="#3b3025" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="25" cy="148" rx="13" ry="3.6" fill="#8a9198" stroke="#3b3025" stroke-width="2.5"/>
  <g style="opacity:var(--fuel,0)">
    <path d="M14,148 Q15,140 20,140 Q23,134 28,139 Q34,137 36,148 Z" fill="var(--lc,#ccd2d8)"
          stroke="#3b3025" stroke-width="2" stroke-linejoin="round"/>
  </g>
  <g style="opacity:var(--flame,0)">
    <path d="M25,146 Q11,136 16,120 Q19,108 25,99 Q31,108 34,120 Q39,136 25,146 Z"
          fill="var(--fc,#ffb347)" fill-opacity=".9" stroke="#d9634f" stroke-width="1.5" stroke-linejoin="round">
      <animateTransform attributeName="transform" type="rotate" values="0 25 146;5 25 146;-4 25 146;2 25 146;0 25 146" dur="0.5s" repeatCount="indefinite"/>
    </path>
    <path d="M25,144 Q19,136 21,126 Q23,118 25,113 Q27,118 29,126 Q31,136 25,144 Z" fill="#fffbe6" opacity=".85"/>
  </g>
</symbol>

<!-- Kính bảo hộ + găng tay treo trên móc tường. Bấm để đeo trước khi lấy hoá chất. -->
<symbol id="sym-goggles" viewBox="0 0 100 70">
  <circle cx="50" cy="5" r="3.5" fill="#8a6238" stroke="#3b3025" stroke-width="2"/>
  <path d="M50,8 L50,16" stroke="#3b3025" stroke-width="3" stroke-linecap="round"/>
  <path d="M8,32 Q50,4 92,32" fill="none" stroke="#3b3025" stroke-width="6" stroke-linecap="round"/>
  <path d="M8,32 Q50,4 92,32" fill="none" stroke="#6f9ec9" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M10,28 Q10,20 20,20 L80,20 Q90,20 90,28 L90,42 Q90,50 80,50 L58,50 Q54,42 50,42 Q46,42 42,50 L20,50 Q10,50 10,42 Z"
        fill="#cfe9f7" fill-opacity=".8" stroke="#3b3025" stroke-width="3" stroke-linejoin="round"/>
  <path d="M18,27 L31,27 M62,27 L75,27" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".85"/>
  <path d="M68,48 Q69,60 77,66 L89,66 Q94,58 92,47 Q89,43 85,46 L85,38 Q82,35 79,38 L79,47 Q74,44 68,48 Z"
        fill="#7aa95c" stroke="#3b3025" stroke-width="2.5" stroke-linejoin="round"/>
</symbol>

<!-- Litmus Box -->
<symbol id="sym-litmusbox" viewBox="0 0 100 100">
  <!-- box body (slightly wobbly card) -->
  <path d="M18,35 Q17,30 22,28 Q50,26 78,28 Q83,30 82,35 L80,78 Q81,83 76,84 Q50,86 24,84 Q19,83 20,78 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- torn corner top-right -->
  <path d="M75,28 Q80,29 82,35 L78,32 Z" fill="#f0e6c8" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- box shade lines -->
  <path d="M22,38 Q50,36 78,38" stroke="#3b3025" stroke-width="1.5" fill="none" opacity="0.18" stroke-linecap="round"/>
  <!-- slot opening -->
  <path d="M36,54 Q50,52 64,54 Q65,58 64,60 Q50,62 36,60 Q35,58 36,54 Z" fill="#e8e0cc" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- litmus strips fanning out -->
  <!-- strip left -->
  <rect x="40" y="20" width="7" height="38" rx="2" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-12,44,56)"/>
  <!-- strip center -->
  <rect x="47" y="18" width="7" height="40" rx="2" fill="#b08ed0" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- strip right -->
  <rect x="54" y="20" width="7" height="38" rx="2" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(12,57,56)"/>
  <!-- box label squiggle -->
  <path d="M30,70 Q38,68 46,70 Q54,72 62,70" stroke="#3b3025" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  <path d="M34,76 Q44,74 56,76" stroke="#3b3025" stroke-width="1.5" fill="none" opacity="0.2" stroke-linecap="round"/>
</symbol>

<!-- Lab Notebook (closed) -->
<symbol id="sym-notebook" viewBox="0 0 100 100">
  <!-- page edge stack (aged) -->
  <path d="M28,18 Q72,16 74,18 L76,82 Q74,84 28,84 Z" fill="#f0e6c8" stroke="none"/>
  <path d="M26,19 Q70,17 72,19 L74,83 Q72,85 26,85 Z" fill="#e8dcc0" stroke="none"/>
  <!-- cover body -->
  <path d="M18,16 Q20,14 68,14 Q72,14 73,18 L73,84 Q73,87 68,87 Q20,88 17,86 Q15,84 15,80 L15,20 Q15,16 18,16 Z" fill="url(#teCNbkCover)" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- spine stitches -->
  <line x1="22" y1="22" x2="22" y2="30" stroke="#f0e6c8" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="22" y1="34" x2="22" y2="42" stroke="#f0e6c8" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="22" y1="46" x2="22" y2="54" stroke="#f0e6c8" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="22" y1="58" x2="22" y2="66" stroke="#f0e6c8" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="22" y1="70" x2="22" y2="78" stroke="#f0e6c8" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <!-- cover wear lines -->
  <path d="M32,22 Q60,20 68,22" stroke="#3b3025" stroke-width="1" fill="none" opacity="0.15" stroke-linecap="round"/>
  <!-- formula doodle (squiggles) on cover -->
  <path d="M36,44 Q40,40 44,44 Q48,48 52,44" stroke="#f0e6c8" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
  <path d="M54,43 L58,43" stroke="#f0e6c8" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
  <path d="M36,54 Q42,50 46,56" stroke="#f0e6c8" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round"/>
  <path d="M50,52 L62,52" stroke="#f0e6c8" stroke-width="1.5" fill="none" opacity="0.35" stroke-linecap="round"/>
  <path d="M38,62 Q50,58 60,62" stroke="#f0e6c8" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  <!-- cover shine -->
  <path d="M28,22 Q30,18 36,18" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.2" stroke-linecap="round"/>
</symbol>

<!-- Lab Notebook (open) -->
<symbol id="sym-notebook-open" viewBox="0 0 240 140">
  <!-- left page -->
  <path d="M8,8 Q8,6 12,6 Q118,5 122,8 L122,134 Q118,137 12,136 Q8,135 8,132 Z" fill="#f7f1e3" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- right page -->
  <path d="M118,8 Q122,5 228,6 Q232,6 232,8 L232,132 Q232,135 228,136 Q122,137 118,134 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- center stitching -->
  <line x1="120" y1="14" x2="120" y2="22" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="28" x2="120" y2="36" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="42" x2="120" y2="50" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="56" x2="120" y2="64" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="70" x2="120" y2="78" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="84" x2="120" y2="92" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="98" x2="120" y2="106" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="112" x2="120" y2="120" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <line x1="120" y1="126" x2="120" y2="132" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <!-- faint ruled lines left page -->
  <line x1="18" y1="30" x2="112" y2="30" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="18" y1="44" x2="112" y2="44" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="18" y1="58" x2="112" y2="58" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="18" y1="72" x2="112" y2="72" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="18" y1="86" x2="112" y2="86" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="18" y1="100" x2="112" y2="100" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="18" y1="114" x2="112" y2="114" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <!-- faint ruled lines right page -->
  <line x1="128" y1="30" x2="222" y2="30" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="128" y1="44" x2="222" y2="44" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="128" y1="58" x2="222" y2="58" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="128" y1="72" x2="222" y2="72" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="128" y1="86" x2="222" y2="86" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="128" y1="100" x2="222" y2="100" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <line x1="128" y1="114" x2="222" y2="114" stroke="#3b3025" stroke-width="1" opacity="0.15"/>
  <!-- doodles left page: beaker sketch -->
  <path d="M24,50 L24,38 L54,38 L54,50 Q58,66 60,75 Q56,80 22,80 Q18,76 24,65 Z" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
  <line x1="24" y1="50" x2="54" y2="50" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
  <path d="M30,65 Q40,60 52,65" stroke="#6f9ec9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
  <!-- arrow doodle left -->
  <path d="M66,56 L92,56" stroke="#3b3025" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
  <path d="M86,50 L92,56 L86,62" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.4"/>
  <!-- scribbled underlines left -->
  <path d="M20,92 Q55,90 108,92" stroke="#3b3025" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
  <path d="M24,98 Q60,96 100,98" stroke="#3b3025" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.3"/>
  <!-- hexagon doodle right page -->
  <polygon points="175,48 187,42 199,48 199,60 187,66 175,60" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
  <!-- right page scribbles -->
  <path d="M134,80 Q160,78 198,80" stroke="#3b3025" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
  <path d="M134,90 Q155,88 180,90" stroke="#3b3025" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.3"/>
  <path d="M134,100 Q168,98 210,100" stroke="#3b3025" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.25"/>
</symbol>

<!-- Lab Sink -->
<symbol id="sym-sink" viewBox="0 0 140 110">
  <!-- sink basin outer -->
  <path d="M12,18 Q10,16 14,14 Q70,12 126,14 Q130,16 128,18 L124,85 Q123,90 118,91 Q70,93 22,91 Q17,90 16,85 Z" fill="#d4dde2" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- basin inner shadow -->
  <path d="M22,28 Q70,25 118,28 L116,82 Q70,84 24,82 Z" fill="url(#teCBasinShad)"/>
  <!-- basin inner surface -->
  <path d="M22,28 Q70,25 118,28 L116,82 Q70,84 24,82 Z" fill="#c0cfd6" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- drain circle -->
  <circle cx="70" cy="74" r="10" fill="#a8b8c0" stroke="#3b3025" stroke-width="2.5"/>
  <!-- drain cross slots -->
  <line x1="70" y1="64" x2="70" y2="84" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="60" y1="74" x2="80" y2="74" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <!-- gooseneck faucet -->
  <path d="M88,14 Q88,4 80,2 Q72,0 70,6 Q68,10 70,14" fill="none" stroke="#aab4bc" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M88,14 L88,20" stroke="#aab4bc" stroke-width="5" stroke-linecap="round"/>
  <!-- faucet highlight -->
  <path d="M86,4 Q86,2 82,2" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"/>
  <!-- faucet mount -->
  <rect x="82" y="12" width="12" height="8" rx="3" fill="#c9a23c" stroke="#3b3025" stroke-width="2"/>
  <!-- water drop at spout -->
  <path d="M70,22 Q68,26 70,30 Q72,26 70,22 Z" fill="#6f9ec9" fill-opacity="0.7" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round"/>

  <!-- splash group — toggled via --splash CSS var -->
  <g style="opacity:var(--splash,0)">
    <!-- 3 splash arcs above drain -->
    <path d="M65,68 Q60,58 56,54" stroke="#6f9ec9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M70,66 Q70,54 70,50" stroke="#6f9ec9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M75,68 Q80,58 84,54" stroke="#6f9ec9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
    <!-- droplets -->
    <circle cx="56" cy="52" r="3" fill="#6f9ec9" fill-opacity="0.7"/>
    <circle cx="70" cy="48" r="3" fill="#6f9ec9" fill-opacity="0.7"/>
    <circle cx="84" cy="52" r="3" fill="#6f9ec9" fill-opacity="0.7"/>
    <circle cx="62" cy="46" r="2" fill="#6f9ec9" fill-opacity="0.6"/>
    <circle cx="78" cy="46" r="2" fill="#6f9ec9" fill-opacity="0.6"/>
  </g>
</symbol>

<!-- ==================== ROOM DECOR ==================== -->

<!-- Wall Clock -->
<symbol id="sym-clock" viewBox="0 0 100 100">
  <!-- wooden rim outer -->
  <circle cx="50" cy="50" r="46" fill="url(#teCWoodRim)" stroke="#3b3025" stroke-width="3"/>
  <!-- wooden rim inner edge -->
  <circle cx="50" cy="50" r="40" fill="none" stroke="#8a6238" stroke-width="2" opacity="0.5"/>
  <!-- clock face -->
  <circle cx="50" cy="50" r="36" fill="#fffdf5" stroke="#3b3025" stroke-width="2"/>
  <!-- 12 tick marks -->
  <line x1="50" y1="16" x2="50" y2="22" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="68.4" y1="21.4" x2="65.3" y2="26.7" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="81.6" y1="34.6" x2="76.3" y2="37.7" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="86" y1="50" x2="80" y2="50" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="81.6" y1="65.4" x2="76.3" y2="62.3" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="68.4" y1="78.6" x2="65.3" y2="73.3" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="50" y1="84" x2="50" y2="78" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="31.6" y1="78.6" x2="34.7" y2="73.3" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="18.4" y1="65.4" x2="23.7" y2="62.3" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="14" y1="50" x2="20" y2="50" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18.4" y1="34.6" x2="23.7" y2="37.7" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="31.6" y1="21.4" x2="34.7" y2="26.7" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <!-- hour hand -->
  <g class="ck-h" style="transform:rotate(var(--ckh,0deg));transform-origin:50px 50px">
    <path d="M50,50 Q48,44 50,24 Q52,44 50,50 Z" fill="#3b3025" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <!-- minute hand -->
  <g class="ck-m" style="transform:rotate(var(--ckm,0deg));transform-origin:50px 50px">
    <path d="M50,50 Q49,42 50,18 Q51,42 50,50 Z" fill="#3b3025" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <!-- center pin -->
  <circle cx="50" cy="50" r="4" fill="#c9a23c" stroke="#3b3025" stroke-width="2"/>
  <circle cx="50" cy="50" r="2" fill="#3b3025"/>
</symbol>

<!-- Window -->
<symbol id="sym-window" viewBox="0 0 170 210">
  <!-- outer frame -->
  <path d="M8,8 Q8,4 14,4 Q85,3 156,4 Q162,4 162,8 L162,202 Q162,206 156,206 Q85,207 14,206 Q8,206 8,202 Z" fill="url(#teCWoodRim)" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- window glass area background (sky) -->
  <rect x="18" y="18" width="134" height="174" fill="var(--sky,#bfe3f2)" style="transition:fill 2s"/>
  <!-- hills at bottom of window -->
  <ellipse cx="52" cy="196" rx="52" ry="28" fill="#7aa95c"/>
  <ellipse cx="128" cy="198" rx="46" ry="24" fill="#5d8446"/>
  <!-- sun/moon disc -->
  <circle cx="128" cy="46" r="18" fill="var(--sun,#e8b84b)" style="transition:fill 2s"/>
  <!-- cloud -->
  <g opacity="0.82">
    <ellipse cx="48" cy="55" rx="16" ry="10" fill="#ffffff"/>
    <ellipse cx="62" cy="50" rx="14" ry="11" fill="#ffffff"/>
    <ellipse cx="76" cy="56" rx="12" ry="8" fill="#ffffff"/>
  </g>
  <!-- cross mullion horizontal -->
  <rect x="18" y="99" width="134" height="8" fill="url(#teCWoodRim)" stroke="#3b3025" stroke-width="2"/>
  <!-- cross mullion vertical -->
  <rect x="81" y="18" width="8" height="174" fill="url(#teCWoodRim)" stroke="#3b3025" stroke-width="2"/>
  <!-- outer frame border lines -->
  <path d="M18,18 Q85,16 152,18 L152,192 Q85,194 18,192 Z" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- sill -->
  <rect x="4" y="198" width="162" height="10" rx="3" fill="url(#teCWoodRim)" stroke="#3b3025" stroke-width="2.5"/>
  <!-- potted plant on sill -->
  <path d="M62,200 Q58,184 54,174 Q60,170 66,174 Q64,182 62,200 Z" fill="#7aa95c" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M62,196 Q68,180 74,172 Q80,170 82,176 Q76,182 62,196 Z" fill="#5d8446" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M56,200 Q62,198 68,200 L70,208 Q62,210 54,208 Z" fill="#c89a63" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>

<!-- Periodic Table Poster -->
<symbol id="sym-poster-periodic" viewBox="0 0 140 180">
  <!-- paper background with curl -->
  <path d="M14,6 Q14,4 18,4 Q70,3 122,4 Q126,4 126,8 L126,174 Q126,177 122,177 Q70,178 18,177 Q14,177 14,174 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- corner curl bottom-right -->
  <path d="M118,168 Q126,168 126,174 Q120,174 116,170 Z" fill="#f0e6c8" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- pin at top -->
  <circle cx="70" cy="8" r="5" fill="#d9634f" stroke="#3b3025" stroke-width="2"/>
  <circle cx="70" cy="8" r="2" fill="#ffffff" opacity="0.5"/>
  <!-- wavy title squiggle -->
  <path d="M24,22 Q35,18 46,22 Q57,26 68,22 Q79,18 90,22 Q101,26 112,22" stroke="#3b3025" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
  <path d="M30,30 Q55,27 90,30" stroke="#3b3025" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.3"/>
  <!-- periodic table grid ~7 cols x 5 rows of small rounded cells -->
  <!-- row 1 -->
  <rect x="18" y="38" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <path d="M21,42 Q25,40 29,42" stroke="#3b3025" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/>
  <rect x="34" y="38" width="14" height="12" rx="3" fill="#6f9ec9" stroke="#3b3025" stroke-width="1.5"/>
  <path d="M37,42 Q41,40 45,42" stroke="#3b3025" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/>
  <rect x="50" y="38" width="14" height="12" rx="3" fill="#7aa95c" stroke="#3b3025" stroke-width="1.5"/>
  <path d="M53,42 Q57,40 61,42" stroke="#3b3025" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/>
  <rect x="66" y="38" width="14" height="12" rx="3" fill="#d9634f" stroke="#3b3025" stroke-width="1.5"/>
  <path d="M69,42 Q73,40 77,42" stroke="#3b3025" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/>
  <rect x="82" y="38" width="14" height="12" rx="3" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5"/>
  <path d="M85,42 Q89,40 93,42" stroke="#3b3025" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/>
  <rect x="98" y="38" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <path d="M101,42 Q105,40 109,42" stroke="#3b3025" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/>
  <rect x="114" y="38" width="14" height="12" rx="3" fill="#6f9ec9" stroke="#3b3025" stroke-width="1.5"/>
  <!-- row 2 -->
  <rect x="18" y="54" width="14" height="12" rx="3" fill="#7aa95c" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="34" y="54" width="14" height="12" rx="3" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="50" y="54" width="14" height="12" rx="3" fill="#d9634f" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="66" y="54" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="82" y="54" width="14" height="12" rx="3" fill="#6f9ec9" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="98" y="54" width="14" height="12" rx="3" fill="#7aa95c" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="114" y="54" width="14" height="12" rx="3" fill="#d9634f" stroke="#3b3025" stroke-width="1.5"/>
  <!-- row 3 -->
  <rect x="18" y="70" width="14" height="12" rx="3" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="34" y="70" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="50" y="70" width="14" height="12" rx="3" fill="#6f9ec9" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="66" y="70" width="14" height="12" rx="3" fill="#7aa95c" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="82" y="70" width="14" height="12" rx="3" fill="#d9634f" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="98" y="70" width="14" height="12" rx="3" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="114" y="70" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <!-- row 4 -->
  <rect x="18" y="86" width="14" height="12" rx="3" fill="#6f9ec9" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="34" y="86" width="14" height="12" rx="3" fill="#d9634f" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="50" y="86" width="14" height="12" rx="3" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="66" y="86" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="82" y="86" width="14" height="12" rx="3" fill="#7aa95c" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="98" y="86" width="14" height="12" rx="3" fill="#6f9ec9" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="114" y="86" width="14" height="12" rx="3" fill="#d9634f" stroke="#3b3025" stroke-width="1.5"/>
  <!-- row 5 (shorter, lanthanides) -->
  <rect x="26" y="106" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="42" y="106" width="14" height="12" rx="3" fill="#9b7bb8" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="58" y="106" width="14" height="12" rx="3" fill="#7aa95c" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="74" y="106" width="14" height="12" rx="3" fill="#6f9ec9" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="90" y="106" width="14" height="12" rx="3" fill="#d9634f" stroke="#3b3025" stroke-width="1.5"/>
  <rect x="106" y="106" width="14" height="12" rx="3" fill="#e8b84b" stroke="#3b3025" stroke-width="1.5"/>
  <!-- wavy underline title squiggle -->
  <path d="M22,130 Q40,128 58,130 Q76,132 94,130 Q112,128 128,130" stroke="#3b3025" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
  <!-- extra squiggle marks on bottom -->
  <path d="M24,144 Q60,142 116,144" stroke="#3b3025" stroke-width="1.5" fill="none" opacity="0.25" stroke-linecap="round"/>
  <path d="M30,154 Q70,152 110,154" stroke="#3b3025" stroke-width="1.5" fill="none" opacity="0.2" stroke-linecap="round"/>
  <path d="M34,164 Q65,162 106,164" stroke="#3b3025" stroke-width="1" fill="none" opacity="0.15" stroke-linecap="round"/>
</symbol>

<!-- Safety Poster -->
<symbol id="sym-poster-safety" viewBox="0 0 140 180">
  <!-- paper background -->
  <path d="M14,6 Q14,4 18,4 Q70,3 122,4 Q126,4 126,8 L126,174 Q126,177 122,177 Q70,178 18,177 Q14,177 14,174 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- pin at top -->
  <circle cx="70" cy="8" r="5" fill="#d9634f" stroke="#3b3025" stroke-width="2"/>
  <circle cx="70" cy="8" r="2" fill="#ffffff" opacity="0.5"/>
  <!-- goggles doodle -->
  <!-- left lens -->
  <path d="M24,52 Q22,42 30,38 Q40,34 50,38 Q56,42 56,50 Q56,60 50,64 Q40,68 30,64 Q22,60 24,52 Z" fill="#6f9ec9" fill-opacity="0.25" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- right lens -->
  <path d="M82,52 Q80,42 88,38 Q98,34 108,38 Q114,42 116,50 Q116,60 108,64 Q98,68 88,64 Q80,60 82,52 Z" fill="#6f9ec9" fill-opacity="0.25" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- bridge between lenses -->
  <path d="M56,50 Q64,46 82,50" stroke="#3b3025" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- left strap -->
  <path d="M24,52 Q18,50 16,58 Q14,66 20,68" stroke="#3b3025" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- right strap -->
  <path d="M116,52 Q122,50 124,58 Q126,66 120,68" stroke="#3b3025" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- lens shine -->
  <path d="M28,44 Q32,40 40,42" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  <path d="M86,44 Q90,40 98,42" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  <!-- gloved hand doodle -->
  <path d="M38,100 Q34,94 30,90 Q28,84 32,82 Q36,80 38,86 L40,80 Q40,74 44,74 Q48,74 48,80 L50,76 Q50,70 54,70 Q58,70 58,76 L60,72 Q60,68 64,68 Q68,68 68,74 L68,82 Q72,78 76,80 Q80,82 78,88 Q76,94 70,100 Q66,106 62,110 Q56,116 44,114 Q36,112 38,100 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- glove cuff -->
  <path d="M34,100 Q36,110 44,114" stroke="#3b3025" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
  <!-- finger lines -->
  <path d="M48,80 L48,86" stroke="#3b3025" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"/>
  <path d="M58,76 L58,82" stroke="#3b3025" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"/>
  <path d="M68,74 L68,80" stroke="#3b3025" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"/>
  <!-- safety text -->
  <text font-family="inherit" font-size="13" fill="#d9634f" text-anchor="middle" x="70" y="140" font-weight="bold">AN TOÀN LÀ</text>
  <text font-family="inherit" font-size="13" fill="#d9634f" text-anchor="middle" x="70" y="158" font-weight="bold">TRÊN HẾT!</text>
  <!-- decorative border squiggle -->
  <path d="M22,168 Q45,166 70,168 Q95,170 118,168" stroke="#d9634f" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
</symbol>

<!-- Bench Top Texture -->
<symbol id="sym-benchtex" viewBox="0 0 400 80" preserveAspectRatio="none">
  <!-- 7 long horizontal grain strokes -->
  <path d="M4,10 Q80,8 160,11 Q240,14 320,10 Q360,8 396,11" stroke="#8a6238" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35"/>
  <path d="M4,22 Q100,20 200,24 Q300,28 396,22" stroke="#8a6238" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3"/>
  <path d="M4,34 Q70,32 150,36 Q230,40 310,34 Q360,30 396,34" stroke="#8a6238" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35"/>
  <path d="M4,46 Q120,44 240,48 Q320,50 396,46" stroke="#8a6238" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.25"/>
  <path d="M4,58 Q80,56 160,60 Q260,64 396,58" stroke="#8a6238" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3"/>
  <path d="M4,68 Q140,66 280,70 Q340,72 396,68" stroke="#8a6238" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.22"/>
  <path d="M4,76 Q100,74 200,77 Q300,80 396,76" stroke="#8a6238" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.2"/>
</symbol>

<!-- Cork Board Texture -->
<symbol id="sym-cork" viewBox="0 0 100 100" preserveAspectRatio="none">
  <!-- cork base fill -->
  <rect x="0" y="0" width="100" height="100" fill="#d9b98a"/>
  <!-- cork speckles (15) -->
  <circle cx="12" cy="8" r="2.5" fill="#8a6238" opacity="0.28"/>
  <circle cx="34" cy="15" r="1.5" fill="#8a6238" opacity="0.32"/>
  <circle cx="58" cy="7" r="2" fill="#8a6238" opacity="0.25"/>
  <circle cx="80" cy="20" r="3" fill="#8a6238" opacity="0.3"/>
  <circle cx="92" cy="10" r="1.5" fill="#8a6238" opacity="0.22"/>
  <circle cx="20" cy="38" r="2" fill="#8a6238" opacity="0.28"/>
  <circle cx="46" cy="32" r="1" fill="#8a6238" opacity="0.35"/>
  <circle cx="68" cy="45" r="2.5" fill="#8a6238" opacity="0.27"/>
  <circle cx="88" cy="38" r="1.5" fill="#8a6238" opacity="0.3"/>
  <circle cx="10" cy="62" r="3" fill="#8a6238" opacity="0.25"/>
  <circle cx="36" cy="70" r="1.5" fill="#8a6238" opacity="0.32"/>
  <circle cx="60" cy="60" r="2" fill="#8a6238" opacity="0.28"/>
  <circle cx="76" cy="78" r="2.5" fill="#8a6238" opacity="0.24"/>
  <circle cx="18" cy="88" r="1.5" fill="#8a6238" opacity="0.3"/>
  <circle cx="94" cy="86" r="2" fill="#8a6238" opacity="0.26"/>
</symbol>

<!-- ==================== ICON SET 24x24 ==================== -->

<!-- ico-play -->
<symbol id="ico-play" viewBox="0 0 24 24">
  <path d="M6,4 L6,20 L20,12 Z" fill="#3b3025" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>

<!-- ico-trophy -->
<symbol id="ico-trophy" viewBox="0 0 24 24">
  <path d="M8,3 L16,3 L16,10 Q16,15 12,17 Q8,15 8,10 Z" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16,5 Q20,5 20,9 Q20,13 16,12" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M8,5 Q4,5 4,9 Q4,13 8,12" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M12,17 L12,20" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M8,20 L16,20" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-trash -->
<symbol id="ico-trash" viewBox="0 0 24 24">
  <path d="M4,7 L20,7" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M10,3 L14,3" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M6,7 L7,20 Q7,21 8,21 L16,21 Q17,21 17,20 L18,7" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="10" y1="11" x2="10" y2="17" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="14" y1="11" x2="14" y2="17" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-back -->
<symbol id="ico-back" viewBox="0 0 24 24">
  <path d="M15,4 L7,12 L15,20" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</symbol>

<!-- ico-next -->
<symbol id="ico-next" viewBox="0 0 24 24">
  <path d="M9,4 L17,12 L9,20" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</symbol>

<!-- ico-retry -->
<symbol id="ico-retry" viewBox="0 0 24 24">
  <path d="M4,12 Q4,6 10,4 Q16,2 20,7" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M20,4 L20,8 L16,8" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20,12 Q20,18 14,20 Q8,22 4,17" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-map -->
<symbol id="ico-map" viewBox="0 0 24 24">
  <path d="M4,5 L9,3 L15,6 L20,4 L20,19 L15,21 L9,18 L4,20 Z" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="9" y1="3" x2="9" y2="18" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="15" y1="6" x2="15" y2="21" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-lock -->
<symbol id="ico-lock" viewBox="0 0 24 24">
  <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="#3b3025" stroke-width="2"/>
  <path d="M8,11 L8,7 Q8,3 12,3 Q16,3 16,7 L16,11" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <circle cx="12" cy="16" r="2" fill="#3b3025"/>
</symbol>

<!-- ico-dice -->
<symbol id="ico-dice" viewBox="0 0 24 24">
  <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="#3b3025" stroke-width="2"/>
  <circle cx="8" cy="8" r="1.5" fill="#3b3025"/>
  <circle cx="16" cy="8" r="1.5" fill="#3b3025"/>
  <circle cx="12" cy="12" r="1.5" fill="#3b3025"/>
  <circle cx="8" cy="16" r="1.5" fill="#3b3025"/>
  <circle cx="16" cy="16" r="1.5" fill="#3b3025"/>
</symbol>

<!-- ico-coin -->
<symbol id="ico-coin" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="9" fill="none" stroke="#3b3025" stroke-width="2"/>
  <line x1="12" y1="7" x2="12" y2="17" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-coinred: đồng đỏ (copper coin earned from achievements) -->
<symbol id="ico-coinred" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="9" fill="#c96f33" stroke="#3b3025" stroke-width="2"/>
  <circle cx="12" cy="12" r="4.5" fill="none" stroke="#8a4a1e" stroke-width="1.8"/>
</symbol>

<!-- ico-pause -->
<symbol id="ico-pause" viewBox="0 0 24 24">
  <rect x="6" y="4" width="4" height="16" rx="1.5" fill="#3b3025"/>
  <rect x="14" y="4" width="4" height="16" rx="1.5" fill="#3b3025"/>
</symbol>

<!-- ico-close -->
<symbol id="ico-close" viewBox="0 0 24 24">
  <line x1="5" y1="5" x2="19" y2="19" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="19" y1="5" x2="5" y2="19" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-check -->
<symbol id="ico-check" viewBox="0 0 24 24">
  <path d="M4,13 L9,18 L20,6" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</symbol>

<!-- ico-drop -->
<symbol id="ico-drop" viewBox="0 0 24 24">
  <path d="M12,3 Q12,3 5,12 Q5,18 12,21 Q19,18 19,12 Q19,6 12,3 Z" fill="#6f9ec9" fill-opacity="0.3" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9,15 Q10,12 13,12" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
</symbol>

<!-- ico-bell -->
<symbol id="ico-bell" viewBox="0 0 24 24">
  <path d="M12,2 Q18,4 18,12 L19,17 L5,17 L6,12 Q6,4 12,2 Z" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10,17 Q10,20 12,20 Q14,20 14,17" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="2" x2="12" y2="4" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-star -->
<symbol id="ico-star" viewBox="0 0 24 24">
  <polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3" fill="#e8b84b" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>

<!-- ico-flask -->
<symbol id="ico-flask" viewBox="0 0 24 24">
  <path d="M9,3 L9,10 L4,18 Q3,21 6,21 L18,21 Q21,21 20,18 L15,10 L15,3 Z" fill="url(#teCFlaskGrad)" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="8" y1="3" x2="16" y2="3" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M6,16 Q12,14 18,16" stroke="#6f9ec9" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
</symbol>

<!-- ico-sound -->
<symbol id="ico-sound" viewBox="0 0 24 24">
  <path d="M4,9 L4,15 L8,15 L14,20 L14,4 L8,9 Z" fill="#3b3025" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17,7 Q20,10 20,12 Q20,14 17,17" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M18.5,4 Q23,8 23,12 Q23,16 18.5,20" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-mute -->
<symbol id="ico-mute" viewBox="0 0 24 24">
  <path d="M4,9 L4,15 L8,15 L14,20 L14,4 L8,9 Z" fill="#3b3025" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="17" y1="7" x2="23" y2="17" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <line x1="23" y1="7" x2="17" y2="17" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
</symbol>

<!-- ico-hand -->
<symbol id="ico-hand" viewBox="0 0 24 24">
  <!-- pointing index hand, clean for use at 48px too -->
  <path d="M9,21 Q5,20 4,16 L4,11 Q4,9 6,9 L6,6 Q6,4 8,4 Q10,4 10,6 L10,4 Q10,2 12,2 Q14,2 14,4 L14,6 Q14,4 16,4 Q18,4 18,6 L18,8 Q19,8 20,9 Q21,10 20,12 L18,19 Q17,22 14,22 L10,22 Q9.5,22 9,21 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="10" y1="6" x2="10" y2="11" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
  <line x1="14" y1="6" x2="14" y2="11" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
  <line x1="18" y1="8" x2="18" y2="12" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
</symbol>

<!-- ico-note -->
<symbol id="ico-note" viewBox="0 0 24 24">
  <path d="M5,3 L15,3 L19,7 L19,21 L5,21 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- folded corner -->
  <path d="M15,3 L15,7 L19,7" fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- ruled lines -->
  <line x1="8" y1="12" x2="16" y2="12" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  <line x1="8" y1="15" x2="16" y2="15" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  <line x1="8" y1="18" x2="13" y2="18" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
</symbol>

<!-- ico-book: sách mở (sổ tay công thức, "Bạn có biết?") — trước đây được gọi mà chưa từng vẽ -->
<symbol id="ico-book" viewBox="0 0 24 24">
  <path d="M12,6 Q8,3.5 3,4.5 L3,19 Q8,18 12,20.5 Q16,18 21,19 L21,4.5 Q16,3.5 12,6 Z" fill="#fffdf5" stroke="#3b3025" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12,6 L12,20.5" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>
  <path d="M5.5,8.5 Q8,8 10,9 M5.5,12 Q8,11.5 10,12.5 M14,9 Q16,8 18.5,8.5 M14,12.5 Q16,11.5 18.5,12" fill="none" stroke="#3b3025" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/>
</symbol>

<!-- ico-gear -->
<symbol id="ico-gear" viewBox="0 0 24 24">
  <path d="M12,2 l1.4,0 0.5,2.4 a7.6,7.6 0 0 1 2,1.15 l2.3,-0.9 1,1.7 -1.8,1.6 a7.6,7.6 0 0 1 0,2.3 l1.8,1.6 -1,1.7 -2.3,-0.9 a7.6,7.6 0 0 1 -2,1.15 l-0.5,2.4 -2.8,0 -0.5,-2.4 a7.6,7.6 0 0 1 -2,-1.15 l-2.3,0.9 -1,-1.7 1.8,-1.6 a7.6,7.6 0 0 1 0,-2.3 l-1.8,-1.6 1,-1.7 2.3,0.9 a7.6,7.6 0 0 1 2,-1.15 l0.5,-2.4 z"
    fill="#fffdf5" stroke="#3b3025" stroke-width="1.6" stroke-linejoin="round"/>
  <circle cx="12" cy="12" r="3.2" fill="#fffdf5" stroke="#3b3025" stroke-width="1.6"/>
</symbol>

</svg>
`;
const BEAKER_SVG = `
<svg id="beakersvg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" width="230">
  <defs>
    <clipPath id="bkclip">
      <path d="M16,222 Q14,224 16,226 L184,226 Q186,224 184,222 L184,22 Q184,20 182,20 L18,20 Q16,20 16,22 Z"/>
    </clipPath>
    <linearGradient id="gwAglass1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
    </linearGradient>
    <linearGradient id="gwAliquid1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#cfe6f2" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#a8cfe8" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Liquid clip group -->
  <g clip-path="url(#bkclip)">
    <rect id="bk-liquid" x="14" y="222" width="172" height="0" fill="#cfe6f2" opacity="0.9" style="transition:all .4s"/>
    <rect id="bk-precip" x="14" y="222" width="172" height="0" fill="#ddd" stroke="#3b3025" stroke-width="2.5" stroke-opacity=".55"/>
    <g id="bk-precip-tex" opacity="0">
      <circle cx="30" cy="223" r="2.2" fill="#3b3025" opacity="0.18"/>
      <circle cx="48" cy="224" r="1.6" fill="#3b3025" opacity="0.15"/>
      <circle cx="65" cy="222" r="2.5" fill="#3b3025" opacity="0.18"/>
      <circle cx="82" cy="224" r="1.8" fill="#3b3025" opacity="0.16"/>
      <circle cx="100" cy="223" r="2.0" fill="#3b3025" opacity="0.18"/>
      <circle cx="118" cy="224" r="1.5" fill="#3b3025" opacity="0.14"/>
      <circle cx="136" cy="222" r="2.3" fill="#3b3025" opacity="0.17"/>
      <circle cx="154" cy="224" r="1.7" fill="#3b3025" opacity="0.15"/>
      <circle cx="170" cy="223" r="2.0" fill="#3b3025" opacity="0.18"/>
      <circle cx="42" cy="225" r="1.4" fill="#3b3025" opacity="0.13"/>
    </g>
  </g>

  <!-- Meniscus (game positions via transform) -->
  <path id="bk-meniscus" opacity="0" fill="#00000018"
    d="M16,0 Q100,-6 184,0 L184,4 Q100,10 16,4 Z"/>

  <!-- Glass artwork on top -->
  <g id="bk-glass">
    <!-- Glass body fill (translucent) -->
    <path d="M18,21 L18,218 Q18,223 22,224 L178,224 Q182,223 182,218 L182,21 Q182,19 180,19 L20,19 Q18,19 18,21 Z"
          fill="#ffffff" opacity="0.15" stroke="none"/>

    <!-- Main beaker outline with spout at upper left -->
    <path d="M182,19 Q183,18 183,17 L183,215 Q183,226 175,227 L25,227 Q17,226 17,215 L17,19 Q17,16 20,16 L170,16 Q173,16 175,18 Q178,22 180,24 L182,19 Z"
          fill="none" stroke="#3b3025" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Spout detail at upper left lip -->
    <path d="M20,16 Q14,14 10,10 Q9,8 12,9 Q16,12 20,14"
          fill="none" stroke="#3b3025" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,10 Q8,7 9,6 Q10,5 12,7 Q14,10 17,13"
          fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Bottom rounded corners accentuation -->
    <path d="M17,215 Q17,228 25,228 L175,228 Q183,228 183,215"
          fill="none" stroke="#3b3025" stroke-width="2" stroke-linecap="round"/>

    <!-- Graduation ticks on right inner wall -->
    <!-- 25% mark (~168 from top, y≈68 in 200px range from 20 to 220) -->
    <line x1="162" y1="170" x2="176" y2="170" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <text x="164" y="167" font-size="9" fill="#3b3025" opacity="0.55" font-family="inherit">50</text>

    <!-- 50% mark -->
    <line x1="162" y1="120" x2="176" y2="120" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <text x="158" y="117" font-size="9" fill="#3b3025" opacity="0.55" font-family="inherit">100</text>

    <!-- 75% mark -->
    <line x1="162" y1="70" x2="176" y2="70" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <text x="158" y="67" font-size="9" fill="#3b3025" opacity="0.55" font-family="inherit">150</text>

    <!-- 100% mark -->
    <line x1="162" y1="28" x2="176" y2="28" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <text x="158" y="25" font-size="9" fill="#3b3025" opacity="0.55" font-family="inherit">200</text>

    <!-- mL label -->
    <text x="165" y="200" font-size="8" fill="#3b3025" opacity="0.45" font-family="inherit" transform="rotate(-90,165,200)">mL</text>

    <!-- Shine highlights on left side (two curved vertical strokes) -->
    <path d="M30,28 Q28,80 29,140 Q29,170 31,200"
          fill="none" stroke="#ffffff" stroke-width="5.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M40,35 Q38,90 39,150"
          fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.28"/>

    <!-- Subtle shadow on inside right -->
    <path d="M176,25 Q178,80 177,200"
          fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity="0.08"/>
  </g>

  <!-- Condensation drops (shown while heating) -->
  <g id="bk-drops" opacity="0">
    <path d="M50,32 Q48,35 50,39 Q52,35 50,32 Z" fill="#ffffff" opacity="0.6" stroke="#3b3025" stroke-width="1.5"/>
    <path d="M70,24 Q68,27 70,31 Q72,27 70,24 Z" fill="#ffffff" opacity="0.6" stroke="#3b3025" stroke-width="1.5"/>
    <path d="M90,30 Q88,34 90,38 Q92,34 90,30 Z" fill="#ffffff" opacity="0.6" stroke="#3b3025" stroke-width="1.5"/>
    <path d="M110,22 Q108,26 110,30 Q112,26 110,22 Z" fill="#ffffff" opacity="0.6" stroke="#3b3025" stroke-width="1.5"/>
    <path d="M130,28 Q128,32 130,36 Q132,32 130,28 Z" fill="#ffffff" opacity="0.6" stroke="#3b3025" stroke-width="1.5"/>
    <path d="M150,24 Q148,28 150,32 Q152,28 150,24 Z" fill="#ffffff" opacity="0.6" stroke="#3b3025" stroke-width="1.5"/>
  </g>
</svg>
`;
/* chars.js — hand-drawn SVG character portraits for Chemlab Assistant
   Globals: CUST_LOOKS, custSVG, profSVG
   ES2019, no imports, no backticks, no DOM access */

/* ---- HD characters (baked from assets/characters/*.svg — edit those files and re-bake, see scratchpad/bake-chars.js) ---- */
var HD_CHARS = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 280 320\"><use xlink:href=\"#hd0__Image1\" x=\"38.8\" y=\"291.8\" width=\"206px\" height=\"29px\"/>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M56.387,106.937C43.054,72.271 56.183,42.079 85.787,33.787C88.362,12.3 136.226,14.062 153.019,28.376C179.951,15.951 204,44 204,76C208,98.667 204,118 192,134C190.667,114 184,100.667 172,94C176,111.333 174,126 166,138C156.667,123.333 146.667,114.667 136,112C138.667,125.333 136.667,136.667 130,146C119.333,134 108,128 96,128C98.667,140 96,150 88,158C74.667,148.667 67.333,135.333 66,118C56.667,124.667 50.667,134.667 48,148C38.667,134.667 36,120 40,104L56.387,106.937Z\" style=\"fill:url(#hd0__Linear2);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M74,96C100.667,76 131.333,74 166,90C162,99.333 156,104.667 148,106C128,95.333 108,94 88,102C81.333,100.667 76.667,98.667 74,96Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.1;fill-rule:nonzero;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M104,150C116,156.667 128,156.667 140,150L142,176C128.667,184 115.333,184 102,176L104,150Z\" style=\"fill:url(#hd0__Radial3);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        <path d=\"M105,152C116.333,158 127.667,158 139,152L140,162C128.667,167.333 117.333,167.333 106,162L105,152Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.12;fill-rule:nonzero;\"/>\n        <path d=\"M70,104C60.667,102.667 56.667,107.333 58,118C59.333,127.333 64.667,131.333 74,130L70,104Z\" style=\"fill:url(#hd0__Radial4);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        <path d=\"M174,104C183.333,102.667 187.333,107.333 186,118C184.667,127.333 179.333,131.333 170,130L174,104Z\" style=\"fill:url(#hd0__Radial5);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        <path d=\"M70,110C66,112.667 65,116.667 67,122\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;\"/>\n        <path d=\"M174,110C178,112.667 179,116.667 177,122\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M72,98C69.333,71.333 85.333,57.333 120,56C154.667,57.333 170.667,71.333 168,98C170.667,120.667 166.667,138.667 156,152C146.667,164 134.667,170 120,170C105.333,170 93.333,164 84,152C73.333,138.667 69.333,120.667 72,98Z\" style=\"fill:url(#hd0__Radial6);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M80,120C76,133.333 78.667,144.667 88,154C78.667,151.333 73.333,143.333 72,130C73.333,124.667 76,121.333 80,120Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.07;fill-rule:nonzero;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <ellipse cx=\"88\" cy=\"128\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd0__Radial7);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <ellipse cx=\"154\" cy=\"128\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd0__Radial8);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <g opacity=\"0.4\">\n            <path d=\"M96,74C113.333,68.667 130,68.667 146,74\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.6px;stroke-linejoin:miter;\"/>\n            <path d=\"M98,80C114,76 129.333,76 144,80\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.6px;stroke-linejoin:miter;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M120,104C116.667,114.667 113.333,122.667 110,128C109.333,132.667 112.667,135 120,135C127.333,135 130.667,132.667 130,128C126.667,122.667 123.333,114.667 120,104\" style=\"fill:url(#hd0__Radial9);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;\"/>\n        <path d=\"M112,130C117.333,132.667 122.667,132.667 128,130\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <ellipse cx=\"116\" cy=\"120\" rx=\"4\" ry=\"6\" style=\"fill:rgb(59,48,37);fill-opacity:0.08;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <circle cx=\"99\" cy=\"103\" r=\"20\" style=\"fill:rgb(219,230,240);fill-opacity:0.28;stroke:rgb(59,48,37);stroke-width:3.4px;stroke-linecap:butt;\"/>\n        <circle cx=\"141\" cy=\"103\" r=\"20\" style=\"fill:rgb(219,230,240);fill-opacity:0.28;stroke:rgb(59,48,37);stroke-width:3.4px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M119,101C119.667,98.333 120.333,98.333 121,101\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M79,99C72.333,97 67,97.667 63,101\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M161,99C167.667,97 173,97.667 177,101\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <clipPath id=\"hd0__clip10\">\n            <path d=\"M91.162,95.627C90.264,96.269 89.014,96.061 88.373,95.162C87.731,94.264 87.939,93.014 88.838,92.373L102.838,82.373C103.736,81.731 104.986,81.939 105.627,82.838C106.269,83.736 106.061,84.986 105.162,85.627L91.162,95.627Z\"/>\n        </clipPath>\n        <g clip-path=\"url(#hd0__clip10)\">\n            <g transform=\"matrix(1,-0,-0,1,-20,0)\">\n                <use xlink:href=\"#hd0__Image11\" x=\"108\" y=\"82\" width=\"18px\" height=\"14px\"/>\n            </g>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <clipPath id=\"hd0__clip12\">\n            <path d=\"M132.937,97.171C132.291,97.688 131.346,97.584 130.829,96.937C130.312,96.291 130.416,95.346 131.063,94.829L141.063,86.829C141.709,86.312 142.654,86.416 143.171,87.063C143.688,87.709 143.584,88.654 142.937,89.171L132.937,97.171Z\"/>\n        </clipPath>\n        <g clip-path=\"url(#hd0__clip12)\">\n            <g transform=\"matrix(1,-0,-0,1,-20,0)\">\n                <use xlink:href=\"#hd0__Image13\" x=\"150.5\" y=\"86.5\" width=\"13px\" height=\"11px\"/>\n            </g>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M80,84C92,78 104,77.333 116,82C113.333,86.667 107.333,88.667 98,88C90,87.333 84,86 80,84Z\" style=\"fill:url(#hd0__Linear14);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;stroke-linecap:butt;\"/>\n        <path d=\"M124,82C136,77.333 148,78 160,84C156,86 150,87.333 142,88C132.667,88.667 126.667,86.667 124,82Z\" style=\"fill:url(#hd0__Linear15);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M120,132C117.333,134 115.333,135 114,135C103.333,131 94.667,131.667 88,137C82.667,141.667 82,145.667 86,149C92.667,153.667 99.333,153 106,147C111.333,141.667 116,138.667 120,138C124,138.667 128.667,141.667 134,147C140.667,153 147.333,153.667 154,149C158,145.667 157.333,141.667 152,137C140,131.667 131.333,131 126,135C124.667,135 122.667,134 120,132Z\" style=\"fill:url(#hd0__Linear16);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path class=\"x-neutral\" d=\"M104,150C114.667,154.667 125.333,154.667 136,150\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linejoin:miter;\"/><path class=\"x-happy\" d=\"M102,146C110,164 130,164 138,146C132,159 126,161 120,161C114,161 108,159 102,146Z\" style=\"fill:rgb(160,74,60);stroke:rgb(59,48,37);stroke-width:2.6px;\"/><path class=\"x-annoy\" d=\"M104,156C114,149 126,149 136,156\" style=\"fill:none;stroke:rgb(59,48,37);stroke-width:2.6px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M104,172C77.333,178.667 58,190 46,206C35.333,220.667 29.333,258.667 28,320L216,320C214.667,258.667 212.747,212.667 202.08,198C190.08,182 166.667,178.667 140,172C128,178.667 115.333,178.667 102,172L104,172Z\" style=\"fill:url(#hd0__Linear17);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        <path d=\"M120,176C109.333,177.333 99.333,182 90,190C104.667,187.333 114.667,190 120,198L120,176Z\" style=\"fill:url(#hd0__Linear18);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        <path d=\"M120,176C130.667,177.333 140.667,182 150,190C135.333,187.333 125.333,190 120,198L120,176Z\" style=\"fill:rgb(243,237,220);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        <path d=\"M104,168C114.667,174.667 126.667,174.667 140,168L136,178C126.667,183.333 117.333,183.333 108,178L104,168Z\" style=\"fill:rgb(234,227,210);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M120,190C110.667,184.667 104.667,185.333 102,192C112.667,196 118.667,195.333 120,190ZM120,190C129.333,184.667 135.333,185.333 138,192C127.333,196 121.333,195.333 120,190Z\" style=\"fill:rgb(232,184,75);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <circle cx=\"120\" cy=\"190\" r=\"3.5\" style=\"fill:rgb(201,162,60);stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <g opacity=\"0.35\">\n            <path d=\"M70,232C74,258.667 74.667,286.667 72,316\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.6px;stroke-linejoin:miter;\"/>\n            <path d=\"M172,232C168,258.667 167.333,286.667 170,316\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.6px;stroke-linejoin:miter;\"/>\n            <path d=\"M120,214L120,318\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.6px;stroke-linejoin:miter;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <circle cx=\"120\" cy=\"238\" r=\"3.4\" style=\"fill:rgb(232,184,75);stroke:rgb(59,48,37);stroke-width:1.8px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <circle cx=\"120\" cy=\"266\" r=\"3.4\" style=\"fill:rgb(232,184,75);stroke:rgb(59,48,37);stroke-width:1.8px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,11.189759,8)\">\n        <path d=\"M158,214L158,200M166,214L166,198\" style=\"fill-rule:nonzero;stroke:rgb(217,99,79);stroke-width:4px;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,11.189759,8.5)\">\n        <path d=\"M158,200L158,197M166,198L166,195\" style=\"fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:4px;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M64,266C70.667,262 76,262.667 80,268C82.667,274.667 80.667,279.333 74,282C64.667,283.333 60,280.667 60,274C60,270.667 61.333,268 64,266Z\" style=\"fill:rgb(122,169,92);fill-opacity:0.4;fill-rule:nonzero;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M150,286C155.333,283.333 159.333,284 162,288C164,293.333 162.333,296.667 157,298C150.333,298.667 147,296.667 147,292L150,286Z\" style=\"fill:rgb(232,184,75);fill-opacity:0.45;fill-rule:nonzero;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <g transform=\"matrix(1,0,0,1.105635,-14.790225,-19.813685)\">\n            <path d=\"M62.47,206.5C48.51,222.383 48.29,258.374 44.98,283C46.313,293.667 74.361,290.786 74.147,281.743C80.814,261.743 76.79,238.387 84.79,223.72C75.457,214.387 67.803,215.833 62.47,206.5Z\" style=\"fill:url(#hd0__Linear19);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.283598,-29.290225,227.375885)\">\n            <path d=\"M60.5,213.094C58.44,255.353 70.22,288.285 89.011,258.362C94.764,273.225 114.311,267.405 114.098,258.362C120.765,238.362 83.08,228.796 91.08,214.129C81.747,204.796 67.533,205.043 60.5,213.094Z\" style=\"fill:rgb(237,232,220);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        </g>\n        <g>\n            <g transform=\"matrix(1,0,0,1,0,4.444444)\">\n                <path d=\"M60,282C69.333,284.667 78,283.333 86,278C90,284.667 89.333,290.667 84,296C76.139,299.93 69.003,300.602 62.59,298.015C60.301,297.092 58.104,295.754 56,294C54.667,288.667 56,284.667 60,282Z\" style=\"fill:url(#hd0__Radial20);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n            </g>\n            <path d=\"M66,290C68.395,293.973 68.372,298.527 66,304M74,290C76.667,295.333 77,300 75,304M82,288C84.667,293.333 85,297.667 83,301\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,1,2.550039,34.446776)\">\n            <path d=\"M182,280C191.333,284 202.053,279.92 208.72,275.92C212.72,282.587 210.877,296.377 204.21,301.71C193.543,305.71 182.667,300.667 176,294C174.667,288.667 176.667,284 182,280Z\" style=\"fill:url(#hd0__Radial21);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n            <path d=\"M188,288C190,293.333 189.667,298 187,302M196,288C198,293.333 198,297.667 196,301M204,286C205.333,291.333 205,295.333 203,298\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(1.054274,0,0,1.464336,-8.680461,-94.653142)\">\n            <path d=\"M200.192,201.22C217.525,211.886 209.515,248.593 208.182,276.593C196.818,280.799 190.797,280.313 181.49,278.73C175.268,264.213 177.887,260.766 177.275,243.228C177.14,239.341 177.378,224.51 175.6,221.25C183.6,211.916 188.29,206.49 200.192,201.22Z\" style=\"fill:url(#hd0__Linear22);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <path d=\"M78,244C75.333,246.667 73.333,250 72,254\" style=\"fill:none;fill-rule:nonzero;stroke:white;stroke-opacity:0.5;stroke-width:3px;stroke-linecap:butt;\"/>\n        <g>\n            <path d=\"M74,238L74,254L60,280C58,286.667 60.667,290.667 68,292L92,292C99.333,290.667 102,286.667 100,280L86,254L86,238L74,238Z\" style=\"fill:white;fill-opacity:0.22;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.8px;stroke-linecap:butt;\"/>\n            <g transform=\"matrix(1,0,0,1,0.489992,5.080062)\">\n                <path d=\"M67,268L91,268C95.667,274.667 97,279.333 95,282C84.333,286 73.667,286 63,282C61,279.333 62.333,274.667 67,268Z\" style=\"fill:url(#hd0__Linear23);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:0.8px;stroke-linecap:butt;\"/>\n            </g>\n            <path d=\"M88,232L88,238C88,239.104 87.104,240 86,240L74,240C72.896,240 72,239.104 72,238L72,232C72,230.896 72.896,230 74,230L86,230C87.104,230 88,230.896 88,232Z\" style=\"fill:rgb(230,224,207);stroke:rgb(59,48,37);stroke-width:2.8px;stroke-linecap:butt;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <circle cx=\"78\" cy=\"276\" r=\"2\" style=\"fill:white;fill-opacity:0.7;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,20,0)\">\n        <circle cx=\"84\" cy=\"272\" r=\"1.4\" style=\"fill:white;fill-opacity:0.6;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,4.189759,8)\">\n        <rect x=\"150\" y=\"214\" width=\"30\" height=\"24\" style=\"fill:rgb(247,240,223);fill-rule:nonzero;stroke:rgb(206,202,191);stroke-width:0.7px;stroke-linecap:butt;\"/>\n    </g>\n    <defs>\n        <image id=\"hd0__Image1\" width=\"206px\" height=\"29px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAAAdCAYAAADitVNFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEqklEQVR4nO2bS3LbMAyGIadX6b77nj/77HOWWl20VCgYjx8gKNmOMaMhCYAUE/ILQNpZ6CU7+f3r53L2HO5R3j8+17PncE/ydJvkhI3/qL/Dw0F4JvgeYtELYaj8eR/idwdK1YYuGecRADt98QegiPab7V/Vd5aMbMZI3+h7UvM6G67DFjgIiOc72x71i/qeKTM2tuczakd9iOgYqMoXGwTE8tFss/WeDbFH/Y4UdDNlN/lZes9GRPUwDS+wAwq6eSW/WT6ReXn6qE9V/9lpV3STZnVVPhHdJiMwhRfbACW6sWfYMm1NZ+k9G2I/UkZSJTQCRCHw+qO+kXGkNhHFIYIWF4QlW68Yg9cr2ojtXs9AFWlZJGWqAKKiHu0ntSGIzMUUgEEhQGzZ/mjds3n+iB61V/XRpPrAn4WGt6ugscDI+Hg6IrIBEhfPACZSZvpIpaez6pm2pkNsEZ+jZcbN10iahEaJKDQeUKjPJhJANwvMoPGAkNpS3dJFSq3+ggWXIy4HIulcFiAPCM2O+LsA/egNAjQSJPyR7Fp/qW6Vns6qS+2ILmIf9T9CIulcRfSRdEgal4WmlVbd0vW2xZnr1wIr0HjPhWQoJIjI0Fllpk6OvhqUbJ8zJHoeQvplz0TZVC4DDG/z52rYtne1qLMQQdBchPpF8fUiT6TkdaSt6RBbxGdUKt+RhaFy/GiUqjoPReGRALkKde63vev943PdpWokR44L7WHh4HCAeH8S6lJp1aW2prP0o75ROSoKae+pAgoZ3/pZV8U+kt5l0raV/u1XDsnStel/eenaN/Pi4BDpadcb7eHxIg8J9b5E65YOsVX2eTSZ/TPyswA6j1XR9zZLlwFIepau7CEhkuHZxl2UNO2iPG+EgUNCnVgdiSiWHrWPyHeAy5KZKWA2/ctCpJ1rWtT507WlZ5e29RHH2vw8NUPBkUpel9qozZPvvvFHZfT3Z8GRHbv141FrFWw8skiHfmLt5s/3q5uq8Ql6FwBImkZG3dJZ8oLi/gVdIw0wK5VbmE4CqPn1fa7M1tIxaw/fzO+iTBiVisN55p0vaJ5LRi9zvD/K3Fc7LsBiRZwmXr6ISH8I68fifzVI0Gvzkd7xkvuX7LlJ64fcuiEXBbyP+V4OjpUPtsPUwto8avU5Ir+54GFUu6a0RPPPLsgLuLxUXh54Y3kXBVFo+Oc12geg4rt7cKRN3r+ET3ilrztx5JyjXRJY0UfLcUdDOx9vthwN5xE/kyeROVi+1i1a30Zu1Fqbf+Bp3aCJc1uIdt8c4JtfukmTPgzNgOPdtkUuEJC8dlS+S2SqgA4ZA0m9eDsaYXqdlUVZAF35uNI3B/ik+YdAbYAWKfrbiJayzQZIakuLoJ2frLEsQc9gjygjsGRSLEkfBSYTaTRoJIDMs8+2AVjUaaUUfbQ2AgwKDwKRB5SmQ2wRn5n9K2QmFJ6fdy7x2urGpVsgLB3yWF/y3MbbfcmzCQAPAommk8blOqnM1KW2prP0qH3Uf7ZE4cmmWtWgSLpspOE25OH9ZXCIoP/J6eseJCPRxgIIBQaFJwsU6oMIOk7FGQQdy7JXQaLVo/CMAKT57+bR/yPbX+x3unOi3MtDAAAAAElFTkSuQmCC\"/>\n        <linearGradient id=\"hd0__Linear2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,144.454545,-144.454545,0,38.2,13.545455)\"><stop offset=\"0\" style=\"stop-color:rgb(236,234,226);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(195,194,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(156,155,145);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd0__Radial3\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(28,0,0,28,118.8,162.16)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd0__Radial4\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(18.530556,0,0,18.530556,64.575,113.837222)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd0__Radial5\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(18.530556,0,0,18.530556,176.825,113.837222)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd0__Radial6\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(79.8,0,0,79.8,112.192,99.32)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd0__Radial7\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,88,128)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd0__Radial8\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,154,128)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd0__Radial9\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(21.7,0,0,21.7,118.386667,115.78)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <image id=\"hd0__Image11\" width=\"18px\" height=\"14px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAHUlEQVQokWP8////GQYqACZqGDJq0KhBowbRzyAAUAcD5egFkncAAAAASUVORK5CYII=\"/>\n        <image id=\"hd0__Image13\" width=\"13px\" height=\"11px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAALCAYAAACksgdhAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGElEQVQokWP8////TAYSAROpGkY1DXNNAD4IA6y4sc+FAAAAAElFTkSuQmCC\"/>\n        <linearGradient id=\"hd0__Linear14\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,9.1875,-9.1875,0,80,78.9375)\"><stop offset=\"0\" style=\"stop-color:rgb(236,234,226);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(195,194,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(156,155,145);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd0__Linear15\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,9.1875,-9.1875,0,124,78.9375)\"><stop offset=\"0\" style=\"stop-color:rgb(236,234,226);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(195,194,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(156,155,145);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd0__Linear16\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,20.0625,-20.0625,0,83.428571,132)\"><stop offset=\"0\" style=\"stop-color:rgb(236,234,226);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(195,194,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(156,155,145);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd0__Linear17\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,148,-148,0,28,172)\"><stop offset=\"0\" style=\"stop-color:rgb(255,254,249);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(230,224,207);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd0__Linear18\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(30,0,0,30,90,176)\"><stop offset=\"0\" style=\"stop-color:rgb(243,237,220);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(255,254,249);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd0__Linear19\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,80,-80,0,44.8,206)\"><stop offset=\"0\" style=\"stop-color:white;stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(230,224,207);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd0__Radial20\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(23.15,0,0,23.15,69.39,286.191111)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd0__Radial21\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(22.855,0,0,22.855,189.313,287.695)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <linearGradient id=\"hd0__Linear22\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(42.142857,0,0,42.142857,158,206)\"><stop offset=\"0\" style=\"stop-color:rgb(243,237,220);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(255,254,249);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd0__Linear23\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,17,-17,0,62.1,268)\"><stop offset=\"0\" style=\"stop-color:rgb(143,208,168);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(77,156,111);stop-opacity:1\"/></linearGradient>\n    </defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"118\" cy=\"104\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"118\" cy=\"104.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"119.4\" cy=\"102.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><ellipse cx=\"162\" cy=\"104\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"162\" cy=\"104.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"163.4\" cy=\"102.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><rect class=\"blinklid\" x=\"108\" y=\"96\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#eecfa8\" stroke=\"none\"/><rect class=\"blinklid\" x=\"152\" y=\"96\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#eecfa8\" stroke=\"none\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 280 280\"><use xlink:href=\"#hd1__Image1\" x=\"53.4\" y=\"252.4\" width=\"173px\" height=\"28px\"/>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(1,0,0,1,-38,2.204651)\">\n            <circle cx=\"120\" cy=\"34\" r=\"18\" style=\"fill:url(#hd1__Linear2);stroke:rgb(59,48,37);stroke-width:3px;\"/>\n        </g>\n        <g transform=\"matrix(0.920554,0,0,1.289372,11.255319,-2.303377)\">\n            <path d=\"M58,100C47.333,69.333 54.667,47.333 80,34C98.667,18 119.333,14 142,22C168.667,28.667 182,46 182,74C184.667,91.333 182,106.667 174,120C174,104 169.333,92.667 160,86C161.333,99.333 158.667,110 152,118C146.667,106 139.333,98.667 130,96C131.333,106.667 128.667,115.333 122,122C114,112.667 109.333,102 108,90C101.333,95.333 96.667,103.333 94,114C86,103.333 83.333,90 86,74C76.667,78 70.667,86.667 68,100C60,90.667 56.667,80.667 58,70L58,100Z\" style=\"fill:url(#hd1__Linear3);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n        </g>\n        <g transform=\"matrix(0.79572,0,0,1,-16.754864,0.726329)\">\n            <path d=\"M104,30C114.667,23.333 125.333,23.333 136,30\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(0.697363,0,0,1,50.263727,20)\">\n            <path d=\"M84,140C94.667,146 105.333,146 116,140L118,164C106,171.333 94,171.333 82,164L84,140Z\" style=\"fill:url(#hd1__Radial4);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        </g>\n        <path d=\"M85,142C95,147.333 105,147.333 115,142L116,151C106,155.667 96,155.667 86,151L85,142Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.12;fill-rule:nonzero;\"/>\n        <g transform=\"matrix(1,0,0,1,20.833333,10.235294)\">\n            <path d=\"M54,96C45.333,94.667 41.667,99 43,109C44.333,117.667 49.333,121.333 58,120L54,96Z\" style=\"fill:url(#hd1__Radial5);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        </g>\n        <path d=\"M146,96C154.667,94.667 158.333,99 157,109C155.667,117.667 150.667,121.333 142,120L146,96Z\" style=\"fill:url(#hd1__Radial6);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M72,100C69.333,73.333 85.333,59.333 120,58C154.667,59.333 170.667,73.333 168,100C170.667,122.667 166.667,140.667 156,154C146.667,166 134.667,172 120,172C105.333,172 93.333,166 84,154C73.333,140.667 69.333,122.667 72,100Z\" style=\"fill:url(#hd1__Radial7);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M80,122C76,135.333 78.667,146.667 88,156C78.667,153.333 73.333,145.333 72,132C73.333,126.667 76,123.333 80,122Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.07;fill-rule:nonzero;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd1__Radial8);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd1__Radial9);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g opacity=\"0.4\">\n            <path d=\"M94,72C111.333,66.667 128,66.667 144,72\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.5px;stroke-linejoin:miter;\"/>\n            <path d=\"M96,78C112,74 127.333,74 142,78\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.5px;stroke-linejoin:miter;\"/>\n            <path d=\"M78,110C82,114 83.333,118.667 82,124\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.5px;stroke-linejoin:miter;\"/>\n            <path d=\"M162,110C158,114 156.667,118.667 158,124\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.5px;stroke-linejoin:miter;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M80,150C84,152.667 85.333,156 84,160\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-opacity:0.35;stroke-width:1.4px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M160,150C156,152.667 154.667,156 156,160\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-opacity:0.35;stroke-width:1.4px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M120,106C117.333,116 114.333,123.333 111,128C110.333,132 113.333,134 120,134C126.667,134 129.667,132 129,128C125.667,123.333 122.667,116 120,106\" style=\"fill:url(#hd1__Radial10);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;\"/>\n        <path d=\"M113,130C117.667,132.667 122.333,132.667 127,130\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.8px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <circle cx=\"99\" cy=\"103\" r=\"17\" style=\"fill:rgb(219,230,240);fill-opacity:0.22;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        <circle cx=\"141\" cy=\"103\" r=\"17\" style=\"fill:rgb(219,230,240);fill-opacity:0.22;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M116,101C118.667,99 121.333,99 124,101\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M82,99C75.333,97 70.333,97.667 67,101\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(0.72,0,0,1.232425,84.24,-22.748638)\">\n        <path d=\"M158,99C164.667,97 169.667,97.667 173,101\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <clipPath id=\"hd1__clip11\">\n            <path d=\"M89.937,96.171C89.291,96.688 88.346,96.584 87.829,95.937C87.312,95.291 87.416,94.346 88.063,93.829L98.063,85.829C98.709,85.312 99.654,85.416 100.171,86.063C100.688,86.709 100.584,87.654 99.937,88.171L89.937,96.171Z\"/>\n        </clipPath>\n        <g clip-path=\"url(#hd1__clip11)\">\n            <g transform=\"matrix(1,-0,-0,1,-40,0)\">\n                <use xlink:href=\"#hd1__Image12\" x=\"127.5\" y=\"85.5\" width=\"13px\" height=\"11px\"/>\n            </g>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M80,84C92,78.667 103.333,78 114,82C111.333,86 106,87.667 98,87C90.667,86.333 84.667,85.333 80,84Z\" style=\"fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n        <path d=\"M124,82C135.333,78 146.667,78.667 158,84C154,86 148,87 140,87C131.333,87 126,85.333 124,82Z\" style=\"fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path class=\"x-neutral\" d=\"M104,152C114.667,156.667 125.333,156.667 136,152\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linejoin:miter;\"/><path class=\"x-happy\" d=\"M102,148C110,166 130,166 138,148C132,161 126,163 120,163C114,163 108,161 102,148Z\" style=\"fill:rgb(160,74,60);stroke:rgb(59,48,37);stroke-width:2.6px;\"/><path class=\"x-annoy\" d=\"M104,158C114,151 126,151 136,158\" style=\"fill:none;stroke:rgb(59,48,37);stroke-width:2.6px;\"/>\n    </g>\n    <g transform=\"matrix(-0.936204,0.351457,-0.351457,-0.936204,226.489764,95.136953)\">\n        <path d=\"M55.905,64.146C62.572,53.479 92.998,50.561 103.664,51.895C99.664,57.228 81.754,68.136 89.523,67.844C80.19,66.511 62.572,62.813 55.905,64.146Z\" style=\"fill:url(#hd1__Linear13);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M108,176C85.333,181.333 68.667,191.333 58,206C48.667,219.333 43.333,248.667 42,294L198,294C196.839,254.51 183.166,216.674 183.166,216.674C183.166,216.674 180.284,208.808 179.081,207.089C168.415,192.423 154.667,181.333 132,176C124,181.333 116,181.333 108,176Z\" style=\"fill:url(#hd1__Linear14);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        <path d=\"M120,180C112,181.333 104.667,185.333 98,192C109.333,190.667 116.667,193 120,199L120,180Z\" style=\"fill:url(#hd1__Linear15);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        <path d=\"M120,180C128,181.333 135.333,185.333 142,192C130.667,190.667 123.333,193 120,199L120,180Z\" style=\"fill:rgb(125,95,153);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        <path d=\"M120,192L120,288\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-opacity:0.3;stroke-width:1.6px;stroke-linecap:butt;\"/>\n        <circle cx=\"120\" cy=\"214\" r=\"3\" style=\"fill:rgb(232,184,75);stroke:rgb(59,48,37);stroke-width:1.6px;stroke-linecap:butt;\"/>\n        <circle cx=\"120\" cy=\"240\" r=\"3\" style=\"fill:rgb(232,184,75);stroke:rgb(59,48,37);stroke-width:1.6px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(1.036802,0,0,1.036802,5.403219,-2.048413)\">\n            <g transform=\"matrix(1,0,0,1,1.082348,1.182901)\">\n                <g transform=\"matrix(1,0,0,1,-6.285714,0.853194)\">\n                    <path d=\"M50,258C58.667,260.667 55.772,261.149 63.105,255.816C67.105,261.816 71.16,266.729 65.826,272.062C55.826,276.729 53.333,275 46,269C44.667,264.333 46,260.667 50,258Z\" style=\"fill:url(#hd1__Radial16);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n                </g>\n                <g transform=\"matrix(1.050464,0,0,1,2.367657,0.269737)\">\n                    <path d=\"M52.464,188.695C52.464,188.695 31.333,220.667 34,246C36.007,265.101 42.164,262.983 52.119,258.91C54.679,240.243 56.978,207.847 65.826,193.847C58.333,185.518 52.464,188.695 52.464,188.695Z\" style=\"fill:rgb(136,105,164);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n                </g>\n            </g>\n            <g transform=\"matrix(0.781534,0,0,0.6,0.923471,106.615694)\">\n                <path d=\"M55,265C57.667,269.667 57.667,274 55,278M63,265C65.667,269.667 66,274 64,278M71,263C72.539,265.694 73.301,268.166 73.285,270.416C73.274,272.063 72.845,273.591 72,275\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.63px;stroke-linecap:butt;\"/>\n            </g>\n        </g>\n        <g transform=\"matrix(0.949056,0,0,0.949056,25.913759,25.965764)\">\n            <g transform=\"matrix(0.846396,0,0,1.058816,24.315527,-25.222955)\">\n                <path d=\"M153.785,256.726C162.451,260.06 166,259.333 172,256C176,262 174.667,267.667 168,273C158.667,276.333 153.572,277 146.905,271C145.572,266.333 148.451,260.726 153.785,256.726Z\" style=\"fill:url(#hd1__Radial17);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n            </g>\n            <g transform=\"matrix(1,0,0,1,-2.80926,-8.329661)\">\n                <path d=\"M155,263C157,267.667 159.956,270.83 157.289,274.83M163,263C165,267.667 165,271.667 163,275M171,261C172.333,265.667 172,269.333 170,272\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;\"/>\n            </g>\n            <g transform=\"matrix(1.017964,0,0,0.992866,3.451942,-6.453408)\">\n                <path d=\"M138.916,183.826C154.916,194.493 165.766,230.462 165.274,244C165.094,248.946 168.888,254.26 160.769,258.116C156.704,260.047 150.329,256.921 145.755,258.761C138.422,241.427 138.054,207.484 130.721,193.484C138.054,184.817 134.249,192.493 138.916,183.826Z\" style=\"fill:url(#hd1__Linear18);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n            </g>\n        </g>\n    </g>\n    <defs>\n        <image id=\"hd1__Image1\" width=\"173px\" height=\"28px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAAAcCAYAAAATOT+TAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAELklEQVR4nOWbS3LbMAyGKbdX6b77nj/77HuWyl20dGHoxxu0lAYzGoEA+Ij5CYJkZxv/ofz4/m07ew1Xkbf3n/ez19AtH2JzF0P4IT4DJstA/AiQn7ZhDSBG+7/qb0XzvAqE6DyldZ0F+NKNDILpjbXizoRZG6tzg7vh9I4XmncV1C0b5oCz4pd8UbtnHd39MpLdaK2f5Mv0qfhaQE5thgKp147iOvt2gduZtVfeuiMQodizbCmI3ZsigKrBkvVF29G+XFZCHJEuSJFfa0diK2N5Lh4XxOomAFAlWJDutaF1ROax+qM2kq6aOiOdNWUWskwc0r02dX4NXrgBCqzdZ8nmialkXy5nAjulC9xqJozC231+0hG8h01gwFJYuI5A9NrQ2aNnoZVsEX821pKVZQG3RaHtAFbSqU0dh4P79OETYDVApUOKH4qNr6FLR23Lno3z9sk8NVezb9ctX9IjsKK21z7G+Afv12kwgL2NI6Q3EIcARjo9WzauR3yaTZJqFkX9q695qtm44+GpA1pu3wX/rq1/G0MF9macPVkXjTuAndtQuwPQjlv7WeVBdowoyLwdfeDyZFEKKNe57TH22/vP+yPTEkHA0sOCdxg6PXPd047YMjGvlq41eeD3wOuxebOuBe4+/jC0DwYnaW98PRvIshKs6Mhk2mHoms3j8/ircrVMW5kj6qvAK2XZnRy/iI5KiMEzrfTANSH9MnDGrQCr2Ty+TNyV5BVrPmQrZf674uN+3o7Utvvf8XfW/wb6PolUHlBdAhTZB9DRmNqcSK5Wh15VtKy56u+nF8TU+XmujZcMszyY/hsbaxvggkPQ0g60zQeyHrQ0cFHb69PkM4Cpifb3e8sQLfNy/53ZOLBWHAdeWsOTSNBKtwB+tfBFcJ220cKlBWo+TbQP+LNJtVbO1rq8XJDa1tsLURC0FDLrmHUJP+iVRMdcIR3Z5bNJ9k2D5PPUtbSNHsBQ+eCuaflEqGCeMZkHMatMQLcVFMdjOi+KK2XozgvPGkvye98iRB/EOLiHNwVo7m2Mw5cL/I0B1dHrrqnz/ha0EXhR27JbvqysGHPFHSF6e5fs0azKzwhc6QsFBDCNFb9c4Gl8vvzlk27EJ2XaCLhaIe4BOPNWQpIrlRzZ+bxgRtoZYKkulZgU2gOoXB6bI2TbMeRXXdKBxuiAVwM3AmwlU64sGyoXQ7b+5O2Ibj14eaFF2Rcdxx/MCIuataz0kGWVBQjODKheYL0lheXriM9IFNzqw5Lmk2IsgL0lgnXw8R5y2AjhxzPzrGVS70NYFdoswJINSQTQDMwROL2x2XpU0ruhRTat/TQX/U0t/MCFH4JTPXPr7yoNVmTdSEwmVpJueC1wu3XrPHVvvArrFPGDd/wjowZdxYbWVYVZs2ViInGaVLKoN6YCpycuW/uac0v/J/Yb+WaHZa45HRcAAAAASUVORK5CYII=\"/>\n        <linearGradient id=\"hd1__Linear2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,36,-36,0,102,16)\"><stop offset=\"0\" style=\"stop-color:rgb(236,234,226);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(195,194,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(156,155,145);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd1__Linear3\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,104,-104,0,53.259259,18)\"><stop offset=\"0\" style=\"stop-color:rgb(236,234,226);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(195,194,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(156,155,145);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd1__Radial4\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(25.2,0,0,25.2,97.12,151.21)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd1__Radial5\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(17.151373,0,0,17.151373,49.145333,105.075451)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd1__Radial6\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(17.151373,0,0,17.151373,148.412,105.075451)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd1__Radial7\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(79.8,0,0,79.8,112.192,101.32)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd1__Radial8\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,88,130)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd1__Radial9\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,154,130)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd1__Radial10\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(19.6,0,0,19.6,118.545455,116.64)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <image id=\"hd1__Image12\" width=\"13px\" height=\"11px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAALCAYAAACksgdhAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGElEQVQokWP8////JgYSAROpGkY1DXNNAHaTA8Vi8LntAAAAAElFTkSuQmCC\"/>\n        <linearGradient id=\"hd1__Linear13\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,14.222222,-14.222222,0,70,55.777778)\"><stop offset=\"0\" style=\"stop-color:rgb(236,234,226);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(195,194,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(156,155,145);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd1__Linear14\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,118,-118,0,42,176)\"><stop offset=\"0\" style=\"stop-color:rgb(182,153,207);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(155,123,184);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd1__Linear15\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(22,0,0,22,98,180)\"><stop offset=\"0\" style=\"stop-color:rgb(155,123,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(125,95,153);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd1__Radial16\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(21.75,0,0,21.75,58.55,261.62375)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd1__Radial17\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(21.455,0,0,21.455,156.473,263.138571)\"><stop offset=\"0\" style=\"stop-color:rgb(249,230,209);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(240,208,172);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(226,177,132);stop-opacity:1\"/></radialGradient>\n        <linearGradient id=\"hd1__Linear18\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(40.153846,0,0,40.153846,126,190)\"><stop offset=\"0\" style=\"stop-color:rgb(155,123,184);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(125,95,153);stop-opacity:1\"/></linearGradient>\n    </defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"137\" cy=\"103\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"137\" cy=\"103.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"138.4\" cy=\"101.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><ellipse cx=\"181\" cy=\"103\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"181\" cy=\"103.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"182.4\" cy=\"101.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><rect class=\"blinklid\" x=\"127\" y=\"95\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#e8c9a0\" stroke=\"none\"/><rect class=\"blinklid\" x=\"171\" y=\"95\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#e8c9a0\" stroke=\"none\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 280 280\"><g transform=\"matrix(0.861111,0,0,1,73.388889,15.5)\">\n        <path d=\"M84,140C94.667,146 105.333,146 116,140L118,164C106,171.333 94,171.333 82,164L84,140Z\" style=\"fill:url(#hd2__Radial1);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M71.8,76C66.726,96.067 69.834,204.776 154,155.5\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(217,99,79);stroke-opacity:0.85;stroke-width:4px;stroke-linecap:round;stroke-linejoin:miter;\"/>\n    </g>\n    <use xlink:href=\"#hd2__Image2\" x=\"53.4\" y=\"252.4\" width=\"173px\" height=\"28px\"/>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M85,142C95,147.333 105,147.333 115,142L116,151C106,155.667 96,155.667 86,151L85,142Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.12;fill-rule:nonzero;\"/>\n        <g transform=\"matrix(1.214093,0,0,1,6.851104,-3.6804)\">\n            <path d=\"M54,96C45.333,94.667 41.667,99 43,109C44.333,117.667 49.333,121.333 58,120L54,96Z\" style=\"fill:url(#hd2__Radial3);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n        </g>\n        <path d=\"M146,96C154.667,94.667 158.333,99 157,109C155.667,117.667 150.667,121.333 142,120L146,96Z\" style=\"fill:url(#hd2__Radial4);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M72,96C69.333,69.333 85.333,55.333 120,54C154.667,55.333 170.667,69.333 168,96C170.667,118.667 166.667,136.667 156,150C146.667,162 134.667,168 120,168C105.333,168 93.333,162 84,150C73.333,136.667 69.333,118.667 72,96Z\" style=\"fill:url(#hd2__Radial5);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M80,122C76,135.333 78.667,146.667 88,156C78.667,153.333 73.333,145.333 72,132C73.333,126.667 76,123.333 80,122Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.07;fill-rule:nonzero;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd2__Radial6);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd2__Radial7);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M120,106C117.333,116 114.333,123.333 111,128C110.333,132 113.333,134 120,134C126.667,134 129.667,132 129,128C125.667,123.333 122.667,116 120,106\" style=\"fill:url(#hd2__Radial8);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;stroke-linecap:round;\"/>\n        <path d=\"M113,130C117.667,132.667 122.333,132.667 127,130\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.8px;stroke-linecap:round;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(0.882506,0,0,0.981481,9.857404,6.555206)\">\n            <path d=\"M80,84C92,78.667 103.333,78 114,82C111.333,86 106,87.667 98,87C90.667,86.333 84.667,85.333 80,84Z\" style=\"fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;stroke-linejoin:miter;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,1,4.721141,5.084306)\">\n            <path d=\"M124,82C135.333,78 146.667,78.667 158,84C154,86 148,87 140,87C131.333,87 126,85.333 124,82Z\" style=\"fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;stroke-linejoin:miter;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g opacity=\"0.45\">\n            <circle cx=\"96\" cy=\"146\" r=\"1.3\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"104\" cy=\"150\" r=\"1.3\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"112\" cy=\"152\" r=\"1.3\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"120\" cy=\"153\" r=\"1.3\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"128\" cy=\"152\" r=\"1.3\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"136\" cy=\"150\" r=\"1.3\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"144\" cy=\"146\" r=\"1.3\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"90\" cy=\"140\" r=\"1.1\" style=\"fill:rgb(59,48,37);\"/>\n            <circle cx=\"150\" cy=\"140\" r=\"1.1\" style=\"fill:rgb(59,48,37);\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path class=\"x-neutral\" d=\"M104,152C114.667,156.667 125.333,156.667 136,152\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linecap:round;stroke-linejoin:miter;\"/><path class=\"x-happy\" d=\"M102,148C110,166 130,166 138,148C132,161 126,163 120,163C114,163 108,161 102,148Z\" style=\"fill:rgb(160,74,60);stroke:rgb(59,48,37);stroke-width:2.6px;\"/><path class=\"x-annoy\" d=\"M104,158C114,151 126,151 136,158\" style=\"fill:none;stroke:rgb(59,48,37);stroke-width:2.6px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M30,68C90,30.667 150,30.667 210,68C212.667,72 211.333,74.667 206,76L34,76C28.667,74.667 27.333,72 30,68Z\" style=\"fill:url(#hd2__Linear9);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:round;\"/>\n        <path d=\"M40,64C93.333,36 146.667,36 200,64M34,68C91.333,36 148.667,36 206,68\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-opacity:0.5;stroke-width:1.4px;stroke-linecap:round;\"/>\n        <clipPath id=\"hd2__clip10\">\n            <path d=\"M119.3,40C119.3,39.614 119.614,39.3 120,39.3C120.386,39.3 120.7,39.614 120.7,40L120.7,68C120.7,68.386 120.386,68.7 120,68.7C119.614,68.7 119.3,68.386 119.3,68L119.3,40Z\"/>\n        </clipPath>\n        <g clip-path=\"url(#hd2__clip10)\">\n            <g transform=\"matrix(1,-0,-0,1,-40,0)\">\n                <use xlink:href=\"#hd2__Image11\" x=\"159.3\" y=\"39.3\" width=\"2px\" height=\"30px\"/>\n            </g>\n        </g>\n        <path d=\"M96,76C112,82.667 128,82.667 144,76\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:round;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <path d=\"M104,178C80,184 62.667,194.667 52,210C42.667,223.333 37.333,252 36,296L204,296C203.323,273.663 203.383,253.724 200.716,239.391C200.121,236.192 199.165,233.2 197.983,229.893C195.205,222.118 191.224,214.605 188,210C177.333,194.667 160,184 136,178C125.333,184 114.667,184 104,178Z\" style=\"fill:url(#hd2__Linear12);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n        <path d=\"M120,182C111.333,183.333 103.333,187.667 96,195C108,193 116,195.333 120,202L120,182Z\" style=\"fill:url(#hd2__Linear13);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n        <path d=\"M120,182C128.667,183.333 136.667,187.667 144,195C132,193 124,195.333 120,202L120,182Z\" style=\"fill:rgb(106,74,41);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n        <path d=\"M70,220C74,244 74.667,269.333 72,296M170,220C166,244 165.333,269.333 168,296\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-opacity:0.3;stroke-width:1.6px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,57,-13)\">\n        <g transform=\"matrix(1,-0,-0,1,-57,13)\">\n            <use xlink:href=\"#hd2__Image14\" x=\"144\" y=\"139\" width=\"32px\" height=\"11px\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(1.063859,0,0,1,2.333128,8.455357)\">\n            <path d=\"M58.731,190C56.796,191.458 47.561,201.743 42.494,215.162C36.978,229.77 35.707,247.487 36.277,246C30.347,254.547 41.333,262.333 52,265C56.588,250.726 59.962,222.225 63.605,211.545C65.249,206.725 63.571,206.947 65.297,203.652C59.094,194.03 63.242,197.686 58.731,190Z\" style=\"fill:url(#hd2__Linear15);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,1,-9.5,8.392857)\">\n            <path d=\"M50,258C58.667,260.667 66.667,259.333 74,254C78,260 77.333,265.667 72,271C62,275.667 53.333,275 46,269C44.667,264.333 46,260.667 50,258Z\" style=\"fill:url(#hd2__Radial16);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,1,-12.607143,4.455357)\">\n            <path d=\"M55,265C57.667,269.667 57.667,274 55,278M63,265C65.667,269.667 66,274 64,278M71,263C73.667,267.667 74,271.667 72,275\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;\"/>\n        </g>\n        <g transform=\"matrix(0.856976,0,0,1.039643,58.442158,0.923229)\">\n            <path d=\"M140.186,190C142.671,191.657 147.202,197.202 147.202,197.202C147.546,196.919 155.824,209.423 158.414,214.234C160.021,217.218 162.501,225.2 162.746,226.07C163.305,228.055 166.326,237.802 166,244C164.667,254 168.139,257.873 157.473,260.54C155.599,256.111 138.057,259.536 138.989,253.338C140.096,245.973 135.636,221.146 130.176,210.723C137.509,202.056 135.519,198.667 140.186,190Z\" style=\"fill:url(#hd2__Linear17);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n        </g>\n        <g transform=\"matrix(0.896642,0,0,0.896642,40.96323,32.836586)\">\n            <g transform=\"matrix(1,0,0,1,4.075,3.607143)\">\n                <path d=\"M150,256C158.667,259.333 166,259.333 172,256C176,262 174.667,267.667 168,273C158.667,276.333 150.667,275 144,269C142.667,264.333 144.667,260 150,256Z\" style=\"fill:url(#hd2__Radial18);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;\"/>\n            </g>\n            <path d=\"M155,263C157,267.667 156.667,272 154,276M163,263C165,267.667 165,271.667 163,275M171,261C172.333,265.667 172,269.333 170,272\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;\"/>\n        </g>\n    </g>\n    <defs>\n        <radialGradient id=\"hd2__Radial1\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(25.2,0,0,25.2,97.12,151.21)\"><stop offset=\"0\" style=\"stop-color:rgb(238,196,158);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(217,168,120);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(185,131,79);stop-opacity:1\"/></radialGradient>\n        <image id=\"hd2__Image2\" width=\"173px\" height=\"28px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAAAcCAYAAAATOT+TAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAELklEQVR4nOWbS3LbMAyGKbdX6b77nj/77HuWyl20dGHoxxu0lAYzGoEA+Ij5CYJkZxv/ofz4/m07ew1Xkbf3n/ez19AtH2JzF0P4IT4DJstA/AiQn7ZhDSBG+7/qb0XzvAqE6DyldZ0F+NKNDILpjbXizoRZG6tzg7vh9I4XmncV1C0b5oCz4pd8UbtnHd39MpLdaK2f5Mv0qfhaQE5thgKp147iOvt2gduZtVfeuiMQodizbCmI3ZsigKrBkvVF29G+XFZCHJEuSJFfa0diK2N5Lh4XxOomAFAlWJDutaF1ROax+qM2kq6aOiOdNWUWskwc0r02dX4NXrgBCqzdZ8nmialkXy5nAjulC9xqJozC231+0hG8h01gwFJYuI5A9NrQ2aNnoZVsEX821pKVZQG3RaHtAFbSqU0dh4P79OETYDVApUOKH4qNr6FLR23Lno3z9sk8NVezb9ctX9IjsKK21z7G+Afv12kwgL2NI6Q3EIcARjo9WzauR3yaTZJqFkX9q695qtm44+GpA1pu3wX/rq1/G0MF9macPVkXjTuAndtQuwPQjlv7WeVBdowoyLwdfeDyZFEKKNe57TH22/vP+yPTEkHA0sOCdxg6PXPd047YMjGvlq41eeD3wOuxebOuBe4+/jC0DwYnaW98PRvIshKs6Mhk2mHoms3j8/ircrVMW5kj6qvAK2XZnRy/iI5KiMEzrfTANSH9MnDGrQCr2Ty+TNyV5BVrPmQrZf674uN+3o7Utvvf8XfW/wb6PolUHlBdAhTZB9DRmNqcSK5Wh15VtKy56u+nF8TU+XmujZcMszyY/hsbaxvggkPQ0g60zQeyHrQ0cFHb69PkM4Cpifb3e8sQLfNy/53ZOLBWHAdeWsOTSNBKtwB+tfBFcJ220cKlBWo+TbQP+LNJtVbO1rq8XJDa1tsLURC0FDLrmHUJP+iVRMdcIR3Z5bNJ9k2D5PPUtbSNHsBQ+eCuaflEqGCeMZkHMatMQLcVFMdjOi+KK2XozgvPGkvye98iRB/EOLiHNwVo7m2Mw5cL/I0B1dHrrqnz/ha0EXhR27JbvqysGHPFHSF6e5fs0azKzwhc6QsFBDCNFb9c4Gl8vvzlk27EJ2XaCLhaIe4BOPNWQpIrlRzZ+bxgRtoZYKkulZgU2gOoXB6bI2TbMeRXXdKBxuiAVwM3AmwlU64sGyoXQ7b+5O2Ibj14eaFF2Rcdxx/MCIuataz0kGWVBQjODKheYL0lheXriM9IFNzqw5Lmk2IsgL0lgnXw8R5y2AjhxzPzrGVS70NYFdoswJINSQTQDMwROL2x2XpU0ruhRTat/TQX/U0t/MCFH4JTPXPr7yoNVmTdSEwmVpJueC1wu3XrPHVvvArrFPGDd/wjowZdxYbWVYVZs2ViInGaVLKoN6YCpycuW/uac0v/J/Yb+WaHZa45HRcAAAAASUVORK5CYII=\"/>\n        <radialGradient id=\"hd2__Radial3\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(17.151373,0,0,17.151373,49.145333,105.075451)\"><stop offset=\"0\" style=\"stop-color:rgb(238,196,158);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(217,168,120);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(185,131,79);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd2__Radial4\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(17.151373,0,0,17.151373,148.412,105.075451)\"><stop offset=\"0\" style=\"stop-color:rgb(238,196,158);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(217,168,120);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(185,131,79);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd2__Radial5\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(79.8,0,0,79.8,112.192,97.32)\"><stop offset=\"0\" style=\"stop-color:rgb(238,196,158);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(217,168,120);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(185,131,79);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd2__Radial6\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,88,130)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd2__Radial7\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,154,130)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd2__Radial8\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(19.6,0,0,19.6,118.545455,116.64)\"><stop offset=\"0\" style=\"stop-color:rgb(238,196,158);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(217,168,120);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(185,131,79);stop-opacity:1\"/></radialGradient>\n        <linearGradient id=\"hd2__Linear9\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,36,-36,0,28.666667,40)\"><stop offset=\"0\" style=\"stop-color:rgb(245,215,138);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(201,149,48);stop-opacity:1\"/></linearGradient>\n        <image id=\"hd2__Image11\" width=\"2px\" height=\"30px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAeCAYAAAAGos/EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAF0lEQVQYlWO0NlBNY2BgYGBigIKRzAAAIZMBMkxeXu0AAAAASUVORK5CYII=\"/>\n        <linearGradient id=\"hd2__Linear12\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,118,-118,0,36,178)\"><stop offset=\"0\" style=\"stop-color:rgb(163,123,77);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(138,98,56);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd2__Linear13\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(24,0,0,24,96,182)\"><stop offset=\"0\" style=\"stop-color:rgb(138,98,56);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(106,74,41);stop-opacity:1\"/></linearGradient>\n        <image id=\"hd2__Image14\" width=\"32px\" height=\"11px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAALCAYAAAAeEY8BAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABX0lEQVQ4jbWTsUoDQRRFj1ksUiiInUwTO0NQBwVXsLAZ/0ErmUawTLEfsYWl5ZbmH5wmguA2ZrGQNAYsVk0TCFoE1kKbSVjCJJsQve29vHvmzQz8gULtH4baL0/xj0Ptr7i80qIFofZPgHPgItS+5yoHToG6C6IQoKgAeAQ+gS3gbIL/Dmy4IEpDykkrKioIorgHXAPfwJEFzvtfwNUkCC+3opqSomWSNMsPMEk6UFK8AAdARUmRmSTtjGX6SoousA9UlRRvJkm7OT9TUrSAmoUYdXlKip7LmKfAZj6UFBlQBXaUFG2TpP0iCG8a3TwFNtNRUqwBFWDbzhlMgeiVZrmnoYIovgXugWXgMtT++ngGuAHawCqw55gx7GoEUdwcvepZN6GkeAY2AQH0He/hR0nxBHSDKL5zAGKSNDNJ+gqwNG7ak9ctRCOI4qYjUwZ2gyh+cBUsrFD7K/Z3/Lt+AVLkz0fNn2ESAAAAAElFTkSuQmCC\"/>\n        <linearGradient id=\"hd2__Linear15\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,75,-75,0,33.466667,190)\"><stop offset=\"0\" style=\"stop-color:rgb(163,123,77);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(138,98,56);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd2__Radial16\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(21.75,0,0,21.75,58.55,261.62375)\"><stop offset=\"0\" style=\"stop-color:rgb(238,196,158);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(217,168,120);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(185,131,79);stop-opacity:1\"/></radialGradient>\n        <linearGradient id=\"hd2__Linear17\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(40.153846,0,0,40.153846,126,190)\"><stop offset=\"0\" style=\"stop-color:rgb(138,98,56);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(106,74,41);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd2__Radial18\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(21.455,0,0,21.455,156.473,263.138571)\"><stop offset=\"0\" style=\"stop-color:rgb(238,196,158);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(217,168,120);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(185,131,79);stop-opacity:1\"/></radialGradient>\n    </defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"135\" cy=\"108\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"135\" cy=\"108.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"136.4\" cy=\"106.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><ellipse cx=\"186\" cy=\"108\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"186\" cy=\"108.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"187.4\" cy=\"106.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><rect class=\"blinklid\" x=\"125\" y=\"100\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#ddb384\" stroke=\"none\"/><rect class=\"blinklid\" x=\"176\" y=\"100\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#ddb384\" stroke=\"none\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 280 280\"><use xlink:href=\"#hd3__Image1\" x=\"53.4\" y=\"254.701\" width=\"173px\" height=\"26px\"/>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M60,90C50.667,62 60.667,43.333 90,34C110,20.667 130,19.333 150,30C170,39.333 178,56 174,80C175.333,92 172.667,102 166,110C166,92.667 160.667,81.333 150,76C151.333,86.667 148,95.333 140,102C136,90 129.333,82.667 120,80C121.333,89.333 118,96.667 110,102C107.333,91.333 101.333,85.333 92,84C92,92 88.667,98 82,102C78,92.667 74,87.333 70,86C68.667,92.667 65.333,97.333 60,100C56,90.667 56,82.667 60,76\" style=\"fill:url(#hd3__Linear2);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,15.972222,27.954262)\">\n            <path d=\"M56,84C41.333,86.667 34.667,96 36,112C36.667,121.333 42,126.667 52,128C48,114.667 49.333,104.667 56,98C58.667,94 58.667,89.333 56,84Z\" style=\"fill:url(#hd3__Linear3);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,10.376984,24.669422)\">\n            <path d=\"M46,100C40.667,97.333 40,94 44,90C48,87.333 51.333,88.667 54,94C56.667,88.667 60,88 64,92C65.333,97.333 62.667,100.667 56,102C52,103.333 48.667,102.667 46,100Z\" style=\"fill:rgb(217,99,79);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M164,84C178.667,86.667 185.333,96 184,112C183.333,121.333 178,126.667 168,128C172,114.667 170.667,104.667 164,98C161.333,94 161.333,89.333 164,84Z\" style=\"fill:url(#hd3__Linear4);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M174,100C179.333,97.333 180,94 176,90C172,87.333 168.667,88.667 166,94C163.333,88.667 160,88 156,92C154.667,97.333 157.333,100.667 164,102C168,103.333 171.333,102.667 174,100Z\" style=\"fill:rgb(217,99,79);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(0.606572,0,0,0.917808,60.951146,38.003729)\">\n            <path d=\"M84,140C94.667,146 105.333,146 116,140L118,164C106,171.333 94,171.333 82,164L84,140Z\" style=\"fill:url(#hd3__Radial5);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M85,142C95,147.333 105,147.333 115,142L116,151C106,155.667 96,155.667 86,151L85,142Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.12;fill-rule:nonzero;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,20.338889,31.0041)\">\n            <path d=\"M54,96C45.333,94.667 41.667,99 43,109C44.333,117.667 49.333,121.333 58,120L54,96Z\" style=\"fill:url(#hd3__Radial6);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M146,96C154.667,94.667 158.333,99 157,109C155.667,117.667 150.667,121.333 142,120L146,96Z\" style=\"fill:url(#hd3__Radial7);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3px;stroke-linecap:butt;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,0.917808,40,23.671156)\">\n        <path d=\"M72,92C69.333,65.333 85.333,51.333 120,50C154.667,51.333 170.667,65.333 168,92C170.667,114.667 166.667,132.667 156,146C146.667,158 134.667,164 120,164C105.333,164 93.333,158 84,146C73.333,132.667 69.333,114.667 72,92Z\" style=\"fill:url(#hd3__Radial8);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,0.917808,40,23.671156)\">\n        <path d=\"M80,122C76,135.333 78.667,146.667 88,156C78.667,153.333 73.333,145.333 72,132C73.333,126.667 76,123.333 80,122Z\" style=\"fill:rgb(59,48,37);fill-opacity:0.07;fill-rule:nonzero;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,0.917808,40,23.671156)\">\n        <ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd3__Radial9);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,0.917808,40,23.671156)\">\n        <ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" style=\"fill:url(#hd3__Radial10);\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M120,106C117.333,116 114.333,123.333 111,128C110.333,132 113.333,134 120,134C126.667,134 129.667,132 129,128C125.667,123.333 122.667,116 120,106\" style=\"fill:url(#hd3__Radial11);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.4px;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M113,130C117.667,132.667 122.333,132.667 127,130\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1.8px;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M80,84C92,78.667 103.333,78 114,82C111.333,86 106,87.667 98,87C90.667,86.333 84.667,85.333 80,84Z\" style=\"fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M124,82C135.333,78 146.667,78.667 158,84C154,86 148,87 140,87C131.333,87 126,85.333 124,82Z\" style=\"fill:rgb(59,48,37);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,0.917808,40,23.671156)\">\n        <path class=\"x-neutral\" d=\"M104,152C114.667,156.667 125.333,156.667 136,152\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;stroke-linejoin:miter;\"/><path class=\"x-happy\" d=\"M102,148C110,166 130,166 138,148C132,161 126,163 120,163C114,163 108,161 102,148Z\" style=\"fill:rgb(160,74,60);stroke:rgb(59,48,37);stroke-width:2.6px;\"/><path class=\"x-annoy\" d=\"M104,158C114,151 126,151 136,158\" style=\"fill:none;stroke:rgb(59,48,37);stroke-width:2.6px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,0.917808,53.737632,10.005213)\">\n        <path d=\"M70.775,69.816C86.775,57.816 117.437,56.482 133.437,65.816C153.404,77.463 143.785,87.074 143.785,87.074L70.368,86.348C70.368,86.348 67.263,77.204 70.775,69.816Z\" style=\"fill:url(#hd3__Linear12);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2.6px;\"/>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M108,176C88,181.333 72.667,190.667 62,204C51.333,217.333 46.667,245.333 48,288L192,288C193.333,245.333 188.667,217.333 178,204C167.333,190.667 152,181.333 132,176C125.333,180 118.667,180 112,176L108,176Z\" style=\"fill:url(#hd3__Linear13);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,0.726329,16.338211)\">\n            <g transform=\"matrix(1,-0,-0,1.089552,-40.726329,-17.801329)\">\n                <use xlink:href=\"#hd3__Image14\" x=\"144.191\" y=\"181.844\" width=\"33px\" height=\"16px\"/>\n            </g>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,0.726329,29.18753)\">\n            <g transform=\"matrix(1,-0,-0,1.089552,-40.726329,-31.801329)\">\n                <use xlink:href=\"#hd3__Image15\" x=\"148.549\" y=\"194.693\" width=\"24px\" height=\"82px\"/>\n            </g>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,-0,23.671156)\">\n            <path d=\"M166,214C162,234 161.333,256 164,280\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-opacity:0.3;stroke-width:1.4px;stroke-linecap:butt;\"/>\n        </g>\n    </g>\n    <g transform=\"matrix(1,0,0,1,40,0)\">\n        <g transform=\"matrix(0.859602,0,0,0.917808,22.380342,35.391128)\">\n            <path d=\"M49.933,190C29.402,218.669 34.613,238.763 34,247.816C35.333,257.816 34.214,266.586 57.591,254C57.76,238.514 60.877,213.458 60.877,213.458C60.877,213.458 52.6,198.667 49.933,190Z\" style=\"fill:url(#hd3__Linear16);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(0.84304,0,0,0.773749,-5.731819,63.431604)\">\n            <g transform=\"matrix(1,0,0,1,17.972222,10)\">\n                <path d=\"M50,258C58.667,260.667 66.667,259.333 74,254C78,260 77.333,265.667 72,271C62,275.667 53.333,275 46,269C44.667,264.333 46,260.667 50,258Z\" style=\"fill:url(#hd3__Radial17);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n            </g>\n            <g transform=\"matrix(1,0,0,1,17.972222,10)\">\n                <path d=\"M55,265C57.667,269.667 57.667,274 55,278M63,265C65.667,269.667 66,274 64,278M71,263C73.667,267.667 74,271.667 72,275\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;\"/>\n            </g>\n        </g>\n        <g transform=\"matrix(0.850731,0,0,0.828962,43.509819,55.903849)\">\n            <path d=\"M155.596,185.619C166.754,199.645 169.611,224.541 171.084,256C171.084,259.666 161.209,261.543 150.542,256C149.746,237.94 145.391,212.559 145.391,212.559L155.596,185.619Z\" style=\"fill:url(#hd3__Linear18);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(0.751176,0,0,0.917808,59.329824,32.849241)\">\n            <path d=\"M150,256C158.667,259.333 166,259.333 172,256C176,262 174.667,267.667 168,273C158.667,276.333 150.667,275 144,269C142.667,264.333 144.667,260 150,256Z\" style=\"fill:url(#hd3__Radial19);fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:3.2px;stroke-linecap:butt;\"/>\n        </g>\n        <g transform=\"matrix(1,0,0,0.917808,17.972222,32.849241)\">\n            <path d=\"M155,263C157,267.667 156.667,272 154,276M163,263C165,267.667 165,271.667 163,275M171,261C172.333,265.667 172,269.333 170,272\" style=\"fill:none;fill-rule:nonzero;stroke:rgb(59,48,37);stroke-width:2px;stroke-linecap:butt;\"/>\n        </g>\n    </g>\n    <defs>\n        <image id=\"hd3__Image1\" width=\"173px\" height=\"26px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAAAaCAYAAADFYNyOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD4UlEQVR4nOWbwXLjIAyG5Wxfpffe+/y9995n2WQPXWew/Ev8EsL2djXjASQBdvgiC5ou8sPk/e11OfseriYfn1+Ps++hUi69wJMBvPSzkzIVxqvCfvjCFYCY6X/kc1pzHQVAZp7hezsS8PLFTEDJ+vf8Zs1bOV71wkbH6/mz44XmrQZ6aOEIQD171mbZR8ar7lch2YX2+lm2TJ8R2xDIoUVxIGUhGtEh/UhfT2alILNf3REor6QLQdz9oA1QPXiyttH27Oh7RNSd/bp/kDbGPzJeaN4ewOZCAFgRICM6tt5rj4DL2LO+UamIqJ5PBjDPFqlndCa8u0VQsFoAahizpVdn/aLRmbWN+GalEtzqKMiCWV3u4N0shAHsIntQURvVIyW6p9nQMvZRf0aOTAt0ewTaSGnptA3VN+A+FwAAy1zIV0CdKXf3RNaZtqWz5CdvxCpTgyisVtu7nuOt4L7IXhCct057JPKy9YiN0Y/6RsdIH/Ek+zM79yNSAwbSO2jv5nt/e10+Pr8eL2vjr94C9iZbWG/KjvqKYHi1Xut03dJFo2nVa/0K6UFmnCjEPR8WXgvcFtSl0d3lm6kW3M18KNKK7IFtLwveEWCZtqXz9Kz9bKm8v2i+6+l7uh64XpRdwVyhbSG9y/YzacHeQOvlqj14IzmtV/d0np61V8iVI61IPz3JpC8VuS5KCTSsaI4NsCIii5EaaEB/NaW2s9B6ddRmbRm//1HYL8ZIihGFtk0J7iLyG9R1KmGmB61Yr3vrElVHY2i9NWfvnmbKVb4AVVGYjbDID0VprXuI3dd7m3oBbhNhV2Gg9aS9ceYhtC76oGjeWdKDpWLuyrRgxtyZ6Oxt1CwfK4LD+RlovWOK9eTAS5zbUqQPpIjxDVN26fgg/0o5EzhPoveV2bixEHrpATpF0KcNcP5F5HnktS5su8nyrjb/tTZwAkqvjto9fc824vuvSATUaM6K9NETBNRGOS26NjA/z2mbARc1AdrZPRrfdfeHzmpF9iAL0AvQW+2IzrKNRMgz05Gq8TJgIl10A6bbepOFQEVjwPRgNepD3hbWFtoVXDbSRiJvBuKqiDxzDC0VwI7s+nvtXjqgdV7dSw/gaYGW5wKAo6+2bv0RgTk9qIA3YkPtnt6TM9KJLMRMFM3Cym62NKitDkVeK6fVwdL97QF68DWSomjaSwey+W0FzJYuYh/1Z6R684R8RuDUbSaP9XRe2oBsG9ktgIq4VtkDsjo1qIrArG3Et+2TiZiRPpGU4EhorZKBGc4Df5rYCvlDcK+M+nj1KpsWFsQquKtgZP0qoGX9TNgcG9MH/vfCHxT+TV/KTUXLAAAAAElFTkSuQmCC\"/>\n        <linearGradient id=\"hd3__Linear2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,87.111111,-87.111111,0,56.62069,22.888889)\"><stop offset=\"0\" style=\"stop-color:rgb(74,64,56);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(55,48,42);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(42,36,32);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd3__Linear3\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,44,-44,0,35.833333,84)\"><stop offset=\"0\" style=\"stop-color:rgb(74,64,56);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(55,48,42);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(42,36,32);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd3__Linear4\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,44,-44,0,162,84)\"><stop offset=\"0\" style=\"stop-color:rgb(74,64,56);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(55,48,42);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(42,36,32);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd3__Radial5\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(25.2,0,0,25.2,97.12,151.21)\"><stop offset=\"0\" style=\"stop-color:rgb(251,232,214);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(245,211,179);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(233,185,140);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd3__Radial6\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(17.151373,0,0,17.151373,49.145333,105.075451)\"><stop offset=\"0\" style=\"stop-color:rgb(251,232,214);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(245,211,179);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(233,185,140);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd3__Radial7\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(17.151373,0,0,17.151373,148.412,105.075451)\"><stop offset=\"0\" style=\"stop-color:rgb(251,232,214);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(245,211,179);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(233,185,140);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd3__Radial8\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(79.8,0,0,79.8,112.192,93.32)\"><stop offset=\"0\" style=\"stop-color:rgb(251,232,214);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(245,211,179);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(233,185,140);stop-opacity:1\"/></radialGradient>\n        <radialGradient id=\"hd3__Radial9\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,88,130)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd3__Radial10\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(13,0,0,13,154,130)\"><stop offset=\"0\" style=\"stop-color:rgb(232,143,114);stop-opacity:0.55\"/><stop offset=\"1\" style=\"stop-color:rgb(232,143,114);stop-opacity:0\"/></radialGradient>\n        <radialGradient id=\"hd3__Radial11\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(19.6,0,0,19.6,118.545455,116.64)\"><stop offset=\"0\" style=\"stop-color:rgb(251,232,214);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(245,211,179);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(233,185,140);stop-opacity:1\"/></radialGradient>\n        <linearGradient id=\"hd3__Linear12\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,16.125,-16.125,0,71.333333,57.875)\"><stop offset=\"0\" style=\"stop-color:rgb(74,64,56);stop-opacity:1\"/><stop offset=\"0.55\" style=\"stop-color:rgb(55,48,42);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(42,36,32);stop-opacity:1\"/></linearGradient>\n        <linearGradient id=\"hd3__Linear13\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,112,-112,0,47.777778,176)\"><stop offset=\"0\" style=\"stop-color:rgb(240,184,201);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(231,157,181);stop-opacity:1\"/></linearGradient>\n        <image id=\"hd3__Image14\" width=\"33px\" height=\"16px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAQCAYAAACYwhZnAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACqUlEQVRIia2WvU8TYRzHP9feXaHXci0t+JaAgEdoIsmFFwO9RKOJk4OJJu4mJk4OxEEnZ/8DJxd0cXAgcWEBox5xIHoGHcj5FhgIhZJeLQXaCg7t4bVpiyC/5Mnlfi/P9/Pc73menIDHDF27CdwA5oGnpmVnOSYzdE0BbgPjwLRp2ZNuTPAkqcCkx+cAT0zLnjsGgGHgHtDucd81LXsFQPQ4x7xQgAo8NHRtHnhhWvbiEcR7gVtAsk44CbyshTAazDUCjBi6tgBMAx9Ny/7VRDgI6MBVYLgZowshVArDwDPABzBxrovZtQ0sJ1eveA9YBJaBDJAFQkAUOAMMAP7aokRY4frpDh4v/vS675iWnXK/xAUXoDMgc14NMaiGsHN5Xq2ss5CtghEqQgNNVlklfu1UnERYQQB6lFZ+bG654XFgyoXYb8VItG1/Y2ihIBNaF0v5bd6lMyw4OVZ3CgcKx2WJQTVEMhahT2mtio1G27wQBjAlVI7Ocyqf8FGih7PB6kKvpXYK2Lk8mWIJp1giV/qNIvpRJZGIJNKntHKyJVC1w722tlPgweevXtdtERh1AWKyRHcTACi3qzMgN81pZh0Bma5gC0v5bdc17sPTioGwcuTJD2OJah1DBPrdNzOd4fvmFkZMZaxdpV2Wjk3YKZZ4v+Ewl3ZY3tr2hvoFQ9fuA5dqi4QKcTIWYSgSpsXvO7RwYXcXy8lhpjN8yebY3aub9kEwdM1H+fa6AgxROaq11ib6iQdkYrJETJaIyxKxgIQqimRLJdKFIus7RdKFvyNTLDXi2wM+AbPA26pNbOhaBLhYAeo99NIPtmVgBnhtWnbadTY6SRi61g1cptyq2H8IO8AbYMa07G/1EhpC1ACFgBNAB9BZM6KUr+8UsAasVp4pIPUvvwN/ALWCyhswI8DnAAAAAElFTkSuQmCC\"/>\n        <image id=\"hd3__Image15\" width=\"24px\" height=\"82px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABSCAYAAABOtBTyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEwklEQVRYhdWZXWsjVRjHf5mkbZrttnTT2vRls92XKShURhS8yIW9WxBlV1CoCsIqri+I4iJ4IYjgVxH8AH4ArwZvROZqQQcvJLtN2m7Tbl/SzmSS2YvMTGYmk5kzaVboc3dOTp7f+T/nOc85J8kgaBVFvg9sAL+pmv6r6Peygs7fBt4HxoH1cql4Uq03/h4JoKLIN4DvAcnX/Uq5VPy3Wm9snQtQUeQ88DMwE/ooA7xeLhX/rNYbB3E+pLgPgc+BJQApk+GLGytcznlzygM/VhT5SpyDgQoqirwBfOC231tZ4I25WeSpAn80ntLpdhforsnv1XqjLaygosiLwJdue316itsLRQBuTRX4ZHXJP/wm8LGwgooi54CfgBcAZsZyPFgrk5d6c1mZzNMB/jluul2ys+iPRRR8BNyC7kp+urrMdC7XN+jO4jxrUwV/1zdR6xEAVBT5VeCu236zNMdL05ci5gBSBu5fX6aQ9YJwGXhQUeSAT6/h0L912zcvTXJ3aT7SuWtXxse4d23R3/Uy8I6/I+s4l4AfgDLAZFbiu7VVpnLJG31pcoKDlsV/zTO3a71cKv5VrTcafgXvAuvuiHvXlpgbH0t07trm1QUW8xP+SX9dUeQsgFRR5Bfx5fvG/CyvzU4LOweYkCQ+u76MlMm4XdeAO66Cr1wly5MTbK6UUjl3rVzIc3shkESbFUXOSoC3kh9eLTEuZfq+LGpvlQJJkQdmJMCriGftztDOAY4sy980gX0J8HZf3TDPBaidGf7mY1XT7SAgOGAIQGCCj6C7uD7ASBWMHlBPUnBoWTTbkWVdyCIVqJp+CuwPmIWwHVttjq3A5LagVyoenRcQmv2OqumGH+BL1eEyKTQxz18/YDQKvIhEAIZTELUHIgHbhok9FCBewTbQBmh1bBpmK5Vzy7Z5YsYoUDW9g6/opQ3TjmHS6cluqprupb3/gPbCVEu50IPCMxCQNpNqA1J0MCDlXqj/zwqSAQ2zhdkRO91sBNdA1fRD4Mhtbwuebocty3/UdoBaJMAxX6qKAUKzr6uaHjiYw4DUJSMu/lEAb4DoXggf9EmA1JmUVoGv6BlCRS9uD0QBtuhmHqftDoctKzw+YEanw16wMMYDnAzY6c0uPkzbwc8PVU0/Co+JekIJl4yk+A8CCF8AkuI/CCCcSXElQhCQKkR9eyARsGuaWHZ0str0rZGYAlXT94AzgI4NuwOK3p7ZotU7Jy2653oywLHEoheK/5ZzrgsDEjMp6iadBpC4F0QyKA6QGKLzKvCFSEhBZIrGATwFR1abk9CjpNlu8zRYCNMpcB4lDbcdDlOo3XDGiwMc650NIYDoAicBBq6DSBUVAXjrUDPCIbogCgJr4Jadtm2zYyRXURHADt0ihmX3HiW7Rot2r8IawJOhAE7x8q6BbsmoR/zgMRTAdeABnLiniX9KgOEAxDNIBNBXtkcN6L3bnOetaBVNDdg3W+yZLX/hs/FtxqEAzk3Nu61pB4GL266q6Yk35CQF4FMRAiSGJzXg4dHJ8wWEbGSAQY4ujoIa9D12mqqmx/69JQxwHiXha6HQ7IUAjoXDdPEAYYcjB4RrznNXUBcFCP2fXK03Tsul4jjdf6l+UTX9oSjgGUcjhednpPjfAAAAAElFTkSuQmCC\"/>\n        <linearGradient id=\"hd3__Linear16\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(0,75,-75,0,33.466667,190)\"><stop offset=\"0\" style=\"stop-color:rgb(240,184,201);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(231,157,181);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd3__Radial17\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(21.75,0,0,21.75,58.55,261.62375)\"><stop offset=\"0\" style=\"stop-color:rgb(251,232,214);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(245,211,179);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(233,185,140);stop-opacity:1\"/></radialGradient>\n        <linearGradient id=\"hd3__Linear18\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(40.153846,0,0,40.153846,126,190)\"><stop offset=\"0\" style=\"stop-color:rgb(231,157,181);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(207,127,156);stop-opacity:1\"/></linearGradient>\n        <radialGradient id=\"hd3__Radial19\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(21.455,0,0,21.455,156.473,263.138571)\"><stop offset=\"0\" style=\"stop-color:rgb(251,232,214);stop-opacity:1\"/><stop offset=\"0.62\" style=\"stop-color:rgb(245,211,179);stop-opacity:1\"/><stop offset=\"1\" style=\"stop-color:rgb(233,185,140);stop-opacity:1\"/></radialGradient>\n    </defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"137\" cy=\"120\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"137\" cy=\"120.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"138.4\" cy=\"118.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><ellipse cx=\"181\" cy=\"120\" rx=\"10\" ry=\"8\" fill=\"#fffdf5\"/><circle cx=\"181\" cy=\"120.5\" r=\"3.6\" fill=\"#1a1208\" stroke=\"none\"/><circle cx=\"182.4\" cy=\"118.6\" r=\"1.1\" fill=\"#fffdf5\" stroke=\"none\"/><rect class=\"blinklid\" x=\"127\" y=\"112\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#f5d4b4\" stroke=\"none\"/><rect class=\"blinklid\" x=\"171\" y=\"112\" width=\"20\" height=\"9\" rx=\"4\" fill=\"#f5d4b4\" stroke=\"none\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 200 280\"><defs><radialGradient id=\"hd4_c3skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e2c8\"/><stop offset=\"62%\" stop-color=\"#eec9a1\"/><stop offset=\"100%\" stop-color=\"#d8a877\"/></radialGradient><linearGradient id=\"hd4_c3hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd4_c3cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8ab4da\"/><stop offset=\"100%\" stop-color=\"#6f9ec9\"/></linearGradient><linearGradient id=\"hd4_c3clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#6f9ec9\"/><stop offset=\"100%\" stop-color=\"#537da8\"/></linearGradient><radialGradient id=\"hd4_c3blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd4_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><ellipse cx=\"100\" cy=\"270\" rx=\"80\" ry=\"10\" fill=\"#3b3025\" opacity=\".16\" filter=\"url(#hd4_csoft)\"/><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd4_c3hair)\" d=\"M62,96 q-10,-44 26,-58 q-6,-10 6,-14 q4,10 10,4 q2,-12 12,-8 q0,10 8,6 q6,-10 14,0 q-4,8 4,8 q10,-6 14,4 q-8,4 -2,10 q22,14 14,58 q-8,-24 -20,-30 q4,14 -4,24 q-6,-18 -18,-22 q2,14 -8,22 q-4,-16 -16,-20 q0,14 -8,20 q-6,-14 -14,-16 q-2,10 -10,14 q-4,-14 -8,-18z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\"><path fill=\"url(#hd4_c3skin)\" d=\"M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z\"/><path d=\"M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z\" fill=\"#3b3025\" opacity=\".12\" stroke=\"none\"/><path fill=\"url(#hd4_c3skin)\" d=\"M68,96 q-13,-2 -11,13 q2,13 15,11 z\"/><path fill=\"url(#hd4_c3skin)\" d=\"M172,96 q13,-2 11,13 q-2,13 -15,11 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd4_c3skin)\" d=\"M72,96 q-4,-40 48,-42 q52,2 48,42 q4,34 -12,54 q-14,18 -36,18 q-22,0 -36,-18 q-16,-20 -12,-54 z\"/></g><path d=\"M80,122 q-6,20 8,34 q-14,-4 -16,-24 q2,-8 8,-10z\" fill=\"#3b3025\" opacity=\".07\"/><ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd4_c3blush)\"/><ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd4_c3blush)\"/><g stroke=\"#3b3025\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22\" fill=\"url(#hd4_c3skin)\"/><path d=\"M113,130 q7,4 14,0\" stroke-width=\"1.8\"/></g><!-- eyes: see companion *-eyes.svg --><g><path d=\"M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/><path d=\"M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/></g><g class=\"x-neutral\"><path d=\"M104,152 q16,7 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></g><g stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd4_c3hair)\" d=\"M78,62 l6,-20 l6,16 l8,-22 l6,18 l8,-20 l6,18 l8,-16 l4,20 q-24,-8 -46,6z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd4_c3cloth)\" d=\"M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 q-16,9 -40,0z\"/><path d=\"M70,218 q6,32 2,70 M170,218 q-6,32 -2,70\" fill=\"none\" stroke-width=\"1.6\" opacity=\".3\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd4_c3cloth)\" d=\"M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z\"/><path fill=\"url(#hd4_c3skin)\" d=\"M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z\"/><path d=\"M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12\" fill=\"none\" stroke-width=\"2\"/><path fill=\"url(#hd4_c3clothL)\" d=\"M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z\"/><path fill=\"url(#hd4_c3skin)\" d=\"M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z\"/><path d=\"M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12\" fill=\"none\" stroke-width=\"2\"/></g><g class=\"x-happy\"><path d=\"M102,150 q18,20 36,0 q-7,14 -18,14 q-11,0 -18,-14z\" fill=\"#a04a3c\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/></g><g class=\"x-annoy\"><path d=\"M104,160 q16,-9 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M170,74 l5,-9 l5,9 M182,80 l5,-9\" fill=\"none\" stroke=\"#d9634f\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><defs><radialGradient id=\"hd4e_c3skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e2c8\"/><stop offset=\"62%\" stop-color=\"#eec9a1\"/><stop offset=\"100%\" stop-color=\"#d8a877\"/></radialGradient><linearGradient id=\"hd4e_c3hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd4e_c3cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8ab4da\"/><stop offset=\"100%\" stop-color=\"#6f9ec9\"/></linearGradient><linearGradient id=\"hd4e_c3clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#6f9ec9\"/><stop offset=\"100%\" stop-color=\"#537da8\"/></linearGradient><radialGradient id=\"hd4e_c3blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd4e_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"99\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><ellipse cx=\"141\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><circle cx=\"101\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"143\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"102.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><circle cx=\"144.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><rect class=\"blinklid\" x=\"89\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd4e_c3skin)\"/><rect class=\"blinklid\" x=\"131\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd4e_c3skin)\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 200 280\"><defs><radialGradient id=\"hd5_c4skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e6d1\"/><stop offset=\"62%\" stop-color=\"#f0d0ac\"/><stop offset=\"100%\" stop-color=\"#e2b184\"/></radialGradient><linearGradient id=\"hd5_c4hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd5_c4cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6cc0b9\"/><stop offset=\"100%\" stop-color=\"#4fa6a0\"/></linearGradient><linearGradient id=\"hd5_c4clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#4fa6a0\"/><stop offset=\"100%\" stop-color=\"#3c827c\"/></linearGradient><radialGradient id=\"hd5_c4blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd5_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><ellipse cx=\"100\" cy=\"270\" rx=\"80\" ry=\"10\" fill=\"#3b3025\" opacity=\".16\" filter=\"url(#hd5_csoft)\"/><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd5_c4hair)\" d=\"M58,100 q-14,-48 30,-64 q28,-20 58,-6 q34,14 26,54 q10,40 -2,96 q-14,4 -16,-10 q4,-46 -6,-70 q-6,-4 -8,6 q4,42 -4,80 q-14,4 -16,-8 q4,-44 -8,-72 q-6,-2 -6,8 q2,40 -6,76 q-14,2 -16,-10 q4,-42 -10,-64 q-8,10 -6,26 q2,-6 -8,-2 q-6,-16 -2,-40 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\"><path fill=\"url(#hd5_c4skin)\" d=\"M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z\"/><path d=\"M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z\" fill=\"#3b3025\" opacity=\".12\" stroke=\"none\"/><path fill=\"url(#hd5_c4skin)\" d=\"M68,96 q-13,-2 -11,13 q2,13 15,11 z\"/><path fill=\"url(#hd5_c4skin)\" d=\"M172,96 q13,-2 11,13 q-2,13 -15,11 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd5_c4skin)\" d=\"M72,96 q-4,-40 48,-42 q52,2 48,42 q4,34 -12,54 q-14,18 -36,18 q-22,0 -36,-18 q-16,-20 -12,-54 z\"/></g><path d=\"M80,122 q-6,20 8,34 q-14,-4 -16,-24 q2,-8 8,-10z\" fill=\"#3b3025\" opacity=\".07\"/><ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd5_c4blush)\"/><ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd5_c4blush)\"/><g stroke=\"#3b3025\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22\" fill=\"url(#hd5_c4skin)\"/><path d=\"M113,130 q7,4 14,0\" stroke-width=\"1.8\"/></g><!-- eyes: see companion *-eyes.svg --><g stroke=\"#3b3025\" stroke-width=\"1.8\" fill=\"#dbe6f0\" fill-opacity=\".14\" stroke-linejoin=\"round\"><rect x=\"84\" y=\"90\" width=\"30\" height=\"22\" rx=\"8\"/><rect x=\"126\" y=\"90\" width=\"30\" height=\"22\" rx=\"8\"/></g><path d=\"M114,100 l12,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"1.8\"/><path d=\"M84,96 q-10,-2 -14,3\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><path d=\"M156,96 q10,-2 14,3\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><g><path d=\"M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/><path d=\"M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/></g><g class=\"x-neutral\"><path d=\"M104,152 q16,7 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></g><g stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd5_c4hair)\" d=\"M74,66 q22,-16 46,-2 q4,6 -4,10 q-20,-10 -38,-2 q-4,-2 -4,-6z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd5_c4cloth)\" d=\"M104,172 q-38,10 -54,32 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-22 -54,-32 q-16,9 -32,0z\"/><path fill=\"url(#hd5_c4clothL)\" d=\"M120,176 q-14,2 -26,13 q19,-3 26,7z\"/><path fill=\"#f3eddc\" d=\"M120,176 q14,2 26,13 q-19,-3 -26,7z\"/><circle cx=\"120\" cy=\"240\" r=\"3\" fill=\"#d9d3c0\" stroke=\"#3b3025\" stroke-width=\"1.6\"/><circle cx=\"120\" cy=\"266\" r=\"3\" fill=\"#d9d3c0\" stroke=\"#3b3025\" stroke-width=\"1.6\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd5_c4cloth)\" d=\"M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z\"/><path fill=\"url(#hd5_c4skin)\" d=\"M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z\"/><path d=\"M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12\" fill=\"none\" stroke-width=\"2\"/><path fill=\"url(#hd5_c4clothL)\" d=\"M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z\"/><path fill=\"url(#hd5_c4skin)\" d=\"M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z\"/><path d=\"M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12\" fill=\"none\" stroke-width=\"2\"/></g><g class=\"x-happy\"><path d=\"M102,150 q18,20 36,0 q-7,14 -18,14 q-11,0 -18,-14z\" fill=\"#a04a3c\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/></g><g class=\"x-annoy\"><path d=\"M104,160 q16,-9 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M170,74 l5,-9 l5,9 M182,80 l5,-9\" fill=\"none\" stroke=\"#d9634f\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><defs><radialGradient id=\"hd5e_c4skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e6d1\"/><stop offset=\"62%\" stop-color=\"#f0d0ac\"/><stop offset=\"100%\" stop-color=\"#e2b184\"/></radialGradient><linearGradient id=\"hd5e_c4hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd5e_c4cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6cc0b9\"/><stop offset=\"100%\" stop-color=\"#4fa6a0\"/></linearGradient><linearGradient id=\"hd5e_c4clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#4fa6a0\"/><stop offset=\"100%\" stop-color=\"#3c827c\"/></linearGradient><radialGradient id=\"hd5e_c4blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd5e_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"99\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><ellipse cx=\"141\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><circle cx=\"101\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"143\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"102.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><circle cx=\"144.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><rect class=\"blinklid\" x=\"89\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd5e_c4skin)\"/><rect class=\"blinklid\" x=\"131\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd5e_c4skin)\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 200 280\"><defs><radialGradient id=\"hd6_c5skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f6e2ca\"/><stop offset=\"62%\" stop-color=\"#ecc99f\"/><stop offset=\"100%\" stop-color=\"#cf9f6d\"/></radialGradient><linearGradient id=\"hd6_c5hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#eceae2\"/><stop offset=\"55%\" stop-color=\"#c3c2b8\"/><stop offset=\"100%\" stop-color=\"#9c9b91\"/></linearGradient><linearGradient id=\"hd6_c5cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a37b4d\"/><stop offset=\"100%\" stop-color=\"#8a6238\"/></linearGradient><linearGradient id=\"hd6_c5clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#8a6238\"/><stop offset=\"100%\" stop-color=\"#6a4a29\"/></linearGradient><radialGradient id=\"hd6_c5blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd6_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><ellipse cx=\"100\" cy=\"270\" rx=\"80\" ry=\"10\" fill=\"#3b3025\" opacity=\".16\" filter=\"url(#hd6_csoft)\"/><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd6_c5hair)\" d=\"M60,132 q-10,-18 4,-32 q0,14 10,16 q-4,-14 6,-20 q8,20 -2,36z\"/><path fill=\"url(#hd6_c5hair)\" d=\"M180,132 q10,-18 -4,-32 q0,14 -10,16 q4,-14 -6,-20 q-8,20 2,36z\"/><ellipse cx=\"120\" cy=\"58\" rx=\"46\" ry=\"34\" fill=\"url(#hd6_c5skin)\" opacity=\".001\"/></g><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\"><path fill=\"url(#hd6_c5skin)\" d=\"M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z\"/><path d=\"M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z\" fill=\"#3b3025\" opacity=\".12\" stroke=\"none\"/><path fill=\"url(#hd6_c5skin)\" d=\"M68,96 q-13,-2 -11,13 q2,13 15,11 z\"/><path fill=\"url(#hd6_c5skin)\" d=\"M172,96 q13,-2 11,13 q-2,13 -15,11 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd6_c5skin)\" d=\"M72,100 q-4,-40 48,-42 q52,2 48,42 q4,34 -12,54 q-14,18 -36,18 q-22,0 -36,-18 q-16,-20 -12,-54 z\"/></g><path d=\"M80,122 q-6,20 8,34 q-14,-4 -16,-24 q2,-8 8,-10z\" fill=\"#3b3025\" opacity=\".07\"/><ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd6_c5blush)\"/><ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd6_c5blush)\"/><g fill=\"none\" stroke=\"#3b3025\" stroke-width=\"1.5\" opacity=\".4\" stroke-linecap=\"round\"><path d=\"M94,72 q26,-8 50,0\"/><path d=\"M96,78 q24,-6 46,0\"/><path d=\"M78,110 q6,6 4,14\"/><path d=\"M162,110 q-6,6 -4,14\"/></g><path d=\"M80,150 q6,4 4,10\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"1.4\" opacity=\".35\"/><path d=\"M160,150 q-6,4 -4,10\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"1.4\" opacity=\".35\"/><g stroke=\"#3b3025\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22\" fill=\"url(#hd6_c5skin)\"/><path d=\"M113,130 q7,4 14,0\" stroke-width=\"1.8\"/></g><!-- eyes: see companion *-eyes.svg --><g><path d=\"M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/><path d=\"M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/></g><path fill=\"url(#hd6_c5hair)\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\" d=\"M84,138 q-6,26 6,44 q14,20 30,20 q16,0 30,-20 q12,-18 6,-44 q-6,14 -12,10 q-4,10 -12,8 q-2,10 -12,10 q-10,0 -12,-10 q-8,2 -12,-8 q-6,4 -12,-10z\"/><g class=\"x-neutral\"><path d=\"M104,152 q16,7 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></g><path d=\"M108,48 q10,-6 18,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"1.4\" opacity=\".3\"/><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"#f7f0df\" d=\"M104,176 q-32,9 -46,30 q-14,20 -16,84 l156,0 q-2,-64 -16,-84 q-14,-21 -46,-30 q-14,8 -32,0z\"/><path fill=\"url(#hd6_c5cloth)\" d=\"M104,176 q-14,4 -26,14 l0,110 l40,0 l0,-118 q-7,-4 -14,-6z\"/><path fill=\"url(#hd6_c5clothL)\" d=\"M136,176 q14,4 26,14 l0,110 l-40,0 l0,-118 q7,-4 14,-6z\"/><circle cx=\"120\" cy=\"222\" r=\"3\" fill=\"#f7f0df\" stroke=\"#3b3025\" stroke-width=\"1.6\"/><circle cx=\"120\" cy=\"248\" r=\"3\" fill=\"#f7f0df\" stroke=\"#3b3025\" stroke-width=\"1.6\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd6_c5cloth)\" d=\"M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z\"/><path fill=\"url(#hd6_c5skin)\" d=\"M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z\"/><path d=\"M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12\" fill=\"none\" stroke-width=\"2\"/><path fill=\"url(#hd6_c5clothL)\" d=\"M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z\"/><path fill=\"url(#hd6_c5skin)\" d=\"M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z\"/><path d=\"M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12\" fill=\"none\" stroke-width=\"2\"/></g><g class=\"x-happy\"><path d=\"M102,150 q18,20 36,0 q-7,14 -18,14 q-11,0 -18,-14z\" fill=\"#a04a3c\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/></g><g class=\"x-annoy\"><path d=\"M104,160 q16,-9 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M170,74 l5,-9 l5,9 M182,80 l5,-9\" fill=\"none\" stroke=\"#d9634f\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><defs><radialGradient id=\"hd6e_c5skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f6e2ca\"/><stop offset=\"62%\" stop-color=\"#ecc99f\"/><stop offset=\"100%\" stop-color=\"#cf9f6d\"/></radialGradient><linearGradient id=\"hd6e_c5hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#eceae2\"/><stop offset=\"55%\" stop-color=\"#c3c2b8\"/><stop offset=\"100%\" stop-color=\"#9c9b91\"/></linearGradient><linearGradient id=\"hd6e_c5cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a37b4d\"/><stop offset=\"100%\" stop-color=\"#8a6238\"/></linearGradient><linearGradient id=\"hd6e_c5clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#8a6238\"/><stop offset=\"100%\" stop-color=\"#6a4a29\"/></linearGradient><radialGradient id=\"hd6e_c5blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd6e_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"99\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><ellipse cx=\"141\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><circle cx=\"101\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"143\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"102.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><circle cx=\"144.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><rect class=\"blinklid\" x=\"89\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd6e_c5skin)\"/><rect class=\"blinklid\" x=\"131\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd6e_c5skin)\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 200 280\"><defs><radialGradient id=\"hd7_c6skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e2c8\"/><stop offset=\"62%\" stop-color=\"#eec9a1\"/><stop offset=\"100%\" stop-color=\"#d8a877\"/></radialGradient><linearGradient id=\"hd7_c6hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd7_c6cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f0d878\"/><stop offset=\"100%\" stop-color=\"#e8c34b\"/></linearGradient><linearGradient id=\"hd7_c6clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e8c34b\"/><stop offset=\"100%\" stop-color=\"#c9a23c\"/></linearGradient><radialGradient id=\"hd7_c6blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd7_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><ellipse cx=\"100\" cy=\"270\" rx=\"80\" ry=\"10\" fill=\"#3b3025\" opacity=\".16\" filter=\"url(#hd7_csoft)\"/><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\"><path fill=\"url(#hd7_c6skin)\" d=\"M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z\"/><path d=\"M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z\" fill=\"#3b3025\" opacity=\".12\" stroke=\"none\"/><path fill=\"url(#hd7_c6skin)\" d=\"M68,96 q-13,-2 -11,13 q2,13 15,11 z\"/><path fill=\"url(#hd7_c6skin)\" d=\"M172,96 q13,-2 11,13 q-2,13 -15,11 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd7_c6skin)\" d=\"M72,92 q-4,-40 48,-42 q52,2 48,42 q4,34 -12,54 q-14,18 -36,18 q-22,0 -36,-18 q-16,-20 -12,-54 z\"/></g><path d=\"M80,122 q-6,20 8,34 q-14,-4 -16,-24 q2,-8 8,-10z\" fill=\"#3b3025\" opacity=\".07\"/><ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd7_c6blush)\"/><ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd7_c6blush)\"/><g fill=\"#b9834f\" opacity=\".55\"><circle cx=\"90\" cy=\"118\" r=\"1.2\"/><circle cx=\"96\" cy=\"122\" r=\"1.1\"/><circle cx=\"86\" cy=\"124\" r=\"1\"/><circle cx=\"150\" cy=\"118\" r=\"1.2\"/><circle cx=\"144\" cy=\"122\" r=\"1.1\"/><circle cx=\"154\" cy=\"124\" r=\"1\"/><circle cx=\"120\" cy=\"128\" r=\"1\"/></g><g stroke=\"#3b3025\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22\" fill=\"url(#hd7_c6skin)\"/><path d=\"M113,130 q7,4 14,0\" stroke-width=\"1.8\"/></g><!-- eyes: see companion *-eyes.svg --><g><path d=\"M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/><path d=\"M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/></g><g class=\"x-neutral\"><path d=\"M104,152 q16,7 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></g><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd7_c6cloth)\" d=\"M62,72 q6,-38 58,-38 q52,0 58,38 q2,8 -6,10 l-104,0 q-8,-2 -6,-10z\"/><path fill=\"url(#hd7_c6clothL)\" d=\"M172,80 q22,-2 30,8 q4,6 -6,8 l-30,-2z\"/><circle cx=\"120\" cy=\"36\" r=\"4\" fill=\"#6f9ec9\"/><path d=\"M76,66 q44,-20 88,0\" fill=\"none\" stroke-width=\"1.6\" opacity=\".4\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd7_c6cloth)\" d=\"M104,178 q-34,8 -50,30 q-14,20 -16,84 l172,0 q-2,-64 -16,-84 q-16,-22 -50,-30 q-16,9 -40,0z\"/><path d=\"M70,218 q6,32 2,70 M170,218 q-6,32 -2,70\" fill=\"none\" stroke-width=\"1.6\" opacity=\".3\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd7_c6cloth)\" d=\"M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z\"/><path fill=\"url(#hd7_c6skin)\" d=\"M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z\"/><path d=\"M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12\" fill=\"none\" stroke-width=\"2\"/><path fill=\"url(#hd7_c6clothL)\" d=\"M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z\"/><path fill=\"url(#hd7_c6skin)\" d=\"M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z\"/><path d=\"M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12\" fill=\"none\" stroke-width=\"2\"/></g><g class=\"x-happy\"><path d=\"M102,150 q18,20 36,0 q-7,14 -18,14 q-11,0 -18,-14z\" fill=\"#a04a3c\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/></g><g class=\"x-annoy\"><path d=\"M104,160 q16,-9 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M170,74 l5,-9 l5,9 M182,80 l5,-9\" fill=\"none\" stroke=\"#d9634f\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><defs><radialGradient id=\"hd7e_c6skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e2c8\"/><stop offset=\"62%\" stop-color=\"#eec9a1\"/><stop offset=\"100%\" stop-color=\"#d8a877\"/></radialGradient><linearGradient id=\"hd7e_c6hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd7e_c6cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f0d878\"/><stop offset=\"100%\" stop-color=\"#e8c34b\"/></linearGradient><linearGradient id=\"hd7e_c6clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e8c34b\"/><stop offset=\"100%\" stop-color=\"#c9a23c\"/></linearGradient><radialGradient id=\"hd7e_c6blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd7e_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"99\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><ellipse cx=\"141\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><circle cx=\"101\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"143\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"102.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><circle cx=\"144.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><rect class=\"blinklid\" x=\"89\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd7e_c6skin)\"/><rect class=\"blinklid\" x=\"131\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd7e_c6skin)\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 200 280\"><defs><radialGradient id=\"hd8_c7skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e6d1\"/><stop offset=\"62%\" stop-color=\"#f0d0ac\"/><stop offset=\"100%\" stop-color=\"#e2b184\"/></radialGradient><linearGradient id=\"hd8_c7hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd8_c7cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#98c479\"/><stop offset=\"100%\" stop-color=\"#7aa95c\"/></linearGradient><linearGradient id=\"hd8_c7clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#7aa95c\"/><stop offset=\"100%\" stop-color=\"#5e8944\"/></linearGradient><radialGradient id=\"hd8_c7blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd8_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><ellipse cx=\"100\" cy=\"270\" rx=\"80\" ry=\"10\" fill=\"#3b3025\" opacity=\".16\" filter=\"url(#hd8_csoft)\"/><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd8_c7hair)\" d=\"M60,98 q-12,-42 26,-58 q28,-18 58,-2 q28,14 18,52 q2,8 -6,14 q-2,-22 -18,-28 q-24,-12 -50,-2 q-14,6 -16,22 q-6,0 -12,2z\"/><path class=\"hairwisp\" fill=\"url(#hd8_c7hair)\" d=\"M132,40 q20,-12 26,10 q6,20 -10,44 q-10,16 -14,28 q-8,-30 2,-54 q4,-16 -4,-28z\"/><path fill=\"#d9634f\" d=\"M126,38 q-6,-8 4,-12 q8,-2 8,8 q8,-6 12,2 q0,8 -10,8 q-8,2 -14,-6z\" stroke=\"#3b3025\" stroke-width=\"2\"/></g><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\"><path fill=\"url(#hd8_c7skin)\" d=\"M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z\"/><path d=\"M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z\" fill=\"#3b3025\" opacity=\".12\" stroke=\"none\"/><path fill=\"url(#hd8_c7skin)\" d=\"M68,96 q-13,-2 -11,13 q2,13 15,11 z\"/><path fill=\"url(#hd8_c7skin)\" d=\"M172,96 q13,-2 11,13 q-2,13 -15,11 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd8_c7skin)\" d=\"M72,96 q-4,-40 48,-42 q52,2 48,42 q4,34 -12,54 q-14,18 -36,18 q-22,0 -36,-18 q-16,-20 -12,-54 z\"/></g><path d=\"M80,122 q-6,20 8,34 q-14,-4 -16,-24 q2,-8 8,-10z\" fill=\"#3b3025\" opacity=\".07\"/><ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd8_c7blush)\"/><ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd8_c7blush)\"/><g stroke=\"#3b3025\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22\" fill=\"url(#hd8_c7skin)\"/><path d=\"M113,130 q7,4 14,0\" stroke-width=\"1.8\"/></g><!-- eyes: see companion *-eyes.svg --><g><path d=\"M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/><path d=\"M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/></g><g class=\"x-neutral\"><path d=\"M104,152 q16,7 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></g><g stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd8_c7hair)\" d=\"M74,66 q22,-16 46,-2 q4,6 -4,10 q-20,-10 -38,-2 q-4,-2 -4,-6z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd8_c7cloth)\" d=\"M108,176 q-30,8 -46,28 q-16,20 -14,84 l144,0 q2,-64 -14,-84 q-16,-20 -46,-28 q-10,6 -20,0z\"/><path fill=\"#d9634f\" d=\"M108,182 q12,10 24,0 l3,10 q-15,8 -30,0z\" opacity=\".7\"/><circle cx=\"120\" cy=\"206\" r=\"3\" fill=\"#fff\" stroke=\"#3b3025\" stroke-width=\"1.4\"/><circle cx=\"120\" cy=\"226\" r=\"3\" fill=\"#fff\" stroke=\"#3b3025\" stroke-width=\"1.4\"/><path d=\"M74,214 q6,30 2,66 M166,214 q-6,30 -2,66\" fill=\"none\" stroke-width=\"1.4\" opacity=\".3\"/></g><path d=\"M96,66 l14,-4 l0,6 l14,2 l-8,8 l6,10 l-14,-4 l-6,10 l-6,-10 l-14,4 l6,-10 l-8,-8 l14,-2z\" fill=\"#d9634f\" stroke=\"#3b3025\" stroke-width=\"1.6\" stroke-linejoin=\"round\" opacity=\".92\"/><circle cx=\"102\" cy=\"64\" r=\"3\" fill=\"#d9634f\" stroke=\"#3b3025\" stroke-width=\"1\"/><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd8_c7cloth)\" d=\"M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z\"/><path fill=\"url(#hd8_c7skin)\" d=\"M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z\"/><path d=\"M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12\" fill=\"none\" stroke-width=\"2\"/><path fill=\"url(#hd8_c7clothL)\" d=\"M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z\"/><path fill=\"url(#hd8_c7skin)\" d=\"M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z\"/><path d=\"M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12\" fill=\"none\" stroke-width=\"2\"/></g><g class=\"x-happy\"><path d=\"M102,150 q18,20 36,0 q-7,14 -18,14 q-11,0 -18,-14z\" fill=\"#a04a3c\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/></g><g class=\"x-annoy\"><path d=\"M104,160 q16,-9 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M170,74 l5,-9 l5,9 M182,80 l5,-9\" fill=\"none\" stroke=\"#d9634f\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><defs><radialGradient id=\"hd8e_c7skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e6d1\"/><stop offset=\"62%\" stop-color=\"#f0d0ac\"/><stop offset=\"100%\" stop-color=\"#e2b184\"/></radialGradient><linearGradient id=\"hd8e_c7hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd8e_c7cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#98c479\"/><stop offset=\"100%\" stop-color=\"#7aa95c\"/></linearGradient><linearGradient id=\"hd8e_c7clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#7aa95c\"/><stop offset=\"100%\" stop-color=\"#5e8944\"/></linearGradient><radialGradient id=\"hd8e_c7blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd8e_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"99\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><ellipse cx=\"141\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><circle cx=\"101\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"143\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"102.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><circle cx=\"144.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><rect class=\"blinklid\" x=\"89\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd8e_c7skin)\"/><rect class=\"blinklid\" x=\"131\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd8e_c7skin)\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 200 280\"><defs><radialGradient id=\"hd9_c8skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f2dcc0\"/><stop offset=\"62%\" stop-color=\"#e3c39a\"/><stop offset=\"100%\" stop-color=\"#c49a6c\"/></radialGradient><linearGradient id=\"hd9_c8hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd9_c8cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f3eddc\"/><stop offset=\"100%\" stop-color=\"#fffef9\"/></linearGradient><linearGradient id=\"hd9_c8clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fffef9\"/><stop offset=\"100%\" stop-color=\"#e6e0cf\"/></linearGradient><radialGradient id=\"hd9_c8blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd9_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><ellipse cx=\"100\" cy=\"270\" rx=\"80\" ry=\"10\" fill=\"#3b3025\" opacity=\".16\" filter=\"url(#hd9_csoft)\"/><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd9_c8hair)\" d=\"M64,98 q-10,-40 22,-54 q10,-8 4,-2 q30,-14 56,4 q22,14 12,48 q2,10 -4,18 q-4,-20 -16,-26 q-24,-10 -50,-2 q2,-6 -6,-4 q-14,4 -14,20 q-4,-2 -4,-2z\"/><path d=\"M100,50 q4,-8 12,-6\" fill=\"none\" stroke-width=\"1.6\" opacity=\".5\"/></g><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\"><path fill=\"url(#hd9_c8skin)\" d=\"M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z\"/><path d=\"M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z\" fill=\"#3b3025\" opacity=\".12\" stroke=\"none\"/><path fill=\"url(#hd9_c8skin)\" d=\"M68,96 q-13,-2 -11,13 q2,13 15,11 z\"/><path fill=\"url(#hd9_c8skin)\" d=\"M172,96 q13,-2 11,13 q-2,13 -15,11 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd9_c8skin)\" d=\"M72,96 q-4,-40 48,-42 q52,2 48,42 q4,34 -12,54 q-14,18 -36,18 q-22,0 -36,-18 q-16,-20 -12,-54 z\"/></g><path d=\"M80,122 q-6,20 8,34 q-14,-4 -16,-24 q2,-8 8,-10z\" fill=\"#3b3025\" opacity=\".07\"/><ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd9_c8blush)\"/><ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd9_c8blush)\"/><g stroke=\"#3b3025\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22\" fill=\"url(#hd9_c8skin)\"/><path d=\"M113,130 q7,4 14,0\" stroke-width=\"1.8\"/></g><!-- eyes: see companion *-eyes.svg --><g><path d=\"M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/><path d=\"M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/></g><g class=\"x-neutral\"><path d=\"M104,152 q16,7 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></g><g stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd9_c8hair)\" d=\"M76,64 q22,-14 44,-4 q4,6 -4,10 q-18,-8 -36,-2 q-4,-2 -4,-4z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd9_c8cloth)\" d=\"M104,172 q-38,10 -54,32 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-22 -54,-32 q-16,9 -32,0z\"/><path fill=\"url(#hd9_c8clothL)\" d=\"M120,176 q-14,2 -26,13 q19,-3 26,7z\"/><path fill=\"#f3eddc\" d=\"M120,176 q14,2 26,13 q-19,-3 -26,7z\"/><circle cx=\"120\" cy=\"240\" r=\"3\" fill=\"#d9d3c0\" stroke=\"#3b3025\" stroke-width=\"1.6\"/><circle cx=\"120\" cy=\"266\" r=\"3\" fill=\"#d9d3c0\" stroke=\"#3b3025\" stroke-width=\"1.6\"/></g><path d=\"M112,182 l8,8 l8,-8 l-2,50 q-6,8 -12,0z\" fill=\"#d9634f\" stroke=\"#3b3025\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><path d=\"M120,190 l-8,-8 l8,-6 l8,6z\" fill=\"#b84534\" stroke=\"#3b3025\" stroke-width=\"2\" stroke-linejoin=\"round\"/><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd9_c8cloth)\" d=\"M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z\"/><path fill=\"url(#hd9_c8skin)\" d=\"M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z\"/><path d=\"M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12\" fill=\"none\" stroke-width=\"2\"/><path fill=\"url(#hd9_c8clothL)\" d=\"M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z\"/><path fill=\"url(#hd9_c8skin)\" d=\"M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z\"/><path d=\"M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12\" fill=\"none\" stroke-width=\"2\"/></g><g class=\"x-happy\"><path d=\"M102,150 q18,20 36,0 q-7,14 -18,14 q-11,0 -18,-14z\" fill=\"#a04a3c\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/></g><g class=\"x-annoy\"><path d=\"M104,160 q16,-9 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M170,74 l5,-9 l5,9 M182,80 l5,-9\" fill=\"none\" stroke=\"#d9634f\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><defs><radialGradient id=\"hd9e_c8skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f2dcc0\"/><stop offset=\"62%\" stop-color=\"#e3c39a\"/><stop offset=\"100%\" stop-color=\"#c49a6c\"/></radialGradient><linearGradient id=\"hd9e_c8hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd9e_c8cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f3eddc\"/><stop offset=\"100%\" stop-color=\"#fffef9\"/></linearGradient><linearGradient id=\"hd9e_c8clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fffef9\"/><stop offset=\"100%\" stop-color=\"#e6e0cf\"/></linearGradient><radialGradient id=\"hd9e_c8blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><filter id=\"hd9e_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"99\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><ellipse cx=\"141\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><circle cx=\"101\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"143\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"102.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><circle cx=\"144.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><rect class=\"blinklid\" x=\"89\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd9e_c8skin)\"/><rect class=\"blinklid\" x=\"131\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd9e_c8skin)\"/></g></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"charsvg\" data-exp=\"neutral\" viewBox=\"0 0 200 280\"><defs><radialGradient id=\"hd10_c9skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e6d1\"/><stop offset=\"62%\" stop-color=\"#f0d0ac\"/><stop offset=\"100%\" stop-color=\"#e2b184\"/></radialGradient><linearGradient id=\"hd10_c9hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd10_c9cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f3eddc\"/><stop offset=\"100%\" stop-color=\"#fffef9\"/></linearGradient><linearGradient id=\"hd10_c9clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fffef9\"/><stop offset=\"100%\" stop-color=\"#e6e0cf\"/></linearGradient><radialGradient id=\"hd10_c9blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><linearGradient id=\"hd10_c9under\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8ab4da\"/><stop offset=\"100%\" stop-color=\"#6f9ec9\"/></linearGradient><filter id=\"hd10_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><ellipse cx=\"100\" cy=\"270\" rx=\"80\" ry=\"10\" fill=\"#3b3025\" opacity=\".16\" filter=\"url(#hd10_csoft)\"/><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd10_c9hair)\" d=\"M62,98 q-12,-42 26,-56 q28,-18 56,-2 q26,14 16,50 q6,10 -2,20 q-8,-18 -6,-28 q-6,10 -18,10 q6,-14 -4,-22 q-4,14 -18,16 q4,-16 -8,-22 q-2,14 -14,18 q0,-14 -10,-18 q-4,10 -10,14 q-4,-6 -8,0z\"/><path d=\"M70,70 l14,-6 l2,6 l-14,6z\" fill=\"#d9634f\" stroke=\"#3b3025\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/></g><g stroke=\"#3b3025\" stroke-width=\"3\" stroke-linejoin=\"round\"><path fill=\"url(#hd10_c9skin)\" d=\"M100,150 q20,10 40,0 l-2,34 q-18,9 -36,0 z\"/><path d=\"M102,152 q18,8 36,0 l-1,11 q-17,7 -34,0 z\" fill=\"#3b3025\" opacity=\".12\" stroke=\"none\"/><path fill=\"url(#hd10_c9skin)\" d=\"M68,96 q-13,-2 -11,13 q2,13 15,11 z\"/><path fill=\"url(#hd10_c9skin)\" d=\"M172,96 q13,-2 11,13 q-2,13 -15,11 z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd10_c9skin)\" d=\"M72,96 q-4,-40 48,-42 q52,2 48,42 q4,34 -12,54 q-14,18 -36,18 q-22,0 -36,-18 q-16,-20 -12,-54 z\"/></g><path d=\"M80,122 q-6,20 8,34 q-14,-4 -16,-24 q2,-8 8,-10z\" fill=\"#3b3025\" opacity=\".07\"/><ellipse cx=\"88\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd10_c9blush)\"/><ellipse cx=\"154\" cy=\"130\" rx=\"13\" ry=\"9\" fill=\"url(#hd10_c9blush)\"/><g stroke=\"#3b3025\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M120,106 q-4,15 -9,22 q-1,6 9,6 q10,0 9,-6 q-5,-7 -9,-22\" fill=\"url(#hd10_c9skin)\"/><path d=\"M113,130 q7,4 14,0\" stroke-width=\"1.8\"/></g><!-- eyes: see companion *-eyes.svg --><g><path d=\"M80,84 q18,-8 34,-2 q-4,6 -16,5 q-11,-1 -18,-3z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/><path d=\"M124,82 q17,-6 34,2 q-6,3 -18,3 q-13,0 -16,-5z\" fill=\"#3b3025\" stroke=\"#3b3025\" stroke-width=\"1\"/></g><g class=\"x-neutral\"><path d=\"M104,152 q16,7 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></g><g stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path fill=\"url(#hd10_c9hair)\" d=\"M74,66 q22,-16 46,-2 q4,6 -4,10 q-20,-10 -38,-2 q-4,-2 -4,-6z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd10_c9cloth)\" d=\"M104,172 q-38,10 -54,32 q-15,21 -17,96 l174,0 q-2,-75 -17,-96 q-16,-22 -54,-32 q-16,9 -32,0z\"/><path fill=\"url(#hd10_c9clothL)\" d=\"M120,176 q-14,2 -26,13 q19,-3 26,7z\"/><path fill=\"#f3eddc\" d=\"M120,176 q14,2 26,13 q-19,-3 -26,7z\"/></g><g stroke=\"#3b3025\" stroke-width=\"3.2\" stroke-linejoin=\"round\"><path fill=\"url(#hd10_c9cloth)\" d=\"M56,196 q-22,10 -24,46 q-1,16 4,28 q4,8 14,7 q8,-1 11,-9 q3,-36 5,-58 q-2,-14 -10,-13z\"/><path fill=\"url(#hd10_c9skin)\" d=\"M38,266 q15,6 28,-2 q5,11 -4,19 q-15,7 -28,-3 q-3,-8 4,-14z\"/><path d=\"M46,280 q3,8 -1,14 M55,281 q3,7 0,13 M63,279 q2,7 -1,12\" fill=\"none\" stroke-width=\"2\"/><path fill=\"url(#hd10_c9clothL)\" d=\"M184,196 q22,10 24,46 q1,16 -4,28 q-4,8 -14,7 q-8,-1 -11,-9 q-3,-36 -5,-58 q2,-14 10,-13z\"/><path fill=\"url(#hd10_c9skin)\" d=\"M202,266 q-15,6 -28,-2 q-5,11 4,19 q15,7 28,-3 q3,-8 -4,-14z\"/><path d=\"M194,280 q-3,8 1,14 M185,281 q-3,7 0,13 M177,279 q-2,7 1,12\" fill=\"none\" stroke-width=\"2\"/></g><g class=\"x-happy\"><path d=\"M102,150 q18,20 36,0 q-7,14 -18,14 q-11,0 -18,-14z\" fill=\"#a04a3c\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/></g><g class=\"x-annoy\"><path d=\"M104,160 q16,-9 32,0\" fill=\"none\" stroke=\"#3b3025\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M170,74 l5,-9 l5,9 M182,80 l5,-9\" fill=\"none\" stroke=\"#d9634f\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><defs><radialGradient id=\"hd10e_c9skin\" cx=\"42%\" cy=\"38%\" r=\"70%\"><stop offset=\"0\" stop-color=\"#f9e6d1\"/><stop offset=\"62%\" stop-color=\"#f0d0ac\"/><stop offset=\"100%\" stop-color=\"#e2b184\"/></radialGradient><linearGradient id=\"hd10e_c9hair\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4038\"/><stop offset=\"55%\" stop-color=\"#37302a\"/><stop offset=\"100%\" stop-color=\"#2a2420\"/></linearGradient><linearGradient id=\"hd10e_c9cloth\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f3eddc\"/><stop offset=\"100%\" stop-color=\"#fffef9\"/></linearGradient><linearGradient id=\"hd10e_c9clothL\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fffef9\"/><stop offset=\"100%\" stop-color=\"#e6e0cf\"/></linearGradient><radialGradient id=\"hd10e_c9blush\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#e88f72\" stop-opacity=\".55\"/><stop offset=\"100%\" stop-color=\"#e88f72\" stop-opacity=\"0\"/></radialGradient><linearGradient id=\"hd10e_c9under\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8ab4da\"/><stop offset=\"100%\" stop-color=\"#6f9ec9\"/></linearGradient><filter id=\"hd10e_csoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3.2\"/></filter></defs><g stroke=\"#3b3025\" stroke-width=\"2\"><ellipse cx=\"99\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><ellipse cx=\"141\" cy=\"106\" rx=\"10\" ry=\"8\" fill=\"#fff\"/><circle cx=\"101\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"143\" cy=\"107\" r=\"3.6\" fill=\"#3b3025\" stroke=\"none\"/><circle cx=\"102.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><circle cx=\"144.4\" cy=\"105.6\" r=\"1.1\" fill=\"#fff\" stroke=\"none\"/><rect class=\"blinklid\" x=\"89\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd10e_c9skin)\"/><rect class=\"blinklid\" x=\"131\" y=\"98\" width=\"20\" height=\"9\" rx=\"4\" fill=\"url(#hd10e_c9skin)\"/></g></svg>"];
var HD_HEADS = ["60 8 155 155","85 35 150 150","85 25 155 155","85 35 150 150","48 12 144 144","48 12 144 144","48 12 144 144","48 12 144 144","48 12 144 144","48 12 144 144","48 12 144 144"];
/* ---- đa dạng hoá dàn khách (xem nhan-vat.js) ----
   7 khách khung 200x280 dùng chung một bộ khung vẽ nên trước đây trông gần như
   giống hệt nhau. diversify() vá lại khuôn mặt / mắt / mũi / lông mày / quần áo
   cho từng người, ngay lúc khởi động, trước khi bất kỳ màn nào vẽ nhân vật. */
if(typeof SPECS !== 'undefined' && typeof diversify === 'function'){
  Object.keys(SPECS).forEach(function(k){
    var sp = SPECS[k];
    HD_CHARS[sp.hd] = diversify(HD_CHARS[sp.hd], sp, sp.hd);
  });
}

/* ---- đạo cụ nhận diện nghề nghiệp ----
   Vẽ chồng lên sprite gốc (nên nằm cuối, trước </svg>). Toạ độ theo viewBox của từng khách:
   khách 0–2 dùng khung 280x280 (mặt ở y≈100, cổ áo y≈190, ngực y 200–260, thân x 85–215),
   khách 3–9 dùng khung 200x280 (mặt ở y≈105, cổ áo y≈185, ngực y 195–255, thân x 35–185).
   Không có đạo cụ cho Chú Ba (đã có nón lá) và Thầy Nam (đã có áo blouse). */
const CUST_PROPS = {
  // 0 · Bà Tư — lò bánh mì: ổ bánh mì ôm chéo trước ngực
  0: '<g stroke="#3b3025" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" transform="rotate(-20 150 228)">'
   + '<rect x="104" y="214" width="92" height="28" rx="14" fill="#d99a52"/>'
   + '<path d="M126,222 l9,12 M147,220 l9,12 M168,220 l9,12" fill="none" stroke-width="2.4" opacity=".65"/></g>',
  // 2 · Bé Na — học sinh: khăn quàng đỏ (che luôn cái cà vạt khiến em trông như dân văn phòng)
  2: '<g stroke="#3b3025" stroke-width="3" stroke-linejoin="round">'
   + '<path d="M126,193 L150,264 L174,193 q-24,11 -48,0z" fill="#d9364a"/>'
   + '<path d="M138,185 q12,-6 24,0 q-2,12 -12,12 q-10,0 -12,-12z" fill="#e8515f"/></g>',
  // 3 · Anh Minh — thợ xây: mũ bảo hộ
  3: '<g stroke="#3b3025" stroke-width="3" stroke-linejoin="round">'
   + '<path d="M64,76 q0,-48 56,-48 q56,0 56,48z" fill="#f0b429"/>'
   + '<rect x="56" y="72" width="128" height="13" rx="6.5" fill="#f7c948"/>'
   + '<path d="M120,30 v44" fill="none" stroke-width="2.4" opacity=".45"/></g>',
  // 4 · Cô Lan — y tá: ống nghe (vốn bị gán nhầm cho Cô Mai) + phù hiệu chữ thập
  4: '<g fill="none" stroke="#3b3025" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
   + '<path d="M96,180 q-6,20 0,34 q4,10 14,10" fill="none" stroke-width="4" stroke="#4a4a4a" opacity=".85"/>'
   + '<path d="M144,180 q6,20 0,34 q-4,10 -14,10" fill="none" stroke-width="4" stroke="#4a4a4a" opacity=".85"/>'
   + '<circle cx="110" cy="224" r="7" fill="#c7c7c7" stroke="#3b3025" stroke-width="2"/></g>'
   + '<g stroke="#3b3025" stroke-width="2"><rect x="150" y="206" width="21" height="21" rx="4" fill="#fff"/>'
   + '<path d="M160.5,211 v11 M155,216.5 h11" stroke="#d9364a" stroke-width="3.6" stroke-linecap="round"/></g>',
  // 5 · Ông Sáu — chủ ao cá: con cá
  5: '<g stroke="#3b3025" stroke-width="3" stroke-linejoin="round">'
   + '<path d="M82,228 q24,-22 52,0 q-24,22 -52,0z" fill="#7fb3d5"/>'
   + '<path d="M134,228 l20,-13 v26z" fill="#5a9bc4"/>'
   + '<circle cx="95" cy="223" r="2.8" fill="#3b3025" stroke="none"/></g>',
  // 6 · Bạn Tí — học sinh: khăn quàng đỏ
  6: '<g stroke="#3b3025" stroke-width="3" stroke-linejoin="round">'
   + '<path d="M101,197 L120,252 L139,197 q-19,9 -38,0z" fill="#d9364a"/>'
   + '<path d="M110,190 q10,-5 20,0 q-2,11 -10,11 q-8,0 -10,-11z" fill="#e8515f"/></g>',
  // 7 · Chị Hoa — tiệm vàng bạc: dây chuyền và hoa tai vàng
  7: '<g fill="none" stroke="#c8a227" stroke-width="3.2" stroke-linecap="round"><path d="M97,190 q23,28 46,0"/></g>'
   + '<g stroke="#8a6238" stroke-width="2"><circle cx="120" cy="214" r="5.5" fill="#f0c419"/>'
   + '<circle cx="78" cy="141" r="4.2" fill="#f0c419"/><circle cx="162" cy="141" r="4.2" fill="#f0c419"/></g>',
  // 9 · Cô Mai — quán chè: tạp dề đã nằm trong nhan-vat.js (GARMENT.apron)
};
function custArt(i){ return HD_CHARS[i+1].replace('</svg>', (CUST_PROPS[i] || '') + '</svg>'); }
function custSVG(i, exp){ return custArt(i).replace('data-exp="neutral"', 'data-exp="'+exp+'"'); }
function custHead(i){ return custArt(i).replace(/viewBox="[^"]+"/, 'viewBox="'+HD_HEADS[i+1]+'"'); }
function profSVG(exp){ return HD_CHARS[0].replace('data-exp="neutral"', 'data-exp="'+exp+'"'); }
