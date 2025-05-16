import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { IImageRepository } from '../../domain/images/repositories/image.repository.interface';
import { Image } from '../../domain/images/entities/image.entity';
import { CreateImageDto } from '../../domain/images/dto/create-image.dto';
import { UpdateImageDto } from '../../domain/images/dto/update-image.dto';
import { Post } from '../../domain/posts/entities/post.entity';

@Injectable()
export class ImageRepository implements IImageRepository {
  private s3: AWS.S3;
  private readonly bucketName = 'backendpracticeimages';

  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {
    this.s3 = new AWS.S3({
      region: 'ap-northeast-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ location: string; key: string }> {
    const key = `${uuidv4()}-${file.originalname}`;

    // ファイルをS3にアップロード
    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    // 署名付きURLを生成（7日間有効）
    const signedUrl = this.s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: 3600 * 24 * 7, // 7日間有効
    });

    // 署名付きURLを返す
    return {
      location: signedUrl,
      key: uploadResult.Key,
    };
  }

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const post = await this.postRepository.findOne({
      where: { id: createImageDto.postId },
    });
    if (!post) {
      throw new NotFoundException(
        `Post with ID ${createImageDto.postId} not found`,
      );
    }

    const image = this.imageRepository.create({
      ...createImageDto,
      post,
    });

    return this.imageRepository.save(image);
  }

  async findByPostId(postId: string): Promise<Image[]> {
    const images = await this.imageRepository.find({
      where: { post: { id: postId } },
      order: { position: 'ASC' },
    });

    // 各画像に署名付きURLを生成
    return Promise.all(
      images.map(async (image) => {
        const key = image.url.split('/').pop();
        if (key) {
          const signedUrl = this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: 3600 * 24 * 7, // 7日間有効
          });
          image.url = signedUrl;
        }
        return image;
      }),
    );
  }

  async findById(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // 署名付きURLを生成
    const key = image.url.split('/').pop();
    if (key) {
      const signedUrl = this.s3.getSignedUrl('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: 3600 * 24 * 7, // 7日間有効
      });
      image.url = signedUrl;
    }

    return image;
  }

  async update(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findById(id);

    // 更新可能なフィールドだけを更新
    if (updateImageDto.url !== undefined) {
      image.url = updateImageDto.url;
    }
    if (updateImageDto.position !== undefined) {
      image.position = updateImageDto.position;
    }
    if (updateImageDto.alt !== undefined) {
      image.alt = updateImageDto.alt;
    }

    return this.imageRepository.save(image);
  }

  async remove(id: string): Promise<void> {
    const image = await this.findById(id);

    // S3から画像を削除
    const key = image.url.split('/').pop();
    if (key) {
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();
    }

    await this.imageRepository.remove(image);
  }
}
