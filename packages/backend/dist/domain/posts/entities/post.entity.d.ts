import { User } from '../../users/entities/user.entity';
import { Thread } from '../../threads/entities/thread.entity';
export declare class Post {
    id: string;
    content: string;
    user: User;
    thread: Thread;
    parent?: Post;
    replies: Post[];
    createdAt: Date;
    updatedAt: Date;
}
