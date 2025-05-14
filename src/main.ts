import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './presentation/common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
