import { UploadImageResponseDto } from '../../usecase/images/dto/upload-image.dto';
import { ImagesService } from '../../usecase/images/images.service';
import { CreateImageDto } from '../../domain/images/dto/create-image.dto';
import { UpdateImageDto } from '../../domain/images/dto/update-image.dto';
import { Image } from '../../domain/images/entities/image.entity';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    uploadFile(file: Express.Multer.File): Promise<UploadImageResponseDto>;
    create(createImageDto: CreateImageDto): Promise<Image>;
    findByPostId(postId: string): Promise<Image[]>;
    findOne(id: string): Promise<Image>;
    update(id: string, updateImageDto: UpdateImageDto): Promise<Image>;
    remove(id: string): Promise<void>;
}
