import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { generateUniqueString, setupApp } from '../test-helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let testUsername: string;
  let testPassword: string;

  beforeAll(async () => {
    app = await setupApp();

    // テスト用のユーザーを作成
    testUsername = generateUniqueString('auth_user');
    testPassword = 'Password123!';
    const email = `${testUsername}@example.com`;

    await request(app.getHttpServer()).post('/users').send({
      username: testUsername,
      email,
      password: testPassword,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ログイン (POST /auth/login)', () => {
    it('正しい認証情報でログインできる', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUsername,
          password: testPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
    });

    it('間違ったパスワードではログインできない', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUsername,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('存在しないユーザー名ではログインできない', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'nonexistent_user',
          password: testPassword,
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('認証ユーザー情報取得 (GET /auth/me)', () => {
    it('有効なトークンでユーザー情報を取得できる', async () => {
      // まずログインしてトークンを取得
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUsername,
          password: testPassword,
        });

      const token = loginResponse.body.accessToken;

      // 取得したトークンでユーザー情報をリクエスト
      const meResponse = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meResponse.status).toBe(200);
      expect(meResponse.body).toHaveProperty('id');
      expect(meResponse.body.username).toBe(testUsername);
      expect(meResponse.body).not.toHaveProperty('password');
    });

    it('認証なしでアクセスできない', async () => {
      const response = await request(app.getHttpServer()).get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('無効なトークンでアクセスできない', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });
});
