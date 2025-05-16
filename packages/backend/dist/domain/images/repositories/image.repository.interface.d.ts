import { CreateImageDto } from '../dto/create-image.dto';
import { UpdateImageDto } from '../dto/update-image.dto';
import { Image } from '../entities/image.entity';
export interface IImageRepository {
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
