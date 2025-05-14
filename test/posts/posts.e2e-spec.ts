import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createTestUser,
  getAuthToken,
  createTestThread,
  createTestPost,
  generateUniqueString,
  setupApp,
} from '../test-helpers';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let testUser: { username: string; email: string; password: string };
  let testThreadId: string;

  beforeAll(async () => {
    app = await setupApp();

    // テスト用のユーザーを作成
    testUser = await createTestUser(app);

    // 認証トークンを取得
    authToken = await getAuthToken(app, testUser.username, testUser.password);

    // テスト用のスレッドを作成
    const thread = await createTestThread(
      app,
      authToken,
      generateUniqueString('post_test_thread'),
      'Thread for post tests',
    );
    testThreadId = thread.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('投稿作成 (POST /posts)', () => {
    it('認証済みユーザーは投稿を作成できる', async () => {
      const content = generateUniqueString('post_content');

      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content,
          threadId: testThreadId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe(content);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(testUser.username);
      expect(response.body.thread).toHaveProperty('id', testThreadId);
    });

    it('認証なしでは投稿を作成できない', async () => {
      const response = await request(app.getHttpServer()).post('/posts').send({
        content: 'Unauthorized post',
        threadId: testThreadId,
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('存在しないスレッドには投稿できない', async () => {
      const nonExistentThreadId = '99999999-9999-9999-9999-999999999999';
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Post to non-existent thread',
          threadId: nonExistentThreadId,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('投稿一覧取得 (GET /posts?threadId=)', () => {
    beforeAll(async () => {
      // テスト用の投稿を複数作成
      for (let i = 0; i < 3; i++) {
        await createTestPost(
          app,
          authToken,
          testThreadId,
          `Post ${i} in thread for listing test`,
        );
      }
    });

    it('スレッド内の投稿一覧を取得できる', async () => {
      const response = await request(app.getHttpServer()).get(
        `/posts?threadId=${testThreadId}`,
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);

      // 各投稿が必要なプロパティを持っていることを確認
      response.body.forEach((post) => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('content');
        expect(post).toHaveProperty('user');
        expect(post.user).toHaveProperty('id');
        expect(post.user).toHaveProperty('username');
      });
    });

    it('存在しないスレッドIDではエラーになる', async () => {
      const nonExistentThreadId = '99999999-9999-9999-9999-999999999999';
      const response = await request(app.getHttpServer()).get(
        `/posts?threadId=${nonExistentThreadId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('投稿への返信作成 (POST /posts with parentId)', () => {
    let parentPostId: string;

    beforeAll(async () => {
      // 返信元となる投稿を作成
      const parentPost = await createTestPost(
        app,
        authToken,
        testThreadId,
        'Parent post for reply test',
      );
      parentPostId = parentPost.id;
    });

    it('認証済みユーザーは投稿に返信できる', async () => {
      const replyContent = generateUniqueString('reply_content');

      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: replyContent,
          threadId: testThreadId,
          parentId: parentPostId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe(replyContent);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(testUser.username);
      expect(response.body.thread).toHaveProperty('id', testThreadId);
      expect(response.body.parent).toHaveProperty('id', parentPostId);
    });

    it('認証なしでは返信できない', async () => {
      const response = await request(app.getHttpServer()).post('/posts').send({
        content: 'Unauthorized reply',
        threadId: testThreadId,
        parentId: parentPostId,
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('存在しない親投稿には返信できない', async () => {
      const nonExistentParentId = '99999999-9999-9999-9999-999999999999';
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply to non-existent parent',
          threadId: testThreadId,
          parentId: nonExistentParentId,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('投稿への返信一覧取得 (GET /posts/:id/replies)', () => {
    let parentPostId: string;

    beforeAll(async () => {
      // 返信元となる投稿を作成
      const parentPost = await createTestPost(
        app,
        authToken,
        testThreadId,
        'Parent post for replies listing',
      );
      parentPostId = parentPost.id;

      // 返信を複数作成
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: `Reply ${i} to parent post`,
            threadId: testThreadId,
            parentId: parentPostId,
          });
      }
    });

    it('投稿への返信一覧を取得できる', async () => {
      const response = await request(app.getHttpServer()).get(
        `/posts/${parentPostId}/replies`,
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);

      // 各返信が必要なプロパティを持っていることを確認
      response.body.forEach((reply) => {
        expect(reply).toHaveProperty('id');
        expect(reply).toHaveProperty('content');
        expect(reply).toHaveProperty('user');
        expect(reply.user).toHaveProperty('id');
        expect(reply.user).toHaveProperty('username');
      });
    });

    it('存在しない投稿IDではエラーになる', async () => {
      const nonExistentPostId = '99999999-9999-9999-9999-999999999999';
      const response = await request(app.getHttpServer()).get(
        `/posts/${nonExistentPostId}/replies`,
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });
});
