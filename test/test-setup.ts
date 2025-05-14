// テスト用の環境変数を設定
process.env.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT || '5432';
process.env.DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'postgres';
process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'threadboard_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';
