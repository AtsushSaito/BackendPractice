import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './presentation/users/users.module';
import { ThreadsModule } from './presentation/threads/threads.module';
import { PostsModule } from './presentation/posts/posts.module';
import { AuthModule } from './presentation/auth/auth.module';
import { User } from './domain/users/entities/user.entity';
import { Thread } from './domain/threads/entities/thread.entity';
import { Post } from './domain/posts/entities/post.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 環境変数の設定
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeORMの設定
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'threadboard',
      entities: [User, Thread, Post],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    ThreadsModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// force touch
