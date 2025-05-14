import { PostsService } from '../../usecase/posts/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(createPostDto: CreatePostDto, user: any): Promise<import("../../domain/posts/entities/post.entity").Post>;
    getPost(id: string): Promise<import("../../domain/posts/entities/post.entity").Post>;
    getPostsByThread(threadId: string): Promise<import("../../domain/posts/entities/post.entity").Post[]>;
    getReplies(id: string): Promise<import("../../domain/posts/entities/post.entity").Post[]>;
    updatePost(id: string, updatePostDto: UpdatePostDto, user: any): Promise<import("../../domain/posts/entities/post.entity").Post>;
    deletePost(id: string, user: any): Promise<{
        success: boolean;
    }>;
}
