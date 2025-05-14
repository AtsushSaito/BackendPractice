import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IPostRepository } from '../../domain/posts/repositories/post.repository.interface';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { IThreadRepository } from '../../domain/threads/repositories/thread.repository.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../../domain/posts/entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IThreadRepository')
    private readonly threadRepository: IThreadRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    // ユーザーIDが必要
    if (!createPostDto.userId) {
      throw new BadRequestException('User ID is required');
    }

    // ユーザーの存在確認
    const user = await this.userRepository.findById(createPostDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // スレッドの存在確認
    const thread = await this.threadRepository.findById(createPostDto.threadId);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    // 親投稿がある場合は存在確認
    let parentPost: Post | undefined = undefined;
    if (createPostDto.parentId) {
      const foundParent = await this.postRepository.findById(
        createPostDto.parentId,
      );
      if (!foundParent) {
        throw new NotFoundException('Parent post not found');
      }
      parentPost = foundParent;
    }

    // 投稿の作成
    const post = await this.postRepository.create({
      content: createPostDto.content,
      user: user,
      thread: thread,
      parent: parentPost,
    });

    return post;
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async getPostsByThreadId(threadId: string): Promise<Post[]> {
    // スレッドの存在確認
    const thread = await this.threadRepository.findById(threadId);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return this.postRepository.findByThreadId(threadId);
  }

  async getRepliesByPostId(postId: string): Promise<Post[]> {
    // 親投稿の存在確認
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.postRepository.findByParentId(postId);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.postRepository.update(id, {
      content: updatePostDto.content,
    });
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.delete(id);
  }
}
