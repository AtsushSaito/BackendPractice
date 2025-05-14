import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from '../../usecase/posts/posts.service';
import { Post } from '../../domain/posts/entities/post.entity';
import { Thread } from '../../domain/threads/entities/thread.entity';
import { User } from '../../domain/users/entities/user.entity';
import { PostRepository } from '../../infrastructure/posts/post.repository';
import { ThreadRepository } from '../../infrastructure/threads/thread.repository';
import { UserRepository } from '../../infrastructure/users/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Thread, User])],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: 'IPostRepository',
      useClass: PostRepository,
    },
    {
      provide: 'IThreadRepository',
      useClass: ThreadRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
