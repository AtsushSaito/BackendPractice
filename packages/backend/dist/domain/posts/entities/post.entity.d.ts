import { User } from '../../users/entities/user.entity';
import { Thread } from '../../threads/entities/thread.entity';
import { Image } from '../../images/entities/image.entity';
export declare class Post {
    id: string;
    content: string;
    user: User;
    thread: Thread;
    parent?: Post;
    replies: Post[];
    images: Image[];
    createdAt: Date;
    updatedAt: Date;
}
