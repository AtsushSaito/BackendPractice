import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { generateUniqueString, setupApp } from '../test-helpers';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ユーザー登録 (POST /users)', () => {
    it('有効なデータでユーザーを登録できる', async () => {
      // タイムスタンプを利用した一意のユーザー名とメールアドレス
      const username = generateUniqueString('user');
      const email = `${username}@example.com`;
      const password = 'Password123!';

      const response = await request(app.getHttpServer()).post('/users').send({
        username,
        email,
        password,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(username);
      expect(response.body.email).toBe(email);
      // パスワードが含まれていないか、ハッシュ化されていることを確認
      if (response.body.password) {
        expect(response.body.password).not.toBe(password);
        expect(response.body.password).toMatch(/^\$2[aby]\$\d+\$/); // bcryptハッシュの形式確認
      }
    });

    it('既存のユーザー名で登録できない', async () => {
      // 一意のユーザー名とメールを生成
      const username = generateUniqueString('duplicate');
      const email = `${username}@example.com`;
      const password = 'Password123!';

      // 最初のユーザーを作成
      await request(app.getHttpServer()).post('/users').send({
        username,
        email,
        password,
      });

      // 同じユーザー名で再度作成を試みる
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username,
          email: `different_${email}`,
          password,
        });

      expect(response.status).toBe(409); // Conflict
      expect(response.body.error).toBe('Duplicate username');
    });

    it('既存のメールアドレスで登録できない', async () => {
      // 一意のユーザー名とメールを生成
      const username = generateUniqueString('email_duplicate');
      const email = `${username}@example.com`;
      const password = 'Password123!';

      // 最初のユーザーを作成
      await request(app.getHttpServer()).post('/users').send({
        username,
        email,
        password,
      });

      // 同じメールアドレスで再度作成を試みる
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: `different_${username}`,
          email,
          password,
        });

      expect(response.status).toBe(409); // Conflict
      expect(response.body.error).toBe('Duplicate email');
    });

    it('必須フィールドがない場合はエラーになる', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        // usernameを省略
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('username')]),
      );
    });
  });
});
