import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './presentation/common/filters/global-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS設定 - より寛容な設定に変更
  app.enableCors({
    origin: true, // すべてのオリジンを許可
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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
