import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from '../../usecase/posts/posts.service';
import { Post } from '../../domain/posts/entities/post.entity';
import { Thread } from '../../domain/threads/entities/thread.entity';
import { User } from '../../domain/users/entities/user.entity';
import { Image } from '../../domain/images/entities/image.entity';
import { PostRepository } from '../../infrastructure/posts/post.repository';
import { ThreadRepository } from '../../infrastructure/threads/thread.repository';
import { UserRepository } from '../../infrastructure/users/user.repository';
import { ImageRepository } from '../../infrastructure/images/image.repository';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Thread, User, Image]),
    ImagesModule,
  ],
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
    {
      provide: 'IImageRepository',
      useClass: ImageRepository,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
