# ポケモンTCGウェブアプリ

ポケモンカードゲームをオンラインで遊べるフルスタックのウェブアプリケーションです。  
フロントエンドはReact、Vite、Tailwind CSS、バックエンドはDjango REST Framework、Django Channels、Redis、PostgreSQLで構築されており、Docker Composeで簡単にローカル開発できます。

---

## 🚀 機能（開発中）

### フロントエンド
- ユーザーログインページ
- ポケモン図鑑ページ（ポケモンカード閲覧）
- マイデッキページ（デッキ管理）
- デッキ作成・編集ページ
- ロビー（リアルタイムマルチプレイヤーマッチメイキング）
- バトルページ（初期手札配布完了、ゲームロジックは進行中）

### バックエンド
- JWT認証および認証APIエンドポイント
- PostgreSQLデータベース（ユーザー、カード、デッキモデル）
- Django ChannelsによるWebSocket通信
- Redisをチャネルレイヤーとして使用（統合は今後予定）
- Docker化されたサービスによる簡単デプロイ

---

## 🛠️ 技術スタック

- **フロントエンド:** React, Vite, Tailwind CSS  
- **バックエンド:** Django, Django REST Framework, Django Channels, PostgreSQL, Redis  
- **デプロイ:** Docker, Docker Compose

---

## 📦 セットアップ手順

### 前提条件
- DockerおよびDocker Composeがインストールされていること  
- （任意）フロントエンド単体で動かす場合はNode.jsとnpm/yarnが必要

### リポジトリのクローン
```bash
git clone https://github.com/kneckebrodet/Poke-tcg.git
cd Poke-tcg
```
Docker Composeで起動
```bash
docker-compose up --build
```
**バックエンドAPI:** http://localhost:8000
**フロントエンド:** http://localhost:5173

📝 プロジェクト構成
```bash
/backend/     # Djangoバックエンド  
/frontend/    # Reactフロントエンド  
/docker-compose.yml
/.gitignore
```

⚙️ 使い方
ユーザー登録・ログイン

デッキの作成・管理

ロビーで対戦相手とマッチング

ポケモンTCGの対戦（ゲームロジックは順次実装中）

🤝 コントリビューション
ご意見・ご要望・プルリクエスト大歓迎です！
お気軽にIssueを立ててください。

📄 ライセンス

👋 お問い合わせ
