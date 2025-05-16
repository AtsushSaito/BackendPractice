import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IPostRepository } from '../../domain/posts/repositories/post.repository.interface';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { IThreadRepository } from '../../domain/threads/repositories/thread.repository.interface';
import { IImageRepository } from '../../domain/images/repositories/image.repository.interface';
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
    @Inject('IImageRepository')
    private readonly imageRepository: IImageRepository,
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

    // 画像がある場合は画像も保存
    if (createPostDto.images && createPostDto.images.length > 0) {
      for (let i = 0; i < createPostDto.images.length; i++) {
        const imageDto = createPostDto.images[i];
        await this.imageRepository.create({
          ...imageDto,
          postId: post.id,
          position: imageDto.position || i, // positionが指定されていない場合は配列のインデックスを使用
        });
      }
    }

    // 画像も含めて再取得
    return this.getPostById(post.id);
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

    // 関連する画像があれば削除
    const images = await this.imageRepository.findByPostId(id);
    for (const image of images) {
      await this.imageRepository.remove(image.id);
    }

    await this.postRepository.delete(id);
  }
}
