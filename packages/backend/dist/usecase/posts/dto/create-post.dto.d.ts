import { CreateImageDto } from '../../images/dto/create-image.dto';
export declare class CreatePostDto {
    content: string;
    threadId: string;
    userId?: string;
    parentId?: string;
    images?: CreateImageDto[];
}
