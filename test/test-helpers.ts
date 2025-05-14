import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/presentation/common/filters/global-exception.filter';

// タイムスタンプを利用したユニークな文字列を生成
export const generateUniqueString = (prefix: string = '') => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// アプリケーションのセットアップ
export const setupApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // ValidationPipeの設定
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // グローバル例外フィルターの設定
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.init();
  return app;
};

// テスト用ユーザーの作成
export const createTestUser = async (app: INestApplication) => {
  const username = generateUniqueString('user');
  const email = `${username}@example.com`;
  const password = 'Password123!';

  await request(app.getHttpServer()).post('/users').send({
    username,
    email,
    password,
  });

  return { username, email, password };
};

// 認証トークンの取得
export const getAuthToken = async (
  app: INestApplication,
  username: string,
  password: string,
) => {
  const response = await request(app.getHttpServer()).post('/auth/login').send({
    username,
    password,
  });

  return response.body.accessToken;
};

// テスト用スレッドの作成
export const createTestThread = async (
  app: INestApplication,
  token: string,
  title = 'Test Thread',
  description = 'This is a test thread',
) => {
  const response = await request(app.getHttpServer())
    .post('/threads')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title,
      description,
    });

  return response.body;
};

// テスト用投稿の作成
export const createTestPost = async (
  app: INestApplication,
  token: string,
  threadId: string,
  content = 'Test Post Content',
) => {
  const response = await request(app.getHttpServer())
    .post('/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      content,
      threadId,
    });

  return response.body;
};
