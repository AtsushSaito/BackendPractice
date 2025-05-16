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

# スレッド型掲示板アプリケーション

モノレポ構成で作成された、スレッド型掲示板のWebアプリケーションです。NestJS、Next.js、PostgreSQLを使用しています。

## アクセス情報

掲示板システムは以下のURLでアクセスできます:

- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:3000
- Swagger API ドキュメント: http://localhost:3000/api

## 構成について

このプロジェクトは以下の構成になっています：

- バックエンド: packages/backend内のdocker-compose.ymlでDocker上で動作
- フロントエンド: packages/frontendディレクトリでNext.jsを直接実行

## 実行方法

```bash
# バックエンドを起動するには（Docker上）
$ npm run backend

# フロントエンドを起動するには（直接実行）
$ npm run frontend

# または両方同時に起動（異なるターミナルで）
$ npm run dev
```

## Docker利用方法（バックエンドのみ）

```bash
# バックエンドシステムを起動するには
$ npm run docker:up

# バックエンドシステムを停止するには
$ npm run docker:down

# 変更を加えた後に再ビルドして起動するには
$ npm run docker:restart
```

掲示板システムではアカウント登録とログイン後に、スレッドの作成や投稿が可能です。投稿への返信もサポートされています。

## プロジェクト構成

このプロジェクトはモノレポ構成で、以下のパッケージを含んでいます：

- `packages/backend`: NestJSで実装されたバックエンドAPI
- `packages/frontend`: Next.jsで実装されたフロントエンドアプリケーション
- `docs/chat_history`: プロジェクト開発中のチャット履歴と開発の記録

## 開発履歴

プロジェクト開発中のチャット履歴は `docs/chat_history` ディレクトリに保存されています。このディレクトリには以下のファイルが含まれています：

- `README.md`: チャット履歴に関する説明
- `chat_history.md`: 開発中の会話を構造化したサマリー
- `chat_history.json`: AIとの会話の生データ
- `chat_history_raw.txt`: チャットデータの抽出元と概要

これらのファイルは、プロジェクトの開発プロセス、特に認証機能の実装、エラーの修正、UIの改善などについて理解するのに役立ちます。

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

## セットアップ手順

### Dockerを使用する場合

Docker Composeを使用して、バックエンドとフロントエンドを同時に実行できます：

```bash
# リポジトリをクローン
$ git clone https://github.com/yourusername/thread-board.git
$ cd thread-board

# Dockerコンテナを起動
$ docker-compose up --build
```

起動後、以下のURLでアクセスできます：

- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:3000
- API仕様(Swagger): http://localhost:3000/api

### 手動セットアップ

#### 1. バックエンドのセットアップ

```bash
# バックエンドディレクトリに移動
$ cd packages/backend

# 依存関係のインストール
$ npm install

# 開発モードで実行
$ npm run start:dev
```

#### 2. フロントエンドのセットアップ

```bash
# フロントエンドディレクトリに移動
$ cd packages/frontend

# 依存関係のインストール
$ npm install

# 開発モードで実行
$ npm run dev
```

## データベース設計

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
   - リレーション：User（多対1）, Thread（多対1）, Parent Post（多対1、自己参照）

## ライセンス

[MIT licensed](LICENSE)
