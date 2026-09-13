# 2026-09-13 ワークショップ追加キャラクター素材

既存の採用版 `public/concept-character.png` を参照し、built-in image_gen で生成しました。アプリのコードは本素材作成では変更していません。

| ファイル | 寸法 | 背景 | 用途 |
|---|---|---|---|
| public/concept-character.png | 1254 × 1254 | 透過 PNG（既存採用版） | 講義・Work開始・席替え・アンケートなどの案内 |
| public/concept-character-karuta.png | 1536 × 1024 | 透過 PNG | 昼一の UI カルタ。主役と同じテイストの白シャツの別キャラクターが UI 記号の札で遊ぶ |
| public/concept-character-welcome.png | 1254 × 1254 | 白背景 PNG | 開始・全ワーク終了・労いの両手を開いたポーズ |

## 配置

- 全素材の縦横比を維持します。
- カルタは横長の場面として配置。元の採用版と顔・手・眼鏡レンズの白を維持しています。
- welcome は白背景として採用。白いパネル／白背景のスライドに配置すると自然です。色背景では既存の透過説明ポーズも利用できます。
- 顔と手の白を維持するため、乗算合成は使わないでください。
- タイトルや案内の文章は画像に描き込んでいません。HTML テキストで配置してください。
- 挨拶ポーズの初回生成と最初の透過編集には格子が描き込まれたため、不採用です。public にコピーした welcome は格子のない白背景版です。

## 最終プロンプト

### UI カルタ
```text
Use case: illustration-story
Asset type: transparent cutout illustration for an existing Japanese design workshop slide.
Primary request: Create a UI-karuta game scene with the reference mascot and one distinct companion in exactly the same visual style. This is a new pose/scene variation of the provided mascot, not a redesign.
Input image: the provided local PNG is the definitive character identity and style reference.
Subject: TWO friendly simplified adult characters playing karuta together, sitting opposite one another at a very simple low oval tabletop with about 8 rectangular cards spread face up. The main character is recognizably the reference: black center-part hair with a single white parting line above the forehead, longer nape, thick round black glasses with opaque white lenses, white face and hands, no visible facial features, plain black collared button-front shirt, and the yellow can sitting directly on the black hair without any white gap. The companion is a distinct adult with a short simple rounded black bob haircut, white face and hands, no glasses, no can, and plain white collared shirt with thick black outlines. Keep head proportions and hand simplification matched. They lean in with engaged relaxed body language; each reaches toward a different karuta card with one hand. Maintain plausible hands and arm joins.
Cards: blank white rectangular cards with large simple black UI symbols (hamburger menu, magnifying glass, plus sign, checkbox, arrow), 1 symbol per card; no letters, no digits, no Japanese writing.
Style/medium: bold clean rounded black contour, simple nearly flat white/black/yellow fills, match the reference faithfully. No anime, no photographic detail, no fine textures, no scenery. Yellow can is the only saturated color accent.
Composition/framing: landscape 3:2. Entire two-person scene visible including hands and table; comfortable 6% empty margins all sides. Characters are the focus, table not huge. Transparent surrounding background with genuine alpha channel; keep white faces, hands, lenses, companion shirt and cards fully opaque.
Constraints: no title, no caption, no logos, no watermark, no checkerboard, no ground plane, no cast shadow, no background rectangle. Do not change the mascot identity.
```

### 挨拶ポーズ（生成）
```text
Use case: illustration-story
Asset type: transparent cutout mascot decoration for a Japanese design workshop presentation.
Primary request: Create a new welcoming and congratulatory pose of the provided exact mascot. This one asset will decorate workshop start and completion slides.
Input image: provided PNG is the definitive identity, proportions, clothes and illustration-style reference; preserve all of them.
Subject: the SAME mascot, from the waist up, front three-quarter view, with both arms lifted outward in a friendly open "welcome / well done" gesture, palms visible, simple softly rounded fingers. Friendly energy conveyed only by body language. Do not add eyes or mouth: opaque white glasses, white face with no facial details, exactly as reference. Keep black center-part hair with the thin white parting above forehead and longer nape, bold round black glasses with white lenses, plain black collared button shirt, and one yellow can atop the black hair. The bottom of the yellow can connects directly to black hair with no white gap.
Style: match reference precisely, thick rounded black outlines, simple black/charcoal and white filled forms, yellow can as sole accent, clean quiet flat illustration.
Composition: square canvas, character waist up entirely visible, hands not clipped, can not clipped, centered. Generous 6% transparent margins left, top, right. Bottom of shirt ends in a clean gently rounded silhouette, not a rectangle backdrop. No scene, no additional object, no confetti, no speech bubble.
Background: genuine transparent alpha surrounding the figure. White face, hands, lenses remain fully opaque. Absolutely no shadow, glow, gradient background, checkerboard, text or watermark.
```

### 挨拶ポーズ（最終編集）
```text
Edit the provided image. Replace every single grey checkerboard pixel outside the character with a perfectly flat solid white (#FFFFFF) background. No checkerboard anywhere. Keep the entire character pixel appearance unchanged: its exact pose, glasses, face, both hands, shirt and yellow can. Use a clean plain white background only, no transparency needed. No shadows, no grey texture, no other objects, no text. The character should look like a clean flat editorial illustration on pure white. Preserve all white parts inside the character too.
```

