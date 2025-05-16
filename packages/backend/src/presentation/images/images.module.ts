import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from '../../usecase/images/images.service';
import { ImageRepository } from '../../infrastructure/images/image.repository';
import { Image } from '../../domain/images/entities/image.entity';
import { Post } from '../../domain/posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Post])],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    {
      provide: 'IImageRepository',
      useClass: ImageRepository,
    },
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
