import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
export declare class Thread {
    id: string;
    title: string;
    description: string;
    user: User;
    posts: Post[];
    createdAt: Date;
    updatedAt: Date;
}
