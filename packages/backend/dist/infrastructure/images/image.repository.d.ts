import { Repository } from 'typeorm';
import { IImageRepository } from '../../domain/images/repositories/image.repository.interface';
import { Image } from '../../domain/images/entities/image.entity';
import { CreateImageDto } from '../../domain/images/dto/create-image.dto';
import { UpdateImageDto } from '../../domain/images/dto/update-image.dto';
import { Post } from '../../domain/posts/entities/post.entity';
export declare class ImageRepository implements IImageRepository {
    private imageRepository;
    private postRepository;
    private s3;
    private readonly bucketName;
    constructor(imageRepository: Repository<Image>, postRepository: Repository<Post>);
    uploadImage(file: Express.Multer.File): Promise<{
        location: string;
        key: string;
    }>;
    create(createImageDto: CreateImageDto): Promise<Image>;
    findByPostId(postId: string): Promise<Image[]>;
    findById(id: string): Promise<Image>;
    update(id: string, updateImageDto: UpdateImageDto): Promise<Image>;
    remove(id: string): Promise<void>;
}
