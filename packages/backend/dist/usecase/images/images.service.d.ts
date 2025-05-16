import { IImageRepository } from '../../domain/images/repositories/image.repository.interface';
import { UploadImageResponseDto } from './dto/upload-image.dto';
import { CreateImageDto } from '../../domain/images/dto/create-image.dto';
import { UpdateImageDto } from '../../domain/images/dto/update-image.dto';
import { Image } from '../../domain/images/entities/image.entity';
export declare class ImagesService {
    private readonly imageRepository;
    constructor(imageRepository: IImageRepository);
    uploadImage(file: Express.Multer.File): Promise<UploadImageResponseDto>;
    create(createImageDto: CreateImageDto): Promise<Image>;
    findByPostId(postId: string): Promise<Image[]>;
    findById(id: string): Promise<Image>;
    update(id: string, updateImageDto: UpdateImageDto): Promise<Image>;
    remove(id: string): Promise<void>;
}
