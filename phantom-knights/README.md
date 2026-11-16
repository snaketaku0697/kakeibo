# 幻影騎士団 展開ガイド

遊戯王マスターデュエルのイベント「プラネットラン」用レンタルデッキ「幻影騎士団」の、初心者向け学習ガイドです。
[元動画](https://youtu.be/JQ--WmlgkL8)の解説をもとに、展開を一手ずつ確認できます（対戦を再現するものではありません）。

## 起動方法

ビルドもアカウント登録も不要です。

- `index.html` をブラウザで直接開く
- または、リポジトリのルートで `python3 -m http.server 8000` を実行し、`http://localhost:8000/phantom-knights/` を開く

## 構成

| ファイル | 内容 |
| --- | --- |
| `index.html` | 画面（はじめに／展開／妨害／注意点／練習／用語） |
| `css/style.css` | スタイル（スマホ優先、ライト・ダーク対応） |
| `js/data.js` | カード、用語、3つの展開ルートの手順データ |
| `js/app.js` | 画面の切り替え、ステップ送り、説明の表示、クイズ、確率計算 |
| `tools/validate.js` | 手順データの整合性チェック |
| `tools/check-cards.js` | カード情報をカードデータベース yaml-yugi と照合 |

## 手順データの確認

```
node phantom-knights/tools/validate.js
```

各ステップのカード移動（手札・場・墓地・除外・素材）が直前の状態と矛盾しないか、本文のカード・用語の参照が正しいかを確認します。

## カード情報の照合

```
git clone --depth 1 https://github.com/DawnbrandBots/yaml-yugi
node phantom-knights/tools/check-cards.js yaml-yugi
```

`js/data.js` の各カードの名前・公式DBのID・種類・レベル/ランク/リンク・属性・種族・攻守・リンクマーカーを、
公開されているカードデータベース [yaml-yugi](https://github.com/DawnbrandBots/yaml-yugi) と突き合わせます。
効果の文章は要約なので機械では比べられません。`--text` を付けると日本語テキストを表示するので、要約を直したときは読み比べてください。
