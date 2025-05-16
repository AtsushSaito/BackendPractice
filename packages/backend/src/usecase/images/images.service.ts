import { Injectable, Inject } from '@nestjs/common';
import { IImageRepository } from '../../domain/images/repositories/image.repository.interface';
import { UploadImageResponseDto } from './dto/upload-image.dto';
import { CreateImageDto } from '../../domain/images/dto/create-image.dto';
import { UpdateImageDto } from '../../domain/images/dto/update-image.dto';
import { Image } from '../../domain/images/entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('IImageRepository')
    private readonly imageRepository: IImageRepository,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadImageResponseDto> {
    const result = await this.imageRepository.uploadImage(file);

    return {
      message: 'Uploaded to S3!',
      location: result.location,
    };
  }

  async create(createImageDto: CreateImageDto): Promise<Image> {
    return this.imageRepository.create(createImageDto);
  }

  async findByPostId(postId: string): Promise<Image[]> {
    return this.imageRepository.findByPostId(postId);
  }

  async findById(id: string): Promise<Image> {
    return this.imageRepository.findById(id);
  }

  async update(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
    return this.imageRepository.update(id, updateImageDto);
  }

  async remove(id: string): Promise<void> {
    return this.imageRepository.remove(id);
  }
}
