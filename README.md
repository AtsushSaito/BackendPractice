<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# スレッド掲示板API

## プロジェクト概要

このプロジェクトは、ユーザー管理、スレッド管理、投稿管理機能を持つ掲示板APIです。NestJSとTypeORMを使用して実装されています。

## 技術スタック

- NestJS: バックエンドフレームワーク
- TypeORM: ORMライブラリ
- PostgreSQL: データベース
- JWT: 認証
- Swagger: API文書化

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

## セットアップ

```bash
# リポジトリをクローン
$ git clone https://github.com/yourusername/threadboard-api.git

# 依存関係をインストール
$ npm install

# 開発モードで実行
$ npm run start:dev

# 本番モードで実行
$ npm run start:prod
```

## Dockerを使用した実行方法

```bash
# Dockerコンテナを起動
$ npm run docker:up

# Dockerコンテナを停止
$ npm run docker:down

# Dockerコンテナを再起動
$ npm run docker:restart
```

## API ドキュメント

サーバー起動後、次のURLでSwagger UIによるAPI仕様を確認できます：

```
http://localhost:3000/api
```

## テスト

```bash
# ユニットテスト
$ npm run test

# E2Eテスト
$ npm run test:e2e:full

# E2Eテスト（詳細手順）
# 1. テスト用データベースを削除
$ npm run test:e2e:clean

# 2. テスト用データベースを作成
$ npm run test:e2e:setup

# 3. E2Eテストを実行
$ npm run test:e2e

# テストカバレッジ
$ npm run test:cov
```

## プロジェクト構造

```
src/
├── domain/           # ドメインモデル
├── infrastructure/   # データベース、外部サービス
├── presentation/     # コントローラー、DTOモデル
└── usecase/          # ビジネスロジック
```

## ライセンス

[MIT licensed](LICENSE)

## データベース設計

### 接続情報

データベース接続情報は主に以下のファイルで設定しています：

1. **docker-compose.yml**

   - PostgreSQLサービスの設定
   - データベース名：`threadboard`
   - ユーザー名：`postgres`
   - パスワード：`postgres`
   - ポート：`5432`

2. **src/app.module.ts**
   - TypeORMの設定
   - 環境変数から接続情報を取得（Docker環境変数経由）
   - エンティティの登録

### テーブル・カラム定義

テーブルとカラムの定義は、Domain層のエンティティクラスで行われています：

1. **src/domain/users/entities/user.entity.ts**

   - `users`テーブルの定義
   - カラム：`id`, `username`, `email`, `password`, `createdAt`, `updatedAt`
   - リレーション：Thread（1対多）, Post（1対多）

2. **src/domain/threads/entities/thread.entity.ts**

   - `threads`テーブルの定義
   - カラム：`id`, `title`, `description`, `createdAt`, `updatedAt`
   - リレーション：User（多対1）, Post（1対多）

3. **src/domain/posts/entities/post.entity.ts**
   - `posts`テーブルの定義
   - カラム：`id`, `content`, `createdAt`, `updatedAt`
   - リレーション：User（多対1）, Thread（多対1）, Parent Post（多対1、自己参照）

### マイグレーション

データベースのマイグレーションは自動生成されたファイル **src/1747036646133-migrations.ts** に定義されています。このファイルには：

- テーブル作成のSQLクエリ
- 外部キー制約の定義
- ロールバック用のdown関数

### データベース初期化フロー

1. Dockerコンテナ起動時にPostgreSQLサービスが初期化
2. NestJSアプリケーション起動時にTypeORMがエンティティ定義に基づいてテーブルを作成/同期
3. 本番環境では、明示的にマイグレーションを実行するフローを推奨
