import { Post } from '../../posts/entities/post.entity';
export declare class Image {
    id: string;
    post: Post;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    position: number;
    alt?: string;
    createdAt: Date;
    updatedAt: Date;
}
