import { IPostRepository } from '../../domain/posts/repositories/post.repository.interface';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { IThreadRepository } from '../../domain/threads/repositories/thread.repository.interface';
import { IImageRepository } from '../../domain/images/repositories/image.repository.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../../domain/posts/entities/post.entity';
export declare class PostsService {
    private readonly postRepository;
    private readonly userRepository;
    private readonly threadRepository;
    private readonly imageRepository;
    constructor(postRepository: IPostRepository, userRepository: IUserRepository, threadRepository: IThreadRepository, imageRepository: IImageRepository);
    createPost(createPostDto: CreatePostDto): Promise<Post>;
    getPostById(id: string): Promise<Post>;
    getPostsByThreadId(threadId: string): Promise<Post[]>;
    getRepliesByPostId(postId: string): Promise<Post[]>;
    updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post>;
    deletePost(id: string): Promise<void>;
}
