import { Thread } from '../../threads/entities/thread.entity';
import { Post } from '../../posts/entities/post.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    threads: Thread[];
    posts: Post[];
}
