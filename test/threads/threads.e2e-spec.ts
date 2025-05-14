import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createTestUser,
  getAuthToken,
  generateUniqueString,
  setupApp,
} from '../test-helpers';

describe('Threads (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let testUser: { username: string; email: string; password: string };

  beforeAll(async () => {
    app = await setupApp();

    // テスト用のユーザーを作成
    testUser = await createTestUser(app);

    // 認証トークンを取得
    authToken = await getAuthToken(app, testUser.username, testUser.password);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('スレッド作成 (POST /threads)', () => {
    it('認証済みユーザーはスレッドを作成できる', async () => {
      const title = generateUniqueString('thread');
      const description = 'This is a test thread description';

      const response = await request(app.getHttpServer())
        .post('/threads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title,
          description,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(title);
      expect(response.body.description).toBe(description);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(testUser.username);
    });

    it('認証なしではスレッドを作成できない', async () => {
      const response = await request(app.getHttpServer())
        .post('/threads')
        .send({
          title: 'Unauthorized Thread',
          description: 'This should fail',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('必須フィールドがない場合はエラーになる', async () => {
      const response = await request(app.getHttpServer())
        .post('/threads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // titleを省略
          description: 'Missing title',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('title')]),
      );
    });
  });

  describe('スレッド一覧取得 (GET /threads)', () => {
    // テスト用のスレッドを複数作成
    beforeAll(async () => {
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/threads')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: generateUniqueString(`thread_list_${i}`),
            description: `Test thread ${i} for listing`,
          });
      }
    });

    it('全スレッドの一覧を取得できる', async () => {
      const response = await request(app.getHttpServer()).get('/threads');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);

      // 各スレッドが必要なプロパティを持っていることを確認
      response.body.forEach((thread) => {
        expect(thread).toHaveProperty('id');
        expect(thread).toHaveProperty('title');
        expect(thread).toHaveProperty('description');
        expect(thread).toHaveProperty('user');
        expect(thread.user).toHaveProperty('id');
        expect(thread.user).toHaveProperty('username');
      });
    });
  });

  describe('スレッド詳細取得 (GET /threads/:id)', () => {
    let testThreadId: string;

    beforeAll(async () => {
      // テスト用のスレッドを作成
      const response = await request(app.getHttpServer())
        .post('/threads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: generateUniqueString('thread_detail'),
          description: 'Thread for detail test',
        });

      testThreadId = response.body.id;
    });

    it('存在するスレッドの詳細を取得できる', async () => {
      const response = await request(app.getHttpServer()).get(
        `/threads/${testThreadId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testThreadId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username');
    });

    it('存在しないスレッドIDではエラーになる', async () => {
      const nonExistentId = '99999999-9999-9999-9999-999999999999';
      const response = await request(app.getHttpServer()).get(
        `/threads/${nonExistentId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });
});
