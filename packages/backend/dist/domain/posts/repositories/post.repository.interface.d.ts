import { Post } from '../entities/post.entity';
export interface IPostRepository {
    create(post: Partial<Post>): Promise<Post>;
    findById(id: string): Promise<Post | null>;
    findByThreadId(threadId: string): Promise<Post[]>;
    findByParentId(parentId: string): Promise<Post[]>;
    update(id: string, post: Partial<Post>): Promise<Post>;
    delete(id: string): Promise<void>;
}
