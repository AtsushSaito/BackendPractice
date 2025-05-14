import { Repository } from 'typeorm';
import { Post } from '../../domain/posts/entities/post.entity';
import { IPostRepository } from '../../domain/posts/repositories/post.repository.interface';
export declare class PostRepository implements IPostRepository {
    private readonly repository;
    constructor(repository: Repository<Post>);
    create(post: Partial<Post>): Promise<Post>;
    findById(id: string): Promise<Post | null>;
    findByThreadId(threadId: string): Promise<Post[]>;
    findByParentId(parentId: string): Promise<Post[]>;
    update(id: string, post: Partial<Post>): Promise<Post>;
    delete(id: string): Promise<void>;
}
