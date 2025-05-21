import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './presentation/common/filters/global-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // フロントエンドのオリジンを環境変数から取得するか、デフォルト値を使用
  const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3001';

  // CORS設定 - フロントエンドからのリクエストを許可
  app.enableCors({
    origin: [frontendOrigin, 'http://localhost:3001', 'http://frontend:3001'], // フロントエンドのオリジンを明示的に許可
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    credentials: true, // クッキーなどの認証情報を含むリクエストを許可
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization'],
  });

  // グローバル例外フィルターの設定
  app.useGlobalFilters(new GlobalExceptionFilter());

  // バリデーションパイプの設定
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swaggerの設定
  const config = new DocumentBuilder()
    .setTitle('Thread Board API')
    .setDescription('スレッド型掲示板のAPI仕様')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .addTag('threads')
    .addTag('posts')
    .addTag('ファイル')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  console.log(`Application is running on: http://localhost:${port}`);
  await app.listen(port);
}
bootstrap();
