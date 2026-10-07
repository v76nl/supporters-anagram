# サポーターズ アナグラム (Supporters Anagram)

「サポーターズ」のイベントで配布される1文字ずつのキーホルダー (サ・ポ・ー・タ・ズ) を組み合わせて作れる言葉を探すウェブアプリケーションです。

手持ちのキーホルダーの文字・個数をタップで直感的に変更し、今作れる言葉や、あと何文字集めれば作れる言葉をリアルタイムに検索・確認できます。完成した言葉はアクリルキーホルダーが連なったプレビューとして画像保存したり、Xにポストして友達とシェアできます。

![アプリケーション画面](docs/screenshots/preview.png)

## 主な機能

- 手持ちキーホルダーの個数管理 (各文字 0〜9個、タップで増減、プリセット一括設定)
- リアルタイム言葉マッチング判定 (今作れる言葉、あと少しで作れる言葉、全単語)
- 不足文字ガイド (あとどの文字が何個足りないかを明示)
- 豊富なカテゴリ辞書 (IT・就活用語、オノマトペ、日常語、スラング等)
- 連結アクリルキーホルダー風プレビュー演出
- 画像保存 (PNGダウンロード) および X (Twitter) シェア機能
- ハプティックフィードバック対応 (対応スマートフォン)

## 技術スタック

- React 19
- TypeScript
- Vite
- Biome (Linter / Formatter)
- Lucide React (アイコン)
- Canvas Confetti (演出)
- html-to-image (キーホルダー画像生成)
- Zen Maru Gothic (Google Fonts)

## コマンド一覧

| コマンド | 説明 |
| --- | --- |
| `pnpm install` | 依存関係パッケージのインストール |
| `pnpm dev` | ローカル開発用サーバーの起動 |
| `pnpm build` | 本番用バンドルのビルド |
| `pnpm preview` | ビルド済み成果物のプレビュー |
| `pnpm lint` | Biomeによる静的解析 (リント) |
| `pnpm format` | Biomeによるコードフォーマット |
| `pnpm check` | Biomeによるリントとフォーマットの同時実行 |
| `uv run --with sudachipy --with sudachidict-core python scripts/extract_dictionary.py` | Sudachi大規模辞書から全単語を再抽出・辞書生成 |

## ディレクトリ構成

```text
supporters-anagram/
├── docs/
│   └── screenshots/
│       └── preview.png          # 画面プレビュー画像
├── scripts/
│   └── extract_dictionary.py    # 大規模形態素辞書 (SudachiDict) からの単語抽出スクリプト
├── src/
│   ├── data/
│   │   ├── dictionary_extracted.json # 抽出元単語JSONデータ
│   │   └── words.ts             # 単語辞書データおよび判定ロジック
│   ├── App.tsx                  # メインアプリケーションコンポーネント
│   ├── index.css                # アクリルキーホルダー風デザイン・スタイル
│   └── main.tsx                 # エントリーポイント
├── biome.json                   # Biome 設定ファイル
├── index.html                   # HTML テンプレート
├── package.json                 # プロジェクト構成定義
├── tsconfig.json                # TypeScript 設定
└── vite.config.ts               # Vite 設定
```
