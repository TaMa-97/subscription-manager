# サブスクリプション管理アプリ

個人用のサブスクリプション管理ツール（ミニマム）

## 技術スタック（フロントエンド）

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

### バックエンド連携

- Supabase
  - 認証
  - データベース
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
