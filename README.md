# スレッド型掲示板アプリケーション

モノレポ構成で作成された、スレッド型掲示板のWebアプリケーションです。NestJS、Next.js、PostgreSQLを使用しています。

## システム構成

このプロジェクトは以下のコンポーネントで構成されています：

- **フロントエンド**: Next.js (TypeScript)
  - ポート: 3001
  - URL: http://localhost:3001
- **バックエンド**: NestJS (TypeScript)
  - ポート: 3000
  - API URL: http://localhost:3000
  - Swagger API ドキュメント: http://localhost:3000/api
- **データベース**: PostgreSQL 16
  - ポート: 5432
  - データベース名: threadboard
  - ユーザー名: postgres
  - パスワード: postgres
- **画像ストレージ**: Amazon S3
  - バケット名: backendpracticeimages
  - リージョン: ap-northeast-1

### システム構成図

```mermaid
graph TD
    User[ユーザー] -->|アクセス| Frontend

    subgraph "Docker環境"
        Frontend[フロントエンド\nNext.js] -->|API呼び出し| Backend
        Backend[バックエンド\nNestJS] -->|データ永続化| DB[(PostgreSQL)]
        Backend -->|画像保存/取得| S3[(Amazon S3)]
    end

    style Frontend fill:#61DAFB,stroke:#333,color:#000
    style Backend fill:#E0234E,stroke:#333,color:#fff
    style DB fill:#336791,stroke:#333,color:#fff
    style S3 fill:#FF9900,stroke:#333,color:#000
```

### コンポーネント間の関係

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant Frontend as フロントエンド<br/>(Next.js)
    participant NextAPI as Next.js API Routes
    participant Backend as バックエンドAPI<br/>(NestJS)
    participant DB as PostgreSQL
    participant S3 as Amazon S3

    User->>Frontend: Webページにアクセス
    Frontend->>NextAPI: APIリクエスト
    NextAPI->>Backend: プロキシリクエスト
    Backend->>DB: データ取得/保存

    alt 画像アップロード処理
        User->>Frontend: 画像をアップロード
        Frontend->>NextAPI: 画像データを送信
        NextAPI->>Backend: 画像を転送
        Backend->>S3: 画像を保存
        S3-->>Backend: 署名付きURL
        Backend-->>NextAPI: 画像URL
        NextAPI-->>Frontend: 画像URL
        Frontend-->>User: アップロード完了表示
    end

    alt スレッド/投稿の表示
        User->>Frontend: スレッド表示リクエスト
        Frontend->>NextAPI: スレッドデータ要求
        NextAPI->>Backend: スレッド情報取得
        Backend->>DB: スレッドとコメントを取得
        Backend->>S3: 画像の署名付きURLを生成
        S3-->>Backend: 署名付きURL
        Backend-->>NextAPI: スレッド、コメント、画像URL
        NextAPI-->>Frontend: 表示データ
        Frontend-->>User: スレッドを表示
    end
```

### Reactコンポーネント構造と認証フロー

```mermaid
graph TD
    subgraph "ページコンポーネント"
        HomePage["HomePage\n(page.tsx)"]
        LoginPage["LoginPage\n(login/page.tsx)"]
        RegisterPage["RegisterPage\n(register/page.tsx)"]
        ThreadDetailPage["ThreadDetailPage\n(threads/[id]/page.tsx)"]
    end

    subgraph "UIコンポーネント"
        Navbar["Navbar\n(認証状態確認・表示)"]
        LoginForm["LoginForm\n(ログイン処理)"]
        RegisterForm["RegisterForm\n(ユーザー登録)"]
        ThreadList["ThreadList\n(スレッド一覧表示)"]
        PostList["PostList\n(投稿一覧表示)"]
        CreateThreadForm["CreateThreadForm\n(スレッド作成)"]
        CreatePostForm["CreatePostForm\n(投稿作成)"]
    end

    subgraph "認証・APIユーティリティ"
        ApiUtils["api.ts\n(APIリクエスト処理)"]
        LocalStorage["localStorage\n(トークン保存)"]
    end

    %% ページとコンポーネントの関係
    HomePage --> Navbar
    HomePage --> ThreadList
    HomePage --> CreateThreadForm
    LoginPage --> Navbar
    LoginPage --> LoginForm
    RegisterPage --> Navbar
    RegisterPage --> RegisterForm
    ThreadDetailPage --> Navbar
    ThreadDetailPage --> PostList
    ThreadDetailPage --> CreatePostForm

    %% 認証関連の関係
    LoginForm -->|"ログイン処理\nトークン保存"| LocalStorage
    Navbar -->|"トークン取得\n認証状態確認"| LocalStorage
    ApiUtils -->|"トークン取得\nリクエストヘッダー設定"| LocalStorage

    CreateThreadForm -->|"認証済みリクエスト"| ApiUtils
    CreatePostForm -->|"認証済みリクエスト"| ApiUtils
    ThreadList -->|"スレッド取得"| ApiUtils
    PostList -->|"投稿取得"| ApiUtils

    style Navbar fill:#FFCCCB,stroke:#333,color:#000
    style LoginForm fill:#FFCCCB,stroke:#333,color:#000
    style RegisterForm fill:#FFCCCB,stroke:#333,color:#000
    style LocalStorage fill:#FFCCCB,stroke:#333,color:#000
    style ApiUtils fill:#FFCCCB,stroke:#333,color:#000
```

### 認証フローと状態管理

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant Client as クライアント<br/>(ブラウザ)
    participant Components as Reactコンポーネント
    participant LocalStorage as ローカルストレージ
    participant NextAPI as Next.js API Routes
    participant Backend as バックエンドAPI<br/>(NestJS)
    participant JWT as JWT認証

    %% ユーザー登録フロー
    User->>Client: ユーザー登録フォーム入力
    Client->>Components: RegisterForm送信
    Components->>NextAPI: /api/users POST
    NextAPI->>Backend: /users POST
    Backend->>Backend: パスワードハッシュ化
    Backend->>JWT: JWTトークン生成
    Backend-->>NextAPI: ユーザー情報返却
    NextAPI-->>Components: 登録成功
    Components->>Client: ログインページへリダイレクト

    %% ログインフロー
    User->>Client: ログインフォーム入力
    Client->>Components: LoginForm送信
    Components->>NextAPI: /api/auth/login POST
    NextAPI->>Backend: /auth/login POST
    Backend->>JWT: 認証情報検証
    Backend->>JWT: JWTトークン生成
    Backend-->>NextAPI: アクセストークン返却
    NextAPI-->>Components: トークン受け取り
    Components->>LocalStorage: トークン保存
    Components->>Client: ホームページへリダイレクト

    %% 認証状態の確認と維持
    User->>Client: ページ訪問/リロード
    Client->>Components: Navbar初期化
    Components->>LocalStorage: トークン取得
    alt トークンあり
        Components->>NextAPI: /api/auth/profile GET
        NextAPI->>Backend: /auth/me GET
        Backend->>JWT: トークン検証
        alt 有効なトークン
            Backend-->>NextAPI: ユーザー情報
            NextAPI-->>Components: ユーザーデータ
            Components->>Components: 認証済み状態に更新
        else 無効なトークン
            Backend-->>NextAPI: 認証エラー
            NextAPI-->>Components: エラー返却
            Components->>LocalStorage: トークン削除
            Components->>Components: 未認証状態に更新
        end
    else トークンなし
        Components->>Components: 未認証状態を維持
    end

    %% 認証が必要なアクション
    User->>Client: スレッド作成/投稿
    Client->>Components: フォーム送信
    Components->>LocalStorage: トークン取得
    Components->>NextAPI: 認証ヘッダー付きリクエスト
    NextAPI->>Backend: 認証ヘッダー転送
    Backend->>JWT: トークン検証
    alt 有効なトークン
        Backend->>Backend: リクエスト処理
        Backend-->>NextAPI: 成功レスポンス
        NextAPI-->>Components: 処理結果
        Components-->>Client: UI更新
    else 無効なトークン
        Backend-->>NextAPI: 認証エラー
        NextAPI-->>Components: エラー返却
        Components->>LocalStorage: トークン削除
        Components->>Client: ログインページへリダイレクト
    end

    %% ログアウト
    User->>Client: ログアウトボタンクリック
    Client->>Components: Navbarログアウト処理
    Components->>LocalStorage: トークン削除
    Components->>Components: ユーザー状態をnullに設定
    Components->>Client: UI更新(未認証表示)
```

## 起動方法

### Docker Compose を使用した起動 (推奨)

プロジェクトルートディレクトリで以下のコマンドを実行するだけで、フロントエンド、バックエンド、PostgreSQLが一緒に起動します：

```bash
# すべてのサービスを起動
$ docker compose up

# バックグラウンドで起動する場合
$ docker compose up -d

# 変更を加えた後に再ビルドして起動する場合
$ docker compose up --build
```

### 個別の起動方法

プロジェクトのルートディレクトリから以下のコマンドを実行できます：

```bash
# バックエンドのみを起動 (Docker経由)
$ npm run backend

# フロントエンドのみを起動
$ npm run frontend

# バックエンドとフロントエンドを同時に起動 (別々のターミナルで)
$ npm run dev
```

## 機能一覧

1. ユーザー管理機能

   - ユーザー登録
   - ユーザー認証（ログイン）
   - 認証ユーザー情報取得

2. スレッド管理機能

   - スレッド作成
   - スレッド一覧取得
   - スレッド詳細取得

3. 投稿管理機能
   - 投稿作成
   - 投稿一覧取得（スレッド単位）
   - 投稿への返信
   - 返信一覧取得（投稿単位）
   - 画像のアップロードと表示

## プロジェクト構造

```
/
├── docker-compose.yml           # Docker Compose 設定ファイル
├── packages/                    # モノレポのパッケージディレクトリ
│   ├── backend/                 # NestJS バックエンド
│   │   ├── Dockerfile          # バックエンド用 Dockerfile
│   │   └── ...
│   └── frontend/               # Next.js フロントエンド
│       ├── Dockerfile          # フロントエンド用 Dockerfile
│       └── ...
└── ...
```

## 開発環境のセットアップ

### 前提条件

- Docker と Docker Compose がインストールされていること
- Node.js と npm がインストールされていること (Docker を使わない場合)
- AWS アカウントと S3 バケットのアクセス権（画像機能を使用する場合）

### 初回セットアップ

```bash
# リポジトリをクローン
$ git clone <repository-url>
$ cd <repository-directory>

# 環境変数の設定（AWS S3用）
$ cp .env.example .env
$ vi .env  # AWS_ACCESS_KEY_ID と AWS_SECRET_ACCESS_KEY を設定

# Docker Compose で起動
$ docker compose up
```

アプリケーションは以下のURLでアクセスできます：

- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:3000
- API仕様(Swagger): http://localhost:3000/api

## データベース設計

### ER図

```mermaid
erDiagram
    User ||--o{ Thread : "作成する"
    User ||--o{ Post : "投稿する"
    Thread ||--o{ Post : "含む"
    Post ||--o{ Post : "返信する"
    Post ||--o{ Image : "含む"

    User {
        uuid id PK "ユーザーID"
        string username "ユーザー名(一意)"
        string email "メールアドレス(一意)"
        string password "パスワード(ハッシュ化)"
        timestamp createdAt "作成日時"
        timestamp updatedAt "更新日時"
    }

    Thread {
        uuid id PK "スレッドID"
        string title "スレッドタイトル"
        text description "スレッド説明"
        uuid user_id FK "作成者ID"
        timestamp createdAt "作成日時"
        timestamp updatedAt "更新日時"
    }

    Post {
        uuid id PK "投稿ID"
        text content "投稿内容(HTML可)"
        uuid user_id FK "投稿者ID"
        uuid thread_id FK "所属スレッドID"
        uuid parent_id FK "親投稿ID(返信先、オプション)"
        timestamp createdAt "作成日時"
        timestamp updatedAt "更新日時"
    }

    Image {
        uuid id PK "画像ID"
        uuid post_id FK "所属投稿ID"
        string url "画像URL"
        string filename "元ファイル名"
        string mimetype "MIMEタイプ"
        integer size "ファイルサイズ(バイト)"
        integer position "表示順序"
        string alt "代替テキスト(オプション)"
        timestamp createdAt "作成日時"
        timestamp updatedAt "更新日時"
    }
```

### 接続情報

データベース接続情報は主に以下のファイルで設定しています：

1. **docker-compose.yml**

   - PostgreSQLサービスの設定
   - データベース名：`threadboard`
   - ユーザー名：`postgres`
   - パスワード：`postgres`
   - ポート：`5432`

2. **packages/backend/src/app.module.ts**
   - TypeORMの設定
   - 環境変数から接続情報を取得（Docker環境変数経由）
   - エンティティの登録

### テーブル・カラム定義

テーブルとカラムの定義は、Domain層のエンティティクラスで行われています：

1. **packages/backend/src/domain/users/entities/user.entity.ts**

   - `users`テーブルの定義
   - カラム：`id`, `username`, `email`, `password`, `createdAt`, `updatedAt`
   - リレーション：Thread（1対多）, Post（1対多）

2. **packages/backend/src/domain/threads/entities/thread.entity.ts**

   - `threads`テーブルの定義
   - カラム：`id`, `title`, `description`, `createdAt`, `updatedAt`
   - リレーション：User（多対1）, Post（1対多）

3. **packages/backend/src/domain/posts/entities/post.entity.ts**

   - `posts`テーブルの定義
   - カラム：`id`, `content`, `createdAt`, `updatedAt`
   - リレーション：User（多対1）, Thread（多対1）, Parent Post（多対1、自己参照）, Image（1対多）

4. **packages/backend/src/domain/images/entities/image.entity.ts**
   - `images`テーブルの定義
   - カラム：`id`, `url`, `filename`, `mimetype`, `size`, `position`, `alt`, `createdAt`, `updatedAt`
   - リレーション：Post（多対1）

## ライセンス

[MIT licensed](LICENSE)
