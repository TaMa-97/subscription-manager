# 固定費管理アプリ

個人用の固定費管理ツール（ミニマム）

![image](https://github.com/user-attachments/assets/36c1d25e-5a38-4bb3-9b13-a7019f8bc3b5)

## 技術スタック

### 言語/ライブラリ等

- React (v18 系)
- TypeScript
- Vite

### スタイリング

- Styled Components
- Tailwind CSS

### フォームとバリデーション

- React Hook Form
- Zod

### コンポーネント関連

- React DatePicker
- Lucide React
- date-fns

### バックエンド/データベース

- Supabase
  - 認証システム
  - PostgreSQL データベース
  - Row Level Security (RLS)
  - リアルタイム更新

### PWA

- Vite PWA
- Workbox - Service Worker 管理
  - オフラインサポート
  - キャッシュ管理
  - 更新通知

## PWA について

このアプリケーションは PWA（Progressive Web App）として実装されています。

- オフライン対応
- ホーム画面へのインストール
- プッシュ通知（準備中）
- 自動アップデート
