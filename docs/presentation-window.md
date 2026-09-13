# 別タブでのスライド上映

全画面表示ボタンと F キーは、現在のページを `?view=presentation#slide-N` で別タブに開く。元のタブは通常表示のまま残し、既に上映タブが開いていれば再利用する。

上映タブは `?view=slide` の同一オリジンのフレームにスライドだけを表示する。1280 × 740 のレイアウトを保ち、縦横比を維持して画面に収める。上部メニュー、進行バー、講師メモ、下部の操作バーは投影しない。スライドの切り替え、タイマー、暗転は上映タブ内で操作できる。元のタブとは独立した進行状態を持つ。

- ← / →、PageUp / PageDown、Space：移動（段階表示のあるページでは先に内容を表示）
- Home / End：先頭 / 最後
- F：上映タブの全画面を切り替え
- B：暗転を切り替え
- Esc：ブラウザーの全画面を終了

ブラウザーが自動全画面表示を許可していれば、上映タブの初期表示時に全画面化する。通常のブラウザーでは操作の直後でなければ全画面化できないため、失敗時は「全画面で表示」ボタンを表示し、クリックで再試行する。ポップアップを拒否された場合は元のタブに復帰方法を表示する。

仕様の根拠：[Fullscreen の操作要件](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen#security)、[Chrome の自動全画面設定](https://developer.chrome.com/blog/chrome-127-beta?hl=en#automatic_fullscreen_content_setting)。

検証：`npm run build:github-pages` の後に `node scripts/check-presentation.mjs`。Chrome で別タブ、実際の全画面化、元タブの保持、タイマー、スライド送り、暗転、全ページの収まり、画面サイズ変更、タブの再利用と再作成、ポップアップ拒否時を確認する。
